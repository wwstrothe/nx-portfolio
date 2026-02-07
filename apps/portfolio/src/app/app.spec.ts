import { Injector, runInInjectionContext } from '@angular/core';
import { App } from './app';
import { Database, SiteContent } from './data/database';

describe('App class', () => {
  let app: App;

  beforeEach(() => {
    const fakeSite = {
      title: 'William Strothe',
      links: [
        { name: 'Projects', link: '' },
        { name: 'Resume', link: '' },
      ],
      contactEmail: '',
      socialLinks: { linkedin: '', github: '' },
    } as Partial<SiteContent>;

    const fakeDb = { siteContent: () => fakeSite } as unknown as Database;

    const injector = Injector.create({ providers: [{ provide: Database, useValue: fakeDb }] });
    app = runInInjectionContext(injector, () => new App());
  });

  it('should have title set to William Strothe', () => {
    expect(app.title()).toBe('William Strothe');
  });

  it('should have links configured', () => {
    const links = app.links();
    expect(links?.length).toBe(2);
    expect(links?.[0].name).toBe('Projects');
    expect(links?.[1].name).toBe('Resume');
  });

  it('should initialize isNavOpen as false', () => {
    expect(app.isNavOpen).toBe(false);
  });

  it('should set isNavOpen to true on onMenuOpen', () => {
    app.onMenuOpen();
    expect(app.isNavOpen).toBe(true);
  });

  it('should set isNavOpen to false on closeNav', () => {
    app.isNavOpen = true;
    app.closeNav();
    expect(app.isNavOpen).toBe(false);
  });
});
