import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

describe('App Component', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        // Verify that some element from your App component is present
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('contains main layout elements', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        // Check for critical UI elements
        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByRole('banner')).toBeInTheDocument();
    });
});