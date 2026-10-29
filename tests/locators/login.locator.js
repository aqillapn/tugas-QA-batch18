const {By} = require("selenium-webdriver");

const LoginLocator = {
    url : "https://www.saucedemo.com/", 
    inventoryUrl: "https://www.saucedemo.com/inventory.html",

    selectors: {
        usernameInput: By.id("user-name"),
        passwordInput: By.id("password"),
        loginButton: By.id("login-button"),
        shoppingCart: By.xpath("//*[@data-test='shopping-cart-link']"),
        errorMessage: By.xpath("//*[@data-test='error']"),
        inventoryTitle: By.xpath("//*[@data-test='title']"),

    },

    messages: {
        invalidCredentials:
        "Epic sadface: Username and password do not match any user in this service",
        lockedOut:
        "Epic sadface: Sorry, this user has been locked out.",
    }
};

module.exports = LoginLocator;