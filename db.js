// db.js will be there we have our functions for talking to the databse, to retreive data, add data, or update data
const spicedPg = require("spiced-pg");
const database = "petition";
const username = "postgres";
const password = "postgres";

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres://spicedling:password@localhost:5432/petition"
    // `postgres:${username}:${password}@localhost:5432/${database}`
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
//#3
module.exports.getSigners = () => {
    const q = `SELECT users.id, users.first, users.last FROM users
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id
    INNER JOIN signatures
    ON users.id = signatures.user_id`;
    return db.query(q);
};

//#4
module.exports.getSignersFromCity = (userCity) => {
    const q = `SELECT users.id, users.first, users.last FROM users
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id
    INNER JOIN signatures
    ON users.id = signatures.user_id
    WHERE LOWER(city)= LOWER($1)`;
    const params = [userCity];
    return db.query(q, params);
};

//#2
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

// module.exports.getUsers = (email) => {
//     const q = "SELECT first, last, password FROM users WHERE email";
//     return db.query(q);
// };

//#5
module.exports.getUserByEmailAdress = (email) => {
    const q = `SELECT users.id, users.first, users.last, users.email, users.password FROM users
    JOIN signatures
    ON users.id = signatures.user_id
    WHERE email=$1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.addProfile = (userId, userAge, userCity, userUrl) => {
    const q = `INSERT INTO user_profiles (user_id, age, city, url) VALUES ($1, $2, $3, $4)`;
    const params = [userId, userAge, userCity, userUrl];
    return db.query(q, params);
};
module.exports.editProfile = (
    firstName,
    lastName,
    userEmail,
    userAge,
    userCity,
    userUrl
) => {
    const q = `SELECT users.id, users.first, users.last, users.email FROM users
    JOIN user_profiles
    ON users.id = user_profiles.user_id`;
    const params = [
        userId,
        firstName,
        lastName,
        userEmail,
        userPassword,
        userAge,
        userCity,
        userUrl,
    ];
    return db.query(q, params);
};

`INSERT INTO users (first, last, email)
VALUES ('Penélope Cruz', 43, 1)
ON CONFLICT (name)
DO UPDATE SET age = 43, oscars = 1;`;

module.exports.updateProfile = (
    firstName,
    lastName,
    userEmail,
    userAge,
    userCity,
    userUrl
) => {
    const q = `INSERT INTO users (first, last, email)
    VALUES ($1, $2, $3)
    INSERT INTO user_profiles(age,city, url)
    ON users.id = user_profiles.id`;
    const params = [
        userId,
        firstName,
        lastName,
        userEmail,
        userPassword,
        userAge,
        userCity,
        userUrl,
    ];
    return db.query(q, params);
};
