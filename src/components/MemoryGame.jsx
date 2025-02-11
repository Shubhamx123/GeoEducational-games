import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playSound } from '../services/SoundService.js';

import petroglyph1 from '../assets/images/1.JPG';
import petroglyph2 from '../assets/images/2.JPG';
import petroglyph3 from '../assets/images/3.JPG';
import petroglyph4 from '../assets/images/14.JPG';
import petroglyph5 from '../assets/images/5.JPG';
import petroglyph6 from '../assets/images/6.JPG';
import petroglyph7 from '../assets/images/7.JPG';
import petroglyph8 from '../assets/images/8.JPG';
import petroglyph9 from '../assets/images/9.JPG';
import petroglyph10 from '../assets/images/10.JPG';

const GameContainer = styled.div`
  max-width: 1000px;
  min-height: 100vh;
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

const GameBoard = styled(motion.div)`
  width: 320px;
  aspect-ratio: 1;
  margin: 1rem auto;
  display: grid;
  grid-template-columns: repeat(${props => Math.ceil(Math.sqrt(props.cardCount))}, 1fr);
  gap: 2px;
  background: rgba(51, 51, 51, 0.5);
  padding: 2px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const Card = styled(motion.div)`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  cursor: pointer;
  transform-style: preserve-3d;

  .front, .back {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(1.5rem, 5vw, 2rem);
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }

  .back {
    transform: rotateY(180deg);
  }

  &:hover {
    filter: brightness(1.2);
    border-color: rgba(215, 78, 159, 0.5);
    box-shadow: 0 0 15px rgba(215, 78, 159, 0.3);
  }

  opacity: ${props => props.isFaded ? 0.4 : 1};
  visibility: ${props => props.isInvisible ? 'hidden' : 'visible'};
  transform: rotate(${props => props.rotation}deg);

  &:hover {
    opacity: 1;
    visibility: visible;
  }
`;

const StyledButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #D74E9F, #9B4DE3);
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(215, 78, 159, 0.3);
  font-size: clamp(0.9rem, 3vw, 1rem);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(215, 78, 159, 0.5);
    transform: translateY(-2px);
  }
`;

const VictoryModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(45, 31, 63, 0.95);
  padding: clamp(1rem, 5vw, 2rem);
  border-radius: 16px;
  width: min(90%, 400px);
  text-align: center;
  z-index: 1000;

  h2 {
    font-size: clamp(1.5rem, 6vw, 2rem);
    margin-bottom: 0.5rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin: 1rem 0;
    font-size: clamp(0.8rem, 4vw, 1rem);
  }

  button {
    font-size: clamp(0.9rem, 4vw, 1rem);
    padding: 0.75rem 1rem;
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.variant === 'success'
        ? 'linear-gradient(45deg, #4ECDC4, #2ECC71)'
        : 'linear-gradient(45deg, #FF6B6B, #D74E9F)'};
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin: 0.5rem;
`;

const GameOverModal = styled(VictoryModal)`
  h2 {
    background: linear-gradient(45deg, #FF6B6B, #D74E9F);
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
  font-size: 0.9rem;
  color: #B3B3B3;

  ul {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;
  }
`;

const gameLevels = [
    {
        id: 1,
        pairs: 4,
        timeLimit: 30,
        cards: [
            { id: 1, image: petroglyph1 },
            { id: 2, image: petroglyph2 },
            { id: 3, image: petroglyph3 },
            { id: 4, image: petroglyph4 }
        ]
    },
    {
        id: 2,
        pairs: 6,
        timeLimit: 45,
        cards: [
            { id: 1, image: petroglyph1 },
            { id: 2, image: petroglyph2 },
            { id: 3, image: petroglyph3 },
            { id: 4, image: petroglyph4 },
            { id: 5, image: petroglyph5 },
            { id: 6, image: petroglyph1 }
        ],
        fadeCards: true
    },
    {
        id: 3,
        pairs: 8,
        timeLimit: 60,
        cards: [
            { id: 1, image: petroglyph1 },
            { id: 2, image: petroglyph2 },
            { id: 3, image: petroglyph3 },
            { id: 4, image: petroglyph4 },
            { id: 5, image: petroglyph5 },
            { id: 6, image: petroglyph1 },
            { id: 7, image: petroglyph2 },
            { id: 8, image: petroglyph3 },
            { id: 9, image: petroglyph4 },
            { id: 10, image: petroglyph5 }
        ],
        shuffleInterval: 15000
    },
    {
        id: 4,
        pairs: 8,
        timeLimit: 50,
        cards: [
            { id: 1, image: petroglyph1 },
            { id: 2, image: petroglyph2 },
            { id: 3, image: petroglyph3 },
            { id: 4, image: petroglyph4 },
            { id: 5, image: petroglyph5 },
            { id: 6, image: petroglyph1 },
            { id: 7, image: petroglyph2 },
            { id: 8, image: petroglyph3 },
            { id: 9, image: petroglyph4 },
            { id: 10, image: petroglyph5 }
        ],
        fadeCards: true,
        timerSpeed: 1.2
    },
    {
        id: 5,
        pairs: 10,
        timeLimit: 70,
        cards: [
            { id: 1, image: petroglyph1 },
            { id: 2, image: petroglyph2 },
            { id: 3, image: petroglyph3 },
            { id: 4, image: petroglyph4 },
            { id: 5, image: petroglyph5 },
            { id: 6, image: petroglyph1 },
            { id: 7, image: petroglyph2 },
            { id: 8, image: petroglyph3 },
            { id: 9, image: petroglyph4 },
            { id: 10, image: petroglyph5 }
        ],
        invisibleCards: true
    },
    {
        id: 6,
        pairs: 10,
        timeLimit: 65,
        cards: [
            { id: 1, image: petroglyph1 },
            { id: 2, image: petroglyph2 },
            { id: 3, image: petroglyph3 },
            { id: 4, image: petroglyph4 },
            { id: 5, image: petroglyph5 },
            { id: 6, image: petroglyph1 },
            { id: 7, image: petroglyph2 },
            { id: 8, image: petroglyph3 },
            { id: 9, image: petroglyph4 },
            { id: 10, image: petroglyph5 }
        ],
        shuffleInterval: 12000,
        fadeCards: true
    },
    {
        id: 7,
        pairs: 12,
        timeLimit: 80,
        cards: [
            { id: 1, image: petroglyph1 },
            { id: 2, image: petroglyph2 },
            { id: 3, image: petroglyph3 },
            { id: 4, image: petroglyph4 },
            { id: 5, image: petroglyph5 },
            { id: 6, image: petroglyph1 },
            { id: 7, image: petroglyph2 },
            { id: 8, image: petroglyph3 },
            { id: 9, image: petroglyph4 },
            { id: 10, image: petroglyph5 },
            { id: 11, image: petroglyph1 },
            { id: 12, image: petroglyph2 }
        ],
        rotateCards: true
    },
    {
        id: 8,
        pairs: 12,
        timeLimit: 75,
        cards: [
            { id: 1, image: petroglyph1 },
            { id: 2, image: petroglyph2 },
            { id: 3, image: petroglyph3 },
            { id: 4, image: petroglyph4 },
            { id: 5, image: petroglyph5 },
            { id: 6, image: petroglyph1 },
            { id: 7, image: petroglyph2 },
            { id: 8, image: petroglyph3 },
            { id: 9, image: petroglyph4 },
            { id: 10, image: petroglyph5 },
            { id: 11, image: petroglyph1 },
            { id: 12, image: petroglyph2 }
        ],
        invisibleCards: true,
        shuffleInterval: 10000
    },
    {
        id: 9,
        pairs: 15,
        timeLimit: 90,
        cards: [
            { id: 1, image: petroglyph1 },
            { id: 2, image: petroglyph2 },
            { id: 3, image: petroglyph3 },
            { id: 4, image: petroglyph4 },
            { id: 5, image: petroglyph5 },
            { id: 6, image: petroglyph1 },
            { id: 7, image: petroglyph2 },
            { id: 8, image: petroglyph3 },
            { id: 9, image: petroglyph4 },
            { id: 10, image: petroglyph5 },
            { id: 11, image: petroglyph1 },
            { id: 12, image: petroglyph2 },
            { id: 13, image: petroglyph3 },
            { id: 14, image: petroglyph4 },
            { id: 15, image: petroglyph5 }
        ],
        fadeCards: true,
        shuffleInterval: 8000,
        rotateCards: true
    },
    {
        id: 10,
        pairs: 15,
        timeLimit: 85,
        cards: [
            { id: 1, image: petroglyph1 },
            { id: 2, image: petroglyph2 },
            { id: 3, image: petroglyph3 },
            { id: 4, image: petroglyph4 },
            { id: 5, image: petroglyph5 },
            { id: 6, image: petroglyph1 },
            { id: 7, image: petroglyph2 },
            { id: 8, image: petroglyph3 },
            { id: 9, image: petroglyph4 },
            { id: 10, image: petroglyph5 },
            { id: 11, image: petroglyph1 },
            { id: 12, image: petroglyph2 },
            { id: 13, image: petroglyph3 },
            { id: 14, image: petroglyph4 },
            { id: 15, image: petroglyph5 }
        ],
        invisibleCards: true,
        shuffleInterval: 7000,
        timerSpeed: 1.3
    },
    {
        id: 11,
        pairs: 12,
        timeLimit: 75,
        cards: generateCards(12, [petroglyph1, petroglyph2, petroglyph3, petroglyph4]),
        fadeCards: true,
        shuffleInterval: 12000,
        description: "Fading memories with periodic shuffles"
    },
    {
        id: 12,
        pairs: 12,
        timeLimit: 70,
        cards: generateCards(12, [petroglyph5, petroglyph6, petroglyph7, petroglyph8]),
        invisibleCards: true,
        rotateCards: true,
        description: "Invisible rotating pieces"
    },
    {
        id: 13,
        pairs: 14,
        timeLimit: 85,
        cards: generateCards(14, [petroglyph1, petroglyph2, petroglyph3, petroglyph4]),
        shuffleInterval: 10000,
        timerSpeed: 1.2,
        description: "Fast-paced with frequent shuffles"
    },
    {
        id: 14,
        pairs: 14,
        timeLimit: 80,
        cards: generateCards(14, [petroglyph5, petroglyph6, petroglyph7, petroglyph8]),
        fadeCards: true,
        invisibleCards: true,
        description: "Fading and invisible cards challenge"
    },
    {
        id: 15,
        pairs: 16,
        timeLimit: 95,
        cards: generateCards(16, [petroglyph1, petroglyph2, petroglyph3, petroglyph4]),
        rotateCards: true,
        shuffleInterval: 9000,
        description: "Rotating chaos"
    },
    {
        id: 16,
        pairs: 16,
        timeLimit: 90,
        cards: generateCards(16, [petroglyph6, petroglyph7, petroglyph8, petroglyph9]),
        fadeCards: true,
        shuffleInterval: 11000,
        description: "Fading memories in motion"
    },
    {
        id: 17,
        pairs: 16,
        timeLimit: 85,
        cards: generateCards(16, [petroglyph1, petroglyph2, petroglyph3, petroglyph4]),
        invisibleCards: true,
        timerSpeed: 1.3,
        description: "Speed challenge with invisible cards"
    },
    {
        id: 18,
        pairs: 18,
        timeLimit: 100,
        cards: generateCards(18, [petroglyph5, petroglyph6, petroglyph7, petroglyph8]),
        rotateCards: true,
        fadeCards: true,
        description: "Rotating fading challenge"
    },
    {
        id: 19,
        pairs: 18,
        timeLimit: 95,
        cards: generateCards(18, [petroglyph9, petroglyph10, petroglyph1, petroglyph2]),
        shuffleInterval: 8000,
        invisibleCards: true,
        description: "Quick shuffles with hidden cards"
    },
    {
        id: 20,
        pairs: 18,
        timeLimit: 90,
        cards: generateCards(18, [petroglyph3, petroglyph4, petroglyph5, petroglyph6]),
        fadeCards: true,
        rotateCards: true,
        timerSpeed: 1.2,
        description: "Triple threat: Fading, rotating, and fast timer"
    },
    {
        id: 21,
        pairs: 18,
        timeLimit: 85,
        cards: generateCards(18, [petroglyph7, petroglyph8, petroglyph9, petroglyph10]),
        shuffleInterval: 7000,
        invisibleCards: true,
        rotateCards: true,
        description: "Chaos mode: Shuffling invisible rotators"
    },
    {
        id: 22,
        pairs: 20,
        timeLimit: 110,
        cards: generateCards(20, [petroglyph1, petroglyph2, petroglyph3, petroglyph4]),
        fadeCards: true,
        shuffleInterval: 9000,
        description: "Large grid with fading shuffles"
    },
    {
        id: 23,
        pairs: 20,
        timeLimit: 105,
        cards: generateCards(20, [petroglyph5, petroglyph6, petroglyph7, petroglyph8]),
        invisibleCards: true,
        timerSpeed: 1.3,
        rotateCards: true,
        description: "Hidden rotations with fast timer"
    },
    {
        id: 24,
        pairs: 20,
        timeLimit: 100,
        cards: generateCards(20, [petroglyph9, petroglyph10, petroglyph1, petroglyph2]),
        fadeCards: true,
        shuffleInterval: 6000,
        rotateCards: true,
        description: "Quick shuffles with rotating fades"
    },
    {
        id: 25,
        pairs: 20,
        timeLimit: 95,
        cards: generateCards(20, [petroglyph3, petroglyph4, petroglyph5, petroglyph6]),
        invisibleCards: true,
        shuffleInterval: 5000,
        timerSpeed: 1.4,
        description: "Speed demon with invisible cards"
    },
    {
        id: 26,
        pairs: 22,
        timeLimit: 120,
        cards: generateCards(22, [petroglyph7, petroglyph8, petroglyph9, petroglyph10]),
        fadeCards: true,
        rotateCards: true,
        shuffleInterval: 8000,
        description: "Massive grid with all challenges"
    },
    {
        id: 27,
        pairs: 22,
        timeLimit: 115,
        cards: generateCards(22, [petroglyph1, petroglyph2, petroglyph3, petroglyph4]),
        invisibleCards: true,
        timerSpeed: 1.4,
        shuffleInterval: 7000,
        description: "Expert challenge: Speed and stealth"
    },
    {
        id: 28,
        pairs: 22,
        timeLimit: 110,
        cards: generateCards(22, [petroglyph5, petroglyph6, petroglyph7, petroglyph8]),
        fadeCards: true,
        rotateCards: true,
        timerSpeed: 1.3,
        shuffleInterval: 6000,
        description: "Master level: All mechanics combined"
    },
    {
        id: 29,
        pairs: 24,
        timeLimit: 120,
        cards: generateCards(24, [petroglyph9, petroglyph10, petroglyph1, petroglyph2]),
        fadeCards: true,
        invisibleCards: true,
        rotateCards: true,
        shuffleInterval: 5000,
        timerSpeed: 1.4,
        description: "Pre-final challenge: Maximum difficulty"
    }
];

function generateCards(pairCount, images) {
    const cards = [];
    for (let i = 0; i < pairCount; i++) {
        cards.push({
            id: i + 1,
            image: images[i % images.length]
        });
    }
    return cards;
}

function MemoryGame() {
    const navigate = useNavigate();
    const [currentLevel, setCurrentLevel] = useState(0);
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [moves, setMoves] = useState(0);
    const [timeLeft, setTimeLeft] = useState(gameLevels[0].timeLimit);
    const [gameStarted, setGameStarted] = useState(false);
    const [showVictory, setShowVictory] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);
    const [rotatedCards, setRotatedCards] = useState(new Set());
    const [fadedCards, setFadedCards] = useState(new Set());
    const [invisibleCards, setInvisibleCards] = useState(new Set());

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
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        window.addEventListener('resize', () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
    }, []);

    useEffect(() => {
        const level = gameLevels[currentLevel];
        if (level.shuffleInterval && gameStarted) {
            const interval = setInterval(() => {
                const shuffledCards = shuffleCards([...cards]);
                setCards(shuffledCards);
                playSound('shuffle');
            }, level.shuffleInterval);
            return () => clearInterval(interval);
        }
    }, [currentLevel, gameStarted]);

    useEffect(() => {
        const level = gameLevels[currentLevel];
        if (gameStarted && timeLeft > 0) {
            const interval = setInterval(() => {
                setTimeLeft(prev => prev - (level.timerSpeed || 1));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [gameStarted, timeLeft, currentLevel]);

    const initializeLevel = (level) => {
        const levelData = gameLevels[level];
        const shuffledCards = shuffleCards([...levelData.cards, ...levelData.cards]);
        setCards(shuffledCards);
        setTimeLeft(levelData.timeLimit);
        setFlippedCards([]);
        setMatchedPairs([]);
        setMoves(0);
        setGameStarted(false);
        setShowVictory(false);
    };

    const shuffleCards = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const handleCardClick = (e, index) => {
        if (!gameStarted) {
            setGameStarted(true);
        }

        if (flippedCards.length === 2 ||
            flippedCards.includes(index) ||
            matchedPairs.includes(index)) {
            return;
        }

        const level = gameLevels[currentLevel];
        if (level.rotateCards && e.altKey) {
            setRotatedCards(prev => {
                const newSet = new Set(prev);
                newSet.add(index);
                return newSet;
            });
            return;
        }

        playSound('select');
        const newFlippedCards = [...flippedCards, index];
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            setMoves(prev => prev + 1);
            checkForMatch(newFlippedCards);
        }
    };

    const checkForMatch = (selectedCards) => {
        const [first, second] = selectedCards;

        setTimeout(() => {
            if (cards[first].id === cards[second].id) {
                playSound('match');
                setMatchedPairs(prev => [...prev, first, second]);
                checkForVictory([...matchedPairs, first, second]);
            } else {
                playSound('mismatch');
            }
            setFlippedCards([]);
        }, 1000);
    };

    const checkForVictory = (currentMatches) => {
        if (currentMatches.length === cards.length) {
            setShowVictory(true);
            setGameStarted(false);
        }
    };

    const handleNextLevel = () => {
        if (currentLevel < gameLevels.length - 1) {
            setCurrentLevel(prev => prev + 1);
        }
    };

    const handleCardHover = (index) => {
        const level = gameLevels[currentLevel];
        if (level.invisibleCards) {
            setInvisibleCards(prev => {
                const newSet = new Set(prev);
                newSet.delete(index);
                return newSet;
            });
        }
    };

    return (
        <GameContainer>
            <InfoPanel>
                <h2>Level {currentLevel + 1}</h2>
                <p>Match the petroglyph pairs</p>
            </InfoPanel>

            <GameContent>
                <div>
                    <Timer isLow={timeLeft <= 30}>{timeLeft}s</Timer>

                    <Stats>
                        <div>Moves: {moves}</div>
                        <div>Pairs: {matchedPairs.length / 2}</div>
                    </Stats>
                </div>

                <GameBoard
                    cardCount={cards.length}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {cards.map((card, index) => (
                        <Card
                            key={index}
                            onClick={(e) => handleCardClick(e, index)}
                            onMouseEnter={() => handleCardHover(index)}
                            animate={{
                                rotateY: flippedCards.includes(index) || matchedPairs.includes(index)
                                    ? 180
                                    : 0
                            }}
                            isFaded={fadedCards.has(index)}
                            isInvisible={invisibleCards.has(index)}
                            rotation={rotatedCards.has(index) ? 90 : 0}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="front">?</div>
                            <div className="back">
                                <img src={card.image} alt="petroglyph" />
                            </div>
                        </Card>
                    ))}
                </GameBoard>

                <div style={{ flex: 1 }} />
            </GameContent>

            <AnimatePresence>
                {showVictory && (
                    <VictoryModal
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                    >
                        <h2>Level Complete! 🎉</h2>
                        <div className="stats">
                            <div>
                                <h4>Time</h4>
                                <p>{gameLevels[currentLevel].timeLimit - timeLeft}s</p>
                            </div>
                            <div>
                                <h4>Moves</h4>
                                <p>{moves}</p>
                            </div>
                            <div>
                                <h4>Pairs</h4>
                                <p>{matchedPairs.length / 2}</p>
                            </div>
                        </div>
                        <div>
                            <Button
                                onClick={() => initializeLevel(currentLevel)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Retry Level
                            </Button>
                            {currentLevel < gameLevels.length - 1 && (
                                <Button
                                    variant="success"
                                    onClick={handleNextLevel}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Next Level →
                                </Button>
                            )}
                        </div>
                    </VictoryModal>
                )}
            </AnimatePresence>

            {showGameOver && (
                <GameOverModal
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                >
                    <h2>Game Over! 😢</h2>
                    <div className="stats">
                        <div>
                            <h4>Time</h4>
                            <p>{gameLevels[currentLevel].timeLimit - timeLeft}s</p>
                        </div>
                        <div>
                            <h4>Moves</h4>
                            <p>{moves}</p>
                        </div>
                        <div>
                            <h4>Pairs</h4>
                            <p>{matchedPairs.length / 2}</p>
                        </div>
                    </div>
                    <div>
                        <Button
                            onClick={() => initializeLevel(currentLevel)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Retry Level
                        </Button>
                        {currentLevel < gameLevels.length - 1 && (
                            <Button
                                variant="success"
                                onClick={handleNextLevel}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Next Level →
                            </Button>
                        )}
                    </div>
                </GameOverModal>
            )}

            <LevelInfo>
                <p>Level Features:</p>
                <ul>
                    {gameLevels[currentLevel].fadeCards && <li>🌟 Cards fade after viewing</li>}
                    {gameLevels[currentLevel].shuffleInterval && <li>🔄 Board shuffles every {(gameLevels[currentLevel].shuffleInterval / 1000).toFixed(1)}s</li>}
                    {gameLevels[currentLevel].invisibleCards && <li>👻 Some cards are invisible until hovered</li>}
                    {gameLevels[currentLevel].rotateCards && <li>↪️ Alt+Click to rotate cards</li>}
                    {gameLevels[currentLevel].timerSpeed > 1 && <li>⚡ Timer runs faster</li>}
                </ul>
            </LevelInfo>
        </GameContainer>
    );
}

export default MemoryGame; 