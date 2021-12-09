const express = require("express");
const app = express();
const db = require("./db");
const cookieParser = require("cookie-parser");
const hb = require("express-handlebars");
const { create } = require("express-handlebars");

const hbs = create({
    helpers: {
        getRandomNum() {
            return Math.floor(Math.random() * 250);
        },
    },
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));

app.get("/petition", (req, res) => {
    db.getSignatures()
        .then(({ rows }) => {
            console.log("getSignatures db results", rows);
        })
        .then(res.redirect("/thanks"))
        .catch((err) => console.log("err in getSignatures", err));
});

// app.post("/add-signature", (req, res) => {
//     db.addSignatures("Janell", "Monroe", "JM")
//         .then(() => {
//             console.log("yeah signature added");
//         })
//         .catch((err) => console.log("no signatures added :(", err));
// });

app.listen(8080, () => console.log("petition server listening 🍌"));

// app.get("/actors", (req, res) => {
//     db.getActors()
//         .then(({ rows }) => {
//             console.log("getActors db results", rows);
//         })
//         .catch((err) => console.log("err in getActors", err));
// });

// app.post("/add-actor", (req, res) => {
//     db.addActor("Janell Monae", 36)
//         .then(() => {
//             console.log("yeah actor added");
//         })
//         .catch((err) => console.log("no actor added :(", err));
// });
