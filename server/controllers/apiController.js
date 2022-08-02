let sqlite3 = require('sqlite3').verbose();//'server/controllers/comunitat.db';//
const fs = require('fs');
var request = require('request');
var crypto = require('crypto');
var base64url = require('base64url');
const exportedC = require('../controllers/userController');
const exportedD = require('../db/dbDriver');
const location = exportedD.dbLocation();
const locationBackup = exportedD.dbLocationBackup();
let conn = exportedD.dbConnection();

// Vinculació comunitat amb servidor extern
exports.init = (req, res) => {
  var { idComunitat, nomComunitat, comentaris } = req.body;
  token = req.headers.authorization;
  // backupDb();
  // deleteTable('comunitat');
  // Sqlite connexió 
  if (nomComunitat && idComunitat) {
    nomComunitat = nomComunitat.toUpperCase();
    conn.all('INSERT INTO comunitat(idComunitat, nomComunitat, comentaris, sync) VALUES (?,?,?,?)', [idComunitat, nomComunitat, comentaris, 1], (err, rows) => {
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
    httpResponse(req, res, 400, 'KO', 'Comunitat no vinculada. Falta idComunitat o nomComunitat');
  }
}
// {"idComunitat":"1",
// "nomComunitat":"Cornella del Terri"}

// Vinculació dades del servidor extern
exports.update = (req, res) => {
  data = exportedC.calcularData();
  var { users, idComunitat } = req.body;
  console.log(req.headers);
  console.log(req.headers.authorization);
  token = req.headers.authorization;
  if (idComunitat && users[0] && users[0].idUsuari) {// && users[0].coeficient && users[0].vinculat) {
    conn.all('SELECT * FROM comunitat ORDER BY id DESC LIMIT 1', (err, rows) => {
      if (!err) {
        if (rows[0] && rows[0].idComunitat == idComunitat) {//} && rows[0].hashtag == hashtag) {
          backupDb();
          deleteTable('usuari');
          conn.serialize(function (err, rows) {
            let stmt = conn.prepare('INSERT INTO usuari(idUsuari,dataAlta, dataActualitzacio, nom, cognoms, email, telefon, coeficient, estat, vinculat, comentaris) VALUES(?,?,?,?,?,?,?,?,?,?,?)');
            for (let i = 0; i < users.length; i++) {
              coeficient = users[i].coeficient;
              coeficient = coeficient.replace(",", ".");
              stmt.run(users[i].idUsuari, users[i].dataAlta, data, users[i].nom, users[i].cognoms, users[i].email, users[i].telefon, coeficient, users[i].estat, users[i].vinculat, users[i].comentaris);
            }
            stmt.finalize();
            checkCoeficients(data);
            if (!err) {
              httpResponse(req, res, 200, 'OK', 'Usuaris actualitzats');
            } else {
              httpResponse(req, res, 400, 'KO', 'Usuaris no actualitzats. Error base de dades ' + err);
              console.log(err);
            }
          });
        } else {
          httpResponse(req, res, 400, 'KO', 'Usuaris no actualitzats. No coincideixen idComunitat');
        }
      } else {
        httpResponse(req, res, 400, 'KO', 'Usuaris no actualitzats. Error base de dades: ' + err);
      }
    });
  } else {
    httpResponse(req, res, 400, 'KO', 'Usuaris no actualitzats. Falta idComunitat o usuaris');
  }
}
// { "idComunitat":"1",
//   "users":[
//   {"idUsuari":"1001","nom":"A", "cognoms":"M", "telefon":"628611940", "coeficient":"0,755", "estat":"1", "vinculat":"1"},
//    {"idUsuari":"1002","nom":"T", "cognoms":"C", "telefon":"64343423", "coeficient":"0.98","estat":"1","vinculat":"0"},
//    {"idUsuari":"1003","nom":"J", "cognoms":"O", "telefon":"984432234", "coeficient":"0,33","estat":"1","vinculat":"0"}
//  ]
//  }

// // Usuari vinculat a la app
// exports.startUser = (req, res) => {
//   var { idUsuari, idComunitat } = req.body;
//   console.log(req.headers);
//   console.log(req.headers.authorization);
//   token = req.headers.authorization;
//   if (idComunitat && idUsuari) {
//     conn.all('SELECT * FROM comunitat ORDER BY id DESC LIMIT 1', (err, rows) => {
//       if (!err) {
//         if (rows[0].idComunitat == idComunitat) {//} && rows[0].hashtag == hashtag) {
//           // Sqlite connexió   
//           conn.all('UPDATE usuari SET vinculat = ? WHERE idUsuari = ?', ["1", idUsuari], (err, rows) => {
//             if (!err) {
//               httpResponse(req, res, 200, 'OK', 'Usuari vinculat');
//             } else {
//               httpResponse(req, res, 400, 'KO', 'Usuari no vinculat. Error base de dades: ' + err);
//               console.log(err);
//             }
//           });
//         } else {
//           httpResponse(req, res, 400, 'KO', 'Usuari no vinculat. No coincideix idComunitat');
//         }
//       } else {
//         httpResponse(req, res, 400, 'KO', 'Usuari no vinculat. Error base de dades: ' + err);
//       }
//     });
//   } else {
//     httpResponse(req, res, 400, 'KO', 'Usuari no vinculat. Falta idComunitat o idUsuari');
//   }
// }

// // Sincronitzar usuaris amb servidor extern
// exports.sync = (req, res) => {
//   conn.all('SELECT * FROM usuari WHERE idUsuari > 2000 ORDER BY idUsuari ASC', (err, rows) => {
//     if (!err) {
//       // console.log(rows);
//       var postData = rows.map((sqliteObj, index) => {
//         return Object.assign({}, sqliteObj);
//       });
//       // console.log(postData);
//       httpRequest(postData, 'httpbin.org', '/post', 'POST', function getResponse(responseBody) {
//         console.log(responseBody.statusCode);
//         console.log(responseBody);
//         conn.all('UPDATE comunitat SET sync =? WHERE id = (SELECT max(id) FROM comunitat)', [0], (err, rows) => {
//           if (!err) {
//             let alert = req.query.alert;
//             let alert3 = 'Usuaris sincronitzats correctament amb el servidor extern';
//             exportedC.calculaCoeficient(function getCoeficient(result) {
//               alert2 = result[1];
//               cT = result[0];
//               res.redirect('/usuaris/?alert3=' + `Usuaris sincronitzats correctament amb el servidor extern`);
//             });
//           } else {
//             console.log(err);
//           }
//         });
//       });
//     } else {
//       alert1 = 'No es pot sincronitzar amb el servidor extern"';
//       res.render('usuaris', { alert1 });
//       console.log(err);
//     }
//   });
// }


// Vinculació comunitat amb servidor extern
exports.mode = (req, res) => {
  console.log("mode");
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
  });
  res.redirect(req.get('referer'));
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
function checkCoeficients(data) {
  let found = false;
  // Sqlite connexió 
  conn.all('SELECT * FROM usuari', (err, rows) => {
    conn.all('SELECT * FROM coeficient ORDER BY idCoeficient DESC', (err, rows2) => {
      rows.forEach(row => {
        rows2.forEach(row2 => {
          if (row.idUsuari == row2.idUsuari) {
            if (row2.coeficient == row.coeficient) {
              console.log(row.coeficient);
              console.log(row2.coeficient);
              //conn.all('UPDATE coeficient SET coeficient = ?, data = ? WHERE idUsuari = ?', [row.coeficient, row.data, row.idUsuari], (err, rows4) => {
              // });
              found = true;
            }

          }
        });
        if (found == false) {
          conn.all('INSERT INTO coeficient(idUsuari, coeficient, data, comentaris, estat) VALUES (?,?,?,?,?)', [row.idUsuari, row.coeficient, data, row.comentaris, row.estat], (err, rows4) => {
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
  console.log(responseBody);
  res.write(JSON.stringify(responseBody));
  res.end();
}

// HTTP request a servidor extern
function httpRequest(postData, clientHost, clientContext, requestType, callback) {
  var clientServerOptions = {
    uri: 'http://' + clientHost + '' + clientContext,
    body: JSON.stringify(postData),
    method: requestType,
    headers: {
      'Content-Type': 'application/json',
      "Authorization": base64url(crypto.randomBytes(20))
    }
  }
  request(clientServerOptions, function (error, response) {
    // console.log(error, response.body);
    callback(response);
    return;
  });
}