import { chromium, Browser, BrowserContext } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// Define the save path relative to where you run the script (e.g., the project root)
const AUTH_DIR = path.join(process.cwd(), 'playwright_auth');
const SESSION_FILE = path.join(AUTH_DIR, 'f4t_session_state.json');
const FREE4TALK_HOME = 'https://free4talk.com/';
const LOGGED_IN_SELECTOR = 'a[href="/profile"]'; // A reliable selector for the logged-in state

async function loginAndSaveSession() {
    console.log('Starting manual login process...');
    
    // Ensure the directory exists
    if (!fs.existsSync(AUTH_DIR)) {
        fs.mkdirSync(AUTH_DIR);
    }
    
    // Launch a visible browser instance
    const browser: Browser = await chromium.launch({ headless: false });
    const context: BrowserContext = await browser.newContext();
    const page = await context.newPage();

    await page.goto(FREE4TALK_HOME);
    console.log(`Browser opened. Please manually click 'Sign in with Google' and complete the login.`);
    console.log(`Do NOT close the browser until the script says 'Session state saved.'`);

    try {
        // Wait until the selector is visible, confirming authentication is complete
        await page.waitForSelector(LOGGED_IN_SELECTOR, { state: 'visible', timeout: 60000 });
        
        console.log('Login detected. Saving session state...');

        // Save the session state
        await context.storageState({ path: SESSION_FILE });
        console.log(`✅ Session state saved to: ${SESSION_FILE}`);

    } catch (error) {
        console.error('Login timed out or failed to detect authenticated state.', error);
        console.log("Check the browser to ensure login completed successfully.");
    } finally {
        await browser.close();
    }
}

loginAndSaveSession().catch(e => {
    console.error("An error occurred during script execution:", e);
});