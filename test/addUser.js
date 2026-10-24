const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");

describe("Open Belajar Bareng - Add User", function () {
    it("Should add new user and display it in the list", async function () {
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

        try {
            await driver.get("https://belajar-bareng.onrender.com/");

            // ===== Login dulu =====
            let loginUsernameInput = await driver.wait(
                until.elementLocated(
                    By.xpath('//input[@data-testid="username-input"]')
                ),
                30000
            );

            let loginPasswordInput = await driver.findElement(
                By.xpath('//input[@data-testid="password-input"]')
            );

            let loginButton = await driver.findElement(
                By.xpath('//button[@data-testid="login-button"]')
            );

            await loginUsernameInput.sendKeys("admin");
            await loginPasswordInput.sendKeys("admin");
            await loginButton.click();

            // ===== Buka form add user =====
            let addUserButton = await driver.wait(
                until.elementLocated(
                    By.xpath('//button[@data-testid="add-button"]')
                ),
                10000
            );
            await addUserButton.click();

            // ===== Isi form =====
            let newUserName = "Tita" + Date.now();   // unik supaya mudah di-assert
            let newAge = "10";

            let newUsernameInput = await driver.wait(
                until.elementLocated(
                 By.xpath('//input[@data-testid="username-input"]')
                  ),
                 10000
            );

            let newAgeInput = await driver.findElement(
                By.xpath('//input[@data-testid="age-input"]')           
            );

            await newUsernameInput.sendKeys(newUserName);
            await newAgeInput.sendKeys(newAge);

            let submitButton = await driver.findElement(
                By.xpath('//button[@data-testid="submit-button"]')          
            );
            await submitButton.click();

            // Assert 1: Notifikasi berhasil menambahkan user dan memuat username
            let notification = await driver.wait(
            until.elementLocated(
                By.xpath('//*[contains(text(),"successfully added")]')
            ),
            10000
            );
            await driver.wait(until.elementIsVisible(notification), 10000);

            let notifText = await notification.getText();
            console.log("Teks notifikasi:", notifText);  

            assert.ok(notifText.toLowerCase().includes("successfully added"));
            assert.ok(notifText.includes(newUserName));

            // Assert 2: Username baru masuk ke list users
            let newUserInList = await driver.wait(
                until.elementLocated(
                    By.xpath('//*[contains(text(),"' + newUserName + '")]')
                ),
                10000
            );
            assert.strictEqual(
                await newUserInList.isDisplayed(),
                true
            );
        } finally {
            await driver.quit();
        }
    });
});