var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var crypto = require('crypto');
var uuid = require('uuid');
var http = require('http');

var CLIENTID = 'a823jkas87y3kjakjhsd';
var CLIENTSECRET = 'dksu287aokjfaouiusdia7127a5skd';

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

var router = express.Router();

var users = {
    "b1a6b22b-7f09-41f8-944d-e7f180b4cd4c": {
        "password": "password",
        "profile": {
            "id": "b1a6b22b-7f09-41f8-944d-e7f180b4cd4c",
            "email": "email@example.com",
            "firstName": "First",
            "lastName": "Last",
            "website": "http://example.com",
            "address": {
                "city": "City",
                "state": "State",
                "zip": "ZIP"
            },
            "phone": "123123123",
            "stars": 4,
            "reviewsCount": 5,
            "followersCount": 14
        }
    }
};

var usersByEmail = {
    'email@example.com': users["b1a6b22b-7f09-41f8-944d-e7f180b4cd4c"]
};

var accessTokens = {

};

router.post('/api/v1/auth/token', function(req, res, next) {
    if (req.query.client_id != CLIENTID) {
        return res.sendStatus(400);
    }
    if (req.query.client_secret != CLIENTSECRET) {
        return res.sendStatus(400);
    }

    if (req.query.grant_type == 'password') {
        if (usersByEmail[req.query.username] && req.query.password && usersByEmail[req.query.username].password == req.query.password) {
            var accessToken = crypto.randomBytes(32).toString('hex');
            var expiresIn = 3600;
            var refreshToken = crypto.randomBytes(32).toString('hex');

            accessTokens[accessToken] = req.query.username;

            return res.json({
                "access_token": accessToken,
                "expires_in": expiresIn,
                "refresh_token": refreshToken
            });
        } else {
            res.status(401);
            return res.json({
                "error": "access_denied",
                "error_description": "The resource owner or authorization server denied the request."
            });
        }
    } else {
        return res.sendStatus(400);
    }
});

function requestToUser(req) {
    if (!req.headers['authorization']) {
        return null;
    }
    var auth = req.headers['authorization'].split(' ');
    if (auth.length != 2 || auth[0] != 'Bearer' || !accessTokens[auth[1]]) {
        return null;
    }
    return usersByEmail[accessTokens[auth[1]]];
}

function requestUser(req, res) {
    var user = requestToUser(req);

    if (!user) {
        res.status(401);
        res.json({
            "error": "invalid_request",
            "error_description": "The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed."
        });
    }

    return user;
}

router.get('/api/v1/profile', function(req, res, next) {
    var user = requestUser(req, res);
    if (!user) {
        return;
    }

    return res.json(user.profile);
});

router.patch('/api/v1/profile', function(req, res, next) {
    var user = requestUser(req, res);
    if (!user) {
        return;
    }

    var profile = user.profile;

    if (req.body.firstName) {
        profile.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
        profile.lastName = req.body.lastName;
    }
    if (req.body.website) {
        profile.website = req.body.website;
    }
    if (req.body.address && req.body.address.city) {
        profile.address.city = req.body.address.city;
    }
    if (req.body.address && req.body.address.state) {
        profile.address.state = req.body.address.state;
    }
    if (req.body.address && req.body.address.zip) {
        profile.address.zip = req.body.address.zip;
    }
    if (req.body.phone) {
        profile.phone = req.body.phone;
    }

    return res.sendStatus(204);
});

router.put('/api/v1/profile/changepassword', function(req, res, next) {
    var user = requestUser(req, res);
    if (!user) {
        return;
    }

    if (!req.body.oldPassword) {
        res.status(400);
        return res.json({
            "error": "old_password_required",
            "error_description": "Old password is required."
        });
    }

    if (!req.body.newPassword) {
        res.status(400);
        return res.json({
            "error": "new_password_required",
            "error_description": "New password is required."
        });
    }

    if (req.body.oldPassword !== user.password) {
        res.status(400);
        return res.json({
            "error": "incorrect_old_password",
            "error_description": "Old password is incorrect."
        });
    }

    user.password = req.body.newPassword;

    return res.sendStatus(204);
});

app.use('/', router);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    console.log(err);

    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

var port = normalizePort(process.env.PORT || '4042');
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    console.log('Listening on ' + bind);
}