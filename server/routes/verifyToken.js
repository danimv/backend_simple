const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // const token = req.header('auth-token');
    // const token = req.query.user;
    // console.log(token);
    // if (!token) return res.status(401).send('Access Denied');

    try {
        // const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(process.env.TOKEN_SECRET);
        if (process.env.TOKEN_SECRET == "admin") {
            console.log("correcte");
            next();
        }else{
            res.status(400).send('Invalid Token');
        }
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}
