let sqlite3 = require('sqlite3').verbose();
let conn = new sqlite3.Database('server/controllers/comunitat.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to database.');
});

// Vista comunitat
exports.view2 = (req, res) => {
  let alert2 = false;
  res.render('comunitat');  
}
