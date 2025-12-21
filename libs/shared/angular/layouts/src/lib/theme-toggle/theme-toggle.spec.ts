import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  let component: ThemeToggle;
  let fixture: ComponentFixture<ThemeToggle>;

  beforeEach(async () => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : true,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    await TestBed.configureTestingModule({
      imports: [ThemeToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggle);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with light mode when no saved preference', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    fixture.detectChanges();

    expect(component.isDarkMode).toBe(false);
  });

  it('should initialize with dark mode when saved in localStorage', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue('dark');
    fixture.detectChanges();

    expect(component.isDarkMode).toBe(true);
  });

  it('should toggle theme when button is clicked', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.theme-toggle');
    button.click();

    expect(component.isDarkMode).toBe(true);
  });

  it('should save theme to localStorage when toggled', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.theme-toggle');
    button.click();

    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should emit themeChange output when toggled', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    fixture.detectChanges();

    jest.spyOn(component.themeChange, 'emit');
    component.toggleTheme();

    expect(component.themeChange.emit).toHaveBeenCalledWith('dark');
  });

  it('should add dark class to html element when dark mode', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue('dark');
    fixture.detectChanges();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should add light class to html element when light mode', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    fixture.detectChanges();

    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('should display moon emoji in light mode', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.icon');
    expect(icon.textContent).toContain('🌙');
  });

  it('should display sun emoji in dark mode', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue('dark');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.icon');
    expect(icon.textContent).toContain('☀️');
  });

  it('should have correct aria-label for light mode', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.theme-toggle');
    expect(button.getAttribute('aria-label')).toBe('Switch to dark mode');
  });

  it('should have correct aria-label for dark mode', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue('dark');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.theme-toggle');
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode');
  });
});
