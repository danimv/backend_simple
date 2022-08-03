let sqlite3 = require('sqlite3').verbose(); //'server/controllers/comunitat.db';//
const fs = require('fs');
const { nextTick } = require('process');
const exportedD = require('../db/dbDriver');
const location = exportedD.dbLocation();
let conn = exportedD.dbConnection();

// Vista comunitat
exports.view = (req, res) => {
  checkFileExists(location, function check(error) {
    if (!error) {
      crearBd();
      // Sqlite connexió 
      conn.all('SELECT * FROM comunitat ORDER BY id DESC LIMIT 1', (err, rows) => {
        if (!err && rows[0]) {
          mode = rows[0].mode;
          res.render('comunitat', { rows, mode });
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

// Canviar de mode online o offline --> 0=ONLINE, 1=OFFLINE
exports.mode = (req, res) => {
  let mode;  
  // Sqlite connexió 
  conn.all('SELECT * FROM comunitat ORDER BY id DESC LIMIT 1', (err, row) => {
    if (err || row[0].mode == null) {
      mode = 1;
    } else {
      mode = row[0].mode + 1;
      if (mode > 1) mode = 0;
    }
    conn.all('UPDATE comunitat SET mode = ? WHERE id = ?', [mode, row[0].id], (err, rows4) => {
    });    
    console.log(mode);
    res.redirect('/comunitat/?mode=' + `${mode}`);              
    // res.render('comunitat', { mode });
  });  
  // res.redirect(req.get('referer'));
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
                'CREATE TABLE IF NOT EXISTS comunitat (id INTEGER, idComunitat INTEGER, nomComunitat TEXT, comentaris TEXT, sync INTEGER, mode INTEGER, PRIMARY KEY("id" AUTOINCREMENT))',
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