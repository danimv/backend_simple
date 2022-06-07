let sqlite3 = require('sqlite3').verbose(); //'server/controllers/comunitat.db';//
const fs = require('fs');
const { nextTick } = require('process');
const location = process.env.SQLITE_DB_LOCATION || 'server/controllers/comunitat.db';//'home/root/db_app/comunitat.db';
let conn = new sqlite3.Database(location, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to database.');
  }
});

// Vista comunitat
exports.view = (req, res) => {
  checkFileExists(location, function check(error) {
    if (!error) {
      crearBd();
      // Sqlite connexió 
      conn.all('SELECT * FROM comunitat ORDER BY id DESC LIMIT 1', (err, rows) => {
        if (!err) {
          res.render('comunitat', { rows });
        } else {
          res.render('comunitat');
          console.log(err);
        }
      });
    } else {
      res.render('inici');
    }
  });
}
// exports.view2 = (req, res) => {
//   res.render('config_comunitat');
// }
exports.interrupcions = (req, res) => {
  res.render('interrupcions');
}

function crearBd() {  
    conn.all(
      'CREATE TABLE IF NOT EXISTS usuari (idUsuari INTEGER, dataAlta TEXT, dataActualitzacio TEXT, nom TEXT, cognoms TEXT, email TEXT, telefon INTEGER, coeficient INTEGER, estat INTEGER, vinculat INTEGER, comentaris TEXT, PRIMARY KEY("idUsuari" AUTOINCREMENT))',
      (err, result) => {
        if (!err) {
          conn.all(
            'CREATE TABLE IF NOT EXISTS coeficient (idCoeficient INTEGER, idUsuari INTEGER, data TEXT, coeficient INTEGER, estat INTEGER, comentaris TEXT, PRIMARY KEY("idCoeficient" AUTOINCREMENT))',
            (err, result2) => {
              if (!err) {
                conn.all(
                  'CREATE TABLE IF NOT EXISTS comunitat (id INTEGER, idComunitat INTEGER, hashtag TEXT, nomComunitat TEXT, comentaris TEXT, sync INTEGER, PRIMARY KEY("id" AUTOINCREMENT))',
                  (err, result3) => {
                    if (!err) {
                      console.log("Taules revisades");
                    }
                  });
              } else {
                console.log(err);
              }
            });
        } else {
          console.log(err);
        }
      },
    );  
}

function checkFileExists(filepath, callback) {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.constants.F_OK, error => {
      if (error) {
        console.log("File NO exists");
      }
      callback(error)
    });
  });
}

exports.checkFileExists = checkFileExists; 