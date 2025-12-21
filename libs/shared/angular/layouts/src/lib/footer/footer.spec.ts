import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

it('should render copyright with current year and title', () => {
    const currentYear = new Date().getFullYear();
    fixture.componentRef.setInput('title', 'John Doe');
    fixture.detectChanges();

    const copyright = fixture.nativeElement.querySelector('.copyright');
    expect(copyright.textContent).toContain(currentYear.toString());
    expect(copyright.textContent).toContain('John Doe');
});

  it('should render email link when provided', () => {
    fixture.componentRef.setInput('title', 'John Doe');
    fixture.componentRef.setInput('email', 'mailto:test@example.com');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a[href="mailto:test@example.com"]');
    expect(link).toBeTruthy();
    expect(link.textContent).toContain('Email');
  });

  it('should render LinkedIn link when provided', () => {
    fixture.componentRef.setInput('title', 'John Doe');
    fixture.componentRef.setInput('linkedIn', 'https://linkedin.com/in/user');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a[href="https://linkedin.com/in/user"]');
    expect(link).toBeTruthy();
    expect(link.textContent).toContain('LinkedIn');
  });

  it('should render GitHub link when provided', () => {
    fixture.componentRef.setInput('title', 'John Doe');
    fixture.componentRef.setInput('github', 'https://github.com/user');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a[href="https://github.com/user"]');
    expect(link).toBeTruthy();
    expect(link.textContent).toContain('GitHub');
  });
});
