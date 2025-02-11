import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PuzzleGame from './components/PuzzleGame';
import WordSearch from './components/WordSearch';
import LandingPage from './components/LandingPage';
import { Global, css } from '@emotion/react';
import MemoryGame from './components/MemoryGame';
import PatternMatch from './components/PatternMatch';
import StoryBuilder from './components/StoryBuilder';

function App() {
  return (
    <BrowserRouter>
      <Global
        styles={css`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
              Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background: #1a1a1a;
            color: white;
            overscroll-behavior: none;
          }

          #root {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
        `}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jigsaw" element={<PuzzleGame />} />
        <Route path="/wordsearch" element={<WordSearch />} />
        <Route path="/memory" element={<MemoryGame />} />
        <Route path="/pattern" element={<PatternMatch />} />
        <Route path="/story" element={<StoryBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 