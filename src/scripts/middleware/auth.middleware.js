const crypto = require("../utils/crypto");
const db = require("../db/db");

function requireAuth(req, res, next){
    const header = req.headers.authorization;

    if(!header || !header.startsWith("Bearer")){
        return res.status(401).json({ ok: false, error:"missing token" });
    }

    const token = header.split(" ")[1];
    const token_hash = crypto.sha256(token);
    console.log("TOKEN HASH (middleware): ", token_hash);

    const session = db.prepare(`SELECT * FROM sessions WHERE token_hash = ?`).get(token_hash);

    if(!session){
        return res.status(401).json({ ok: false, error: "invalid token"});
    }

    if(new Date(session.expiresAt) < new Date()){
        return res.status(401).json({ ok: false, error: "session expired"});
    }

    console.log("AUTH HEADER RECEIVED", req.headers.authorization);
    req.user = { id: session.user_id};
    next();
}

module.exports = { requireAuth };