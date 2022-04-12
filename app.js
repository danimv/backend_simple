const express = require('express');
const exphbs = require('express-handlebars');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5010;

// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true })); // New

// Parse application/json
// app.use(bodyParser.json());
app.use(express.json()); // New

// Static Files
app.use(express.static('public'));

// Templating Engine
const handlebars = exphbs.create({ extname: '.hbs', });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

const rutesInici = require('./server/routes/inici');
const rutesComunitat = require('./server/routes/comunitat');
const rutesUsuari = require('./server/routes/usuaris');
app.use('/', rutesInici);
app.use('/comunitat', rutesComunitat);
app.use('/usuari', rutesUsuari);
// app.use(express.static('imatges'));


app.listen(port, () => console.log(`Listening on port ${port}`));