require("./scripts/db/migrate");
const app = require("./scripts/app")
const PORT = process.env.PORT || 3030

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// setInterval(() =>console.log("still alive"), 3000);