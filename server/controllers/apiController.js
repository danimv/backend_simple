let sqlite3 = require('sqlite3').verbose();//'server/controllers/comunitat.db';//
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || 'server/controllers/comunitat.db';// 'home/root/db_app/comunitat.db';
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
        data: message,
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

  // Sqlite connexió 
  // conn.all('INSERT INTO usuari(idComunitat, hashtag, nomComunitat, comentaris) VALUES (?,?,?,?)', [idComunitat, hashtag, nomComunitat, comentaris], (err, rows) => {
  //   if (!err) {
  //     res.statusCode = 200;
  //     res.setHeader('Content-Type', 'application/json');
  //     const body = {
  //       result: 'OK',
  //       strMsg: 'Comunitat vinculada',
  //       data: req.body,
  //     }
  //     const responseBody = { headers, method, url, body };
  //     res.write(JSON.stringify(responseBody));
  //     res.end();
  //   } else {
  //     res.statusCode = 400;
  //     res.setHeader('Content-Type', 'application/json');
  //     const body = {
  //       result: 'KO',
  //       strMsg: 'Comunitat NO vinculada. ' + err,
  //       data: message,
  //     }
  //     const responseBody = { headers, method, url, body };
  //     res.write(JSON.stringify(responseBody));
  //     res.end();
  //     console.log(err);
    // }
  // });
}

//Funcio calcul coeficient
function backupDb(callback) {
  // File destination.txt will be created or overwritten by default.
  fs.copyFile('server/controllers/comunitat.db', 'server/controllers/comunitat_backup.db', (err) => {
    if (err) console.log(err);
    console.log('backup feta de comunitat.db');
    callback(err);
  });
}