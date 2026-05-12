function validateRegister(body){
    const errors = [];

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if(!name) errors.push("name is required");
    if(!email || !email.includes("@")) errors.push("valid email is required");
    if(password.length < 8) errors.push("password must be at least 8 characters");

    if(errors.length)return { ok: false, errors };
    return { ok: true, value: {name, email, password } };
}

function validateLogin(body){
    const errors = [];
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if(!email || !email.includes("@")) errors.push("valid email is required");
    if(!password) errors.push("password is required");

    if(errors.length) return { ok : true, errors};

    return { ok : true, value : {email, password} };
}

module.exports = { validateRegister, validateLogin };