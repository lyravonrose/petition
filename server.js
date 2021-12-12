const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const { engine } = require("express-handlebars");
const cookieSession = require("cookie-session");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

//middlewares
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader("x-frame-options", "deny");
    next();
});

app.use(
    cookieSession({
        secret: `emperor penguins are aliens.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.get("/", (req, res) => {
    console.log("req.session before:", req.session);
    req.session.onion = "bigSecret1111";
    // req.session.signatureId = rows[0].id;
    console.log("req.session after: ", req.session);
    res.redirect("/petition");
});

//cookies
app.get("/petition", (req, res) => {
    console.log("req.session in petition route: ", req.session);
    if (req.session.onion === "bigSecret1111") {
        res.render("petition");
    } else {
        res.send("<h1>🤷‍♂️</h1>");
    }
    //access database by row, cookies = rows[0].id
});

app.get("/petition", (req, res) => {
    db.getSignatures().then(({ rows }) => {
        console.log("getSignatures db results", rows);
        // if signed
        res.redirect("/thanks");
        // else
        res.render("petition");
    });
    // .catch((err) => console.log("err in getSignatures", err));
});

app.post("/petition", (req, res) => {
    data = req.body;
    db.addSignatures(data.params[0], data.params[1], data.params[2])
        .then(() => {
            res.cookie();
            //set cookie to remember that the user has signed (do this last → this logic will change in the future)
            res.redirect("/thanks");
            console.log("yeah signature added");
        })
        //if submit signature rejected
        // res.render("/petition")
        .catch((err) => {
            console.log("no signatures added :(", err);
            res.render("/petition");
        });
});

app.get("/thanks", (req, res) => {
    const { signatureId } = req.session;
    // db query to get signature using signatureId
    // pass signature back to client to render onscreen
    res.render("thanks", {
        layout: "main",
    });
});

app.get("/signers", (req, res) => {
    res.render("signers").catch((err) => {
        res.redirect("/petition");
    });
    //SELECT first and last values of every person that has signed from the database and pass them to signers.handlebars
    // params[0], params[1];
});
app.listen(8080, () => console.log("petition server listening 🍌"));

//atob(), btoa()
