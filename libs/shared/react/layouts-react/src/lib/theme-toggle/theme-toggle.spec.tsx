import { render } from '@testing-library/react';

import ThemeToggle from './theme-toggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should render successfully', () => {
    const { baseElement } = render(<ThemeToggle />);
    expect(baseElement).toBeTruthy();
  });
});
