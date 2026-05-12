const { validateCreateTask, validateUpdateTask}  = require("../validators/tasks.validator");
const tasksService = require("../services/tasks.service");

function listTasks(req, res){
    const userId = req.user.id;
    const tasks = tasksService.listTasks(userId);
    res.json({ ok: true, tasks });
}

function createTask(req, res){
    const userId = req.user.id;
    const v = validateCreateTask(req.body);
    if(!v.ok) return res.status(400).json({ ok: false, errors: v.errors });
    console.log("REQ BODY", req.body);
    console.log("REQ USER", req.user);//from middleware
    console.log("REQ HEADERS", req.headers.authorization);
    const task= tasksService.createTask(userId, v.value);
    res.status(201).json({ok: true, task });
}

function updateTask(req, res){
    const userId = req.user.id;
    const taskId = req.params.id;

    const v = validateUpdateTask(req.body);
    if(!v.ok) return res.status(400).json({ ok: false, errors: v.errors });

    const result = tasksService.updateTask(userId, taskId, v.value);
    if(!result.ok) return res.status(404).json({ ok: false, error: result.error });

    res.json({ ok: true, task: result.task });
}

function deleteTask(req, res){
    const userId = req.user.id;
    const taskId = req.params.id;

    const result = tasksService.deleteTask(userId, taskId);
    if(!result.ok) return res.status(404).json({ ok: false, error: result.error });

    res.json({ ok: true});
    
}
function clearTasks(req, res){
    const userId = req.user.id;
    const result = tasksService.clearTasks(userId);
    res.json(result);
}

module.exports = { listTasks, createTask, updateTask, deleteTask, clearTasks };