const express = require("express");
const app = express();
const db = require("./db");
// const hb = require("express-handlebars");
const { engine } = require("express-handlebars");
const cookieSession = require("cookie-session");
const { compare, hash } = require("./bc");
const helmet = require("helmet");

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
app.use(helmet());
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
    console.log("req.session in petition route:", req.session);
    if (req.session.signed) {
        res.redirect("/thanks");
    } else {
        res.render("petition");
    }
});

app.post("/petition", (req, res) => {
    const data = req.body;
    console.log("IN POST/petition", req.body);
    db.addSignatures(data.signature)
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
        .then(({ rows }) => {
            res.render("signers", rows);
        })
        .catch((err) => {
            res.redirect("/petition");
        });
});

app.get("/signers/:city", (req, res) => {
    const userCity = req.params.city;
    db.getSignersFromCity(userCity)
        .then(({ rows }) => {
            res.render("signers", rows);
        })
        .catch((err) => {
            res.redirect("/petition");
        });
});

app.get("/profile", (req, res) => {
    res.render("profile", {});
});
app.post("/profile", (req, res) => {
    const { user_id, age, city, url } = req.body;
    console.log("IN POST/profile", req.body);
    if (!age && !url && !city) {
    } else {
        if (
            !url.startsWith("http:") ||
            !url.startsWith("https:") ||
            !url.startsWith("//")
        ) {
            res.sendStatus(403);
        }
    }
    db.addProfile(user_id, age, city, url)
        .then(({ rows }) => {
            res.redirect("/petition");
        })
        .catch((err) => {
            console.log("no info added :(", err);
            res.render("/profile");
        });
});

app.get("/profile/edit", (req, res) => {
    const userId = req.session.userId;
    db.getUserProfile(userId).then(({ rows }) => {
        const { first, last, email, age, city, url } = rows[0];
        res.render("edit", {
            first,
            last,
            email,
            age,
            city,
            url,
        });
    });
});

app.post("/profile/edit", (req, res) => {
    const userId = req.session.userId;
    const { first, last, email, password, age, city, url } = req.body;
    if (!req.body.password) {
        db.editUsers(userId, first, last, email)
            .then(() => {
                db.editUserProfile(userId, age, city, url)
                    .then(() => {
                        res.redirect("/profile");
                    })
                    .catch((err) => {
                        console.log("err in edit user profile", err);
                        res.render("edit", {
                            first,
                            last,
                            email,
                            age,
                            city,
                            url,
                            err: true,
                        });
                    });
            })
            .catch((err) => {
                console.log("error in edit users", err);
                res.render("edit", {
                    first,
                    last,
                    email,
                    age,
                    city,
                    url,
                    err: true,
                });
            });
    } else {
        hash(password)
            .then((hashedPW) => {
                db.editUsersWithPassword(userId, first, last, email, hashedPW)
                    .then(() => {
                        db.editUserProfile(userId, age, url, city)
                            .then(() => {
                                res.redirect("/profile");
                            })
                            .catch((err) => {
                                console.log("err in edit user profile", err);
                                res.render("edit", {
                                    first,
                                    last,
                                    email,
                                    age,
                                    city,
                                    url,
                                    err: true,
                                });
                            });
                    })
                    .catch((err) => {
                        console.log("err in edit users with password", err);
                        res.render("edit", {
                            first,
                            last,
                            email,
                            age,
                            city,
                            url,
                            err: true,
                        });
                    });
            })
            .catch((err) => {
                console.log("hash password err:", err);
                res.render("edit", {
                    first,
                    last,
                    email,
                    age,
                    city,
                    url,
                    err: true,
                });
            });
    }
});

app.post("/thanks", (req, res) => {
    const userId = req.session.userId;
    db.deleteSig(userId)
        .then(() => {
            req.session.signed = null;
            res.redirect("/petition");
        })
        .catch((err) => console.log("Err in delete sig", err));
});

console.log("Main module", require.main == module);
if (require.main == module) {
    app.listen(process.env.PORT || 8080, () =>
        console.log("petition server listening 🍌")
    );
}
