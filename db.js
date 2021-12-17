// db.js will be there we have our functions for talking to the databse, to retreive data, add data, or update data
const spicedPg = require("spiced-pg");
const database = "petition";
const username = "postgres";
const password = "postgres";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);

console.log("db: ", db);
console.log(`[db] connecting to:${database}`);

module.exports.getSignatures = (userId) => {
    const q = "SELECT signature FROM signatures WHERE user_id = $1";
    const params = [userId];
    return db.query(q, params);
};
module.exports.getSignatureNumbers = () => {
    const q = "SELECT COUNT(*) FROM signatures";
    return db.query(q);
};

module.exports.getSigners = () => {
    const q = `SELECT * FROM users
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id
    INNER JOIN signatures
    ON users.id = signatures.user_id`;
    return db.query(q);
};

module.exports.getSignersFromCity = (userCity) => {
    const q = `SELECT users.id, users.first, users.last FROM users
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id
    INNER JOIN signatures
    ON users.id = signatures.user_id WHERE LOWER(city)= LOWER($1)`;
    const params = [userCity];
    return db.query(q, params);
};

module.exports.addSignatures = (userId, signature) => {
    const q = `INSERT INTO signatures (user_id, signature) VALUES ($1, $2) RETURNING id`;
    const params = [userId, signature];
    return db.query(q, params);
};
module.exports.addUsers = (firstName, lastName, userEmail, userPassword) => {
    const q = `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id`;
    const params = [firstName, lastName, userEmail, userPassword];
    return db.query(q, params);
};

module.exports.getUserByEmailAdress = (email) => {
    const q = `SELECT users.id, users.first, users.last, users.email, users.password FROM users
    JOIN signatures
    ON users.id = signatures.user_id
    WHERE email=$1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getUserProfile = (userId) => {
    const q = `
        SELECT
            users.id, users.first, users.last, users.email,
            user_profiles.age, user_profiles.city, user_profiles.url
        FROM users
        LEFT JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE users.id = $1
    `;
    const params = [userId];
    return db.query(q, params);
};

module.exports.addProfile = (userId, userAge, userCity, userUrl) => {
    const q = `INSERT INTO user_profiles (user_id, age, city, url) VALUES ($1, $2, $3, $4)`;
    const params = [userId, userAge || null, userCity || null, userUrl || null];
    return db.query(q, params);
};

module.exports.editUsers = (userId, firstName, lastName, userEmail) => {
    const q = `UPDATE users SET (first, last, email) = ($2, $3, $4) WHERE users.id = $1`;
    const params = [userId, firstName, lastName, userEmail];
    return db.query(q, params);
};

module.exports.editUserProfile = (userId, userAge, userUrl, userCity) => {
    const q = `INSERT INTO user_profiles (user_id, age, url, city)
    VALUES ($1,$2,$3,$4)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $2, url = $3, city = $4;`;
    const params = [userId, userAge, userUrl, userCity];
    return db.query(q, params);
};

module.exports.editUsersWithPassword = (
    userId,
    firstName,
    lastName,
    userEmail,
    password
) => {
    const q = `UPDATE users SET (first, last, email, password) = ($2, $3, $4, $5) WHERE users.id = $1`;
    const params = [userId, firstName, lastName, userEmail, password];
    return db.query(q, params);
};

module.exports.deleteSig = (userId) => {
    const q = `DELETE FROM signatures WHERE user_id=$1`;
    const params = [userId];
    return db.query(q, params);
};
