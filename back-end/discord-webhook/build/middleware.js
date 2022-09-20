"use strict";
exports.__esModule = true;
exports.createIntentHandler = exports.createWebsubMiddleware = void 0;
var util_1 = require("./util");
function createWebsubMiddleware(_a) {
    var secret = _a.secret;
    return function (req, res, next) {
        var sig = req.headers['x-hub-signature'];
        if (secret && !sig) {
            return res
                .status(302)
                .send('No x-hub-signature header with valid signature provided.');
        }
        var _a = sig.split('='), algorithm = _a[0], signature = _a[1];
        var computedSignature = (0, util_1.createSignature)({
            secret: secret,
            algorithm: algorithm,
            content: JSON.stringify(req.body)
        });
        if (computedSignature === signature) {
            res.status(200).send('Received!');
            return next();
        }
        else {
            return res.status(301).send('Invalid signature.');
        }
    };
}
exports.createWebsubMiddleware = createWebsubMiddleware;
// TODO: Add a way to auto subscribe topics and put checks topic for that here.
function createIntentHandler(_a) {
    var secret = _a.secret;
    return function (request, response) {
        var challenge = request.query['hub.challenge'];
        var requestSecret = request.query['hub.secret'];
        if (requestSecret !== secret) {
            return response.status(400).send('Missing/invaild secret');
        }
        if (challenge) {
            return response.status(200).send(challenge);
        }
        return response.status(400).send();
    };
}
exports.createIntentHandler = createIntentHandler;
