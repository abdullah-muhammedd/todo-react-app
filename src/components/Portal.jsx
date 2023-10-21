import { createPortal } from 'react-dom'
import { useRef, useEffect } from 'react';

const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    zIndex: 2000, // Ensure the modal is on top
};

export default function Portal({ children }) {
    const elRef = useRef(null);

    if (!elRef.current) {
        elRef.current = document.createElement('div');
    }

    useEffect(() => {
        const modalRoot = document.getElementById('modal');
        modalRoot.appendChild(elRef.current);

        return () => {
            modalRoot.removeChild(elRef.current);
        };
    }, []);

    return createPortal(
        <div style={modalStyles}>
            {children}
        </div>,
        elRef.current
    );
}
