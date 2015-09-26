var express = require('express')
    , morgan = require('morgan')
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , app = express()
    , port = process.env.PORT || 3000
    , router = express.Router();

app.use(express.static(__dirname + '/views')); // set the static files location for the static html
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                     // log every request to the console
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

router.get('/', function(req, res, next) {
    res.render('index.html');
});

router.get('/book', function(req, res, next) {
    var params = req.params;

    console.log('booking...');
    
    // res.render('index.html');
});

app.use('/', router);

app.listen(port);
console.log('App running on port', port);