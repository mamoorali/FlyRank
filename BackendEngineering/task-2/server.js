const swaggerUi = require("swagger-ui-express");
const openapi = require("./openapi.json");
const express = require('express');
const tasksRepository = require('./tasksRepository');
const app = express();
app.use(express.json());
const port = 3000;

app.get('/tasks', async (req, res) => {
    const tasks = await tasksRepository.getAll();
    res.send(tasks);
});

app.get("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);
    const task = await tasksRepository.getById(id);
    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }
    res.json(task);
});

app.get('/', (req, res) => {
    res.json({
        "name": "Task API",
        "version": "1.0",
        "endpoints": ["/tasks"]
    });
});

app.get('/health', (req, res) => {
    res.json({
        "status": "ok"
    });
});

app.post("/tasks", async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({
            error: "Title is required"
        });
    }
    const newTask = await tasksRepository.create(title);
    res.status(201).json(newTask);
});

app.put("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { title, done } = req.body;
    if (title === undefined && done === undefined) {
        return res.status(400).json({
            error: "Nothing to update"
        });
    }
    const updatedTask = await tasksRepository.update(id, { title, done });
    if (!updatedTask) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }
    res.json(updatedTask);
});

app.delete("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);
    const deleted = await tasksRepository.remove(id);
    if (!deleted) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }
    res.sendStatus(204);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.listen(port, () => {
    console.log(`Server is live on port: ${port}`);
});