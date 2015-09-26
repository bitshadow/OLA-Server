var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    request = require('request'),
    app = express(),
    port = process.env.PORT || 3000,
    router = express.Router();

app.use(express.static(__dirname + '/views')); // set the static files location for the static html
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

router.get('/', function(req, res, next) {
    res.render('index.html');
});

router.post('/book', function(req, response, next) {
    var params = req.params;

    var regex = /[?&]([^=#]+)=([^&#]*)/g,
        url = req.body.obj,
        params = {},
        match;
    while (match = regex.exec(url)) {
        params[match[1]] = match[2];
    }

    var token = ''

    var url = 'http://sandbox­t.olacabs.com/v1/bookings/create?pickup_lat=' + params.slat + '&pickup_lng=' + params.slong + '&pickup_mode=NOW' + '&category=' + 'sedan';

    request({
        headers: {
            'Content-Type': 'application/json',
            'X-APP-TOKEN': ''
        },
        uri: url,
        method: 'GET'
    }, function(err, res, body) {
        console.log('cab booked', err, res, body);
        response.send(res);
    });
});

app.use('/', router);

app.listen(port);
console.log('App running on port', port);
