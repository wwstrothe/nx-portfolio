import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

type ContactApiResponse = {
  id: string;
  target: string;
  createdAt?: string;
};

@Component({
  selector: 'portfolio-contact',
  imports: [ReactiveFormsModule],
  template: `
    <section class="contact-page">
      <div class="contact-container">
        <header class="hero">
          <p class="eyebrow">Contact</p>
          <h1>Let&apos;s Build Something Great</h1>
          <p class="subtext">
            Have a project in mind, a role to discuss, or just want to connect? Send a message and
            I&apos;ll get back to you.
          </p>
        </header>

        <form class="contact-form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label class="field">
            <span>Name</span>
            <input type="text" formControlName="name" placeholder="Your name" />
            @if (controlHasError('name')) {
              <small>Name must be between 2 and 80 characters.</small>
            }
          </label>

          <label class="field">
            <span>Email</span>
            <input type="email" formControlName="email" placeholder="you@example.com" />
            @if (controlHasError('email')) {
              <small>Enter a valid email address.</small>
            }
          </label>

          <label class="field">
            <span>Message</span>
            <textarea
              rows="7"
              formControlName="message"
              placeholder="Tell me about your project or question"
            ></textarea>
            @if (controlHasError('message')) {
              <small>Message must be between 10 and 2000 characters.</small>
            }
          </label>

          <button type="submit" [disabled]="isSubmitDisabled()">
            {{ status() === 'submitting' ? 'Sending...' : 'Send Message' }}
          </button>

          @if (status() === 'success') {
            <p class="success">Message sent successfully. Thanks for reaching out.</p>
          }

          @if (status() === 'error') {
            <p class="error">{{ errorMessage() }}</p>
          }
        </form>
      </div>
    </section>
  `,
  styleUrls: ['./contact.scss'],
})
export default class Contact {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  readonly status = signal<SubmitStatus>('idle');
  readonly errorMessage = signal<string>('');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
  });

  isSubmitDisabled(): boolean {
    return this.status() === 'submitting' || this.form.invalid;
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.status() === 'submitting') return;

    this.status.set('submitting');
    this.errorMessage.set('');

    this.http
      .post<ContactApiResponse>(`${this.getApiBaseUrl()}/contact`, this.form.getRawValue())
      .subscribe({
        next: () => {
          this.status.set('success');
          this.form.reset();
        },
        error: (err: unknown) => {
          const serverError =
            typeof err === 'object' &&
            err !== null &&
            'error' in err &&
            typeof (err as { error?: { error?: string } }).error?.error === 'string'
              ? (err as { error: { error: string } }).error.error
              : 'Something went wrong while sending your message. Please try again.';

          this.errorMessage.set(serverError);
          this.status.set('error');
        },
      });
  }

  controlHasError(controlName: 'name' | 'email' | 'message'): boolean {
    const control = this.form.controls[controlName];
    return !!(control.invalid && (control.touched || control.dirty));
  }

  private getApiBaseUrl(): string {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:3333';
    }

    return 'https://firebase-sync-369124476464.us-central1.run.app';
  }
}
