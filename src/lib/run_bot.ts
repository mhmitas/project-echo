// src/lib/run_bot.ts (Final Client Setup)
import { chromium, Browser, BrowserContext } from 'playwright';
import * as path from 'path';

const SESSION_FILE = path.join(process.cwd(), 'playwright_auth/f4t_session_state.json');
const FREE4TALK_ROOM_URL = 'https://free4talk.com/room/nBd01'; // Use your test room URL

async function launchBotWithSession() {
    console.log(`Attempting to launch bot using session file: ${SESSION_FILE}`);
    
    // Launch a standard browser
    const browser: Browser = await chromium.launch({ headless: false }); 
    
    // CRITICAL: Create a new context and load the saved authentication state
    const context: BrowserContext = await browser.newContext({
        storageState: SESSION_FILE, // Loads the cookies/tokens saved in Step 1
    });

    const page = await context.newPage();

    // The bot should now be logged in immediately
    await page.goto(FREE4TALK_ROOM_URL);
    
    console.log(`✅ Successfully navigated to room: ${FREE4TALK_ROOM_URL} as an authenticated user.`);
    console.log('The bot is ready for Phase 1.4: Real-Time Input.');
    
    // Now you can start the next phase of development here...
    // // Example: await page.waitForTimeout(5000); 

}

launchBotWithSession().catch(e => {
    console.error("An error occurred during bot launch:", e);
});