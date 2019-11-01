const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const {clientId, clientSecret} = require('../keys');
const requireAuth = require('../middleware/requireAuth');

const oauth2Client = new OAuth2(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground/"
);
const gmail = google.gmail('v1');

module.exports = (app) => {
    //get mail id list
    app.get('/mails', requireAuth, async (req, res) => {
        const user = req.user;

        oauth2Client.setCredentials({
            refresh_token: user.refreshToken
        })
        const accessToken = await oauth2Client.getAccessToken();
        oauth2Client.setCredentials({
            access_token : accessToken.token
        })
        let nextPageToken = req.query.page_token;
        try{
            const response = await gmail.users.messages.list({
                userId:req.user.email, 
                auth: oauth2Client,
                maxResults: 10,
                pageToken: nextPageToken
            });
            nextPageToken = response.data.nextPageToken;
            //res.send([...response.data.messages]);
            res.render('pages/mails', {
                msg_ids: [...response.data.messages], 
                token:nextPageToken,
                title:'Mail List',
                user : req.user.email
            });
        }catch(err){
            res.status(401).send(err);
        }
    });

    // get a mail
    app.get('/mails/:id',requireAuth, async (req,res) => {
        const user = req.user;
        oauth2Client.setCredentials({
            refresh_token: user.refreshToken
        })
        const accessToken = await oauth2Client.getAccessToken();
        oauth2Client.setCredentials({
            access_token : accessToken.token
        })
        try{
            const response = await gmail.users.messages.get({ userId:req.user.email, id:req.params.id, auth: oauth2Client});
            const msg_obj = response.data;
            const decoded = require('../parser.js')(msg_obj);
            //res.json(decoded);
            //console.log(msg_obj);
            res.render('pages/mails/show', {decoded})     
           //res.send(decoded.html);  
        }catch(err){
            res.json(err);
        }
    })
    //get a mail attachments
    // app.get('/attachment/mail/:mail_id', requireAuth, async (req, res) => {
    //     const user = req.user;
    //     oauth2Client.setCredentials({
    //         refresh_token: user.refreshToken
    //     })
    //     const accessToken = await oauth2Client.getAccessToken();
    //     oauth2Client.setCredentials({
    //         access_token : accessToken.token
    //     })

    //     const attachment_id = req.query.attachment_id;
    //     console.log(google);
    //     //res.redirect(`https://www.googleapis.com/gmail/v1/users/${req.user.email}/messages/${req.params.mail_id}/attachments/${attachment_id}`)
    //     try{
    //         const response = await gmail.users.messages.attachments({
    //             id : attachment_id,
    //             messageId : req.params.mail_id,
    //             userId : req.user.email,
    //             auth: oauth2Client
    //         })
    //         //console.log(response);
    //         res.send('done');
    //         //res.sendFile(response);
    //     }catch(err){
    //         res.send(err);
    //     }
    // });
}