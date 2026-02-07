import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import SideNav from './side-nav';

describe('SideNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MemoryRouter>
        <SideNav open />
      </MemoryRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
