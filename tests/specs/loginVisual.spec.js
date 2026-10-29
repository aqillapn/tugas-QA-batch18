const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");
const LoginPage = require("../pages/login.page");
const CommonPage = require("../pages/common.page");
const LoginLocator = require("../locators/login.locator");
const VisualRegression = require("../../utilities/visualRegression.helper");

describe("Login Sauce Demo - Visual Regression", function () {
    this.timeout(30000);

    let driver;
    let login;
    let common;
    let visualHelper;

    beforeEach(async function () {
        const options = new chrome.Options();
        options.addArguments("--window-size=1280,800"); 
        options.setUserPreferences({
            credentials_enable_service: false,
            "profile.password_manager_enabled": false, 
        });

        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();

        login = new LoginPage(driver);
        common = new CommonPage(driver);
        visualHelper = new VisualRegression();
        await login.openBrowser();
    });

    afterEach(async function () {
        await driver.quit();
    });

    // ================= POSITIVE =================

    it("Visual - Success Login Standard User", async function () {
        await login.login("standard_user", "secret_sauce");
        assert.strictEqual(await login.isShoppingCartVisible(), true); 

        await common.fullScreenshot("visual_standard_user");
        await visualHelper.assertVisual(
            "screenshots/visual_standard_user.png",
            "visual_standard_user.png"
        );
    });

    it("Visual - Success Login Performance Glitch User", async function () {
        await login.login("performance_glitch_user", "secret_sauce");
        assert.strictEqual(await login.isShoppingCartVisible(), true);

        await common.fullScreenshot("visual_performance_glitch_user");
        await visualHelper.assertVisual(
            "screenshots/visual_performance_glitch_user.png",
            "visual_performance_glitch_user.png"
        );
    });

    // ================= NEGATIVE =================

    it("Visual - Invalid Username", async function () {
        await login.login("invalid_user", "secret_sauce");
        assert.strictEqual(
            await login.getErrorMessage(),
            LoginLocator.messages.invalidCredentials
        );

        await common.fullScreenshot("visual_invalid_username");
        await visualHelper.assertVisual(
            "screenshots/visual_invalid_username.png",
            "visual_invalid_username.png"
        );
    });

    it("Visual - Wrong Password", async function () {
        await login.login("standard_user", "wrong_password");
        assert.strictEqual(
            await login.getErrorMessage(),
            LoginLocator.messages.invalidCredentials
        );

        await common.fullScreenshot("visual_wrong_password");
        await visualHelper.assertVisual(
            "screenshots/visual_wrong_password.png",
            "visual_wrong_password.png"
        );
    });

    it("Visual - Locked Out User", async function () {
        await login.login("locked_out_user", "secret_sauce");
        assert.strictEqual(
            await login.getErrorMessage(),
            LoginLocator.messages.lockedOut
        );

        await common.fullScreenshot("visual_locked_out_user");
        await visualHelper.assertVisual(
            "screenshots/visual_locked_out_user.png",
            "visual_locked_out_user.png"
        );
    });
});