const express = require('express');
let sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
const exphbs = require('express-handlebars');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let alert = require('alert');
const app = express();
const verify = require('./server/routes/verifyToken');
const port = process.env.PORT || 5011;

// Parsing middleware
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true })); // New

// Parse application/json
// app.use(bodyParser.json());
app.use(express.json()); // New

// Static Files
app.use(express.static(__dirname + '/public'));

// Templating Engine
const handlebars = exphbs.create({ extname: '.hbs', defaultLayout: 'main_initial.hbs' });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

const rutesInici = require('./server/routes/inici');
const rutesComunitat = require('./server/routes/comunitat');
const rutesUsuari = require('./server/routes/usuaris');
const rutesApi = require('./server/routes/api');

// Recursos i rutes
app.use('/', rutesInici, function (req, res, next) {
    req.app.locals.layout = 'main_initial';
    next();
});
app.use('/comunitat', verify, rutesComunitat, function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
});
app.use('/usuaris', verify, rutesUsuari, function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
});
app.use('/api', rutesApi, function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// app.use(session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: false,
//     cookie: {
//         // Session expires after 1 min of inactivity.
//         expires: 60000
//     }
// }));

// app.get('/', (req, res) => {
//     res.render('inici');
// });

app.post('/auth', function (request, response) {
    // Capture the input fields
    let username = request.body.username;
    let password = request.body.password;
    if (username && password) {
        // //Connexió a Sqlite
        // let conn = new sqlite3.Database('server/controllers/comunitat.db', sqlite3.OPEN_READWRITE, (err) => {
        //     if (err) {
        //         console.error(err.message);
        //     }
        //     console.log('Connected to database.');
        // });
        // conn.all('SELECT * FROM credencial WHERE nomUsuari = ? AND contrasenya = ?', [username, password], function (error, results, fields) {
        //     if (error) throw error;
        //     if (results.length > 0) {
        // if (username == 'admin' && password == 'admin') {
        // request.session.loggedin = true;
        // request.session.username = username;
        // request.session.admin = true;

        // const token = jwt.sign({ "_id": username }, process.env.TOKEN_SECRET);
        process.env.TOKEN_SECRET = username;
        // response.header('auth_token', token).send(token);
        // response.redirect('/comunitat/?user=' + `${username}`);
        response.redirect('/comunitat');
        // response.render('main');
        //} //else {
        //     response.redirect('/');
        //     alert("USUARI O CONTRASENYA INCORRECTE");
        // }
        response.end();
        // });
    } else {
        response.send('Introdueix l`usuari i la contrasenya!');
        response.end();
    }
});

//Logout
app.get('/logout', function (req, res, next) {
    req.app.locals.layout = 'main_initial';
    process.env.TOKEN_SECRET = "";
    next();
}, function (req, res) {
    res.redirect('/');
   
});