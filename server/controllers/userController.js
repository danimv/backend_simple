let sqlite3 = require('sqlite3').verbose();
let conn = new sqlite3.Database('server/controllers/comunitat.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to database.');
});

// View Users
exports.view = (req, res) => {
      let alert2 = false;
      // Calcul coeficient total
      var coeficientTotal = calculaCoeficient();
      console.log( coeficientTotal);
      if(coeficientTotal>1 || coeficientTotal<1) {
        alert2 = true;
      } else{
        alert2 = false;
      } 
  // Sqlite connection 
  conn.all('SELECT * FROM usuari', (err, rows) => {    
     // When done with the connection, release it
    if (!err) {      
      let alert = req.query.removed;         
      res.render('home', {rows, alert, alert2, coeficientTotal});
    } else {
      console.log(err);
    }
    //console.log('fsd \n', rows);
  });
}

// Find User by Search
exports.find = (req, res) => {
  let searchTerm = req.body.search;
  // User the connection
  conn.all('SELECT * FROM usuari WHERE nom LIKE ? OR cognoms LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
    if (!err) {
      res.render('home', { rows });
    } else {
      console.log(err);
    }
    console.log('Les dades de la búsqueda');
  });
}

exports.form = (req, res) => {
  res.render('add-user');
}

// Add new user
exports.create = (req, res) => {
  const { nom, cognoms, email, telefon, coeficient, estat, comentaris} = req.body;
  let searchTerm = req.body.search;
  if(coeficient>1 || coeficient<0 || coeficient ==''){
    //res.render('add-user', { alert2: 'Error. Indica un coeficient entre 0 i 1' });
  }else{
  // User the connection
    const data = new Date();  
    const year = data.getFullYear() * 100000000; 
    const month = (data.getMonth() + 1) * 1000000;
    const day = data.getDate() * 10000; 
    const hour = data.getHours() * 100;
    const min = data.getMinutes();
    const data2 = year + month + day + hour + min + ''
    conn.all('INSERT INTO usuari(nom, cognoms, email, telefon, coeficient, estat, comentaris, dataAlta, dataActualitzacio) VALUES (?,?,?,?,?,?,?,?,?)', [nom, cognoms, email, telefon, coeficient, estat, comentaris, data2, data2], (err, rows) => {  
    if (!err) {
      res.render('add-user', { alert: 'Usuari afegit correctament.' });
    } else {
      console.log(err);
    }
    console.log('Editant l`usuari');
  });
}
}
  
// Edit user
exports.edit = (req, res) => {
  // User the connection
  conn.all('SELECT * FROM usuari WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('edit-user', { rows });
    } else {
      console.log(err);
    }
    console.log('Les dades de l`usuari');
  });
}

// Update User
exports.update = (req, res) => {
  const { nom, cognoms, email, telefon, coeficient, estat, comentaris } = req.body;
  const data = new Date();  
    const year = data.getFullYear() * 100000000; 
    const month = (data.getMonth() + 1) * 1000000;
    const day = data.getDate() * 10000; 
    const hour = data.getHours() * 100;
    const min = data.getMinutes();
    const data2 = year + month + day + hour + min + ''
  // User the connection
  conn.all('UPDATE usuari SET nom = ?, cognoms = ?, email = ?, telefon = ?, coeficient = ?, estat = ?, comentaris = ?, dataActualitzacio = ? WHERE id = ?', [nom, cognoms, email, telefon, coeficient, estat, comentaris, data2, req.params.id], (err, rows) => {

    if (!err) {
      // User the connection
      conn.all('SELECT * FROM usuari WHERE id = ?', [req.params.id], (err, rows) => {
        // When done with the connection, release it        
        if (!err) {
          res.render('edit-user', { rows, alert: `Les dades de ${nom} s'han actualitzat.` });
        } else {
          console.log(err);
        }
        console.log('Actualitzant usuari');
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

  conn.all('UPDATE usuari SET estat = ? WHERE id = ?', ['Baixa', req.params.id], (err, rows) => {
    if (!err) {
      let removedUser = encodeURIComponent('Usuari donat de baixa.');
      res.redirect('/?removed=' + removedUser);
    } else {
      console.log(err);
    }
    console.log('L`usuari es dona de baixa');
  });

}

// View Users
exports.viewall = (req, res) => {

  // User the connection
  conn.all('SELECT * FROM usuari WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('view-user', { rows });
    } else {
      console.log(err);
    }
    console.log('Dades de l`usuari');
  });
}

function calculaCoeficient(){
  coeficientT = 0;
  conn.all('SELECT * FROM usuari', (err, rows, cT) =>  {          
        
     // Calcul coeficient total
     rows.forEach(row => {
       cT = cT + row.coeficient;        
     });       
     cT = cT.toFixed(5);
      
     return cT
    });   
    return coeficientT 
}