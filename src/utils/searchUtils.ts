
export interface SearchResult {
  index: number;
  text: string;
  lineNumber: number;
  startPos: number;
  endPos: number;
}

export interface AutocompleteWord {
  word: string;
  frequency: number;
}

// Function to find all occurrences of search term in text
export const findAllMatches = (
  text: string,
  searchTerm: string,
  caseSensitive: boolean = false
): SearchResult[] => {
  if (!text || !searchTerm) return [];
  
  const results: SearchResult[] = [];
  const lines = text.split('\n');
  let charIndex = 0;
  
  const searchTermLower = caseSensitive ? searchTerm : searchTerm.toLowerCase();
  
  lines.forEach((line, lineIndex) => {
    const lineLower = caseSensitive ? line : line.toLowerCase();
    let position = 0;
    
    while ((position = lineLower.indexOf(searchTermLower, position)) !== -1) {
      results.push({
        index: results.length,
        text: line.substring(position, position + searchTerm.length),
        lineNumber: lineIndex,
        startPos: charIndex + position,
        endPos: charIndex + position + searchTerm.length
      });
      position += searchTerm.length;
    }
    
    // Add +1 for newline character
    charIndex += line.length + 1;
  });
  
  return results;
};

// Function to extract unique words for autocomplete
export const extractWords = (text: string): AutocompleteWord[] => {
  if (!text) return [];
  
  // Remove punctuation and split by whitespace
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/);
  
  // Count word frequency
  const wordCounts: Record<string, number> = {};
  words.forEach((word) => {
    if (word.length > 1) {  // Only consider words with length > 1
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  
  // Convert to array and sort by frequency
  return Object.entries(wordCounts)
    .map(([word, frequency]) => ({ word, frequency }))
    .filter(item => item.word.length > 1) // Filter out single-letter words
    .sort((a, b) => b.frequency - a.frequency);
};

// Function to get autocomplete suggestions based on input
export const getAutocompleteSuggestions = (
  input: string,
  wordList: AutocompleteWord[],
  maxSuggestions: number = 5
): string[] => {
  if (!input || input.length < 2) return [];
  
  const inputLower = input.toLowerCase();
  
  // Find matching words starting with the input
  return wordList
    .filter(item => item.word.startsWith(inputLower) && item.word !== inputLower)
    .slice(0, maxSuggestions)
    .map(item => item.word);
};

// Function to highlight text with HTML
export const highlightText = (
  text: string,
  searchResults: SearchResult[],
  activeResultIndex: number | null
): string => {
  if (!text || searchResults.length === 0) return text;
  
  // Sort results by start position in descending order to avoid index shifts
  const sortedResults = [...searchResults].sort((a, b) => b.startPos - a.startPos);
  
  let highlightedText = text;
  
  // Replace each occurrence with highlighted version
  sortedResults.forEach((result, i) => {
    const { startPos, endPos } = result;
    const isActive = activeResultIndex === result.index;
    
    const beforeMatch = highlightedText.substring(0, startPos);
    const match = highlightedText.substring(startPos, endPos);
    const afterMatch = highlightedText.substring(endPos);
    
    highlightedText = 
      beforeMatch + 
      `<span class="highlight${isActive ? ' active' : ''}" data-result-index="${result.index}">${match}</span>` + 
      afterMatch;
  });
  
  return highlightedText;
};
