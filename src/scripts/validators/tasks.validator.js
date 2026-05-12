function validateCreateTask(body){
    const errors = [];
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const amount =  Number(body.amount);
    if(!title) errors.push("title is required");
    if(!Number.isFinite(amount) || amount <= 0) errors.push("amount mush be a positive number");

    if(errors.length) return { ok: false, errors};
    
    return { ok: true, value: {title, amount}};
}

function validateUpdateTask(body){
    const errors = [];

    const out = {};

    if(body.title !== undefined){
        const title = typeof body.title === "string" ? body.title.trim() : "";
    if(!title) errors.push("title must be a non-empty string");
    else out.title = title;
    }

    if(body.amount !== undefined){
        const amount = Number(body.amount);
        if(!Number.isFinite(amount) || amount <= 0)
            errors.push("amount mush be a positive number");
        else out.amount = body.amount;
    }
    if(body.amount !== undefined){
        const allowed = ["pending", "completed", "cancelled"];
        if(!allowed.includes(body.status))
            errors.push(`status must be one of: ${allowed.join(", ")}`);
        else out.status = body.status;
    }

    if(Object.keys(out).length === 0)
        errors.push("no valid fields to update");
    if(errors.length) return { ok: false, errors };

    return {ok: true, value: out};
}

module.exports = { validateCreateTask, validateUpdateTask };