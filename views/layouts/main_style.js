let sqlite3 = require('sqlite3').verbose();//'server/controllers/comunitat.db';//
const fs = require('fs');
const exportedC = require('../controllers/comunitatController');
const exportedD = require('../db/dbDriver');
const location = exportedD.dbLocation();
let conn = exportedD.dbConnection();

console.log("main_style");
const btn = document.getElementById('workingMode');

btn.addEventListener('click', function onClick() {
    btn.style.backgroundColor = 'salmon';
    btn.style.color = 'white';
    console.log("helloooo");
    // let mode;
    // // Sqlite connexió 
    // conn.all('SELECT * FROM comunitat ORDER BY id DESC LIMIT 1', (err, row) => {
    //     if (err || row[0].mode == null) {
    //         mode = 1;
    //     } else {
    //         mode = row[0].mode + 1;
    //         if (mode > 1) mode = 0;
    //     }
    //     conn.all('UPDATE comunitat SET mode = ? WHERE id = ?', [mode, row[0].id], (err, rows4) => {
    //     });
    // });

});