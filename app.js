const express = require('express');
let sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
const exphbs = require('express-handlebars');
const session = require('express-session');
let alert = require('alert');
const app = express();
const port = process.env.PORT || 5010;


app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});