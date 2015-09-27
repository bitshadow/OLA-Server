var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    request = require('request'),
    app = express(),
    port = process.env.PORT || 3000,
    router = express.Router(),
    http = require('http'),
    querystring = require('querystring');

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

    // var url = 'http://sandbox­-t.olacabs.com/v1/bookings/create?pickup_lat=' +  + '&pickup_lng=' + params.slong + '&pickup_mode=NOW' + '&category=' + 'sedan';
    var url = 'http://sandbox­-t.olacabs.com/v1/bookings/create?pickup_lat='+ params.slat + '&pickup_lng='+ params.slong + '&pickup_mode=NOW&category=sedan'

    var postData = querystring.stringify({
        'msg': 'Hello World!'
    });

    var options = {
        host: 'sandbox-t.olacabs.com',
        port: 80,
        path: '/v1/bookings/create?pickup_lat=12.954825&pickup_lng=77.642484&pickup_mode=NOW&category=sedan',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-APP-TOKEN': '',
            'Authorization': 'Bearer '
        }
    };

    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log('BODY: ' + chunk);
        });
        res.on('end', function() {
            console.log('No more data in response.')
        })
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(postData);
    req.end();

});

app.use('/', router);

app.listen(port);
console.log('App running on port', port);
