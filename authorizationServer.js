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

var codes = {};

var requests = {};

function getClient(clientId) {
    return clients.client_id === clientId ? clients : null;
}

app.get('/', function (req, res) {
    res.render('index', { clients: clients , authServer : authServer});
});


app.get('/authorize', function (req, res) {
    // TODO 第五章で学習予定

    var client = getClient(req.query.client_id);
	
	if (!client) {
		console.log('Unknown client %s', req.query.client_id);
		res.render('error', {error: 'Unknown client'});
		return;
	} else if (!__.contains(client.redirect_uris, req.query.redirect_uri)) {
		console.log('Mismatched redirect URI, expected %s got %s', client.redirect_uris, req.query.redirect_uri);
		res.render('error', {error: 'Invalid redirect URI'});
		return;
	} else {
		
		var rscope = req.query.scope ? req.query.scope.split(' ') : undefined;
		var cscope = client.scope ? client.scope.split(' ') : undefined;
		if (__.difference(rscope, cscope).length > 0) {
			// client asked for a scope it couldn't have
			var urlParsed = url.parse(req.query.redirect_uri);
			delete urlParsed.search; // this is a weird behavior of the URL library
			urlParsed.query = urlParsed.query || {};
			urlParsed.query.error = 'invalid_scope';
			res.redirect(url.format(urlParsed));
			return;
		}
		
		var reqid = randomstring.generate(8);
		
		requests[reqid] = req.query;
		
		res.render('approve', {client: client, reqid: reqid, scope: rscope});
		return;
	}
});


const server = app.listen(authorizationServerPort, 'localhost', function () {
    const host = server.address().address;
    console.log('OAuth Authorization Server is listening at http://%s:%s', host, authorizationServerPort);
});