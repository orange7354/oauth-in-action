const express = require("express");
const url = require("url");
const bodyParser = require('body-parser');
const randomstring = require("randomstring");
const cons = require('consolidate');
const nosql = require('nosql').load('database.nosql');
const querystring = require('querystring');
const __ = require('underscore');
__.string = require('underscore.string');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', cons.underscore);
app.set('view engine', 'html');
app.set('views', 'file/authorizationServer');
app.set('json spaces', 4);
const authorizationServerPort = 3001;

const clients = {
    client_id: 'oauth-client-1',
    client_secret: 'oauth-client-secret-1',
    redirect_uris: ['http://localhost:3000/callback']
}

const authServer = {
    authorizationEndpoint: 'http://localhost:3001/authorize',
    tokenEndpoint: 'http://localhost:3001/token',
}


app.get('/', function (req, res) {
    res.render('index', { clients: clients , authServer : authServer});
});


app.get('/authorize', function (req, res) {
});


const server = app.listen(authorizationServerPort, 'localhost', function () {
    const host = server.address().address;
    console.log('OAuth Authorization Server is listening at http://%s:%s', host, authorizationServerPort);
});