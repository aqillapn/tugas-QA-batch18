import { expect } from '@wdio/globals'
import loginAction from '../actions/login.action.js'

describe('Swag Labs App', () => {


    it('should login successfully with standard user', async () => {
        const isLoginPage = await loginAction.isOnLoginPage()
        await expect(isLoginPage).toBe(true)
        await loginAction.login('standard_user', 'secret_sauce')
        const isProductsVisible = await loginAction.waitForProducts()
        await expect(isProductsVisible).toBe(true)
    })
})