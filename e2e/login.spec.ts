// tests/login.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/signin'); // Replace with the actual URL of your login page
  });

  test('should display the login form', async ({ page }) => {
    await expect(page).toHaveTitle(/SIMS/); // Assuming your login page title contains "Login"
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="submit"]')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.click('input[type="submit"]');
    await expect(page.locator('text=Please input your email')).toBeVisible();
    await expect(page.locator('text=Please input your password')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.click('input[type="submit"]');
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
  });

  test('should show error message for incorrect login', async ({ page }) => {
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('input[type="submit"]');
        await page.waitForURL('http://localhost:5173/signin');

  });

  test('should login successfully with correct credentials', async ({ page, context }) => {
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', 'Abcd1234');
    await page.click('input[type="submit"]');

    await page.waitForURL('http://localhost:5173/');

   
  });

});
