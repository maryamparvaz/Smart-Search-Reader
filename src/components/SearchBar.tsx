
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AutocompleteWord } from '@/utils/searchUtils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onNextResult: () => void;
  onPrevResult: () => void;
  resultCount: number;
  currentResult: number | null;
  suggestions: string[];
  onSuggestionSelected: (suggestion: string) => void;
  caseSensitive: boolean;
  onToggleCaseSensitive: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onNextResult,
  onPrevResult,
  resultCount,
  currentResult,
  suggestions,
  onSuggestionSelected,
  caseSensitive,
  onToggleCaseSensitive
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
    setShowSuggestions(query.length > 1);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    onSuggestionSelected(suggestion);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) && 
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border py-3 px-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search in text..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(searchQuery.length > 1)}
            className="pl-4 pr-10 w-full"
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Case sensitive toggle */}
        <Button 
          type="button" 
          variant={caseSensitive ? "default" : "outline"} 
          onClick={onToggleCaseSensitive}
          className="px-3"
        >
          Aa
        </Button>
        
        {/* Result navigation buttons */}
        <div className="flex items-center space-x-1">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevResult}
            disabled={resultCount === 0}
            className="p-2"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={onNextResult}
            disabled={resultCount === 0}
            className="p-2"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Result counter */}
        {resultCount > 0 && (
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {currentResult !== null ? currentResult + 1 : 0} of {resultCount}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
