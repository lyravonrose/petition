const supertest = require("supertest");
const { app } = require("./server.js");
const cookieSession = require("cookie-session");

test("Sanity Check", () => {
    expect(1).toBe(1);
});

// test("homepage functional", () => {
//     return supertest(app).get("/").expect(200).expect("Hello World");
// });

// test("Redirect /onion to /bye if no idsco cookie session", () => {
//     return supertest(app).get("/onion").expect(302);
// });

// test("redirection /bye to /onion if disco cookie session set", () => {
//     cookieSession.mockSessionOnce({ disco: "duck" });
//     return supertest(app).get("/bye").expect(302).expect("location", "/onion");
// });
