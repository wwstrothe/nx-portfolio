import { FormEvent, useMemo, useState } from 'react';
import styles from './contact.module.scss';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

type FormState = {
  name: string;
  email: string;
  message: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

type FieldTouched = {
  name: boolean;
  email: boolean;
  message: boolean;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  const name = form.name.trim();
  const email = form.email.trim().toLowerCase();
  const message = form.message.trim();

  if (name.length < 2 || name.length > 80) {
    errors.name = 'Name must be between 2 and 80 characters.';
  }

  if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (message.length < 10 || message.length > 2000) {
    errors.message = 'Message must be between 10 and 2000 characters.';
  }

  return errors;
}

export function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState<FieldTouched>({
    name: false,
    email: false,
    message: false,
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const errors = useMemo(() => validateForm(form), [form]);

  const isSubmitDisabled = useMemo(() => {
    if (status === 'submitting') return true;
    return Object.keys(errors).length > 0;
  }, [errors, status]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(`${getApiBaseUrl()}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          message: form.message.trim(),
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? 'Something went wrong while sending your message.');
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTouched({ name: false, email: false, message: false });
      setHasSubmitted(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong while sending your message.';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === 'success' || status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const markTouched = (field: keyof FieldTouched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: keyof FieldErrors): string | undefined => {
    if (!touched[field] && !hasSubmitted) {
      return undefined;
    }
    return errors[field];
  };

  return (
    <section className={styles.contactPage}>
      <div className={styles.contactContainer}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Contact</p>
          <h1>Let&apos;s Build Something Great</h1>
          <p className={styles.subtext}>
            Have a project in mind, a role to discuss, or just want to connect? Send a message and
            I&apos;ll get back to you.
          </p>
        </header>

        <form className={styles.contactForm} onSubmit={onSubmit} noValidate>
          <label className={styles.field}>
            <span>Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              onBlur={() => markTouched('name')}
              placeholder="Your name"
            />
            {getFieldError('name') && <small>{getFieldError('name')}</small>}
          </label>

          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              onBlur={() => markTouched('email')}
              placeholder="you@example.com"
            />
            {getFieldError('email') && <small>{getFieldError('email')}</small>}
          </label>

          <label className={styles.field}>
            <span>Message</span>
            <textarea
              rows={7}
              value={form.message}
              onChange={(e) => updateField('message', e.target.value)}
              onBlur={() => markTouched('message')}
              placeholder="Tell me about your project or question"
            />
            {getFieldError('message') && <small>{getFieldError('message')}</small>}
          </label>

          <button type="submit" disabled={isSubmitDisabled}>
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <p className={styles.success}>Message sent successfully. Thanks for reaching out.</p>
          )}

          {status === 'error' && <p className={styles.error}>{errorMessage}</p>}
        </form>
      </div>
    </section>
  );
}

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3333';
  }

  return 'https://firebase-sync-369124476464.us-central1.run.app';
}

export default Contact;
