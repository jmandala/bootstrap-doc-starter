/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , jsonfile = require('jsonfile')
    , fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// configure documentation
fs.exists('./app.json', function (exists) {
    if (!exists) {
        fs.createReadStream('./app.json.sample').pipe(fs.createWriteStream('./app.json'));
    }
    readConfig('./app.json');

});


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


function readConfig(path) {
    jsonfile.readFile(path, function (err, obj) {
        console.log(err);
        console.log(obj);
        app.locals(obj);
    });
}