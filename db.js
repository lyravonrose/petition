// db.js will be there we have our functions for talking to the databse, to retreive data, add data, or update data
const spicedPg = require("spiced-pg");
const database = "petition";
const username = "postgres";
const password = "postgres";

const db = spicedPg(
    `postgres:${username}:${password}@localhost:5432/${database}`
);
console.log("db: ", db);
console.log(`[db] connecting to:${database}`);

module.exports.getSignatures = (id) => {
    const q = "SELECT signature FROM signatures WHERE id = $1";
    return db.query(q);
};
module.exports.getSignatureNumbers = () => {
    const q = "SELECT COUNT(*) FROM signatures";
    return db.query(q);
};
module.exports.getSigners = () => {
    const q = "SELECT first, last FROM signatures";
    return db.query(q);
};
module.exports.addSignatures = (firstName, lastName, signature, userId) => {
    const q = `INSERT INTO signatures (first, last, signature, user_id) VALUES ($1, $2, $3) RETURNING id`;
    const params = [firstName, lastName, signature];
    return db.query(q, params);
};
module.exports.addUsers = (firstName, lastName, userEmail, userPassword) => {
    const q = `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id`;
    const params = [firstName, lastName, userEmail, userPassword];
    return db.query(q, params);
};

module.exports.getUsers = (email) => {
    const q = "SELECT first, last, password FROM users WHERE email";
    return db.query(q);
};
module.exports.getUserByEmailAdress = (email) => {
    const q = "SELECT password, id FROM users WHERE email=$1";
    const params = [email];
    return db.query(q, params);
};

// db.query("SELECT * FROM actors")
//     .then((dbResult) => {
//         console.log("result from the database:", dbResult.rows);
//     })
//     .catch((err) => console.log("err in query:", err));

// vulnerability concerns
