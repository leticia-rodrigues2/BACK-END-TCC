const express = require('express');
const routes = express.Router();

routes.post('/login', (req , res) => {
    const { email , password } = req.body;
    res.send(email);
});

module.exports = routes;
