const { validateRegister, validateLogin } = require("../validators/auth.validator");
const { registerUser, loginUser } = require("../services/auth.service");

function register(req, res){
    const v = validateRegister(req.body);
    if(!v.ok) return res.status(400).json({ok:false, errors: v.errors});
    try{
        const user = registerUser(v.value);
        return res.status(201).json({ ok:true, user});
    }catch (err) {
        //common: duplicate email (SQLITE_CONSTRAINT)
        if(err && err.code == "SQLITE_COSTRAINT_UNIQUE"){
            return res.status(409).json({ ok: false, error: "email already exists" });
        }
        console.error(err);
        return res.status(500).json ({ ok: false, error: "server error" });
    }
}

function login(req, res){
    const v = validateLogin(req.body);
    if(!v.ok) return res.status(400).json({ok: false, errors: v.errors});

    try{
        const result = loginUser(v.value);
        if(!result.ok) return res.status(401).json({ok: false, error: result.errors});

        return res.json({ok: true, token: result.token, user: result.user });
    }catch(err){
        console.log("LOGIN ERROR: ", err);
        return res.status(500).json({ok: false, error: `server error oo ${err}`});
    }
}

module.exports = { register, login }