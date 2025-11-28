const { chromium } = require('playwright');
const path = require('path');

const SESSION_FILE = path.join(__dirname, 'playwright_auth/f4t_session_state.json');
const FREE4TALK_HOME = 'https://free4talk.com/';

async function loginAndSaveSession() {
  console.log('Starting manual login process...');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page  = await context.newPage();

  await page.goto(FREE4TALK_HOME);
  console.log('Browser opened. Please manually click "Sign in with Google" and complete the login.');
  console.log('Do NOT close the browser until the script says "Session state saved."');

  try {
    const LOGGED_IN_SELECTOR = 'a[href="/profile"]';
    await page.waitForSelector(LOGGED_IN_SELECTOR, { state: 'visible', timeout: 60_000 });

    console.log('Login detected. Saving session state...');
    await context.storageState({ path: SESSION_FILE });
    console.log(`✅ Session state saved to: ${SESSION_FILE}`);
  } catch (err) {
    console.error('Login timed out or failed to detect authenticated state. Please try again.');
  } finally {
    await browser.close();
  }
}

loginAndSaveSession();