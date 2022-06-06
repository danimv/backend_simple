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
      res.render('comunitat');
    }
  });
}
exports.view2 = (req, res) => {
  res.render('config_comunitat');
}
exports.interrupcions = (req, res) => {
  res.render('interrupcions');
}

exports.crearBd = (req, res) => {
  checkFileExists(location, function check(error) {
    if (!error) {
      conn.all(
        'CREATE TABLE IF NOT EXISTS usuari (idUsuari INTEGER, dataAlta TEXT, dataActualitzacio TEXT, nom TEXT, cognoms TEXT, email TEXT, telefon INTEGER, coeficient INTEGER, estat TEXT, vinculat TEXT, comentaris TEXT, PRIMARY KEY("idUsuari" AUTOINCREMENT))',
        (err, result) => {
          if (!err) {
            conn.all(
              'CREATE TABLE IF NOT EXISTS coeficient (idCoeficient INTEGER, idUsuari INTEGER, data TEXT, coeficient INTEGER, estat TEXT, comentaris TEXT, PRIMARY KEY("idCoeficient" AUTOINCREMENT))',
              (err, result2) => {
                if (!err) {
                  conn.all(
                    'CREATE TABLE IF NOT EXISTS comunitat (id INTEGER, idComunitat INTEGER, hashtag TEXT, nomComunitat TEXT, comentaris TEXT, PRIMARY KEY("id" AUTOINCREMENT))',
                    (err, result3) => {
                      res.render('config_comunitat');
                    });
                } else {
                  console.log(err);
                }
              });
          } else {
            res.render('config_comunitat');
            console.log(err);
          }
        },
      );
    } else {
      // fs.open(location, 'w', function (err, file) {
      //   if (err) { console.log(err); } else {
      //     console.log('File is created');
      //   }
      // });

      // var createStream = fs.createWriteStream(location);
      // createStream.end();
      res.render('comunitat');
    }
  });
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