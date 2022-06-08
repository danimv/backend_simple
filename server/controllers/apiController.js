let sqlite3 = require('sqlite3').verbose();//'server/controllers/comunitat.db';//
const fs = require('fs');
var request = require('request');
const exportedC = require('../controllers/userController');
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
  var { hashtag, idComunitat, nomComunitat, comentaris } = req.body;
  // backupDb();
  // deleteTable('comunitat');
  // Sqlite connexió 
  if (nomComunitat && hashtag && idComunitat) {
    nomComunitat = nomComunitat.toUpperCase();
    conn.all('INSERT INTO comunitat(idComunitat, hashtag, nomComunitat, comentaris, sync) VALUES (?,?,?,?,?)', [idComunitat, hashtag, nomComunitat, comentaris, 1], (err, rows) => {
      if (!err) {
        idUsuari = idComunitat * 1000;
        conn.all('INSERT INTO usuari(idUsuari, nom, coeficient, estat) VALUES (?,?,?,?)', [idUsuari, "Administrador", 0, 0], (err, result1) => {
        });
        httpResponse(req, res, 200, 'OK', 'Comunitat vinculada');
      } else {
        httpResponse(req, res, 400, 'KO', 'Comunitat no vinculada. Error base de dades: ' + err);
        console.log(err);
      }
    });
  } else {
    httpResponse(req, res, 400, 'KO', 'Comunitat no vinculada. Falta hashtag, idComunitat o nomComunitat');
  }
}
// {"hashtag":"abcd",
// "idComunitat":"1",
// "nomComunitat":"Cornella del Terri"}

// Vinculació dades del servidor extern
exports.update = (req, res) => {
  var { users, idComunitat, hashtag } = req.body;
  if (idComunitat && hashtag && users[0] && users[0].idUsuari && users[0].coeficient && users[0].vinculat) {
    conn.all('SELECT * FROM comunitat ORDER BY id DESC LIMIT 1', (err, rows) => {
      if (!err) {
        if (rows[0].idComunitat == idComunitat && rows[0].hashtag == hashtag) {
          backupDb();
          deleteTable('usuari');
          conn.serialize(function (err, rows) {
            let stmt = conn.prepare('INSERT INTO usuari(idUsuari,dataAlta, dataActualitzacio, nom, cognoms, email, telefon, coeficient, estat, vinculat, comentaris) VALUES(?,?,?,?,?,?,?,?,?,?,?)');
            for (let i = 0; i < users.length; i++) {
              coeficient = users[i].coeficient;
              coeficient = coeficient.replace(",", ".");
              stmt.run(users[i].idUsuari, users[i].dataAlta, users[i].dataActualitzacio, users[i].nom, users[i].cognoms, users[i].email, users[i].telefon, coeficient, users[i].estat, users[i].vinculat, users[i].comentaris);
            }
            stmt.finalize();
            checkCoeficients();
            if (!err) {
              httpResponse(req, res, 200, 'OK', 'Usuaris actualitzats');
            } else {
              httpResponse(req, res, 400, 'KO', 'Usuaris no actualitzats. Error base de dades ' + err);
              console.log(err);
            }
          });
        } else {
          httpResponse(req, res, 400, 'KO', 'Usuaris no actualitzats. No coincideixen idComunitat o Hashtag ');
        }
      } else {
        httpResponse(req, res, 400, 'KO', 'Usuaris no actualitzats. Error base de dades: ' + err);
      }
    });
  } else {
    httpResponse(req, res, 400, 'KO', 'Usuaris no actualitzats. Falta hashtag, idComunitat o usuaris');
  }
}
// { "idComunitat":"1",
//  "hashtag":"abcd",
//   "users":[
//   {"idUsuari":"1011","nom":"Aron", "cognoms":"marquez", "telefon":"628611940", "coeficient":"0,755", "estat":"0", "vinculat":"0"},
//    {"idUsuari":"1012","nom":"kia", "cognoms":"pepa", "telefon":"64343423", "coeficient":"0.98","estat":"1","vinculat":"0"},
//    {"idUsuari":"10104","nom":"qa", "cognoms":"nina", "telefon":"984432234", "coeficient":"0,33","estat":"Baixa","vinculat":"0"}
//  ]
//  }

// Usuari vinculat a la app
exports.startUser = (req, res) => {
  var { idUsuari, idComunitat, hashtag } = req.body;
  if (idComunitat && hashtag && idUsuari) {
    conn.all('SELECT * FROM comunitat ORDER BY id DESC LIMIT 1', (err, rows) => {
      if (!err) {
        if (rows[0].idComunitat == idComunitat && rows[0].hashtag == hashtag) {
          // Sqlite connexió   
          conn.all('UPDATE usuari SET vinculat = ? WHERE idUsuari = ?', ["1", idUsuari], (err, rows) => {
            if (!err) {
              httpResponse(req, res, 200, 'OK', 'Usuari vinculat');
            } else {
              httpResponse(req, res, 400, 'KO', 'Usuari no vinculat. Error base de dades: ' + err);
              console.log(err);
            }
          });
        } else {
          httpResponse(req, res, 400, 'KO', 'Usuari no vinculat. No coincideixen idComunitat o Hashtag ');
        }
      } else {
        httpResponse(req, res, 400, 'KO', 'Usuari no vinculat. Error base de dades: ' + err);
      }
    });
  } else {
    httpResponse(req, res, 400, 'KO', 'Usuari no vinculat. Falta hashtag, idComunitat o idUsuari');
  }
}

// Sincronitzar usuaris amb servidor extern
exports.sync = (req, res) => {
  conn.all('SELECT * FROM usuari WHERE idUsuari > 2000 ORDER BY idUsuari ASC', (err, rows) => {
    if (!err) {
      // console.log(rows);
      var postData = rows.map((sqliteObj, index) => {
        return Object.assign({}, sqliteObj);
      });
      // console.log(postData);
      syncUsers(postData, 'httpbin.org', '/post', 'POST', function getResponse(responseBody) {
        console.log(responseBody.statusCode);
        console.log(responseBody.body);
        conn.all('UPDATE comunitat SET sync =? WHERE id = (SELECT max(id) FROM comunitat)', [0], (err, rows) => {
          if (!err) {
            let alert = req.query.alert;
            let alert3 = 'Usuaris sincronitzats correctament amb el servidor extern';
            exportedC.calculaCoeficient(function getCoeficient(result) {
              alert2 = result[1];
              cT = result[0];
              res.redirect('/usuaris/?alert3=' + `Usuaris sincronitzats correctament amb el servidor extern`);
            });
          } else {
            console.log(err);
          }
        });
      });
    } else {
      alert1 = 'No es pot sincronitzar amb el servidor extern"';
      res.render('usuaris', { alert1 });
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

//Esborrar usuaris de la taula
function deleteTable(table) {
  // Sqlite connexió 
  conn.all('DELETE FROM ' + [table], (err, rows) => {
    // Si no hi ha error 
    if (!err) {
      console.log('Dades usuaris borrades');
    } else {
      console.log(err);
    }
  });
}

// Comprovar si s'ha d'actualitzar la taula de coeficients
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

// Resposta http
function httpResponse(req, res, code, strResult, msg) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  const body = {
    result: strResult,
    strMsg: msg,
    data: req.body,
  }
  headers = req.headers;
  method = req.method;
  url = req.url;
  const responseBody = { headers, method, url, body };
  res.write(JSON.stringify(responseBody));
  res.end();
}

// HTTP request a servidor extern
function syncUsers(postData, clientHost, clientContext, requestType, callback) {
  var clientServerOptions = {
    uri: 'http://' + clientHost + '' + clientContext,
    body: JSON.stringify(postData),
    method: requestType,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  request(clientServerOptions, function (error, response) {
    // console.log(error, response.body);
    callback(response);
    return;
  });
}