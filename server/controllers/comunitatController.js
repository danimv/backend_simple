let sqlite3 = require('sqlite3').verbose();
const location = process.env.SQLITE_DB_LOCATION || 'home/root/db_app/comunitat.db';
let conn = new sqlite3.Database(location, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to database.');
});

// Vista comunitat
exports.view = (req, res) => {
  let alert2 = false;
  res.render('comunitat');  
}
exports.view2 = (req, res) => {
  res.render('config_comunitat');  
}

exports.crearBd = (req, res) => {
  conn.all(
    'CREATE TABLE IF NOT EXISTS usuari (idUsuari INT, idComunitat INT, dataAlta TEXT, dataActualitzacio TEXT, nom TEXT, cognoms TEXT, email TEXT, telefon INT, coeficient INT, estat TEXT, comentaris TEXT)',
    (err, result) => {
      if (err) return rej(err);
      res.render('config_comunitat', {result});       
    },
  );   
}
