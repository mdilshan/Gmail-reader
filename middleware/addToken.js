const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const {clientId, clientSecret} = require('../keys');

const oauth2Client = new OAuth2(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground/"
);
const gmail = google.gmail('v1');

module.exports = async (req, res, next) => {
    if(!req.user){
        return res.status(401).send('You are not authorized');
    }else{
        const user = req.user;
        //res.send(user);
        oauth2Client.setCredentials({
            refresh_token: user.refreshToken
        })
        const accessToken = await oauth2Client.getAccessToken();
        //console.log('user email', user.email);
        oauth2Client.setCredentials({
            access_token : accessToken.token
        })
        next();
    }
    
}