const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers.authorization;
    
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        console.log('verifyToken:', token);
        console.log('tokenKey:', config.TOKEN_KEY);
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        console.log('decoded', decoded);
        req.user = decoded;
        
    } catch (err) {
        console.log('verify error');
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;
