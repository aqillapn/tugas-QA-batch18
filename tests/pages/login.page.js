const {until, By} = require("selenium-webdriver");
const LoginLocator = require("../locators/login.locator");

class LoginPage {
    constructor(driver) {
        this.driver = driver;
    }

    async openBrowser() {
        await this.driver.get(LoginLocator.url);
        await this.driver.wait(async () => {
            const url = await this.driver.getCurrentUrl();
            return url  === LoginLocator.url;
        }, 5000).catch(() => {
            throw new Error("Failed to navigate to login page");
        });

    };

    async inputUsername(username){
        const inputUsername = await this.driver.findElement(LoginLocator.selectors.usernameInput);
        await inputUsername.clear();
        await inputUsername.sendKeys(username);
    }

    async inputPassword(password){
        const inputPassword = await this.driver.findElement(LoginLocator.selectors.passwordInput);
        await inputPassword.clear();
        await inputPassword.sendKeys(password);
    }

    async clickLoginButton(){
        const loginButton = await this.driver.findElement(LoginLocator.selectors.loginButton);
        await loginButton.click();
    }

    // [BARU] Gabungan 3 langkah: isi username, isi password, klik login
    async login(username, password){
        await this.inputUsername(username);
        await this.inputPassword(password);
        await this.clickLoginButton();
    }

    async getCurrentUrl() {
        return this.driver.getCurrentUrl();
    }

    async isShoppingCartVisible() {
        const shoppingCart = await this.driver.wait(
            until.elementLocated(LoginLocator.selectors.shoppingCart),
            15000
        );
        return shoppingCart.isDisplayed();
    }

    async getInventoryTitle() {
        const title = await this.driver.wait(
            until.elementLocated(LoginLocator.selectors.inventoryTitle),
            5000
        );
        return title.getText();
    }

    // [DIPERBAIKI] Hanya mengembalikan true/false, assertion dilakukan di spec
    async isErrorMessageVisible() {
        const errorMessage = await this.driver.wait(
            until.elementLocated(LoginLocator.selectors.errorMessage),
            5000
        );
        return errorMessage.isDisplayed();
    }

    // [BARU] Mengambil teks pesan error untuk dibandingkan di spec
    async getErrorMessage() {
        const errorMessage = await this.driver.wait(
            until.elementLocated(LoginLocator.selectors.errorMessage),
            5000
        );
        return errorMessage.getText();
    }

}

module.exports = LoginPage;