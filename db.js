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

module.exports.getSignatures = () => {
    const q = "SELECT * FROM signatures";
    return db.query(q);
};
module.exports.addSignatures = (firstName, lastName, signature) => {
    const q = `INSERT INTO signatures (first, last, signature) VALUES ($1, $2, $3)`;
    const params = [firstName, lastName, signature];
    return db.query(q, params);
};
// db.query("SELECT * FROM actors")
//     .then((dbResult) => {
//         console.log("result from the database:", dbResult.rows);
//     })
//     .catch((err) => console.log("err in query:", err));
