import { useState, useRef, useCallback } from 'react';

export function useLongPress(callback, ms = 600) {
  const [startLongPress, setStartLongPress] = useState(false);
  const timerRef = useRef();

  const start = useCallback((e) => {
    // Prevent scrolling and default context menu on touch
    setStartLongPress(true);
    timerRef.current = setTimeout(() => {
      callback(e);
      setStartLongPress(false);
    }, ms);
  }, [callback, ms]);

  const stop = useCallback(() => {
    setStartLongPress(false);
    clearTimeout(timerRef.current);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}
