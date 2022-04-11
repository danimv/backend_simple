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
  conn.all('SELECT * FROM usuari ORDER BY idUsuari ASC', (err, rows) => {
    // Si no hi ha error 
    if (!err) {
      let alert = req.query.alert;
      let alert3 = req.query.alert3;
      calculaCoeficient(function getData(result) {
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
      calculaCoeficient(function getData(result) {
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
  calculaCoeficient(function getData(result) {
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
  assignarIdUsuari(function getData(result2) {
    idUsuari = result2;
    conn.all('INSERT INTO usuari(idUsuari, nom, cognoms, email, telefon, coeficient, estat, comentaris, dataAlta, dataActualitzacio) VALUES (?,?,?,?,?,?,?,?,?,?)', [idUsuari, nom, cognoms, email, telefon, coeficient, estat, comentaris, data, data], (err, rows) => {
      if (!err) {
        conn.all('INSERT INTO coeficient(idUsuari, coeficient, data) VALUES (?,?,?)', [idUsuari, coeficient, data], (err, rows) => {
          if (!err) {
            calculaCoeficient(function getData(result) {
              alert2 = result[1];
              cT = result[0];
              res.redirect('/?alert3=' + `S'ha creat correctament un usuari nou: ${nom} ${cognoms}`);
            });
          } else {
            console.log(err);
          }
        });
      } else {
        console.log(err);
      }
      console.log('Editant l`usuari');
    });
  });
}

// Editar usuari
exports.edit = (req, res) => {
  // Select Sqlite
  conn.all('SELECT * FROM usuari WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      calculaCoeficient(function getData(result) {
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
  coeficient = coeficient.replace(",", ".");
  // Update Sqlite
  conn.all('UPDATE usuari SET nom = ?, cognoms = ?, email = ?, telefon = ?, coeficient = ?, estat = ?, comentaris = ?, dataActualitzacio = ? WHERE id = ?', [nom, cognoms, email, telefon, coeficient, estat, comentaris, data2, req.params.id], (err, rows) => {
    // Si no hi ha error        
    if (!err) {
      conn.all('INSERT INTO coeficient(id, coeficient, data) VALUES (?,?,?)', [1, coeficient, data], (err, rows) => {
        if (!err) {
          calculaCoeficient(function getData(result) {
            conn.all('SELECT * FROM usuari WHERE id = ?', [req.params.id], (err, rows) => {
              if (!err) {
                calculaCoeficient(function getData(result) {
                  alert2 = result[1];
                  cT = result[0];
                  // res.render('edit-user', { rows, alert3: `L'usuari ${nom} s'ha actualitzat.`, alert2 });
                  res.redirect('/?alert3=' + `Les dades de l'usuari ${nom} ${cognoms} s'han actualitzat correctament`);
                });
              } else {
                console.log(err);
              }
            });
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
  conn.all('UPDATE usuari SET estat = ?, idUsuari = ? WHERE id = ?', ['Baixa',0, req.params.id], (err, rows) => {
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
  conn.all('SELECT * FROM usuari WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      conn.all('SELECT * FROM coeficient WHERE id = ?', [req.params.id], (err, rows2) => {
        if (!err) {
          calculaCoeficient(function getData(result) {
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
  conn.all('SELECT idUsuari + 1 FROM usuari WHERE NOT EXISTS (SELECT 1 FROM usuari t2 WHERE t2.idUsuari = usuari.idUsuari + 1);', (err, rows) => {
    let result2;
    result2 = rows[0]["idUsuari + 1"];
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

