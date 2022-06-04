let sqlite3 = require('sqlite3').verbose(); //'server/controllers/comunitat.db';//
const location = process.env.SQLITE_DB_LOCATION || 'server/controllers/comunitat.db';//'home/root/db_app/comunitat.db';
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
exports.interrupcions = (req, res) => {
  res.render('interrupcions');
}

exports.crearBd = (req, res) => {
  conn.all(
    'CREATE TABLE IF NOT EXISTS usuari (idUsuari INTEGER, dataAlta TEXT, dataActualitzacio TEXT, nom TEXT, cognoms TEXT, email TEXT, telefon INTEGER, coeficient INTEGER, estat TEXT, comentaris TEXT, PRIMARY KEY("idUsuari" AUTOINCREMENT))',
    (err, result1) => {
      conn.all(
        'INSERT INTO usuari(idComunitat, nom, coeficient, estat) VALUES (?,?,?,?)', [1000,"Administrador",0,"Baixa"],
        (err, result2) => {
          conn.all(
            'CREATE TABLE IF NOT EXISTS coeficient (idCoeficient INTEGER, idUsuari INTEGER, data TEXT, coeficient INTEGER, estat TEXT, comentaris TEXT, PRIMARY KEY("idCoeficient" AUTOINCREMENT))',
            (err, result2) => {
              res.render('config_comunitat', { result1, result2 });
            });
        },
      );
    },
  );
}
