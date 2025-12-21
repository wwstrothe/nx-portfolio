import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    // Mock window.matchMedia
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

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    fixture.componentRef.setInput('title', 'Portfolio');
    fixture.detectChanges();

    const brand = fixture.nativeElement.querySelector('.brand');
    expect(brand.textContent).toContain('Portfolio');
  });

  it('should render navigation links', () => {
    const links = [
      { name: 'About', link: '/about' },
      { name: 'Projects', link: '/projects' },
    ];
    fixture.componentRef.setInput('title', 'Portfolio');
    fixture.componentRef.setInput('links', links);
    fixture.detectChanges();

    const navLinks = fixture.nativeElement.querySelectorAll('.nav a');
    expect(navLinks.length).toBe(2);
    expect(navLinks[0].textContent).toContain('About');
    expect(navLinks[1].textContent).toContain('Projects');
  });

  it('should emit menuOpen when menu button is clicked', () => {
    fixture.componentRef.setInput('title', 'Portfolio');
    fixture.detectChanges();

    jest.spyOn(component.menuOpen, 'emit');
    const menuBtn = fixture.nativeElement.querySelector('.menu-btn');
    menuBtn.click();

    expect(component.menuOpen.emit).toHaveBeenCalled();
  });

  it('should render theme toggle by default', () => {
    fixture.componentRef.setInput('title', 'Portfolio');
    fixture.detectChanges();

    const themeToggle = fixture.nativeElement.querySelector('lib-portfolio-theme-toggle');
    expect(themeToggle).toBeTruthy();
  });

  it('should not render theme toggle when false', () => {
    fixture.componentRef.setInput('title', 'Portfolio');
    fixture.componentRef.setInput('themeToggle', false);
    fixture.detectChanges();

    const themeToggle = fixture.nativeElement.querySelector('lib-portfolio-theme-toggle');
    expect(themeToggle).not.toBeTruthy();
  });
});
