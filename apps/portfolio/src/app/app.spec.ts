import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    // Provide a mock for matchMedia used by ThemeToggle during initialization
    if (!window.matchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
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
    }

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a router-outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const outletDebug = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outletDebug).toBeTruthy();
  });

  it('should render header and footer', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('lib-portfolio-header');
    const footer = fixture.nativeElement.querySelector('lib-portfolio-footer');

    expect(header).toBeTruthy();
    expect(footer).toBeTruthy();
  });

  it('should not show side-nav/overlay when closed', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const sidenav = fixture.nativeElement.querySelector('lib-portfolio-side-nav');
    const overlay = fixture.nativeElement.querySelector('.overlay');

    expect(sidenav).toBeFalsy();
    expect(overlay).toBeFalsy();
  });

  it('should show side-nav and overlay when open', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.isNavOpen = true;
    fixture.detectChanges();

    const sidenav = fixture.nativeElement.querySelector('lib-portfolio-side-nav');
    const overlay = fixture.nativeElement.querySelector('.overlay');

    expect(sidenav).toBeTruthy();
    expect(overlay).toBeTruthy();
  });
});
