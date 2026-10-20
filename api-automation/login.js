const { describe } = require("mocha");
const assert = require("assert");
const { expect } = require("chai");

let token;

describe("API Automation", function () {
    
describe("POST /login", function () {
    it("Valid Login", async function () {
        const response = await fetch(
            "https://belajar-bareng.onrender.com/api/login",
            {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    username: "admin",
                    password: "admin",
                }),
            }
        );
        // Assert 1: status code 200 (gaya Chai)
        expect(response.status).to.equal(200);

        // Assert 2: Mencetak Response Body
        const data = await response.json();
        console.log(data);
        expect(data.message).to.eql("Login successful");

        // Simpan Token (ini termasuk respon body)
        token = data.token;
        console.log(token);
           expect(data.token).to.exist;
    });

describe("GET /users", function () {
    it("Get User", async function () {
        const response = await fetch(
            "https://belajar-bareng.onrender.com/api/users",
            {
                headers: {
                    "Content-Type": "application/JSON",
                    authorization: `Bearer ${token}`,
                },   
            }
        );

        // Assert 1: status code 200
        expect(response.status).to.equal(200);

        // Assert 2: Respons body
        const data = await response.json();
        console.log(data);
    });

describe("POST /users", function () {
    it("[Positive Case] Add user dengan data valid", async function () {
        const response = await fetch(
            "https://belajar-bareng.onrender.com/api/add-user",
            {
                headers: {
                    "Content-Type": "application/JSON",
                    authorization: `Bearer ${token}`,
                },
                method: "POST",
                body: JSON.stringify({
                    username: "Anna",
                    age: 21,
                })
            }
        );
        
        // Assert 1: response status (200 atau 201)
        expect(response.status).to.equal(201);

        // Assert 2: response body
        const data = await response.json();
        console.log(data);

    });

    it("[Negative Case] Add user dengan invalid data", async function () {
        const response = await fetch(
            "https://belajar-bareng.onrender.com/api/add-user",
            {
                headers: {
                    "Content-Type": "application.JSON",
                    authorization: `Bearer ${token}`,
                },
                method: "POST",
                body: JSON.stringify({
                    username: " ",
                    age: 1,
                }),
            }
        );

        // Assert 1: response status
        expect(response.status).to.equal(500);

        //Assert 2: response body
        const data = await response.json();
        console.log(data);

        // Assert respons error
        expect(data).to.have.property("message");

    });
});
});
});
});