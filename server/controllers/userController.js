let sqlite3 = require('sqlite3').verbose();
let conn = new sqlite3.Database('server/controllers/comunitat.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to database.');
});

// Vista usuaris
exports.view = (req, res) => {
  let alert2 = false;
  // Sqlite connexió 
  conn.all('SELECT * FROM usuari ORDER BY idComunitat ASC', (err, rows) => {
    // Si no hi ha error 
    if (!err) {
      let alert = req.query.alert;
      let alert3 = req.query.alert3;
      calculaCoeficient(function getCoeficient(result) {
        alert2 = result[1];
        cT = result[0];
        res.render('home', { rows, alert, alert2, alert3, cT });
      });
    } else {
      console.log(err);
    }
  });
}

// Buscar usuari
exports.find = (req, res) => {
  let searchTerm = req.body.search;
  // Select Sqlite
  conn.all('SELECT * FROM usuari WHERE nom LIKE ? OR cognoms LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
    if (!err) {
      calculaCoeficient(function getCoeficient(result) {
        alert2 = result[1];
        cT = result[0];
        if (rows.length == 0) {
          msg = 'No hi ha resultats per aquesta búsqueda: ';
        } else {
          msg = 'Es mostren els resultats de la búsqueda: ';
        }
        res.render('home', { rows, alert2, alert3: `${msg}` + `${searchTerm}` });
      });
    } else {
      console.log(err);
    }
    console.log('Les dades de la búsqueda');
  });
}

// Carregar la pagina afegir usuari
exports.form = (req, res) => {
  calculaCoeficient(function getCoeficient(result) {
    alert2 = result[1];
    cT = result[0];
    res.render('add-user', { alert2 });
  });
}

// Afegir usuari
exports.create = (req, res) => {
  var { nom, cognoms, email, telefon, coeficient, estat, comentaris } = req.body;
  data = calcularData();
  coeficient = coeficient.replace(",", ".");
  // Calcular id usuari i Insert Sqlite
  assignarIdUsuari(function getId(result2) {
    processSqlite(result2);
  });
  function processSqlite(idComunitat) {
    conn.all('INSERT INTO usuari(idComunitat, nom, cognoms, email, telefon, coeficient, estat, comentaris, dataAlta, dataActualitzacio) VALUES (?,?,?,?,?,?,?,?,?,?)', [idComunitat, nom, cognoms, email, telefon, coeficient, estat, comentaris, data, data], (err, rows) => {
      if (!err) {
        conn.all('SELECT idUsuari FROM usuari WHERE idComunitat = ?', [idComunitat], (err, rows) => {
          conn.all('INSERT INTO coeficient(idUsuari, coeficient, data) VALUES (?,?,?)', [rows[0].idUsuari, coeficient, data], (err, rows) => {
            if (!err) {
              calculaCoeficient(function getCoeficient(result) {
                alert2 = result[1];
                cT = result[0];
                res.redirect('/?alert3=' + `S'ha creat correctament un usuari nou: ${nom} ${cognoms}`);
              });
            } else {
              console.log(err);
            }
          });
        });
      } else {
        console.log(err);
      }
      console.log('Editant l`usuari');
    });
  }
}

// Editar usuari
exports.edit = (req, res) => {
  // Select Sqlite
  conn.all('SELECT * FROM usuari WHERE idUsuari = ?', [req.params.idUsuari], (err, rows) => {
    if (!err) {
      calculaCoeficient(function getCoeficient(result) {
        alert2 = result[1];
        cT = result[0];
        res.render('edit-user', { rows, alert2 });
      });
    } else {
      console.log(err);
    }
    console.log('Les dades de l`usuari');
  });
}

// Actualitzar usuari
exports.update = (req, res) => {
  var { nom, cognoms, email, telefon, coeficient, estat, comentaris } = req.body;
  data = calcularData();
  idComunitat = req.params.idComunitat;
  coeficient = coeficient.replace(",", ".");
  if ((idComunitat == '--' || idComunitat == null) & estat == 'Actiu') {
    assignarIdUsuari(function getId(result2) {
      console.log(result2);
      processSqlite(result2);
    });
  } else {
    processSqlite(idComunitat)
  }
  // console.log(idUsuari);
  // Update Sqlite
  function processSqlite(idComunitat) {
    conn.all('SELECT coeficient FROM usuari WHERE idUsuari = ?', [req.params.idUsuari], (err, rows) => {
      if (!err) {
        console.log(req.params.idUsuari);
        console.log(rows[0].coeficient);
        console.log(coeficient);
        if (rows[0].coeficient != coeficient) {
          actualitzarHistoricCoeficients();
        }
        conn.all('UPDATE usuari SET idComunitat = ?, nom = ?, cognoms = ?, email = ?, telefon = ?, coeficient = ?, estat = ?, comentaris = ?, dataActualitzacio = ? WHERE idUsuari = ?', [idComunitat, nom, cognoms, email, telefon, coeficient, estat, comentaris, data, req.params.idUsuari], (err, rows) => {
          // Si no hi ha error        
          if (!err) {
            calculaCoeficient(function getCoeficient(result) {
              alert2 = result[1];
              cT = result[0];
              res.redirect('/?alert3=' + `Les dades de l'usuari ${nom} ${cognoms} s'han actualitzat correctament`);
            });
          } else {
            console.log(err);
          }
        });
      } else {
        console.log(err);
      }
      console.log('Actualitzant usuari');
    });
    function actualitzarHistoricCoeficients() {
      conn.all('INSERT INTO coeficient(idUsuari, coeficient, data, comentaris) VALUES (?,?,?)', [req.params.idUsuari, coeficient, data, comentaris], (err, rows) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }
}

// Delete User
exports.delete = (req, res) => {
  // Delete a record
  // User the connection
  // connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {
  //   if(!err) {
  //     res.redirect('/');
  //   } else {
  //     console.log(err);
  //   }
  //   console.log('The data from user table: \n', rows);
  // });
  // Hide a record
  conn.all('UPDATE usuari SET estat = ?, idUsuari = ? WHERE idUsuari = ?', ['Baixa', '--', req.params.idUsuari], (err, rows) => {
    if (!err) {
      let removedUser = encodeURIComponent('Usuari donat de baixa.');
      res.redirect('/?alert=' + `S'ha donat de baixa a l'usuari`);
    } else {
      console.log(err);
    }
    console.log(`L'usuari s'ha donat de baixa`);
  });

}

// Vista usuari
exports.viewall = (req, res) => {
  // Select Sqlite
  conn.all('SELECT * FROM usuari WHERE idUsuari = ?', [req.params.idUsuari], (err, rows) => {
    if (!err) {
      conn.all('SELECT * FROM coeficient WHERE idUsuari = ?', [req.params.idUsuari], (err, rows2) => {
        if (!err) {
          calculaCoeficient(function getCoeficient(result) {
            alert2 = result[1];
            cT = result[0];
            res.render('view-user', { rows, rows2, alert2, cT });
          });
        } else {
          console.log(err);
        }
        console.log('Dades de l`usuari');
      });
    } else {
      console.log(err);
    }
    console.log('Dades de l`usuari');
  });
}

//Funcio calcul coeficient
function calculaCoeficient(callback) {
  conn.all('SELECT * FROM usuari WHERE estat = "Actiu"', (err, rows) => {
    let result = [];
    cT = 0;
    // Calcul coeficient total
    rows.forEach(row => {
      cT = cT + row.coeficient;
    });
    cT = cT.toFixed(5);
    result[0] = cT;
    if (cT > 1 || cT < 1) {
      result[1] = true;
    } else {
      result[1] = false;
    }
    callback(result);
  });
}

//Funcio calcul coeficient
function assignarIdUsuari(callback2) {
  conn.all('SELECT idComunitat + 1 FROM usuari WHERE NOT EXISTS (SELECT 1 FROM usuari t2 WHERE t2.idComunitat = usuari.idComunitat + 1);', (err, rows) => {
    let result2;
    result2 = rows[0]["idComunitat + 1"];
    if (result2 == null || result2 == '') {
      result2 = 999;
    }
    // console.log(result2);   
    callback2(result2);
  });
}

// assignarIdUsuari();

//Funcio calcul data
function calcularData() {
  const data = new Date();
  const year = data.getFullYear() * 100000000;
  const month = (data.getMonth() + 1) * 1000000;
  const day = data.getDate() * 10000;
  const hour = data.getHours() * 100;
  const min = data.getMinutes();
  const data2 = year + month + day + hour + min + ''
  return data2;
}

