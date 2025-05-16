
import React, { useEffect, useRef } from 'react';
import { SearchResult } from '@/utils/searchUtils';

interface TextDisplayProps {
  text: string;
  searchResults: SearchResult[];
  activeResultIndex: number | null;
  setActiveResultIndex: (index: number | null) => void;
}

const TextDisplay: React.FC<TextDisplayProps> = ({
  text,
  searchResults,
  activeResultIndex,
  setActiveResultIndex
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create processed text with search result highlights
  const processedText = React.useMemo(() => {
    if (!text || searchResults.length === 0) {
      return { __html: text };
    }

    // Sort results by start position in descending order to avoid index shifts
    const sortedResults = [...searchResults].sort((a, b) => b.startPos - a.startPos);
    
    let highlightedText = text;
    const lineInfoMap: Map<number, { hasHighlight: boolean, hasActive: boolean }> = new Map();
    
    // Replace each occurrence with highlighted version
    sortedResults.forEach((result) => {
      const { startPos, endPos, lineNumber } = result;
      const isActive = activeResultIndex === result.index;
      
      // Update line info for highlighting
      if (!lineInfoMap.has(lineNumber)) {
        lineInfoMap.set(lineNumber, { hasHighlight: true, hasActive: isActive });
      } else {
        const lineInfo = lineInfoMap.get(lineNumber)!;
        lineInfo.hasHighlight = true;
        lineInfo.hasActive = lineInfo.hasActive || isActive;
      }
      
      const beforeMatch = highlightedText.substring(0, startPos);
      const match = highlightedText.substring(startPos, endPos);
      const afterMatch = highlightedText.substring(endPos);
      
      highlightedText = 
        beforeMatch + 
        `<span class="highlight${isActive ? ' active' : ''}" id="result-${result.index}" data-result-index="${result.index}">${match}</span>` + 
        afterMatch;
    });

    // Convert text to lines with line numbers
    const lines = highlightedText.split('\n');
    const processedLines = lines.map((line, index) => {
      const lineInfo = lineInfoMap.get(index);
      const lineClass = lineInfo?.hasHighlight 
        ? `line ${lineInfo.hasActive ? 'line-highlight' : ''}` 
        : 'line';
        
      return `<div class="${lineClass}" data-line="${index + 1}">${line || ' '}</div>`;
    });

    return { __html: processedLines.join('') };
  }, [text, searchResults, activeResultIndex]);

  // Scroll to active result
  useEffect(() => {
    if (activeResultIndex !== null && containerRef.current) {
      const element = document.getElementById(`result-${activeResultIndex}`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [activeResultIndex]);

  // Handle click on highlighted text
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('highlight')) {
      const resultIndex = parseInt(target.getAttribute('data-result-index') || '-1', 10);
      if (resultIndex !== -1) {
        setActiveResultIndex(resultIndex);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="font-sans text-base p-6 overflow-y-auto bg-white rounded-md"
      onClick={handleClick}
    >
      <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed" dangerouslySetInnerHTML={processedText} />
    </div>
  );
};

export default TextDisplay;
