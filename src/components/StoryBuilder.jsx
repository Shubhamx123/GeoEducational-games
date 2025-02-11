import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playSound } from '../services/SoundService.js';

// Import petroglyphs
import petroglyph1 from '../assets/images/1.JPG';
import petroglyph2 from '../assets/images/2.JPG';
import petroglyph3 from '../assets/images/3.JPG';
import petroglyph4 from '../assets/images/14.JPG';
import petroglyph5 from '../assets/images/5.JPG';

// Basic styled components first (those without dependencies)
const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.gradient || 'linear-gradient(45deg, #D74E9F, #9B4DE3)'};
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: rgba(45, 31, 63, 0.95);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  max-width: 90%;
  width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;

  h2 {
    color: #D74E9F;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
`;

// Modal components that use Button
const VictoryModal = ({ points, requirements, onNextLevel, onRetry }) => (
    <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <ModalContent
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
        >
            <h2>Level Complete! 🎉</h2>
            <div style={{ margin: '1rem 0' }}>
                <p>Score: {points}</p>
                <div style={{ margin: '1rem 0' }}>
                    {requirements.map((req, index) => (
                        <p key={index}>{req}</p>
                    ))}
                </div>
            </div>
            <div>
                <Button onClick={onRetry} gradient="linear-gradient(45deg, #D74E9F, #9B4DE3)">
                    Retry Level
                </Button>
                <Button onClick={onNextLevel} gradient="linear-gradient(45deg, #4ECDC4, #2ECC71)">
                    Next Level →
                </Button>
            </div>
        </ModalContent>
    </ModalOverlay>
);

const GameOverModal = ({ score, onRestart }) => (
    <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <ModalContent
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
        >
            <h2>Game Over!</h2>
            <p style={{ margin: '1rem 0' }}>Final Score: {score}</p>
            <Button
                onClick={onRestart}
                gradient="linear-gradient(45deg, #D74E9F, #9B4DE3)"
            >
                Try Again
            </Button>
        </ModalContent>
    </ModalOverlay>
);

// Rest of the styled components
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

const StoryArea = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 320px) 1fr;
  gap: 1rem;
  margin: 1rem 0;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PetroglyphPalette = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: fit-content;
`;

const PetroglyphItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: grab;
  border: 1px solid rgba(255, 255, 255, 0.1);

  img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
  }

  &:active {
    cursor: grabbing;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StoryBoard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const StoryScene = styled(motion.div)`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  align-items: center;
`;

const SceneImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
`;

const SceneText = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
  color: white;

  &:focus {
    outline: none;
    border-color: #4ECDC4;
  }
`;

const StoryTimeline = styled(motion.div)`
  position: relative;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      to bottom,
      transparent,
      #D74E9F,
      #9B4DE3,
      transparent
    );
  }
`;

const TimelineNode = styled(motion.div)`
  position: absolute;
  left: calc(50% - 15px);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(45deg, #D74E9F, #9B4DE3);
  box-shadow: 0 0 20px rgba(215, 78, 159, 0.3);
`;

const StoryMood = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
  justify-content: center;
`;

const MoodTag = styled(motion.button)`
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 15px;
  background: ${props => props.selected ?
        'linear-gradient(45deg, #D74E9F, #9B4DE3)' :
        'rgba(255, 255, 255, 0.05)'};
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => !props.selected && 'rgba(255, 255, 255, 0.1)'};
  }
`;

const InspirationButton = styled(motion.button)`
  position: absolute;
  right: 1rem;
  top: 1rem;
  padding: 0.5rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #B3B3B3;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

// Add these styled components
const StoryPreviewModal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const PreviewContent = styled(motion.div)`
  background: rgba(45, 31, 63, 0.95);
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;

  .story-header {
    margin-bottom: 2rem;
    text-align: center;
  }

  .story-body {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .scene {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .scene img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
  }

  .scene p {
    line-height: 1.6;
    color: #B3B3B3;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

const ShareButton = styled(Button)`
  background: linear-gradient(45deg, #4ECDC4, #2ECC71);
  margin: 0.5rem;
`;

const CopyButton = styled(Button)`
  background: linear-gradient(45deg, #9B4DE3, #4ECDC4);
  margin: 0.5rem;
`;

// Data constants
const petroglyphElements = [
    {
        id: 1,
        image: petroglyph1,
        title: 'Hunter',
        suggestedText: 'A skilled hunter tracking prey...'
    },
    {
        id: 2,
        image: petroglyph2,
        title: 'Ceremony',
        suggestedText: 'The community gathered for an important ritual...'
    },
    {
        id: 3,
        image: petroglyph3,
        title: 'Animals',
        suggestedText: 'A herd of animals moving across the landscape...'
    },
    {
        id: 4,
        image: petroglyph4,
        title: 'Symbols',
        suggestedText: 'Ancient symbols telling a story of...'
    },
    {
        id: 5,
        image: petroglyph5,
        title: 'Daily Life',
        suggestedText: 'Scenes from everyday life in ancient times...'
    }
];

const gameLevels = [
    {
        id: 1,
        title: "Simple Story",
        minScenes: 2,
        minWordsPerScene: 10,
        timeLimit: 120,
        description: "Create a basic story with 2 scenes",
        requirements: ["Use at least 2 different petroglyphs"]
    },
    {
        id: 2,
        title: "Extended Narrative",
        minScenes: 3,
        minWordsPerScene: 15,
        timeLimit: 180,
        description: "Build a story with character development",
        requirements: ["Include a beginning and end", "Use at least 3 different petroglyphs"]
    },
    {
        id: 3,
        title: "Sequential Tale",
        minScenes: 3,
        minWordsPerScene: 20,
        timeLimit: 240,
        shuffleScenes: true,
        description: "Create a story with shuffled scenes",
        requirements: ["Arrange scenes in correct order", "Clear transitions between scenes"]
    },
    // Adding more complex levels...
    {
        id: 15,
        title: "Epic Saga",
        minScenes: 5,
        minWordsPerScene: 40,
        timeLimit: 600,
        shuffleScenes: true,
        fadeText: true,
        timerPressure: true,
        description: "Create an epic tale with multiple plot points",
        requirements: [
            "Complex character development",
            "Multiple story arcs",
            "Cultural context",
            "Use all available petroglyphs"
        ]
    }
];

const mechanics = {
    shuffleScenes: {
        description: "Scenes will shuffle periodically",
        icon: "🔄"
    },
    fadeText: {
        description: "Text fades over time - type quickly!",
        icon: "📝"
    },
    timerPressure: {
        description: "Timer speeds up as you progress",
        icon: "⏱️"
    },
    wordLimit: {
        description: "Limited words per scene",
        icon: "📏"
    }
};

const storyThemes = [
    {
        id: "hunt",
        title: "The Great Hunt",
        prompt: "Tell a story about an ancient hunting expedition...",
        requiredElements: ["hunter", "animals"]
    },
    {
        id: "ritual",
        title: "Sacred Ceremony",
        prompt: "Describe an important ritual or ceremony...",
        requiredElements: ["ceremony", "symbols"]
    }
    // ... more themes
];

// Main component
function StoryBuilder() {
    const navigate = useNavigate();
    const [currentLevel, setCurrentLevel] = useState(0);
    const [storyScenes, setStoryScenes] = useState([]);
    const [timeLeft, setTimeLeft] = useState(gameLevels[0].timeLimit);
    const [score, setScore] = useState(0);
    const [showVictory, setShowVictory] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);
    const [fadeOpacity, setFadeOpacity] = useState(1);
    const [isShuffling, setIsShuffling] = useState(false);
    const [selectedMood, setSelectedMood] = useState('');
    const [showInspiration, setShowInspiration] = useState(false);
    const [storyProgress, setStoryProgress] = useState(0);
    const [showStoryPreview, setShowStoryPreview] = useState(false);

    useEffect(() => {
        const level = gameLevels[currentLevel];
        let timer;

        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleGameOver();
                        return 0;
                    }
                    return prev - 1;
                });
            }, level.timerPressure ? 800 : 1000);
        }

        return () => clearInterval(timer);
    }, [timeLeft, currentLevel]);

    useEffect(() => {
        const level = gameLevels[currentLevel];
        if (level.shuffleScenes && storyScenes.length > 0) {
            const shuffleInterval = setInterval(() => {
                setIsShuffling(true);
                setTimeout(() => setIsShuffling(false), 1000);
                setStoryScenes(prev => [...prev].sort(() => Math.random() - 0.5));
            }, 15000);
            return () => clearInterval(shuffleInterval);
        }
    }, [currentLevel, storyScenes.length]);

    const handleGameOver = () => {
        playSound('gameover');
        setShowGameOver(true);
    };

    const handleSceneAdd = (petroglyph) => {
        playSound('select');
        setStoryScenes(prev => [...prev, {
            id: Date.now(),
            image: petroglyph.image,
            text: '',
            petroglyphId: petroglyph.id
        }]);
    };

    const handleSceneTextChange = (id, text) => {
        setStoryScenes(prev => prev.map(scene =>
            scene.id === id ? { ...scene, text } : scene
        ));
    };

    const evaluateStory = () => {
        const level = gameLevels[currentLevel];
        let points = 0;
        let requirements = [];

        // Check minimum scenes
        if (storyScenes.length >= level.minScenes) {
            points += 50;
            requirements.push("✅ Scene count met");
        }

        // Check word count per scene
        const allScenesValid = storyScenes.every(scene =>
            scene.text.split(' ').length >= level.minWordsPerScene
        );
        if (allScenesValid) {
            points += 50;
            requirements.push("✅ Word count met");
        }

        // Check unique petroglyphs used
        const uniquePetroglyphs = new Set(storyScenes.map(scene => scene.petroglyphId));
        if (uniquePetroglyphs.size >= Math.min(level.minScenes, 5)) {
            points += 50;
            requirements.push("✅ Petroglyph variety");
        }

        return { points, requirements };
    };

    const handleStoryComplete = () => {
        const evaluation = evaluateStory();
        if (evaluation.points >= 100) {
            playSound('success');
            setScore(prev => prev + evaluation.points);
            setShowVictory(true);
        } else {
            playSound('error');
        }
    };

    const handleNextLevel = () => {
        if (currentLevel < gameLevels.length - 1) {
            setCurrentLevel(prev => prev + 1);
            setTimeLeft(gameLevels[currentLevel + 1].timeLimit);
            setStoryScenes([]);
            setShowVictory(false);
            setFadeOpacity(1);
            playSound('levelup');
        }
    };

    const moodOptions = [
        { emoji: '🌟', mood: 'Mystical' },
        { emoji: '⚔️', mood: 'Epic' },
        { emoji: '🌅', mood: 'Peaceful' },
        { emoji: '🏃', mood: 'Adventure' },
        { emoji: '🤝', mood: 'Community' }
    ];

    const getInspiration = () => {
        const prompts = [
            "What mysteries do these ancient symbols hold?",
            "How did this ritual change the community?",
            "What challenges did these hunters face?",
            "What stories were passed down through generations?",
            "How did the seasons affect daily life?"
        ];
        return prompts[Math.floor(Math.random() * prompts.length)];
    };

    const getSceneStyle = (mood) => {
        switch (mood) {
            case 'Mystical':
                return { filter: 'hue-rotate(45deg) saturate(1.2)' };
            case 'Epic':
                return { filter: 'contrast(1.2) brightness(1.1)' };
            case 'Peaceful':
                return { filter: 'sepia(0.3) brightness(1.1)' };
            case 'Adventure':
                return { filter: 'saturate(1.3)' };
            case 'Community':
                return { filter: 'warmth(1.2)' };
            default:
                return {};
        }
    };

    const generateStoryText = () => {
        return storyScenes.map(scene => scene.text).join('\n\n');
    };

    const handleShare = async () => {
        const storyText = generateStoryText();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Petroglyph Story',
                    text: storyText
                });
                playSound('success');
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(storyText);
            playSound('success');
        }
    };

    const StoryPreview = () => (
        <StoryPreviewModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <PreviewContent
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
            >
                <div className="story-header">
                    <h2>Your Story</h2>
                    <p>Level {currentLevel + 1} - {selectedMood || 'Classic'} Style</p>
                </div>
                <div className="story-body">
                    {storyScenes.map((scene, index) => (
                        <div key={scene.id} className="scene">
                            <img
                                src={scene.image}
                                alt={`Scene ${index + 1}`}
                                style={getSceneStyle(selectedMood)}
                            />
                            <p>{scene.text}</p>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <ShareButton
                        onClick={handleShare}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Share Story 📤
                    </ShareButton>
                    <CopyButton
                        onClick={() => {
                            navigator.clipboard.writeText(generateStoryText());
                            playSound('success');
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Copy Text 📋
                    </CopyButton>
                    <Button
                        onClick={() => setShowStoryPreview(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Close
                    </Button>
                </div>
            </PreviewContent>
        </StoryPreviewModal>
    );

    return (
        <GameContainer>
            <InfoPanel>
                <h2>Level {currentLevel + 1}: {gameLevels[currentLevel].title}</h2>
                <p>{gameLevels[currentLevel].description}</p>
                <div style={{ color: timeLeft <= 10 ? '#FF6B6B' : '#4ECDC4', fontSize: '1.5rem' }}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
            </InfoPanel>

            <StoryArea>
                <PetroglyphPalette>
                    <h3 style={{ color: '#B3B3B3', marginBottom: '1rem' }}>Story Elements</h3>
                    {petroglyphElements.map(petroglyph => (
                        <PetroglyphItem
                            key={petroglyph.id}
                            onClick={() => handleSceneAdd(petroglyph)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img src={petroglyph.image} alt={petroglyph.title} />
                            <p style={{ color: '#B3B3B3', marginTop: '0.5rem' }}>{petroglyph.title}</p>
                        </PetroglyphItem>
                    ))}
                </PetroglyphPalette>

                <StoryBoard>
                    <StoryMood>
                        {moodOptions.map(({ emoji, mood }) => (
                            <MoodTag
                                key={mood}
                                selected={selectedMood === mood}
                                onClick={() => {
                                    setSelectedMood(mood);
                                    playSound('select');
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {emoji} {mood}
                            </MoodTag>
                        ))}
                    </StoryMood>

                    <InspirationButton
                        onClick={() => {
                            setShowInspiration(true);
                            setTimeout(() => setShowInspiration(false), 3000);
                            playSound('select');
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        💡
                    </InspirationButton>

                    {showInspiration && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                textAlign: 'center',
                                color: '#B3B3B3'
                            }}
                        >
                            {getInspiration()}
                        </motion.div>
                    )}

                    <StoryTimeline>
                        {storyScenes.map((scene, index) => (
                            <TimelineNode
                                key={scene.id}
                                style={{ top: `${(index + 1) * (100 / (storyScenes.length + 1))}%` }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            />
                        ))}
                    </StoryTimeline>

                    <Reorder.Group axis="y" values={storyScenes} onReorder={setStoryScenes}>
                        {storyScenes.map(scene => (
                            <Reorder.Item
                                key={scene.id}
                                value={scene}
                                style={{ opacity: isShuffling ? 0.5 : 1 }}
                            >
                                <StoryScene
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <SceneImage
                                        src={scene.image}
                                        alt="Scene"
                                        style={getSceneStyle(selectedMood)}
                                    />
                                    <SceneText
                                        value={scene.text}
                                        onChange={(e) => handleSceneTextChange(scene.id, e.target.value)}
                                        placeholder="Tell your story..."
                                        style={{
                                            opacity: gameLevels[currentLevel].fadeText ? fadeOpacity : 1
                                        }}
                                    />
                                </StoryScene>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

                    {storyScenes.length > 0 && (
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <Button
                                onClick={handleStoryComplete}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Complete Story
                            </Button>
                            <Button
                                onClick={() => setShowStoryPreview(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                gradient="linear-gradient(45deg, #4ECDC4, #2ECC71)"
                            >
                                Preview Story 📖
                            </Button>
                        </div>
                    )}
                </StoryBoard>
            </StoryArea>

            <AnimatePresence>
                {showStoryPreview && <StoryPreview />}
                {showVictory && (
                    <VictoryModal
                        points={score}
                        requirements={evaluateStory().requirements}
                        onNextLevel={handleNextLevel}
                        onRetry={() => {
                            setStoryScenes([]);
                            setShowVictory(false);
                            setTimeLeft(gameLevels[currentLevel].timeLimit);
                        }}
                    />
                )}

                {showGameOver && (
                    <GameOverModal
                        score={score}
                        onRestart={() => window.location.reload()}
                    />
                )}
            </AnimatePresence>
        </GameContainer>
    );
}

export default StoryBuilder;

// Would you like me to continue with:
// 1. Victory and GameOver modal components
// 2. Additional game mechanics
// 3. The remaining levels (4-30)
// Let me know which part you'd like to see next! 