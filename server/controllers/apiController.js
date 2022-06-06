let sqlite3 = require('sqlite3').verbose();//'server/controllers/comunitat.db';//
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || 'server/controllers/comunitat.db';// 'home/root/db_app/comunitat.db';
const locationBackup = process.env.SQLITE_DB_LOCATION || 'server/controllers/comunitat_backup.db';// 'home/root/db_app/comunitat.db';
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
  const { headers, method, url } = req;
  var { hashtag, idComunitat, nomComunitat, comentaris } = req.body;
  // Sqlite connexió 
  conn.all('INSERT INTO comunitat(idComunitat, hashtag, nomComunitat, comentaris) VALUES (?,?,?,?)', [idComunitat, hashtag, nomComunitat, comentaris], (err, rows) => {
    if (!err) {
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
// {"hashtag":"fdsfrcewrcew",
// "idComunitat":"1000",
// "nomComunitat":"Cornella del Terri"}

// Vinculació comunitat amb servidor extern
exports.update = (req, res) => {
  const { headers, method, url } = req;
  var { users } = req.body;
  backupDb();
  deleteUsuaris();
  conn.serialize(function (err, rows) {
    let stmt = conn.prepare('INSERT INTO usuari(idUsuari,dataAlta, dataActualitzacio, nom, cognoms, email, telefon, coeficient, estat, comentaris) VALUES(?,?,?,?,?,?,?,?,?,?)');
    for (let i = 0; i < users.length; i++) {
      coeficient = users[i].coeficient;
      coeficient = coeficient.replace(",", ".");
      stmt.run(users[i].idUsuari, users[i].dataAlta, users[i].dataActualitzacio, users[i].nom, users[i].cognoms, users[i].email, users[i].telefon, coeficient, users[i].estat, users[i].comentaris);
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
}
// { "users":[
//   {"idUsuari":"1030","nom":"Aron", "cognoms":"marquez", "telefon":"628611940", "coeficient":"0,255", "estat":"Actiu"},
//   {"idUsuari":"1028","nom":"kia", "cognoms":"pepa", "telefon":"64343423", "coeficient":"0,88","estat":"Actiu"},
//   {"idUsuari":"1034","nom":"qa", "cognoms":"nina", "telefon":"984432234", "coeficient":"0,33","estat":"Baixa"}
// ]
// }

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