const bcrypt = require("bcryptjs");
const { genSalt, hash, compare } = bcrypt;

module.exports.compare = compare;
module.exports.hash = (plainTextPW) =>
    genSalt().then((salt) => hash(plainTextPW, salt));
/// DEMO of how these functions work
// genSalt()
//     .then((salt) => {
//         console.log("salt:", salt);
//         // has expects to be given a cleartext password and a salt!
//         return hash("password123.", salt);
//     })
//     .then((hashedPW) => {
//         console.log("hashed and salted Password:", hashedPW);
//         //compare takes two arguments: a cleartext password and a hash
//         //compare returns a boolean on whether the cleatext can generate
//         // that hash when comibine with the salt
//         return compare("password123", hashedPW);
//     })
//     .then((matchValue) => {
//         console.log("is the password correct:", matchValue);
//     });
