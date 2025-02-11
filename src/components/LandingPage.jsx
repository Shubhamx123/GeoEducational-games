import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import jigsawThumb from '../assets/images/jigsaw.png';
import wordSearchThumb from '../assets/images/wordsearch.png';
import memoryThumb from '../assets/images/memory.png';
import patternThumb from '../assets/images/pattern.png';
import storyThumb from '../assets/images/story.png';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d1f3f 100%);
  overflow-x: hidden;
`;

const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  text-align: center;
  margin: 2rem auto 3rem;
  padding: 0 1rem;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #D74E9F, #9B4DE3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(215, 78, 159, 0.3);
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 3vw, 1.2rem);
  color: #B3B3B3;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  padding: 0 1rem;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const GameCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const GameThumbnail = styled(motion.img)`
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
`;

const GameInfo = styled.div`
  text-align: center;
  width: 100%;
`;

const GameTitle = styled.h2`
  font-size: 1.5rem;
  color: white;
  margin-bottom: 0.5rem;
`;

const GameDescription = styled.p`
  font-size: 0.9rem;
  color: #B3B3B3;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const GameButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: white;
  background: ${props => props.gradient || 'linear-gradient(45deg, #D74E9F, #9B4DE3)'};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 250px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const games = [
  {
    title: 'Jigsaw Puzzle',
    description: 'Piece together ancient petroglyphs in this challenging puzzle game',
    image: jigsawThumb,
    path: '/jigsaw',
    difficulty: 'Hard',
    timeEstimate: '5-10 min'
  },
  {
    title: 'Word Search',
    description: 'Discover hidden words related to ancient petroglyphs and archaeology',
    image: wordSearchThumb,
    path: '/wordsearch',
    difficulty: 'Medium',
    timeEstimate: '5-10 min'
  },
  {
    title: 'Memory Game',
    description: 'Test your memory by matching pairs of ancient petroglyphs',
    image: memoryThumb,
    path: '/memory',
    difficulty: 'Medium',
    timeEstimate: '5-10 min'
  },
  {
    title: 'Pattern Match',
    description: 'Find matching patterns of ancient petroglyphs',
    image: patternThumb,
    path: '/pattern',
    difficulty: 'Medium',
    timeEstimate: '5-10 min'
  },
  {
    title: 'Story Builder',
    description: 'Create stories using ancient petroglyphs and bring history to life',
    image: storyThumb,
    path: '/story',
    difficulty: 'Medium',
    timeEstimate: '10-15 min'
  }
];

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          PetroQuest
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Explore ancient petroglyphs through engaging puzzles and word searches
        </Subtitle>
      </Header>

      <ButtonContainer>
        <GameCard
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GameThumbnail
            src={jigsawThumb}
            alt="Jigsaw Puzzle"
            whileHover={{ scale: 1.03 }}
          />
          <GameInfo>
            <GameTitle>Jigsaw Puzzle</GameTitle>
            <GameDescription>
              Piece together ancient petroglyphs in this challenging puzzle game
            </GameDescription>
            <GameButton
              onClick={() => navigate('/jigsaw')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Now
            </GameButton>
          </GameInfo>
        </GameCard>

        <GameCard
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GameThumbnail
            src={wordSearchThumb}
            alt="Word Search"
            whileHover={{ scale: 1.03 }}
          />
          <GameInfo>
            <GameTitle>Word Search</GameTitle>
            <GameDescription>
              Discover hidden words related to ancient petroglyphs and archaeology
            </GameDescription>
            <GameButton
              onClick={() => navigate('/wordsearch')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              gradient="linear-gradient(45deg, #4ECDC4, #2ECC71)"
            >
              Play Now
            </GameButton>
          </GameInfo>
        </GameCard>

        <GameCard
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GameThumbnail
            src={memoryThumb}
            alt="Memory Game"
            whileHover={{ scale: 1.03 }}
          />
          <GameInfo>
            <GameTitle>Memory Game</GameTitle>
            <GameDescription>
              Test your memory by matching pairs of ancient petroglyphs
            </GameDescription>
            <GameButton
              onClick={() => navigate('/memory')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              gradient="linear-gradient(45deg, #9B4DE3, #4ECDC4)"
            >
              Play Now
            </GameButton>
          </GameInfo>
        </GameCard>

        <GameCard
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 }}
        >
          <GameThumbnail
            src={patternThumb}
            alt="Pattern Match"
            whileHover={{ scale: 1.03 }}
          />
          <GameInfo>
            <GameTitle>Pattern Match</GameTitle>
            <GameDescription>
              Find matching patterns of ancient petroglyphs
            </GameDescription>
            <GameButton
              onClick={() => navigate('/pattern')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              gradient="linear-gradient(45deg, #4ECDC4, #2ECC71)"
            >
              Play Now
            </GameButton>
          </GameInfo>
        </GameCard>

        <GameCard
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          <GameThumbnail
            src={storyThumb}
            alt="Story Builder"
            whileHover={{ scale: 1.03 }}
          />
          <GameInfo>
            <GameTitle>Story Builder</GameTitle>
            <GameDescription>
              Create stories using ancient petroglyphs and bring history to life
            </GameDescription>
            <GameButton
              onClick={() => navigate('/story')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              gradient="linear-gradient(45deg, #D74E9F, #9B4DE3)"
            >
              Play Now
            </GameButton>
          </GameInfo>
        </GameCard>
      </ButtonContainer>
    </Container>
  );
}

export default LandingPage; 