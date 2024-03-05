const express = require('express');
var cons = require('consolidate');
var __ = require('underscore');
__.string = require('underscore.string');

const app = express();
app.engine('html', cons.underscore);
app.set('view engine','html');
app.set('views','file/client');
const clientPort = 3000;


const clients = {
    client_id: 'oauth-client-1',
    client_secret: 'oauth-client-secret-1',
    redirect_uris: ['http://localhost:3000/callback']
}


app.get('/',function(req,res){
	res.render('index', {access_token: '', scope: ''});
});



app.get('/authorize',(req,res) => {
    //ユーザーを認証するためのページを表示する
    const authorizeUrl = buildUrl('http://localhost:3001/authorize',{
        response_type: 'code',
        client_id: clients.client_id,
        redirect_uri: 'http://localhost:3000/callback',
    });
    console.log('redirect',authorizeUrl);
    res.redirect(authorizeUrl);
})

function buildUrl(base, options , hash) {
    const newUrl = new URL(base);
    if(!newUrl.search){
        newUrl.search = '';
    }

    Object.keys(options).forEach((key) => {
        newUrl.searchParams.set(key,options[key]);
    });

    if(hash){
        newUrl.hash = hash;
    }

    return newUrl.toString();
}






const server = app.listen(clientPort,'localhost',() => {
    const host = server.address().address;
    console.log(`OAuth clinet server is listening at http://%s:%s`,host,clientPort);
})