import { expect, test } from '@playwright/test';

test('home page renders', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/William Strothe Portfolio/i);
  await expect(page.locator('h1')).toHaveText('William Strothe Portfolio');
});