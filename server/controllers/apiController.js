let sqlite3 = require('sqlite3').verbose();//'server/controllers/comunitat.db';//
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || 'server/controllers/comunitat.db';//'home/root/db_app/comunitat.db';
const locationBackup = process.env.SQLITE_DB_LOCATION || 'server/controllers/comunitat_backup.db';//'home/root/db_app/comunitat_backup.db';
const dirName = require('path').dirname(location);

if (!fs.existsSync(dirName)) {
  fs.mkdirSync(dirName, { recursive: true });
}
let conn = new sqlite3.Database(location, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to database.');
  }
});

// Vinculació comunitat amb servidor extern
exports.init = (req, res) => {
  const { headers, method, url } = req;
  var { hashtag, idComunitat, nomComunitat, comentaris } = req.body;
  // Sqlite connexió 
  nomComunitat = nomComunitat.toUpperCase();
  conn.all('INSERT INTO comunitat(idComunitat, hashtag, nomComunitat, comentaris) VALUES (?,?,?,?)', [idComunitat, hashtag, nomComunitat, comentaris], (err, rows) => {
    if (!err) {
      idUsuari = idComunitat * 1000;
      conn.all('INSERT INTO usuari(idUsuari, nom, coeficient, estat) VALUES (?,?,?,?)', [idUsuari, "Administrador", 0, "Baixa"], (err, result1) => {
      });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      const body = {
        result: 'OK',
        strMsg: 'Comunitat vinculada',
        data: req.body,
      }
      const responseBody = { headers, method, url, body };
      res.write(JSON.stringify(responseBody));
      res.end();
    } else {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      const body = {
        result: 'KO',
        strMsg: 'Comunitat NO vinculada. ' + err,
        data: req.body,
      }
      const responseBody = { headers, method, url, body };
      res.write(JSON.stringify(responseBody));
      res.end();
      console.log(err);
    }
  });
}
// {"hashtag":"abcd",
// "idComunitat":"1",
// "nomComunitat":"Cornella del Terri"}

// Vinculació comunitat amb servidor extern
exports.update = (req, res) => {
  const { headers, method, url } = req;
  var { users, idComunitat, hashtag } = req.body;
  conn.all('SELECT * FROM comunitat ORDER BY id DESC LIMIT 1', (err, rows) => {
    if (!err) {
      if (rows[0].idComunitat == idComunitat && rows[0].hashtag == hashtag) {
        backupDb();
        deleteUsuaris();
        conn.serialize(function (err, rows) {
          let stmt = conn.prepare('INSERT INTO usuari(idUsuari,dataAlta, dataActualitzacio, nom, cognoms, email, telefon, coeficient, estat, vinculat, comentaris) VALUES(?,?,?,?,?,?,?,?,?,?,?)');
          for (let i = 0; i < users.length; i++) {
            coeficient = users[i].coeficient;
            coeficient = coeficient.replace(",", ".");
            if (users[i].vinculat == 1) {
              vinculat = "Sí";
            } else {
              vinculat = "No";
            }
            stmt.run(users[i].idUsuari, users[i].dataAlta, users[i].dataActualitzacio, users[i].nom, users[i].cognoms, users[i].email, users[i].telefon, coeficient, users[i].estat, vinculat, users[i].comentaris);
          }
          stmt.finalize();
          checkCoeficients();
          if (!err) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            const body = {
              result: 'OK',
              strMsg: 'Usuaris actualitzats',
              data: req.body,
            }
            const responseBody = { headers, method, url, body };
            res.write(JSON.stringify(responseBody));
            res.end();
          } else {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            const body = {
              result: 'KO',
              strMsg: 'Usuaris NO actualitzats. ' + err,
              data: req.body,
            }
            const responseBody = { headers, method, url, body };
            res.write(JSON.stringify(responseBody));
            res.end();
            console.log(err);
          }
        });
      }else{
        console.log("no coincideixen idcomunitat o hashtag");
      }
    }
  });
}
// { "idComunitat":"1",
//  "hashtag":"abcd",
//   "users":[
//   {"idUsuari":"1011","nom":"Aron", "cognoms":"marquez", "telefon":"628611940", "coeficient":"0,755", "estat":"Actiu", "vinculat":"1"},
//    {"idUsuari":"1012","nom":"kia", "cognoms":"pepa", "telefon":"64343423", "coeficient":"0.98","estat":"Actiu","vinculat":"0"},
//    {"idUsuari":"10104","nom":"qa", "cognoms":"nina", "telefon":"984432234", "coeficient":"0,33","estat":"Baixa","vinculat":"1"}
//  ]
//  }

// Usuari vinculat a la app
exports.startUser = (req, res) => {
  const { headers, method, url } = req;
  var { idUsuari } = req.body;
  // Sqlite connexió   
  conn.all('UPDATE usuari SET vinculat = ? WHERE idUsuari = ?', ["Sí", idUsuari], (err, rows) => {
    if (!err) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      const body = {
        result: 'OK',
        strMsg: 'Usuari vinculat',
        data: req.body,
      }
      const responseBody = { headers, method, url, body };
      res.write(JSON.stringify(responseBody));
      res.end();
    } else {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      const body = {
        result: 'KO',
        strMsg: 'Usuari NO vinculat. ' + err,
        data: req.body,
      }
      const responseBody = { headers, method, url, body };
      res.write(JSON.stringify(responseBody));
      res.end();
      console.log(err);
    }
  });
}


//Funcio backup db
function backupDb() {
  // File destination.txt will be created or overwritten by default.
  fs.copyFile(location, locationBackup, (err) => {
    if (err) console.log(err);
    console.log('Backup feta de comunitat.db');
  });
}

function deleteUsuaris() {
  // Sqlite connexió 
  conn.all('DELETE FROM usuari', (err, rows) => {
    // Si no hi ha error 
    if (!err) {
      console.log('Dades usuaris borrades');
    } else {
      console.log(err);
    }
  });
}

function checkCoeficients() {
  let found = false;
  // Sqlite connexió 
  conn.all('SELECT * FROM usuari', (err, rows) => {
    conn.all('SELECT * FROM coeficient', (err, rows2) => {
      rows.forEach(row => {
        rows2.forEach(row2 => {
          if (row.idUsuari == row2.idUsuari) {
            if (row2.coeficient != row.coeficient) {
              conn.all('UPDATE coeficient SET coeficient = ?, data = ? WHERE idUsuari = ?', [row.coeficient, row.data, row.idUsuari], (err, rows4) => {
              });
            }
            found = true;
          }
        });
        if (found == false) {
          conn.all('INSERT INTO coeficient(idUsuari, coeficient, data, comentaris, estat) VALUES (?,?,?,?,?)', [row.idUsuari, row.coeficient, row.data, row.comentaris, row.estat], (err, rows4) => {
            if (err) {
              console.log(err);
            }
          });
        }
        found = false;
      });
    });
  });
}

