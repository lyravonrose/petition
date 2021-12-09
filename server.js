const express = require("express");
const app = express();
const db = require("./db");
const cookieParser = require("cookie-parser");
const hb = require("express-handlebars");
const { engine } = require("express-handlebars");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

//middlewares
app.use(express.static("./public"));
app.use(express.urlencoded());
app.use(cookieParser());

app.get("/petition", (req, res) => {
    db.getSignatures()
        .then(({ rows }) => {
            console.log("getSignatures db results", rows);
            // if signed
            // res.redirect("/thanks")
            // else
            res.render(petition.handlebars);
        })
        .catch((err) => console.log("err in getSignatures", err));
});

// app.post("/add-petition", (req, res) => {
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
