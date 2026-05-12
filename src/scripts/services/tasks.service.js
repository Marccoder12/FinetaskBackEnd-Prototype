const crypto = require("crypto");
const db = require("../db/db");

function createTask(userId, data){
    const task = {
        id: crypto.randomUUID(),
        userId: userId,
        title: data.title,
        amount: data.amount,
        status: "pending",
        createdAt: new Date().toISOString()
    };
    console.log("TASKS.SERVICES FILE:", __filename);
    
    const sql = `
        INSERT INTO tasks (id, user_id, title, amount, status, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [task.id, task.userId, task.title, task.amount, task.status, task.createdAt];
    console.log("SQL:", sql)
    console.log("VALUES LENGTH:", values.length);
    console.log("VALUES:", values);

    db.prepare(sql).run(...values);
        return task;
}

function listTasks(userId){
    return db.prepare(`
        SELECT id, title, amount, status, createdAt
        FROM tasks WHERE user_id = ?
        ORDER BY createdAt DESC`).all(userId);
}

function updateTask(userId, taskId, patch){
    //Fetch to ensure ownership + existence
    const existing = db.prepare(`
        SELECT FROM tasks WHERE id = ? AND user_id = ?`).get(taskId, userId);
    
        if(!existing) return { ok: false, error: "task not found"};
        const newTitle = patch.title ?? existing.title;
        const newAmount = patch.amount ?? existing.amount;
        const newStatus = patch.status ?? existing.status;

        db.prepare(`
            UPDATE tasks SET title = ?, amount = ?, status = ?
            WHERE id = ? AND user_id = ?`).run(newTitle, newAmount, newStatus, taskId, userId);

            return{
                ok: true,
                task: {
                    id: existing.id,
                    title: newTitle,
                    amount: newAmount,
                    status: newStatus,
                    createdAt: existing.createdAt
                }
            };
}

function deleteTask(userId, taskId){
    const info = db.prepare(`
        DELETE FROM tasks WHERE id = ? AND user_id = ?`).run(taskId, userId);

    if(info.changes === 0) return { ok: false, error: "task not found"};

    return { ok: true};
}

function clearTasks(userId){
    const info = db.prepare(`
        DELETE FROM tasks WHERE user_id = ?`).run(userId);

        return { ok: true, deleted: info.changes };
}

module.exports = { createTask, listTasks, updateTask, deleteTask, clearTasks };