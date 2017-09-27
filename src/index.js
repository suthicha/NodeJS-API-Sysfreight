var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var settings = require('./settings');
var httpMsg = require('./core/httpMsg');
var user = require('./controller/user');
var reports = require('./controller/reports');

app.set('secert', settings.secert);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// basic route (http://localhost:<port>)
app.get('/', function(req, resp) {
    resp.send('The API is at the http://localhost:' + settings.webPort + '/api');
});

var apiRoute = express.Router();
apiRoute.post('/authenticate', function(req, resp) {
    user.authenticate(req, resp);
});


// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoute.use(function(req, resp, next) {

    if (req.method == 'POST' && req.url == '/user'){
        next();
    } else {

    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    if (token){
        // verifies secret and checks exp
		jwt.verify(token, app.get('secert'), function(err, decoded) {
			if (err) {
				return resp.json({ auth: { authenticated: false, message: 'Failed to authenticate token.'} });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
    }
    else {
      // if there is no token
		  // return an error
  		return resp.status(403).send({
  			success: false,
  			message: 'No token provided.'
  		});
    }
  }
});

// ---------------------------------------------------------
// route middleware to user api.
// ---------------------------------------------------------
apiRoute.get('/isauth', function(req, resp) {
  httpMsg.sendJson(req, resp, true);
})

apiRoute.get('/user', function(req, resp) {
	user.getList(req, resp);
})

apiRoute.post('/user', function(req, resp) {
	user.add(req, resp);
})

apiRoute.put('/user', function(req, resp) {
	user.update(req, resp);
})

apiRoute.delete('/user', function(req, resp) {
	user.delete(req, resp);
})

// ---------------------------------------------------------
// route middleware to shipment api.
// ---------------------------------------------------------
apiRoute.get('/airlineshipments/:period', function(req, resp) {
	reports.getPivotAirline(req, resp, req.params.period);
})

apiRoute.get('/airline/:period', function(req, resp) {
	reports.getAirline(req, resp, req.params.period);
})

apiRoute.get('/', function(req, resp) {
    httpMsg.showHome(req, resp);
});

app.use('/api', apiRoute);
app.listen(settings.webPort);
console.log('Service started at http://localhost:' + settings.webPort);
