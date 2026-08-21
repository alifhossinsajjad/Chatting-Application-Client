import { useEffect, useRef, useState, useCallback } from 'react';

export function useSmartScroll<T>(dependencies: T[]) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);

  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
      setHasUnread(false);
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Check if we are near the bottom (within 50px)
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    setIsAtBottom(atBottom);
    if (atBottom) {
      setHasUnread(false);
    }
  }, []);

  // When dependencies (like messages array) change
  useEffect(() => {
    if (isAtBottom) {
      // Small timeout to allow DOM to render the new message before scrolling
      setTimeout(() => {
        scrollToBottom(true);
      }, 50);
    } else {
      setHasUnread(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { scrollRef, isAtBottom, hasUnread, scrollToBottom, handleScroll };
}
