"use strict";
//来自https://imququ.com/post/web-proxy.html
const http = require('http');
const net = require('net');
const url = require('url');
const utils = require('../utils/utils');
const port = 8888;

function request(cReq, cRes) {
    let u = url.parse(cReq.url);

    let options = {
        hostname : u.hostname,
        port     : u.port || 80,
        path     : u.path,
        method     : cReq.method,
        headers     : cReq.headers
    };
    console.log(options);

    let pReq = http.request(options, function(pRes) {
        cRes.writeHead(pRes.statusCode, pRes.headers);
        pRes.pipe(cRes);
    }).on('error', function(e) {
        cRes.end();
    });

    cReq.pipe(pReq);
}

function connect(cReq, cSock) {
    let u = url.parse('http://' + cReq.url);

    let pSock = net.connect(u.port, u.hostname, function() {
        cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        pSock.pipe(cSock);
    }).on('error', function(e) {
        cSock.end();
    });

    cSock.pipe(pSock);
}

http.createServer()
    .on('request', request)
    .on('connect', connect)
    .listen(port, '0.0.0.0');
utils.printIpv4s();
console.log(`port:${port}`);