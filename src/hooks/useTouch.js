import { useState, useCallback } from 'react';

export const useTouch = (onSwap) => {
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const minSwipeDistance = 50;

    const onTouchStart = useCallback((e) => {
        setTouchEnd(null);
        setTouchStart({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    }, []);

    const onTouchMove = useCallback((e) => {
        setTouchEnd({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    }, []);

    const onTouchEnd = useCallback(() => {
        if (!touchStart || !touchEnd) return;

        const distanceX = touchStart.x - touchEnd.x;
        const distanceY = touchStart.y - touchEnd.y;
        const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

        if (Math.abs(distanceX) < minSwipeDistance && Math.abs(distanceY) < minSwipeDistance) {
            return;
        }

        if (isHorizontalSwipe) {
            onSwap(distanceX > 0 ? 'left' : 'right');
        } else {
            onSwap(distanceY > 0 ? 'up' : 'down');
        }
    }, [touchStart, touchEnd, onSwap]);

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}; 