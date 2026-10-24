const { Builder, By, until } = require('selenium-webdriver');
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");

describe("Open Belajar Bareng - Login", function () {
    it("Should login successfully and display user page", async function () {
        let options = new chrome.Options();

        options.addArguments("--disable-features=PasswordLeakDetection");

        options.setUserPreferences({
            "credentials_enable_service": false,
            "profile.password_manager_enabled": false,
            "profile.password_manager_leak_detection": false
        });

        let driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();

        await driver.get("https://belajar-bareng.onrender.com/");

        let usernameInput = await driver.wait(
            until.elementLocated(
            By.xpath('//input[@data-testid="username-input"]')
            ),
            30000
            );
      
        let passwordInput = await driver.findElement(
            By.xpath('//input[@data-testid="password-input"]')
            );

        let loginButton = await driver.findElement(
            By.xpath('//button[@data-testid="login-button"]')
            );

        await usernameInput.sendKeys("admin"); 
        await passwordInput.sendKeys("admin");
        await loginButton.click();

        // Assert 1: Form login hilang = login berhasil
        await driver.wait(until.stalenessOf(usernameInput), 10000);

        let loginFormElements = await driver.findElements(
            By.xpath('//input[@data-testid="username-input"]')
            );
            assert.strictEqual(loginFormElements.length, 0);

        // Assert 2: Memeriksa URL di page selanjutnya setelah login
        await driver.wait(until.urlContains("https://belajar-bareng.onrender.com/users"), 10000); 
        let currentUrl = await driver.getCurrentUrl();
        assert.ok(currentUrl.includes("/users"));

    });
});