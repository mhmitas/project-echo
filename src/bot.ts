import { chromium } from "playwright";

async function runBot() {
  const userDataDir = "google-profile"; // your saved Google login

  console.log("Launching Rabbot with Google login...");
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
  });

  const page = await context.newPage();

  const roomUrl = "https://www.free4talk.com/room/vv12b";

  console.log("Joining specific room:", roomUrl);
  await page.goto(roomUrl, { waitUntil: "networkidle" });

  // Check login
  const signInBtn = await page.$("text=Sign in");
  if (signInBtn) {
    console.log("❌ You are NOT logged in. Your persistent profile did not save.");
    console.log("Run:  npx ts-node src/login.ts   and login again.");
    return;
  }

  console.log("✔ Logged in, inside the room!");

  // Wait for any chat input box to appear
  await page.waitForSelector("textarea, input[type='text'], [contenteditable='true']");

  console.log("Sending greeting...");

  // Prefer textarea
  const textarea = await page.$("textarea");
  if (textarea) {
    await textarea.click();
    await textarea.type("Hello! I'm Rabbot.", { delay: 50 });
    await textarea.press("Enter");
    console.log("✔ Sent via <textarea>");
  } else {
    // Try input box
    const input = await page.$("input[type='text']");
    if (input) {
      await input.click();
      await input.type("Hello! I'm Rabbot.", { delay: 50 });
      await input.press("Enter");
      console.log("✔ Sent via <input>");
    } else {
      // As a last fallback, use contenteditable
      const ce = await page.$("[contenteditable='true']");
      if (ce) {
        await ce.click();
        await page.keyboard.type("Hello! I'm Rabbot.", { delay: 50 });
        await page.keyboard.press("Enter");
        console.log("✔ Sent via contenteditable");
      } else {
        console.log("❌ ERROR: No chat input found!");
      }
    }
  }

  console.log("🎉 Rabbot is inside the room and sent its first message.");

  // Keep browser open so you can see it
  await page.waitForTimeout(999999999);
}

runBot();
