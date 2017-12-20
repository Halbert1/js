"use strict";
const express = require('express');
const request = require('request');
const utils = require('../utils/utils');
const app = express();
const port = 3000;
app.use('/', function(req, res) {
    let url = 'https://www.google.com/' + req.url;
    console.log(url);
    req.pipe(request(url)).pipe(res);
});
app.listen(port);
utils.printIpv4s();
console.log(`port:${port}`);