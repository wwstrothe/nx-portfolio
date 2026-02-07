import { App } from './app';

describe('App class', () => {
  it('should have title set to William Strothe', () => {
    const app = new App();
    expect(app.title).toBe('William Strothe');
  });

  it('should have links configured', () => {
    const app = new App();
    expect(app.links.length).toBe(2);
    expect(app.links[0].name).toBe('Projects');
    expect(app.links[1].name).toBe('Resume');
  });

  it('should initialize isNavOpen as false', () => {
    const app = new App();
    expect(app.isNavOpen).toBe(false);
  });

  it('should set isNavOpen to true on onMenuOpen', () => {
    const app = new App();
    app.onMenuOpen();
    expect(app.isNavOpen).toBe(true);
  });

  it('should set isNavOpen to false on closeNav', () => {
    const app = new App();
    app.isNavOpen = true;
    app.closeNav();
    expect(app.isNavOpen).toBe(false);
  });
});
