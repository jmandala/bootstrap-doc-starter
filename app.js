/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , jsonfile = require('jsonfile')
    , fs = require('fs')
    , ncp = require('ncp').ncp;

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

fs.exists('./views', function(exists) {
    if (!exists) {
        ncp('./template.views', './views', function(err) {
            if (err) {
                return console.error(err);
            }
            console.log('Built views from template');
        });
    }
});


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/chapter/:id', routes.chapters);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

// custom functions


function readConfig(path) {
    jsonfile.readFile(path, function (err, obj) {
        app.locals(obj);
    });
}