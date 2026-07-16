const swaggerUi = require("swagger-ui-express");
const openapi = require("./openapi.json");
const express = require('express');
const app = express();
app.use(express.json());
port = 3000;

const tasks = [
    {
        id: 1,
        title: "Learn Express",
        done: false
    },
    {
        id: 2,
        title: "Finish Backend Task",
        done: false
    },
    {
        id: 3,
        title: "Push to GitHub",
        done: true
    }
];

app.get('/tasks', (req,res) =>{
    res.send(tasks);
});
app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);
    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }
    else{
    res.json(task)
    };
});

app.get('/', (req,res) =>
{
    res.json({
        "name": "Task API",
        "version": "1.0",
        "endpoints": ["/tasks"]  
    });
});

app.get('/health', (req,res) => 
{
    res.json({
        "status": "ok"    
    });
});

app.post("/tasks", (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({
            error: "Title is required"
        });
    }
    const newTask = {
        id: tasks.length + 1,
        title: title,
        done: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);
    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }
    const { title, done } = req.body;
    if (title === undefined && done === undefined) {
        return res.status(400).json({
            error: "Nothing to update"
        });
    }
    if (title !== undefined) {
        task.title = title;
    }
    if (done !== undefined) {
        task.done = done;
    }
    res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }
    tasks.splice(index, 1);
    res.sendStatus(204);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.listen(port, () =>
{
    console.log(`Server is live on port: ${port}`);
})