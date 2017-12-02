var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.JSON(content);
}

/**
 * Registers a user to the database
 * Then returns a JWT token back to them
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.register = function(req, res) {
    if (!req.body.name || !req.body.email || !req.body.password) {
        sendJSONresponse(res, 404, { message: "All fields required" })
    } else {
        var user = new User();
        
            user.name = req.body.name;
            user.email = req.body.email;
        
            user.setPassword(req.body.password);
        
            user.save(function(err) {
                if (err) {
                    sendJSONresponse(res, 400, err);
                } else {
                    var token = user.generateJwt();
                    sendJSONresponse(res, 200, {
                        token: token
                    });
                }
            })
    }
};


/**
 * Logs a user in by creating a JWT token
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.register = function(req, res) {
    if (!req.body.email || !req.body.password) {
        sendJSONresponse(res, 404, { message: "All fields required" })
    } else {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                sendJSONresponse(res, 400, err);
            } else if (!user) {
                sendJSONresponse(res, 401, info);
            } else {
                /** Authentication successful */
                var token = user.generateJwt();
                sendJSONresponse(res, 200, {
                    token: toke
                });
            }
        })(req, res);
    }
};