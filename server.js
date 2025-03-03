const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json());

const users = [];

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', async (req, res) => {
    try {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            id: users.length + 1,
            name: req.body.name,
            password: hashedPassword
        }
        users.push(user);
        res.status(201).json({ "success": `user ${user.name} is created.` });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);
    if (user == null) {
        return res.status(400).send('Cannot find the user');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('success.');
        }
        else {
            res.send('Not allowed.');
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(3000);