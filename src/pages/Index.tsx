
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import TextDisplay from '@/components/TextDisplay';
import TextInput from '@/components/TextInput';
import InstallPrompt from '@/components/InstallPrompt';
import { 
  findAllMatches, 
  extractWords, 
  getAutocompleteSuggestions,
  SearchResult,
  AutocompleteWord
} from '@/utils/searchUtils';

const Index: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeResultIndex, setActiveResultIndex] = useState<number | null>(null);
  const [wordList, setWordList] = useState<AutocompleteWord[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [hasText, setHasText] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);

  // Extract words for autocomplete when text changes
  useEffect(() => {
    if (text) {
      const extractedWords = extractWords(text);
      setWordList(extractedWords);
      setHasText(true);
    }
  }, [text]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setActiveResultIndex(null);
      setSuggestions([]);
      return;
    }

    // Get autocomplete suggestions
    const newSuggestions = getAutocompleteSuggestions(query, wordList);
    setSuggestions(newSuggestions);
    
    // Find matches
    const results = findAllMatches(text, query, caseSensitive);
    setSearchResults(results);
    setActiveResultIndex(results.length > 0 ? 0 : null);
  };

  // Text input handler
  const handleTextSubmit = (newText: string) => {
    setText(newText);
  };

  // Navigate to next result
  const handleNextResult = () => {
    if (searchResults.length === 0) return;
    
    if (activeResultIndex === null) {
      setActiveResultIndex(0);
    } else {
      setActiveResultIndex((activeResultIndex + 1) % searchResults.length);
    }
  };

  // Navigate to previous result
  const handlePrevResult = () => {
    if (searchResults.length === 0) return;
    
    if (activeResultIndex === null) {
      setActiveResultIndex(searchResults.length - 1);
    } else {
      setActiveResultIndex(
        (activeResultIndex - 1 + searchResults.length) % searchResults.length
      );
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelected = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    
    const results = findAllMatches(text, suggestion, caseSensitive);
    setSearchResults(results);
    setActiveResultIndex(results.length > 0 ? 0 : null);
  };

  // Toggle case sensitivity
  const handleToggleCaseSensitive = () => {
    setCaseSensitive(!caseSensitive);
    // Re-run search with new case sensitivity setting
    if (searchQuery) {
      const results = findAllMatches(text, searchQuery, !caseSensitive);
      setSearchResults(results);
      setActiveResultIndex(results.length > 0 ? 0 : null);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-primary text-white py-4 px-6">
        <h1 className="text-2xl font-bold">Smart Search Reader</h1>
      </header>
      
      <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto p-4">
        {!hasText ? (
          <TextInput onTextSubmit={handleTextSubmit} />
        ) : (
          <>
            <SearchBar 
              onSearch={handleSearch}
              onNextResult={handleNextResult}
              onPrevResult={handlePrevResult}
              resultCount={searchResults.length}
              currentResult={activeResultIndex}
              suggestions={suggestions}
              onSuggestionSelected={handleSuggestionSelected}
              caseSensitive={caseSensitive}
              onToggleCaseSensitive={handleToggleCaseSensitive}
            />
            
            <div className="flex-1 overflow-hidden border border-gray-200 rounded-lg mt-4 bg-white shadow">
              <TextDisplay 
                text={text} 
                searchResults={searchResults}
                activeResultIndex={activeResultIndex}
                setActiveResultIndex={setActiveResultIndex}
              />
            </div>
          </>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-600">
        <p>Smart Search Reader PWA © {new Date().getFullYear()}</p>
      </footer>
      
      <InstallPrompt />
    </div>
  );
};

export default Index;
