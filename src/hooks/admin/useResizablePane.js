import { useState, useEffect, useRef } from 'react';

/**
 * Hook for managing a resizable split pane.
 * @param {number} initialWidthPercentage Initial width of the left/first panel in percentage (0-100).
 * @param {number} minWidth Min percentage.
 * @param {number} maxWidth Max percentage.
 * @returns {object} { containerRef, leftPanelWidth, startResizing, isDragging }
 */
export const useResizablePane = (initialWidthPercentage = 50, minWidth = 20, maxWidth = 80) => {
    const [leftPanelWidth, setLeftPanelWidth] = useState(initialWidthPercentage);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const startResizing = (e) => {
        setIsDragging(true);
        e.preventDefault(); // Prevent text selection/dragging
    };

    const stopResizing = () => {
        setIsDragging(false);
    };

    const resize = (e) => {
        if (isDragging && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            // Calculate new width based on mouse X relative to container
            const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

            if (newLeftWidth > minWidth && newLeftWidth < maxWidth) {
                setLeftPanelWidth(newLeftWidth);
            }
        }
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isDragging]);

    return {
        containerRef,
        leftPanelWidth,
        startResizing,
        isDragging
    };
};
