import { chromium } from "playwright";

async function login() {
  const userDataDir = "google-profile"; // folder Playwright will use like Chrome

  console.log("Opening Chrome with persistent profile:", userDataDir);

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-features=IsolateOrigins,site-per-process",
      "--disable-web-security",
    ],
  });

  const page = await context.newPage();

  console.log("Opening Free4Talk...");
  await page.goto("https://free4talk.com/", { waitUntil: "networkidle" });

  // Click Google login button
  const googleBtn = page.locator('button:has-text("Google"), button:has-text("Continue with Google")');

  await googleBtn.first().click().catch(()=>console.log("Login button click failed — manually click it."));

  console.log("⚠️ IMPORTANT: Log in normally. Take your time.");
  console.log("❗ The browser will NOT close until you close it manually.");

  // Keep browser open forever
  await page.waitForTimeout(999999999);
}

login();
