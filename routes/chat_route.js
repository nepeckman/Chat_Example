///<reference path='../libs/express.d.ts' />
///<reference path='../libs/socket.io.d.ts' />
var express = require('express');
var router = express.Router();
router.use(function (req, res, next) {
    var namespace = req.originalUrl;
    res.render('../views/chat', { pageTitle: namespace.substring(6, namespace.length) });
    next();
});
module.exports = router;
