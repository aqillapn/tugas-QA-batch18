const fs = require("fs");

class commonPage {
    constructor(driver) {
        this.driver = driver;

        if (!fs.existsSync("screenshots")) {
            fs.mkdirSync("screenshots");
        }
    }

    async fullScreenshot(filename){
        const fullScreen = await this.driver.takeScreenshot();

        fs.writeFileSync(`screenshots/${filename}.png`,
            fullScreen,
            "base64"
        );
    }

    async elementScreenshot(element, filename){
        const elementScreen = await this.driver
            .findElement(element)
            .takeScreenshot();
        
        fs.writeFileSync(`screenshots/${filename}.png`,
            elementScreen,
            "base64"
        );
    }
}

module.exports = commonPage;