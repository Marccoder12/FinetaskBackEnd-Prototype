const crypto = require("crypto");
const cryptoUtils = require("../utils/crypto");
const bcrypt = require("bcrypt");
const db = require("../db/db");

function registerUser({name, email, password}){
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const password_hash = bcrypt.hashSync(password, 10);

    const info = db.prepare(`
        INSERT INTO users (id, name, email, password_hash, createdAt)
        VALUES (?, ?, ?, ?, ?)
        `).run(id, name, email, password_hash, createdAt);

        console.log("INSERT INFO:", info);
        //Return safe user object (never send password_hash back)
        return { id, name, email, createdAt };
}

function findUserByEmail(email){
    return db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
}

function sha256(input){
    return crypto.createHash("sha256").update(input).digest("hex");
}

function loginUser({ email, password}){
    const user = findUserByEmail(email);
    if(!user) return {ok: false, error:"Invalid credentials"};

    const ok = bcrypt.compareSync(password, user.password_hash);
    if(!ok) return { ok : false, error : "Invalid credentials" };

    //creatw token (raw) + store hash in DB
    const token = crypto.randomBytes(32).toString("hex");
    const token_hash = cryptoUtils.sha256(token);

    const sessionId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    // const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString(); // 2 mins

    db.prepare(`
        INSERT INTO sessions (id, user_id, token_hash, createdAt, expiresAt)
        VALUES (?, ?, ?, ?, ?)
        `).run(sessionId, user.id, token_hash, createdAt, expiresAt);
        
        console.log("TOKEN HASH(login store):", token_hash);
        return { ok: true, token: token, user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        
        }
    };
}

module.exports = { registerUser, loginUser};