import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playSound } from '../services/SoundService.js';

// Import petroglyphs
import petroglyph1 from '../assets/images/1.JPG';
import petroglyph2 from '../assets/images/2.JPG';
import petroglyph3 from '../assets/images/3.JPG';
import petroglyph4 from '../assets/images/14.JPG';
import petroglyph5 from '../assets/images/5.JPG';
// ... more imports 

const GameContainer = styled.div`
  max-width: 1000px;
  margin: 1rem auto;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin: 0;
    border-radius: 0;
  }
`;

const GameContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoPanel = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h2 {
    color: #D74E9F;
    margin-bottom: 0.25rem;
    font-size: clamp(1.2rem, 4vw, 1.5rem);
    text-shadow: 0 0 10px rgba(215, 78, 159, 0.5);
  }
  
  p {
    color: #B3B3B3;
    font-size: clamp(0.8rem, 3vw, 0.9rem);
  }
`;

const Timer = styled.div`
  font-size: clamp(1.5rem, 6vw, 2rem);
  text-align: center;
  margin: 0.5rem 0;
  color: ${props => props.isLow ? '#FF6B6B' : '#4ECDC4'};
  font-weight: bold;
  text-shadow: 0 0 15px ${props => props.isLow ? 'rgba(255, 107, 107, 0.5)' : 'rgba(78, 205, 196, 0.5)'};
  transition: color 0.3s ease;
`;

const PatternGrid = styled(motion.div)`
  width: 320px;
  aspect-ratio: 1;
  margin: 1rem auto;
  display: grid;
  grid-template-columns: repeat(${props => Math.ceil(Math.sqrt(props.gridSize))}, 1fr);
  gap: 2px;
  background: rgba(51, 51, 51, 0.5);
  padding: 2px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const Pattern = styled(motion.div)`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid ${props => props.isSelected ? '#D74E9F' : 'rgba(255, 255, 255, 0.1)'};
  box-shadow: ${props => props.isSelected ? '0 0 15px rgba(215, 78, 159, 0.3)' : 'none'};

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: ${props => props.isFaded ? 0.4 : 1};
    filter: ${props => props.isBlurred ? 'blur(3px)' : 'none'};
    transition: all 0.3s ease;
  }

  &:hover {
    border-color: rgba(215, 78, 159, 0.5);
    box-shadow: 0 0 15px rgba(215, 78, 159, 0.3);
    
    img {
      opacity: 1;
      filter: none;
    }
  }
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  flex-wrap: wrap;

  div {
    padding: 0.25rem 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    color: white;
    font-size: clamp(0.8rem, 3vw, 0.9rem);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const LevelInfo = styled.div`
    margin-top: 1rem;
    text-align: center;
    color: #B3B3B3;
    font-size: 0.9rem;

    ul {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
    }

    li {
        background: rgba(255, 255, 255, 0.05);
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
`;

const gameLevels = [
    {
        id: 1,
        gridSize: 9, // 3x3
        matchesNeeded: 3,
        timeLimit: 30,
        description: "Find three matching petroglyphs"
    },
    {
        id: 2,
        gridSize: 12, // 3x4
        matchesNeeded: 4,
        timeLimit: 45,
        fadeCards: true,
        description: "Cards fade after viewing"
    },
    {
        id: 3,
        gridSize: 16, // 4x4
        matchesNeeded: 4,
        timeLimit: 50,
        shuffleInterval: 10000, // Shuffle every 10 seconds
        description: "Board shuffles periodically"
    },
    {
        id: 4,
        gridSize: 16,
        matchesNeeded: 4,
        timeLimit: 45,
        fadeCards: true,
        description: "Cards fade after viewing"
    },
    {
        id: 5,
        gridSize: 16,
        matchesNeeded: 5,
        timeLimit: 50,
        shuffleInterval: 8000,
        description: "Find 5 matches with shuffling board"
    },
    {
        id: 6,
        gridSize: 20, // 4x5
        matchesNeeded: 4,
        timeLimit: 45,
        fadeCards: true,
        shuffleInterval: 12000,
        description: "Fading cards with periodic shuffles"
    },
    {
        id: 7,
        gridSize: 20,
        matchesNeeded: 5,
        timeLimit: 50,
        blurCards: true,
        description: "Blurred cards challenge"
    },
    {
        id: 8,
        gridSize: 25, // 5x5
        matchesNeeded: 4,
        timeLimit: 40,
        fadeCards: true,
        blurCards: true,
        description: "Fading and blurred cards"
    },
    {
        id: 9,
        gridSize: 25,
        matchesNeeded: 5,
        timeLimit: 45,
        shuffleInterval: 7000,
        blurCards: true,
        description: "Quick shuffles with blurred cards"
    },
    {
        id: 10,
        gridSize: 25,
        matchesNeeded: 6,
        timeLimit: 55,
        fadeCards: true,
        shuffleInterval: 10000,
        description: "Find 6 matches with fading and shuffling"
    },
    {
        id: 11,
        gridSize: 30, // 5x6
        matchesNeeded: 5,
        timeLimit: 50,
        blurCards: true,
        fadeCards: true,
        description: "Blurred and fading challenge"
    },
    {
        id: 12,
        gridSize: 30,
        matchesNeeded: 6,
        timeLimit: 55,
        shuffleInterval: 6000,
        blurCards: true,
        description: "Fast shuffles with blurred cards"
    },
    {
        id: 13,
        gridSize: 36, // 6x6
        matchesNeeded: 5,
        timeLimit: 45,
        fadeCards: true,
        shuffleInterval: 8000,
        blurCards: true,
        description: "Triple challenge: Fading, blurred, and shuffling"
    },
    {
        id: 14,
        gridSize: 36,
        matchesNeeded: 6,
        timeLimit: 50,
        fadeCards: true,
        blurCards: true,
        fastFade: true,
        description: "Fast fading with blurred cards"
    },
    {
        id: 15,
        gridSize: 36,
        matchesNeeded: 7,
        timeLimit: 60,
        shuffleInterval: 5000,
        blurCards: true,
        description: "Very fast shuffles with 7 matches"
    },
    {
        id: 16,
        gridSize: 42, // 6x7
        matchesNeeded: 6,
        timeLimit: 55,
        fadeCards: true,
        shuffleInterval: 7000,
        blurCards: true,
        description: "Large grid with all challenges"
    },
    {
        id: 17,
        gridSize: 42,
        matchesNeeded: 7,
        timeLimit: 60,
        fadeCards: true,
        fastFade: true,
        blurCards: true,
        description: "Fast fading with 7 matches"
    },
    {
        id: 18,
        gridSize: 49, // 7x7
        matchesNeeded: 6,
        timeLimit: 50,
        shuffleInterval: 6000,
        blurCards: true,
        fadeCards: true,
        description: "Huge grid with all mechanics"
    },
    {
        id: 19,
        gridSize: 49,
        matchesNeeded: 7,
        timeLimit: 55,
        fadeCards: true,
        fastFade: true,
        shuffleInterval: 8000,
        description: "Fast fading and shuffling"
    },
    {
        id: 20,
        gridSize: 49,
        matchesNeeded: 8,
        timeLimit: 65,
        blurCards: true,
        shuffleInterval: 5000,
        description: "Find 8 matches with fast shuffles"
    },
    {
        id: 21,
        gridSize: 56, // 7x8
        matchesNeeded: 7,
        timeLimit: 60,
        fadeCards: true,
        blurCards: true,
        shuffleInterval: 6000,
        description: "Extra large grid challenge"
    },
    {
        id: 22,
        gridSize: 56,
        matchesNeeded: 8,
        timeLimit: 65,
        fadeCards: true,
        fastFade: true,
        blurCards: true,
        description: "Fast fading with 8 matches"
    },
    {
        id: 23,
        gridSize: 64, // 8x8
        matchesNeeded: 7,
        timeLimit: 55,
        shuffleInterval: 5000,
        blurCards: true,
        fadeCards: true,
        description: "Massive grid with fast mechanics"
    },
    {
        id: 24,
        gridSize: 64,
        matchesNeeded: 8,
        timeLimit: 60,
        fadeCards: true,
        fastFade: true,
        shuffleInterval: 7000,
        description: "Expert challenge with all mechanics"
    },
    {
        id: 25,
        gridSize: 64,
        matchesNeeded: 9,
        timeLimit: 70,
        blurCards: true,
        shuffleInterval: 4000,
        description: "Ultra fast shuffles with 9 matches"
    },
    {
        id: 26,
        gridSize: 72, // 8x9
        matchesNeeded: 8,
        timeLimit: 65,
        fadeCards: true,
        fastFade: true,
        blurCards: true,
        shuffleInterval: 5000,
        description: "Master challenge: All mechanics combined"
    },
    {
        id: 27,
        gridSize: 72,
        matchesNeeded: 9,
        timeLimit: 70,
        fadeCards: true,
        fastFade: true,
        shuffleInterval: 4000,
        description: "Speed master with 9 matches"
    },
    {
        id: 28,
        gridSize: 81, // 9x9
        matchesNeeded: 8,
        timeLimit: 60,
        fadeCards: true,
        fastFade: true,
        blurCards: true,
        shuffleInterval: 4000,
        description: "Ultimate grid challenge"
    },
    {
        id: 29,
        gridSize: 81,
        matchesNeeded: 9,
        timeLimit: 65,
        fadeCards: true,
        fastFade: true,
        blurCards: true,
        shuffleInterval: 3000,
        description: "Expert speed challenge"
    },
    {
        id: 30,
        gridSize: 81,
        matchesNeeded: 10,
        timeLimit: 75,
        fadeCards: true,
        fastFade: true,
        blurCards: true,
        shuffleInterval: 3000,
        description: "Final challenge: Find 10 matches in chaos!"
    }
];

function PatternMatch() {
    const navigate = useNavigate();
    const [currentLevel, setCurrentLevel] = useState(0);
    const [patterns, setPatterns] = useState([]);
    const [selectedPatterns, setSelectedPatterns] = useState([]);
    const [targetPattern, setTargetPattern] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(gameLevels[0].timeLimit);
    const [gameStarted, setGameStarted] = useState(false);
    const [showVictory, setShowVictory] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);
    const [fadeOpacity, setFadeOpacity] = useState(1);
    const [blurAmount, setBlurAmount] = useState(0);

    useEffect(() => {
        initializeLevel(currentLevel);
    }, [currentLevel]);

    useEffect(() => {
        let timer;
        if (gameStarted && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameStarted, timeLeft]);

    useEffect(() => {
        if (timeLeft === 0 && gameStarted) {
            playSound('gameover');
            setGameStarted(false);
            setShowGameOver(true);
        }
    }, [timeLeft, gameStarted]);

    useEffect(() => {
        const level = gameLevels[currentLevel];
        if (level.shuffleInterval && gameStarted) {
            const interval = setInterval(() => {
                shufflePatterns();
                playSound('shuffle');
            }, level.shuffleInterval);
            return () => clearInterval(interval);
        }
    }, [currentLevel, gameStarted]);

    useEffect(() => {
        const level = gameLevels[currentLevel];
        if (level.fadeCards && gameStarted) {
            const fadeInterval = level.fastFade ? 50 : 100;
            const fadeAmount = level.fastFade ? 0.02 : 0.01;
            const minOpacity = level.fastFade ? 0.2 : 0.4;

            const interval = setInterval(() => {
                setFadeOpacity(prev => Math.max(prev - fadeAmount, minOpacity));
            }, fadeInterval);

            return () => clearInterval(interval);
        } else {
            setFadeOpacity(1);
        }
    }, [currentLevel, gameStarted]);

    useEffect(() => {
        const level = gameLevels[currentLevel];
        if (level.blurCards && gameStarted) {
            const interval = setInterval(() => {
                setBlurAmount(prev => Math.min(prev + 0.2, 3));
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setBlurAmount(0);
        }
    }, [currentLevel, gameStarted]);

    const initializeLevel = (levelIndex) => {
        const level = gameLevels[levelIndex];
        const allPetroglyphs = [petroglyph1, petroglyph2, petroglyph3, petroglyph4, petroglyph5];
        const target = allPetroglyphs[Math.floor(Math.random() * allPetroglyphs.length)];
        setTargetPattern(target);

        // Create grid with required matches
        const newPatterns = [];
        const matchPositions = new Set();

        // Add required matches
        while (matchPositions.size < level.matchesNeeded) {
            const pos = Math.floor(Math.random() * level.gridSize);
            matchPositions.add(pos);
        }

        // Fill the grid
        for (let i = 0; i < level.gridSize; i++) {
            if (matchPositions.has(i)) {
                newPatterns.push({ id: i, image: target });
            } else {
                const randomImage = allPetroglyphs[Math.floor(Math.random() * allPetroglyphs.length)];
                newPatterns.push({ id: i, image: randomImage });
            }
        }

        setPatterns(shufflePatterns(newPatterns));
        setTimeLeft(level.timeLimit);
        setSelectedPatterns([]);
        setGameStarted(false);
        setShowVictory(false);
        setShowGameOver(false);
    };

    const shufflePatterns = (patternsToShuffle = patterns) => {
        return [...patternsToShuffle].sort(() => Math.random() - 0.5);
    };

    const handlePatternClick = (index) => {
        if (!gameStarted) {
            setGameStarted(true);
        }

        if (selectedPatterns.includes(index)) {
            setSelectedPatterns(prev => prev.filter(i => i !== index));
            return;
        }

        const newSelected = [...selectedPatterns, index];
        setSelectedPatterns(newSelected);
        playSound('select');

        // Check if we have enough selections
        if (newSelected.length === gameLevels[currentLevel].matchesNeeded) {
            checkMatch(newSelected);
        }
    };

    const checkMatch = (selected) => {
        const selectedImages = selected.map(index => patterns[index].image);
        const allMatch = selectedImages.every(img => img === targetPattern);

        setTimeout(() => {
            if (allMatch) {
                playSound('match');
                setScore(prev => prev + selected.length);
                setShowVictory(true);
                setGameStarted(false);
            } else {
                playSound('mismatch');
            }
            setSelectedPatterns([]);
        }, 1000);
    };

    return (
        <GameContainer>
            <InfoPanel>
                <h2>Level {currentLevel + 1}</h2>
                <p>{gameLevels[currentLevel].description}</p>
            </InfoPanel>

            <GameContent>
                <div>
                    <Timer isLow={timeLeft <= 10}>{timeLeft}s</Timer>

                    <Stats>
                        <div>Score: {score}</div>
                        <div>Matches: {selectedPatterns.length}/{gameLevels[currentLevel].matchesNeeded}</div>
                    </Stats>
                </div>

                {targetPattern && (
                    <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                        <p style={{ color: '#B3B3B3', fontSize: '0.9rem' }}>
                            Find {gameLevels[currentLevel].matchesNeeded} matching patterns
                        </p>
                        <Pattern
                            style={{
                                width: '80px',
                                height: '80px',
                                margin: '0.5rem auto',
                                padding: 0
                            }}
                        >
                            <img src={targetPattern} alt="Target pattern" />
                        </Pattern>
                    </div>
                )}

                <PatternGrid
                    gridSize={gameLevels[currentLevel].gridSize}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {patterns.map((pattern, index) => (
                        <Pattern
                            key={pattern.id}
                            onClick={() => handlePatternClick(index)}
                            isSelected={selectedPatterns.includes(index)}
                            isFaded={gameLevels[currentLevel].fadeCards}
                            style={{
                                '--fade-opacity': fadeOpacity,
                                '--blur-amount': `${blurAmount}px`
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img
                                src={pattern.image}
                                alt="Pattern"
                                style={{
                                    filter: gameLevels[currentLevel].blurCards ? `blur(${blurAmount}px)` : 'none',
                                    opacity: gameLevels[currentLevel].fadeCards ? fadeOpacity : 1
                                }}
                            />
                        </Pattern>
                    ))}
                </PatternGrid>

                <div style={{ flex: 1 }} />
            </GameContent>

            <AnimatePresence>
                {showVictory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.5 }}
                            style={{
                                background: 'rgba(45, 31, 63, 0.95)',
                                padding: '2rem',
                                borderRadius: '16px',
                                textAlign: 'center',
                                maxWidth: '90%',
                                width: '400px'
                            }}
                        >
                            <h2>Level Complete! 🎉</h2>
                            <div style={{ margin: '1rem 0' }}>
                                <p>Score: {score}</p>
                                <p>Time: {gameLevels[currentLevel].timeLimit - timeLeft}s</p>
                            </div>
                            <div>
                                <button
                                    onClick={() => initializeLevel(currentLevel)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        margin: '0.5rem',
                                        background: 'linear-gradient(45deg, #D74E9F, #9B4DE3)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Retry Level
                                </button>
                                {currentLevel < gameLevels.length - 1 && (
                                    <button
                                        onClick={() => setCurrentLevel(prev => prev + 1)}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            margin: '0.5rem',
                                            background: 'linear-gradient(45deg, #4ECDC4, #2ECC71)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Next Level →
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {showGameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.5 }}
                            style={{
                                background: 'rgba(45, 31, 63, 0.95)',
                                padding: '2rem',
                                borderRadius: '16px',
                                textAlign: 'center',
                                maxWidth: '90%',
                                width: '400px'
                            }}
                        >
                            <h2>Game Over!</h2>
                            <p style={{ margin: '1rem 0' }}>Final Score: {score}</p>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'linear-gradient(45deg, #D74E9F, #9B4DE3)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Try Again
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <LevelInfo>
                <p>Active Mechanics:</p>
                <ul>
                    {gameLevels[currentLevel].fadeCards && (
                        <li>🌟 {gameLevels[currentLevel].fastFade ? 'Fast' : ''} Fading Cards</li>
                    )}
                    {gameLevels[currentLevel].blurCards && (
                        <li>👁️ Blurred Cards</li>
                    )}
                    {gameLevels[currentLevel].shuffleInterval && (
                        <li>🔄 Shuffles every {gameLevels[currentLevel].shuffleInterval / 1000}s</li>
                    )}
                </ul>
            </LevelInfo>
        </GameContainer>
    );
}

export default PatternMatch; 