let sqlite3 = require('sqlite3').verbose();//'server/controllers/comunitat.db';//
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION ||'server/controllers/comunitat.db';// 'home/root/db_app/comunitat.db';
const dirName = require('path').dirname(location);
if (!fs.existsSync(dirName)) {
  fs.mkdirSync(dirName, { recursive: true });
}
let conn = new sqlite3.Database(location, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to database.');
});


// Vinculació comunitat amb servidor extern
exports.init = (req, res) => {
   // Sqlite connexió 
  conn.all('SELECT * FROM usuari ORDER BY idComunitat ASC', (err, rows) => {
    // Si no hi ha error 
    if (!err) {
      let alert = req.query.alert;
      let alert3 = req.query.alert3;
      calculaCoeficient(function getCoeficient(result) {
        alert2 = result[1];
        cT = result[0];
        res.render('usuaris', { rows, alert, alert2, alert3, cT });
      });
    } else {
      alert2 = 'No es pot accedir a la base de dades';
      res.render('usuaris', { alert2 });
      console.log(err);
    }
  });
}
