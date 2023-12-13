const jwt = require("jsonwebtoken");
const GoogleAuth = require('google-auth-library');

const config = process.env;

async function getGoogleAccountInfo(googleToken) {
    const googleAuthClient = new GoogleAuth.OAuth2Client();
    let payload;
    try {
        const ticket = await googleAuthClient.verifyIdToken({ idToken: googleToken });
        payload = ticket.getPayload();
    } catch (error) {
        return null;
    }
    const {
        given_name: givenName, name, email, picture,
    } = payload;
    const credentials = {
        signedIn: true, givenName, name, email, picture,
    };
    return credentials;
}

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers.authorization;
    
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    // For GoogleAccount Token
    const gaccountInfo = await getGoogleAccountInfo(token);

    if(gaccountInfo !== null) {
        req.user = gaccountInfo;
        req.body.email = gaccountInfo.email;
    } else {
        try {   
            // For Self Token
            const decoded = jwt.verify(token, config.TOKEN_KEY);
            req.user = decoded;
            const email = decoded.email;
            req.body.email = email;
        } catch (err) {
            console.log('verify error');
            return res.status(401).send("Invalid Token");
        }
    }
    return next();
};


module.exports = verifyToken;
