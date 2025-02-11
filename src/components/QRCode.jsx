import { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';
import styled from '@emotion/styled';

const QRContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

function QRCode({ url }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            QRCodeLib.toCanvas(canvasRef.current, url || window.location.href, {
                width: 128,
                margin: 2,
                color: {
                    dark: '#D74E9F',
                    light: '#FFFFFF'
                }
            });
        }
    }, [url]);

    return (
        <QRContainer>
            <canvas ref={canvasRef} />
        </QRContainer>
    );
}

export default QRCode; 