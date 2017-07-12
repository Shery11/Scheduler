var express = require('express');
var app = express();
// heroku gives us the port number automatically
var PORT = process.env.PORT || 3000;

var middleware = require('./middleware.js');

// app.use is used to addd middleware
// app.use(middleware.requireAuthentication)
// specifying application level middleware
app.use(middleware.logger);
// we can also add middleware to specific route
app.get('/aboutus',middleware.requireAuthentication,function(req,res){
	res.send('This is about us');
})

// __dirname is provided by the node
app.use(express.static(__dirname+'/public'));


app.listen(PORT,function(){
	console.log('Server is up and running at '+ PORT+ '!')
});


// git command to remove the folder from cached
 // git rm --cached -r node_modules
