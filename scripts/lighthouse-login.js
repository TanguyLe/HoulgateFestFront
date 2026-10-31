// Lighthouse CI logs in before auditing, so /history and /shotgun are audited as a connected user
// sees them, not as the login card. It uses a test account of the back's createTestRecords script,
// against a back seeded in CI (.github/workflows/ci.yml): never a real account.
const SITE_URL = process.env.LHCI_SITE_URL || "http://localhost:8000";
const API_URL = process.env.LHCI_API_URL || "http://localhost:3000";
const TEST_ACCOUNT = { email: "patrick", password: "test" };

module.exports = async (browser) => {
    // Logged in from Node: the page's CSP only lets it call the API set when the server started
    const response = await fetch(API_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(TEST_ACCOUNT),
    });
    if (!response.ok) throw new Error("Lighthouse could not log in the test account on " + API_URL);
    const session = await response.json();

    // The session is what src/login/store.js keeps in localStorage after a login
    const page = await browser.newPage();
    await page.goto(SITE_URL);
    await page.evaluate((session) => {
        window.localStorage.setItem("username", session.username);
        window.localStorage.setItem("accessToken", session.accessToken);
        window.localStorage.setItem("refreshToken", session.refreshToken);
        window.localStorage.setItem("session", "true");
    }, session);
    await page.close();
};
