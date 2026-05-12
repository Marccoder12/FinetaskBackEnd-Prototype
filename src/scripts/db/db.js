const Database = require("better-sqlite3");

//This creates/opens finetask.db in your project folder
const db = new Database("finetask.db");

//recommended (optional) settings;
db.pragma("journal_mode = WAL"); //better concurrency
db.pragma("foreign_keys = ON"); //enforce foreign keys rules (if you yse them)

console.log("DB PATH:", db.name);
module.exports = db;