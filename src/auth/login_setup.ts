// src/auth/login_setup.ts (Refactored to use generic imports)
import * as pw from 'playwright'; // Load everything as 'pw' to bypass named import conflict
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM path handling (Needed because we are running an ESM file)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define constants
const AUTH_DIR = path.join(process.cwd(), 'playwright_auth');
const SESSION_FILE = path.join(AUTH_DIR, 'f4t_session_state.json');
const FREE4TALK_HOME = 'https://free4talk.com/';
const LOGGED_IN_SELECTOR = 'a[href="/profile"]';

async function loginAndSaveSession() {
    console.log('Starting manual login process...');

    // 1. Ensure the directory exists
    if (!fs.existsSync(AUTH_DIR)) {
        fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    // 2. Use 'pw.' prefix for all Playwright objects and types
    const browser: pw.Browser = await pw.chromium.launch({ headless: false });
    const context: pw.BrowserContext = await browser.newContext({
        // Inject a common, stable desktop User-Agent string to bypass bot detection
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();

    await page.goto(FREE4TALK_HOME);
    console.log(`Browser opened. Please manually click 'Sign in with Google' and complete the login.`);

    try {
        await page.waitForSelector(LOGGED_IN_SELECTOR, { state: 'visible', timeout: 60000 });
        console.log('Login detected. Saving session state...');

        await context.storageState({ path: SESSION_FILE });
        console.log(`✅ Session state saved to: ${SESSION_FILE}`);

    } catch (error) {
        console.error('Login timed out or failed to detect authenticated state.', error);
    } finally {
        await browser.close();
    }
}

loginAndSaveSession().catch(e => {
    console.error("An error occurred during script execution:", e);
});