import loginPage from '../pageobjects/login.page.js'

export class LoginAction {
    async enterUsername(username) {
        const fields = await $$(loginPage.usernameInput)
        if (fields.length >= 1) {
            await fields[0].setValue(username)
        }
    }

    async enterPassword(password) {
        const fields = await $$(loginPage.usernameInput)
        if (fields.length >= 2) {
            await fields[1].setValue(password)
        }
    }

    async tapLogin() {
        const btn = await $(loginPage.loginButton)
        await btn.click()
    }

    async login(username, password) {
        await this.enterUsername(username)
        await this.enterPassword(password)
        await this.tapLogin()
    }

    async waitForProducts() {
        const products = await $(loginPage.productsTitle)
        await products.waitForExist({ timeout: 10000 })
        return products.isDisplayed()
    }

    async isOnLoginPage() {
        const btn = await $(loginPage.loginButton)
        await btn.waitForExist({ timeout: 10000 })
        return btn.isExisting()
    }
}

export default new LoginAction()