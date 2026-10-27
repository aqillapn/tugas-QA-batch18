const { Builder, By, until } = require('selenium-webdriver');
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");

describe("Open Belajar Bareng - Login", function () {
    let driver;
    before(async function() {

        const options = new chrome.Options();
        options.addArguments("--disable-features=PasswordLeakDetection"); // kalo mau headless, ini di comment dulu

        options.setUserPreferences({                                        //mematikan fitur password manager Chrome biar nggak ganggu pas test otomatis.
            "credentials_enable_service": false,
            "profile.password_manager_enabled": false,
            "profile.password_manager_leak_detection": false
        });

        driver = await new Builder()    // Penanda headed
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();
    });

    beforeEach(async function () {
        await driver.get("https://belajar-bareng.onrender.com/");
    });

    afterEach(async function () {
        await driver.sleep(2000); 
        await driver.manage().deleteAllCookies();
        console.log("Test Completed!");
    })

    after(async function () {
        if (driver) {
            await driver.quit();

            console.log("Driver Closed.");
        }
    });

    it("Should login successfully and display user page", async function () {
       
        let usernameInput = await driver.wait(
            until.elementLocated(
            By.xpath('//input[@data-testid="username-input"]')
            ),
            60000
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
        await driver.wait(until.stalenessOf(usernameInput), 30000);

        let loginFormElements = await driver.findElements(
            By.xpath('//input[@data-testid="username-input"]')
            );
            assert.strictEqual(loginFormElements.length, 0);

        // Assert 2: Memastikan URL di page selanjutnya setelah login
        await driver.wait(until.urlContains("https://belajar-bareng.onrender.com/users"), 30000); 
        let currentUrl = await driver.getCurrentUrl();
        assert.ok(currentUrl.includes("/users"));

         });
        
    it("Should show hint credentials and change button to Hide Hint", async function () {

        // Tunggu halaman siap, dengan acuan tombol Show Hint
        let hintButton = await driver.wait(
        until.elementLocated(
            By.xpath('//button[@data-testid="hint-button" and normalize-space()="Show Hint"]')
        ),
        30000
    );

        // Precondition: hint belum ada di halaman
        let hintBefore = await driver.findElements(By.xpath('//code[@id="hintUser"]'));
        assert.strictEqual(hintBefore.length, 0);

        // Action
        await hintButton.click();

        // Assert 1: Username hint muncul dengan teks yang tepat
        let hintUser = await driver.wait(
        until.elementLocated(By.xpath('//code[@id="hintUser"]')),
        30000
    );
        assert.ok(await hintUser.isDisplayed());
        assert.strictEqual((await hintUser.getText()).trim(), "Username: admin");

        // Assert 2: Password hint muncul dengan teks yang tepat
        let hintPass = await driver.findElement(By.xpath('//code[@id="hintPass"]'));
        assert.ok(await hintPass.isDisplayed());
        assert.strictEqual((await hintPass.getText()).trim(), "Password: admin");

        // Assert 3: tombol berubah menjadi Hide Hint
        let hideButton = await driver.wait(
        until.elementLocated(By.xpath('//button[@data-testid="hint-button" and normalize-space()="Hide Hint"]')
        ),
        30000
    );
        
        assert.strictEqual((await hideButton.getText()).trim(), "Hide Hint");   
        });

    it("Should hide the hint when Hide Hint is clicked", async function () {

        let showBtn = await driver.wait(
        until.elementLocated(
        By.xpath('//button[@data-testid="hint-button" and normalize-space()="Show Hint"]')
        ),
        30000
        );
        await showBtn.click();

        let hideBtn = await driver.wait(
        until.elementLocated(
        By.xpath('//button[@data-testid="hint-button" and normalize-space()="Hide Hint"]')
        ),
        10000
        );
        await hideBtn.click();

        // Tombol kembali ke Show Hint
        await driver.wait(
        until.elementLocated(
        By.xpath('//button[@data-testid="hint-button" and normalize-space()="Show Hint"]')
        ),
        10000
        );

        // Hint hilang
        let hintAfter = await driver.findElements(By.xpath('//code[@id="hintUser"]'));
        assert.strictEqual(hintAfter.length, 0);
    });

    it("Verify password visibility toggle", async function () {

         let passwordInput = await driver.wait(
            until.elementLocated(By.xpath('//input[@data-testid="password-input"]')),
        30000
    );

        await passwordInput.sendKeys("admin");

        // Kondisi awal: masked, dan ikon toggle 😎
        assert.strictEqual(await passwordInput.getAttribute("type"), "password");
        await driver.findElement(
            By.xpath('//span[contains(@class,"toggle-btn") and normalize-space()="😎"]')
    );

        //Click visibility toggle
        let toggleButton = await driver.findElement(
            By.xpath('//span[contains(@class,"toggle-btn")]')
    );
        await toggleButton.click();

        // Expected result: password yang tadinya masked menjadi terlihat
        // Tunggu sampai type berubah, lalu cari ulang input untuk menghindari stale element
        await driver.wait(async () => {
            let el = await driver.findElement(
                By.xpath('//input[@data-testid="password-input"]')
        );
        return (await el.getAttribute("type")) === "text";
    }, 10000);

        passwordInput = await driver.findElement(
            By.xpath('//input[@data-testid="password-input"]')
    );
        assert.strictEqual(await passwordInput.getAttribute("type"), "text");

        // Isi password tetap utuh dan sekarang terbaca
        assert.strictEqual(await passwordInput.getAttribute("value"), "admin");

        // Ikon toggle berubah menjadi 🙈
        let iconAfter = await driver.findElement(
            By.xpath('//span[contains(@class,"toggle-btn") and normalize-space()="🙈"]')
    );
        assert.ok(await iconAfter.isDisplayed());
    });

});