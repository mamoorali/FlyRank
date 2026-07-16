const express = require('express');
const app = express();
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

app.listen(port, () =>
{
    console.log(`Server is live on port: ${port}`);
})