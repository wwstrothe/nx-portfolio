import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('./data/database', () => ({
  DatabaseProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useDatabase: () => ({
    siteContent: {
      title: 'William Strothe',
      contactEmail: 'william.strothe@gmail.com',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/william-strothe',
        github: 'https://github.com/wwstrothe',
      },
    },
  }),
}));

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render layout shell', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    expect(getByRole('navigation')).toBeTruthy();
  });
});
