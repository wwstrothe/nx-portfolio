import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SideNav } from './side-nav';

describe('SideNav', () => {
  let component: SideNav;
  let fixture: ComponentFixture<SideNav>;

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
      imports: [SideNav],
      providers: [
        provideRouter([
          { path: 'about', component: SideNav },
          { path: 'projects', component: SideNav },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SideNav);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have closed class when open is false', () => {
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();

    const sidenav = fixture.nativeElement.querySelector('.sidenav');
    expect(sidenav.classList.contains('open')).toBe(false);
  });

  it('should have open class when open is true', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const sidenav = fixture.nativeElement.querySelector('.sidenav');
    expect(sidenav.classList.contains('open')).toBe(true);
  });

  it('should render navigation links', () => {
    const links = [
      { name: 'About', link: '/about' },
      { name: 'Projects', link: '/projects' },
    ];
    fixture.componentRef.setInput('links', links);
    fixture.detectChanges();

    const navLinks = fixture.nativeElement.querySelectorAll('.links a');
    expect(navLinks.length).toBe(2);
    expect(navLinks[0].textContent).toContain('About');
    expect(navLinks[1].textContent).toContain('Projects');
  });

  it('should emit closeSidenav when close button is clicked', () => {
    fixture.detectChanges();

    jest.spyOn(component.closeSidenav, 'emit');
    const closeBtn = fixture.nativeElement.querySelector('.close-btn');
    closeBtn.click();

    expect(component.closeSidenav.emit).toHaveBeenCalled();
  });

  it('should emit closeSidenav when escape key is pressed', () => {
    fixture.detectChanges();

    jest.spyOn(component.closeSidenav, 'emit');
    component.onEsc();

    expect(component.closeSidenav.emit).toHaveBeenCalled();
  });

  it('should emit closeSidenav when a link is clicked', () => {
    const links = [{ name: 'About', link: '/about' }];
    fixture.componentRef.setInput('links', links);
    fixture.detectChanges();

    jest.spyOn(component.closeSidenav, 'emit');
    const link = fixture.nativeElement.querySelector('.links a');
    link.click();

    expect(component.closeSidenav.emit).toHaveBeenCalled();
  });

  it('should render theme toggle by default', () => {
    fixture.detectChanges();

    const themeToggle = fixture.nativeElement.querySelector('lib-portfolio-theme-toggle');
    expect(themeToggle).toBeTruthy();
  });

  it('should not render theme toggle when false', () => {
    fixture.componentRef.setInput('themeToggle', false);
    fixture.detectChanges();

    const themeToggle = fixture.nativeElement.querySelector('lib-portfolio-theme-toggle');
    expect(themeToggle).not.toBeTruthy();
  });
});
