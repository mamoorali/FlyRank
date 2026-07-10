const express = require('express');
const app = express();
const PORT = 3000;

app.get("/", (req,res) =>
{
    res.json({
        message : "Hello From Backend"
    })
})

app.get("/about", (req,res) => 
{
    res.json({
        name: "Mamoor Ali Zarrar",
        company: "FlyRank",
        role: "Backend intern",
        education: "Software Engineering, Bahria University"
    })
})

app.listen(PORT, () =>
{
    console.log(`Server running on port ${PORT}`);
})