const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");  
const assert = require("assert");
const loginPage = require("../pages/login.page");
const commonPage = require("../pages/common.page");

describe("Open Sauce Demo", function () {
    let driver;
    let login;
    let common;

    beforeEach(async function () {

        const options = new chrome.Options();                 
        options.addArguments("--window-size=1280,800");       
        options.setUserPreferences({                         
            credentials_enable_service: false,
            "profile.password_manager_enabled": false,
        });

        driver = await new Builder()
            .forBrowser("chrome")
            .build();
        login = new loginPage(driver);
        common = new commonPage(driver);
        await login.openBrowser();
    });

    afterEach(async function () {
        await driver.quit();  
    });

    // POSITIVE CASE

    it("Success Login - Standard User", async function () {
       
       await login.inputUsername("standard_user");
       await login.inputPassword("secret_sauce");
       await login.clickLoginButton();
       await login.isShoppingCartVisible();

        assert.strictEqual(await login.getCurrentUrl(), LoginLocator.inventoryUrl); // pindah ke inventory
        assert.strictEqual(await login.getInventoryTitle(), "Products");            // judul benar
        assert.strictEqual(await login.isShoppingCartVisible(), true);              // keranjang tampil


       //Take full screenshot after succesful login
       await common.fullScreenshot("login_standard_user");


    });

    it("Success Login - Performance Glitch User", async function () {
       
       await login.inputUsername("performance_glitch_user");
       await login.inputPassword("secret_sauce");
       await login.clickLoginButton();
       await login.isShoppingCartVisible();
       
       assert.strictEqual(await login.getCurrentUrl(), LoginLocator.inventoryUrl);
       assert.strictEqual(await login.isShoppingCartVisible(), true);

       //Take element partial screenshot after succesful login
       await common.elementScreenshot(By.xpath("//*[@data-test='shopping-cart-link']"),
        "shopping_cart_performance_glitch_user");

    });

    // NEGATIVE CASE
    it("Failed Login - Invalid Username", async function () {
        await login.login("invalid_user", "secret_sauce");   // username tidak terdaftar

        assert.strictEqual(await login.isErrorMessageVisible(), true);          // kotak error muncul
        assert.strictEqual(
            await login.getErrorMessage(),
            LoginLocator.messages.invalidCredentials                            // teks error sesuai
        );
        assert.strictEqual(await login.getCurrentUrl(), LoginLocator.url);      // tetap di halaman login

        await common.fullScreenshot("login_invalid_username");
    });

    it("Failed Login - Wrong Password", async function () {
        await login.login("standard_user", "wrong_password"); // username benar, password salah
        // Tiga assertion di bawah sama dengan test sebelumnya
        assert.strictEqual(await login.isErrorMessageVisible(), true);
        assert.strictEqual(
            await login.getErrorMessage(),
            LoginLocator.messages.invalidCredentials
        );
        assert.strictEqual(await login.getCurrentUrl(), LoginLocator.url);

        await common.fullScreenshot("login_wrong_password");
    });

    it("Failed Login - Locked Out User", async function () {
        await login.login("locked_out_user", "secret_sauce"); // akun valid tetapi diblokir

        assert.strictEqual(await login.isErrorMessageVisible(), true);
        assert.strictEqual(
            await login.getErrorMessage(),
            LoginLocator.messages.lockedOut                   // teksnya beda: "...locked out."
        );
        assert.strictEqual(await login.getCurrentUrl(), LoginLocator.url);

        await common.fullScreenshot("login_locked_out_user");
    });
});
