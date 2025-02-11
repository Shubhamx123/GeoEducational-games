import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const GameContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d1f3f 100%);
`;

const GameHeader = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  .level-info {
    text-align: center;
    margin-bottom: 1.5rem;

    h2 {
      font-size: 2rem;
      color: #D74E9F;
      margin-bottom: 0.5rem;
      background: linear-gradient(45deg, #4ECDC4, #45b8b0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 10px rgba(215, 78, 159, 0.3);
    }

    p {
      color: #B3B3B3;
      font-size: 1.1rem;
    }
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;

    div {
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 30px;
      font-weight: 600;
      color: white;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 1fr);
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  aspect-ratio: 1;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const Cell = styled(motion.div)`
  background: ${props =>
        props.isSelected ? 'rgba(215, 78, 159, 0.3)' :
            props.isFound ? 'rgba(78, 205, 196, 0.3)' :
                props.isHighlighted ? 'rgba(255, 255, 255, 0.1)' :
                    'rgba(255, 255, 255, 0.05)'
    };
  color: ${props =>
        props.isFound ? '#4ECDC4' :
            props.isSelected ? '#D74E9F' :
                'white'
    };
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  border-radius: 8px;
  font-size: clamp(1rem, 2vw, 1.4rem);
  box-shadow: ${props =>
        props.isSelected ? '0 0 20px rgba(215, 78, 159, 0.3)' :
            props.isFound ? '0 0 20px rgba(78, 205, 196, 0.3)' :
                'none'
    };
  transition: all 0.2s ease;
  border: 1px solid ${props =>
        props.isSelected ? 'rgba(215, 78, 159, 0.5)' :
            props.isFound ? 'rgba(78, 205, 196, 0.5)' :
                'rgba(255, 255, 255, 0.1)'
    };

  &:hover {
    transform: ${props => props.isFound ? 'none' : 'scale(1.05)'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const WordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Word = styled(motion.div)`
  padding: 0.75rem 1.5rem;
  background: ${props =>
        props.found ?
            'linear-gradient(45deg, #4ECDC4, #45b8b0)' :
            'rgba(255, 255, 255, 0.05)'
    };
  color: ${props => props.found ? 'white' : '#B3B3B3'};
  border-radius: 30px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: ${props =>
        props.found ? '0 0 20px rgba(78, 205, 196, 0.3)' : 'none'
    };
  border: 1px solid ${props =>
        props.found ? 'rgba(78, 205, 196, 0.5)' : 'rgba(255, 255, 255, 0.1)'
    };

  &:hover {
    transform: translateY(-2px);
  }
`;

const AchievementNotification = styled(motion.div)`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;

  .achievement-icon {
    font-size: 2rem;
  }

  .achievement-info {
    h3 {
      color: #2d3436;
      margin-bottom: 0.25rem;
    }

    p {
      color: #636e72;
      font-size: 0.9rem;
    }
  }
`;

const gameLevels = {
    easy: [
        {
            id: 1,
            words: ['ROCK', 'ART', 'CAVE', 'OLD'],
            gridSize: 8,
            directions: [[0, 1], [1, 0]], // only horizontal and vertical
            timeLimit: 120,
            hintsAllowed: 3
        },
        {
            id: 2,
            words: ['STONE', 'DRAW', 'PAST', 'TIME', 'AGE'],
            gridSize: 9,
            directions: [[0, 1], [1, 0]],
            timeLimit: 150,
            hintsAllowed: 3
        },
        {
            id: 3,
            words: ['ANCIENT', 'CARVE', 'PAINT', 'WALL', 'ERA'],
            gridSize: 10,
            directions: [[0, 1], [1, 0]],
            timeLimit: 180,
            hintsAllowed: 3
        },
        {
            id: 4,
            words: ['HISTORY', 'SYMBOL', 'IMAGE', 'TRIBE', 'MARK'],
            gridSize: 10,
            directions: [[0, 1], [1, 0]],
            timeLimit: 180,
            hintsAllowed: 2
        },
        {
            id: 5,
            words: ['KONKAN', 'RITUAL', 'DANCE', 'HUNT', 'LIFE'],
            gridSize: 11,
            directions: [[0, 1], [1, 0]],
            timeLimit: 200,
            hintsAllowed: 2
        },
        {
            id: 6,
            words: ['TOOLS', 'CHISEL', 'HAMMER', 'CUT', 'MAKE'],
            gridSize: 11,
            directions: [[0, 1], [1, 0]],
            timeLimit: 200,
            hintsAllowed: 2
        },
        {
            id: 7,
            words: ['ANIMAL', 'DEER', 'BIRD', 'FISH', 'HUNT'],
            gridSize: 11,
            directions: [[0, 1], [1, 0]],
            timeLimit: 220,
            hintsAllowed: 2
        },
        {
            id: 8,
            words: ['NATURE', 'SUN', 'MOON', 'STAR', 'SKY', 'RAIN'],
            gridSize: 11,
            directions: [[0, 1], [1, 0]],
            timeLimit: 220,
            hintsAllowed: 2
        },
        {
            id: 9,
            words: ['TRIBE', 'CLAN', 'GROUP', 'FAMILY', 'PEOPLE'],
            gridSize: 12,
            directions: [[0, 1], [1, 0]],
            timeLimit: 240,
            hintsAllowed: 2
        },
        {
            id: 10,
            words: ['STORY', 'MYTH', 'LEGEND', 'TALE', 'LORE'],
            gridSize: 12,
            directions: [[0, 1], [1, 0]],
            timeLimit: 240,
            hintsAllowed: 2
        }
    ],
    medium: [
        {
            id: 11,
            words: ['PETROGLYPH', 'HERITAGE', 'CULTURE', 'ANCIENT', 'SYMBOL'],
            gridSize: 12,
            directions: [[0, 1], [1, 0], [1, 1]], // add diagonal
            timeLimit: 240,
            hintsAllowed: 2
        },
        {
            id: 12,
            words: ['CEREMONY', 'RITUAL', 'SACRED', 'DANCE', 'DRUM'],
            gridSize: 13,
            directions: [[0, 1], [1, 0], [1, 1]],
            timeLimit: 260,
            hintsAllowed: 2
        },
        {
            id: 13,
            words: ['WARRIOR', 'HUNTER', 'SHAMAN', 'CHIEF', 'ELDER'],
            gridSize: 13,
            directions: [[0, 1], [1, 0], [1, 1]],
            timeLimit: 260,
            hintsAllowed: 2
        },
        {
            id: 14,
            words: ['SEASONS', 'HARVEST', 'MONSOON', 'SUMMER', 'WINTER'],
            gridSize: 14,
            directions: [[0, 1], [1, 0], [1, 1]],
            timeLimit: 280,
            hintsAllowed: 2
        },
        {
            id: 15,
            words: ['SYMBOLS', 'MESSAGE', 'MEANING', 'DECODE', 'SECRET'],
            gridSize: 14,
            directions: [[0, 1], [1, 0], [1, 1]],
            timeLimit: 280,
            hintsAllowed: 1
        }
    ],
    hard: [
        {
            id: 21,
            words: ['CIVILIZATION', 'ARCHAEOLOGY', 'PRESERVATION', 'HISTORICAL', 'DISCOVERY'],
            gridSize: 15,
            directions: [[0, 1], [1, 0], [1, 1], [-1, 1]], // all directions
            timeLimit: 300,
            hintsAllowed: 1
        },
        {
            id: 22,
            words: ['PREHISTORIC', 'INDIGENOUS', 'TRADITIONS', 'COMMUNITY', 'KNOWLEDGE'],
            gridSize: 15,
            directions: [[0, 1], [1, 0], [1, 1], [-1, 1]],
            timeLimit: 320,
            hintsAllowed: 1
        },
        {
            id: 23,
            words: ['EXPEDITION', 'DISCOVERY', 'RESEARCH', 'DOCUMENT', 'PRESERVE'],
            gridSize: 16,
            directions: [[0, 1], [1, 0], [1, 1], [-1, 1]],
            timeLimit: 340,
            hintsAllowed: 1
        },
        {
            id: 24,
            words: ['TECHNIQUE', 'ARTISTRY', 'MASTERY', 'SKILLED', 'CRAFTED'],
            gridSize: 16,
            directions: [[0, 1], [1, 0], [1, 1], [-1, 1]],
            timeLimit: 340,
            hintsAllowed: 1
        }
    ]
};

const levelThemes = {
    1: { theme: 'Basic Terms', description: 'Learn the fundamental terms of rock art' },
    2: { theme: 'Time and Age', description: 'Explore concepts of time and history' },
    3: { theme: 'Art Methods', description: 'Discover ancient artistic techniques' },
    4: { theme: 'Tribal Life', description: 'Learn about ancient community life' },
    5: { theme: 'Konkan Culture', description: 'Explore the Konkan region traditions' },
    6: { theme: 'Tools & Techniques', description: 'Discover ancient carving tools' },
    7: { theme: 'Wildlife', description: 'Animals in ancient rock art' },
    8: { theme: 'Natural Elements', description: 'Nature symbols in petroglyphs' },
    9: { theme: 'Social Structure', description: 'Ancient social organization' },
    10: { theme: 'Mythology', description: 'Ancient stories and legends' },
    11: { theme: 'Advanced Terms', description: 'Complex petroglyph terminology' },
    12: { theme: 'Rituals', description: 'Ancient ceremonial practices' },
    13: { theme: 'Roles & Leaders', description: 'Community leadership roles' },
    14: { theme: 'Seasonal Life', description: 'Life through changing seasons' },
    15: { theme: 'Hidden Meanings', description: 'Decode ancient messages' }
};

const achievements = {
    speedster: {
        id: 'speedster',
        title: 'Speed Reader',
        description: 'Complete a level in under 60 seconds',
        icon: '⚡'
    },
    perfectionist: {
        id: 'perfectionist',
        title: 'Perfect Score',
        description: 'Complete a level without using hints',
        icon: '✨'
    },
    wordmaster: {
        id: 'wordmaster',
        title: 'Word Master',
        description: 'Find all words in correct order',
        icon: '📚'
    }
};

function generateGrid(words, size = 15, allowedDirections = [[0, 1], [1, 0], [1, 1], [-1, 1]]) {
    const grid = Array(size).fill().map(() => Array(size).fill(''));
    const placedWords = [];

    // Place words
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const direction = allowedDirections[Math.floor(Math.random() * allowedDirections.length)];
            const startX = Math.floor(Math.random() * size);
            const startY = Math.floor(Math.random() * size);

            if (canPlaceWord(grid, word, startX, startY, direction)) {
                placeWord(grid, word, startX, startY, direction);
                placedWords.push({
                    word,
                    start: [startX, startY],
                    direction,
                    found: false
                });
                placed = true;
            }
        }
    });

    // Fill empty cells
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    return { grid, placedWords };
}

function canPlaceWord(grid, word, startX, startY, [dx, dy]) {
    const size = grid.length;

    for (let i = 0; i < word.length; i++) {
        const x = startX + i * dx;
        const y = startY + i * dy;

        if (x < 0 || x >= size || y < 0 || y >= size) return false;
        if (grid[x][y] !== '' && grid[x][y] !== word[i]) return false;
    }

    return true;
}

function placeWord(grid, word, startX, startY, [dx, dy]) {
    for (let i = 0; i < word.length; i++) {
        grid[startX + i * dx][startY + i * dy] = word[i];
    }
}

function WordSearch() {
    const [gameState, setGameState] = useState(null);
    const [selection, setSelection] = useState([]);
    const [foundWords, setFoundWords] = useState([]);
    const [difficulty, setDifficulty] = useState('Medium');
    const [score, setScore] = useState(0);
    const [hints, setHints] = useState(3);
    const [startTime] = useState(Date.now());
    const [timeTaken, setTimeTaken] = useState(0);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [highestLevel, setHighestLevel] = useState(1);
    const [unlockedAchievements, setUnlockedAchievements] = useState([]);
    const [showAchievement, setShowAchievement] = useState(null);
    const [highlightedCells, setHighlightedCells] = useState([]);
    const [currentHover, setCurrentHover] = useState(null);

    // Get current level data
    const getLevelData = (levelNumber) => {
        if (levelNumber <= 10) return gameLevels.easy[levelNumber - 1];
        if (levelNumber <= 20) return gameLevels.medium[levelNumber - 11];
        return gameLevels.hard[levelNumber - 21];
    };

    const currentLevelData = getLevelData(currentLevel);

    // Remove the old useEffect and keep only the one with currentLevelData
    useEffect(() => {
        if (currentLevelData) {
            setGameState(generateGrid(
                currentLevelData.words,
                currentLevelData.gridSize,
                currentLevelData.directions
            ));
            setHints(currentLevelData.hintsAllowed);
        }
    }, [currentLevel]);

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeTaken(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    // Add function to calculate cells to highlight
    const calculateHighlightedCells = (startCell, currentCell) => {
        if (!startCell || !currentCell) return [];

        const [startX, startY] = startCell;
        const [currentX, currentY] = currentCell;

        const dx = Math.sign(currentX - startX);
        const dy = Math.sign(currentY - startY);

        // Only highlight if we have a valid direction
        if (dx === 0 && dy === 0) return [];

        const cells = [];
        let x = startX;
        let y = startY;

        while (
            x >= 0 && x < currentLevelData.gridSize &&
            y >= 0 && y < currentLevelData.gridSize
        ) {
            cells.push([x, y]);
            if (x === currentX && y === currentY) break;
            x += dx;
            y += dy;
        }

        return cells;
    };

    // Update handleCellClick to use highlighting
    const handleCellClick = (x, y) => {
        if (selection.length === 0) {
            setSelection([[x, y]]);
            setHighlightedCells([[x, y]]);
        } else if (selection.length === 1) {
            const cells = calculateHighlightedCells(selection[0], [x, y]);

            // Get word from selection
            const selectedWord = cells.map(([cx, cy]) => gameState.grid[cx][cy]).join('');

            // Check if word exists
            const wordEntry = gameState.placedWords.find(w =>
                w.word === selectedWord && !w.found &&
                w.start[0] === selection[0][0] && w.start[1] === selection[0][1] &&
                w.direction[0] === Math.sign(x - selection[0][0]) &&
                w.direction[1] === Math.sign(y - selection[0][1])
            );

            if (wordEntry) {
                setFoundWords(prev => [...prev, selectedWord]);
                wordEntry.found = true;
                handleWordFound(selectedWord);
            }

            setSelection([]);
            setHighlightedCells([]);
        }
    };

    // Add hover effect
    const handleCellHover = (x, y) => {
        if (selection.length === 1) {
            setCurrentHover([x, y]);
            const cells = calculateHighlightedCells(selection[0], [x, y]);
            setHighlightedCells(cells);
        }
    };

    const useHint = () => {
        if (hints > 0 && currentLevelData) {
            const unFoundWord = currentLevelData.words.find(word => !foundWords.includes(word));
            if (unFoundWord) {
                setHints(prev => prev - 1);
                // Highlight the first letter of the word temporarily
                // Implementation details...
            }
        }
    };

    const handleWordFound = (word) => {
        const basePoints = word.length * 10;
        const speedBonus = Math.max(0, 100 - timeTaken);
        const points = basePoints + speedBonus;
        setScore(prev => prev + points);
    };

    // Add level completion handler
    const handleLevelComplete = () => {
        setLevelCompleted(true);
        if (currentLevel === highestLevel) {
            setHighestLevel(prev => prev + 1);
        }
    };

    // Add next level handler
    const handleNextLevel = () => {
        setCurrentLevel(prev => prev + 1);
        setLevelCompleted(false);
        setFoundWords([]);
        setScore(0);
        setHints(currentLevelData.hintsAllowed);
    };

    // Add achievement handler
    const checkAchievements = (stats) => {
        const newAchievements = [];

        if (stats.timeTaken < 60) {
            newAchievements.push(achievements.speedster);
        }
        if (stats.hintsUsed === 0) {
            newAchievements.push(achievements.perfectionist);
        }
        if (stats.perfectOrder) {
            newAchievements.push(achievements.wordmaster);
        }

        if (newAchievements.length > 0) {
            setUnlockedAchievements(prev => [...prev, ...newAchievements]);
            showAchievementNotification(newAchievements[0]);
        }
    };

    const showAchievementNotification = (achievement) => {
        setShowAchievement(achievement);
        setTimeout(() => setShowAchievement(null), 3000);
    };

    if (!gameState) return null;

    return (
        <GameContainer>
            <GameHeader>
                <div className="level-info">
                    <h2>Level {currentLevel}</h2>
                    <p>{levelThemes[currentLevel]?.description}</p>
                </div>
                <div className="stats">
                    <div>Level: {currentLevel}</div>
                    <div>Score: {score}</div>
                    <div>Hints: {hints}</div>
                    <div>Time: {currentLevelData.timeLimit - timeTaken}s</div>
                </div>
            </GameHeader>

            <WordList>
                {currentLevelData.words.map(word => (
                    <Word key={word} found={foundWords.includes(word)}>
                        {word}
                    </Word>
                ))}
            </WordList>

            <Grid size={currentLevelData.gridSize}>
                {gameState.grid.map((row, x) =>
                    row.map((cell, y) => {
                        const isSelected = selection.some(([sx, sy]) => sx === x && sy === y);
                        const isHighlighted = highlightedCells.some(([hx, hy]) => hx === x && hy === y);
                        const isFound = foundWords.includes(cell);

                        return (
                            <Cell
                                key={`${x}-${y}`}
                                isSelected={isSelected}
                                isHighlighted={isHighlighted}
                                isFound={isFound}
                                onClick={() => handleCellClick(x, y)}
                                onMouseEnter={() => handleCellHover(x, y)}
                                onMouseLeave={() => setHighlightedCells(selection)}
                                whileHover={{ scale: isFound ? 1 : 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {cell}
                            </Cell>
                        );
                    })
                )}
            </Grid>

            <AnimatePresence>
                {foundWords.length === currentLevelData.words.length && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="level-complete-modal"
                    >
                        <h2>Level {currentLevel} Complete! 🎉</h2>
                        <p>Score: {score}</p>
                        <p>Time: {timeTaken}s</p>
                        {currentLevel < 30 && (
                            <button onClick={handleNextLevel}>
                                Next Level →
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAchievement && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="achievement-notification"
                    >
                        <div className="achievement-icon">{showAchievement.icon}</div>
                        <div className="achievement-info">
                            <h3>{showAchievement.title}</h3>
                            <p>{showAchievement.description}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GameContainer>
    );
}

export default WordSearch; 