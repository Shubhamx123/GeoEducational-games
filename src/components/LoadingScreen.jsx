import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const LoadingContainer = styled(motion.div)`
    position: fixed;
    inset: 0;
    background: #1a1a1a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const LoadingText = styled(motion.h2)`
    color: #D74E9F;
    font-size: 2rem;
    margin-bottom: 2rem;
`;

const Spinner = styled(motion.div)`
    width: 50px;
    height: 50px;
    border: 4px solid rgba(215, 78, 159, 0.3);
    border-top-color: #D74E9F;
    border-radius: 50%;
`;

function LoadingScreen() {
    return (
        <LoadingContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <LoadingText
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Loading Puzzle...
            </LoadingText>
            <Spinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </LoadingContainer>
    );
}

export default LoadingScreen; 