const jwt = require("jsonwebtoken");

const config = process.env;

const verifyGallery = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers.authorization;
    
    if (!token) {
        return res.status(403).send("A token is required for handle gallery");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        const userId = decoded.user_id;
        req.body.userid = userId;
    } catch (err) {
        console.log('verify error');
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyGallery;
