const express = require('express');
var cons = require('consolidate');
var __ = require('underscore');
__.string = require('underscore.string');

const app = express();
app.engine('html', cons.underscore);
app.set('view engine','html');
app.set('views','file/client');
const clientPort = 3000;


app.get('/',function(req,res){
	res.render('index', {access_token: '', scope: ''});
});



const server = app.listen(clientPort,'localhost',() => {
    const host = server.address().address;
    console.log(`OAuth clinet server is listening at http://%s:%s`,host,clientPort);
})