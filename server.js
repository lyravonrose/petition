const express = require("express");
const app = express();
const db = require("./db");
// const hb = require("express-handlebars");
const { engine } = require("express-handlebars");
const cookieSession = require("cookie-session");
const { compare, hash } = require("./bc");

const packageLock =
    process.env.PACKAGE_LOCK || require("./package-lock").PACKAGE_LOCK;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

//middlewares
if (process.env.NODE_ENV == "production") {
    app.use((req, res, next) => {
        if (req.headers["x-forwarded-proto"].startsWith("https")) {
            return next();
        }
        res.redirect(`https://${req.hostname}${req.url}`);
    });
}
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
    res.redirect("/register");
});

app.get("/register", (req, res) => {
    res.render("registration", {});
});

app.post("/register", (req, res) => {
    const { first, last, email, password } = req.body;
    hash(password)
        .then((hashedPw) => {
            console.log("hashedPW:", hashedPw);
            return db.addUsers(first, last, email, hashedPw);
        })
        .then(({ rows }) => {
            req.session.userId = rows[0].id;
            res.redirect("/profile");
        })
        .catch((err) => {
            console.log("err in hash", err);
            res.render("registration");
        });
});

app.get("/login", (req, res) => {
    res.render("login", {});
});
app.post("/login", (req, res) => {
    // this is where we will want to use compare
    // we'd first go to the database to retreive the hash
    // for the email that the user provided
    const { email, password } = req.body;
    const claimedPassword = req.body.password;
    db.getUserByEmailAdress(email)
        .then((result) => {
            console.log(result);
            compare(password, result.rows[0].password)
                .then((match) => {
                    console.log(
                        "do provided PW and db stored hash match?",
                        match
                    );
                    res.sendStatus(200);
                    res.redirect("/petition");
                })
                .catch((err) => {
                    console.log("err in compare:", err);
                    res.render("login");
                });
        })
        .catch((err) => {
            console.log("err in compare:", err);
            res.render("login");
        });
});

app.get("/petition", (req, res) => {
    console.log("req.session in petition route: ", req.session);
    if (req.session.signed) {
        res.redirect("/thanks");
    } else {
        res.render("petition");
    }
});

app.post("/petition", (req, res) => {
    const data = req.body;
    console.log("IN POST/petition", req.body);
    db.addSignatures(data.first, data.last, data.signature)
        .then(({ rows }) => {
            req.session.signed = rows[0].id;
            res.redirect("/thanks");
            console.log("yeah signature added");
        })
        .catch((err) => {
            console.log("no signatures added :(", err);
            res.render("/petition");
        });
});
app.get("/thanks", (req, res) => {
    console.log("/thanks", req.session);
    const signatureId = req.session.signed;
    db.getSignatures(signatureId).then(({ rows }) => {
        if (rows.length) {
            res.render("/thanks");
        } else {
            res.redirect("/petition");
        }
    });
});

app.get("/signers", (req, res) => {
    db.getSigners()
        .then(({ rows: signers }) => {
            res.render("signers", signers);
        })
        .catch((err) => {
            res.redirect("/petition");
        });
    //SELECT first and last values of every person that has signed from the database and pass them to signers.handlebars
});

app.get("/profile", (req, res) => {
    res.render("profile", {});
});
app.post("/profile", (req, res) => {
    const { age, url, city } = req.body;
    console.log("IN POST/profile", req.body);
    db.addProfile(age, url, city)
        .then(({ rows }) => {
            req.session.signed = rows[0].id;
            res.redirect("/petition");
        })
        .catch((err) => {
            console.log("no info added :(", err);
            res.render("/profile");
        });

    if (age || url || city === null) {
        res.redirect("");
    }
    // When the user submits the form from the GET route, the data should go into the new user_profiles table. All of the data is optional, so if none of it is present you can skip doing the query. Either way, you should end by redirecting to /petition (unless there's an error, in which case you should re-render the form).
});

app.listen(process.env.PORT || 8080, () =>
    console.log("petition server listening 🍌")
);

//atob(), btoa()

app.post("/profile/edit", (req, res) => {
    if (!req.body.password) {
        // HERE!!!
        // user has not changed their password
        // we should leave the value in the DB as it is
    } else {
        req.body.password;
        //user has updated password
        //we should update db with new value
    }
});

// DELETE FROM users WHERE id = $1;

/* <form action="delete-signature" method="POST">
    <button>Delete Signature</button>
</form> */
