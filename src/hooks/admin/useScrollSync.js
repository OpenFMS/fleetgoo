import { useRef } from 'react';

/**
 * Hook for bidirectional scroll synchronization between two elements.
 * @returns {object} { sourceRef, targetRef, handleScroll, handleMouseEnter, handleMouseLeave }
 */
export const useScrollSync = () => {
    // Refs to the actual DOM elements
    const sourceRef = useRef(null); // Can call it 'left' or 'source'
    const targetRef = useRef(null); // Can call it 'right' or 'target'

    // Track which side is actively being scrolled by the user to prevent loops
    const activeScroller = useRef(null); // 'source' | 'target' | null

    const handleMouseEnter = (side) => {
        activeScroller.current = side;
    };

    const handleMouseLeave = () => {
        activeScroller.current = null;
    };

    /**
     * Syncs scroll position from one element to another based on percentage.
     * @param {React.MutableRefObject} activeRef The ref of the element triggering the scroll
     * @param {React.MutableRefObject} passiveRef The ref of the element to be synced
     * @param {string} side 'source' or 'target' identifier
     */
    const handleScroll = (activeRef, passiveRef, side) => {
        if (activeScroller.current !== side) return;
        if (!activeRef.current || !passiveRef.current) return;

        const sourceEl = activeRef.current;
        const targetEl = passiveRef.current;

        const sourceScrollableHeight = sourceEl.scrollHeight - sourceEl.clientHeight;
        if (sourceScrollableHeight <= 0) return;

        const percentage = sourceEl.scrollTop / sourceScrollableHeight;

        const targetScrollableHeight = targetEl.scrollHeight - targetEl.clientHeight;
        targetEl.scrollTop = percentage * targetScrollableHeight;
    };

    return {
        sourceRef, // Bind to left/editor container
        targetRef, // Bind to right/preview container
        handleScroll, // Pass to onScroll event
        handleMouseEnter, // Pass to onMouseEnter
        handleMouseLeave, // Pass to onMouseLeave
    };
};
