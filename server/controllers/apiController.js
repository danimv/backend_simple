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
      stmt.run(users[i].idUsuari, users[i].dataAlta, users[i].dataActualitzacio, users[i].nom, users[i].cognoms, users[i].email, users[i].telefon, users[i].coeficient, users[i].estat, users[i].comentaris);
    }
    stmt.finalize();
    if (!err) {  
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      const body = {
        result: 'OK',
        strMsg: 'Usuaris actualitzat',
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
//   {"idUsuari":"1021","nom":"Aron", "cognoms":"marquez", "telefon":"628611940"},
//   {"idUsuari":"1023","nom":"kia", "cognoms":"pepa", "telefon":"64343423"},
//   {"idUsuari":"1024","nom":"qa", "cognoms":"nina", "telefon":"984432234"}
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