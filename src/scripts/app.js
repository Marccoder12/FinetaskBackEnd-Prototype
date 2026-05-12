const express = require("express");
const authRoutes = require("./routes/auth.routes");
const tasksRoutes = require("./routes/tasks.routes")
const db= require("./db/db");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => res.json({ ok: true}));
app.get("/db-test", (req, res) => {
    const row = db.prepare("SELECT 1 AS one").get();
    res.json(row);
})
app.use(express.json());
app.use((req, res, next) => {
    console.log("INCOMING:", req.method, req.url);
    next();
});

app.get("/api/debug/users", (req, res) => {
    const users = db.prepare("SELECT id, name, email, createdAt FROM users").all();
    res.json({ ok: true, users });
})

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        ok: false,
        error: "Internal Server Error"
    });
});

//actual routes

app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes)

module.exports = app;