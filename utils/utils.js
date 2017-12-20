'use strict';
const http = require('http');
const urlLib = require('url');
const stringify = require('json-stable-stringify');
const md5 = require('md5');
const os = require("os");
exports = module.exports = {};


exports.getValue = function(obj, keyPath, defaultValue){
    if(obj == null || !keyPath) {
        return defaultValue;
    }

    let properties = keyPath.split('.');
    if (keyPath.indexOf('..') > 0){
        properties = keyPath.split('..');
    }

    for (let i = 0; i < properties.length; i++) {
        let prop = properties[i];

        if(obj == null || !obj.hasOwnProperty(prop)){
            return defaultValue;
        } else {
            obj = obj[prop];
        }
    }
    return obj == null ? defaultValue: obj;
};


exports.fetchValue = function(obj, keyPath, value){
    let properties = keyPath.split('.');
    if (keyPath.indexOf('..') > 0){
        properties = keyPath.split('..');
    }

    for (let i = 0; i < properties.length; i++) {
        let prop = properties[i];

        if (i === properties.length - 1){
            if (!obj.hasOwnProperty(prop)){
                obj[prop] = value;
            }
            return obj[prop];
        }
        else {
            if (!obj.hasOwnProperty(prop)) {
                obj[prop] = {}
            }
            obj = obj[prop];
        }
    }
};

exports.delValue = function (obj, keyPath) {
    if(obj == null || !keyPath) {
        return undefined;
    }

    let name = keyPath.split('.').slice(-1)[0];
    let path = keyPath.split('.').slice(0, -1).join('.');
    let parentObj = null;
    if (path === ''){
        parentObj = obj;
    }
    else {
        parentObj = this.getValue(obj, path, {});
    }
    let ret  = parentObj[name];
    delete parentObj[name];
    return ret;
};

exports.getProperty = function (obj, propertyName, defaultValue) {
    if (obj == null || !obj.hasOwnProperty(propertyName)){
        return defaultValue;
    }
    return obj[propertyName]
};

exports.setValue = function(obj, keyPath, value){
    let properties = keyPath.split('.');
    if (keyPath.indexOf('..') > 0){
        properties = keyPath.split('..');
    }

    for (let i = 0; i < properties.length; i++) {
        let prop = properties[i];

        if(!obj.hasOwnProperty(prop)){
            obj[prop] = {}
        }

        if (i === properties.length - 1){
            obj[prop] = value
        }
        else {
            obj = obj[prop];
        }
    }
};

exports.opValue = function (obj, keyPath, value, assign) {
    assign = assign.split(',');
    if (assign.indexOf('append') >= 0) {
        let src = this.getValue(obj, keyPath, null);
        if (src === null) {
            this.setValue(obj, keyPath, [value]);
        }
        else{
            src.push(value);
        }
    }
    else if (assign.indexOf('extend') >= 0) {
        let src = this.getValue(obj, keyPath, null);
        if (src === null) {
            this.setValue(obj, keyPath, value);
        }
        else{
            Array.prototype.push.apply(src, value);
            this.setValue(obj, keyPath, src);
        }
    }
    else {
        this.setValue(obj, keyPath, value);
    }

    if (assign.indexOf('unique') >= 0){
        let src = this.getValue(obj, keyPath, null);
        if (Array.isArray(src)){
            this.setValue(obj, keyPath, [...new Set(src)]);
        }
    }

    if (assign.indexOf('sort') >= 0){
        let src = this.getValue(obj, keyPath, null);
        if (Array.isArray(src)){
            src.sort()
        }
    }
};

exports.incValue = function(obj, keyPath, incValue, baseValue){
    if (obj == null){
        return baseValue;
    }
    let keys = keyPath.split('.');
    if (keyPath.indexOf('..') > 0){
        keys = keyPath.split('..');
    }

    let ret = baseValue;
    for (let i = 0; i < keys.length; i++) {
        let prop = keys[i];

        if(!obj.hasOwnProperty(prop)){
            obj[prop] = {}
        }

        if (i === keys.length - 1){
            if (typeof obj[prop] !== 'number')
            {
                obj[prop] = baseValue;
            }
            obj[prop] += incValue;
            ret = obj[prop];
        }
        else {
            obj = obj[prop];
        }
    }
    return ret;
};




exports.parseValue = function (value, storage) {
    let ret = value;
    if (this.isStorageName(value)) {
        ret = this.getValue(storage, value, null);
    }
    return ret
};

exports.getTime = function () {
    let date = new Date();
    return date.getTime() / 1000.0
};

exports.msNow = function () {
    return new Date().getTime();
};

exports.sleep = function (milliseconds) {
    return new Promise(function (resolve) {
        if (Array.isArray(milliseconds)){
            milliseconds = Math.random() * (milliseconds[1] - milliseconds[0]) + milliseconds[0]
        }
        setTimeout(resolve, milliseconds);
    });
};


exports.getFreePort = function() {
    return new Promise(function (resolve) {
        let server = http.createServer();
        server.listen(0);
        server.on('listening', function() {
            let port = server.address().port;
            server.close();
            resolve(port)
        })
    })
};


exports.isStorageName = function (name) {
    return typeof name === 'string' && (
        name.startsWith('$in.') ||
        name.startsWith('$out.') ||
        name.startsWith('$cache.') ||
        name.startsWith('$const.') ||
        ['$in', '$out', '$cache', '$const'].indexOf(name) >= 0);
};

exports.isWritableStorageName = function (name) {
    return typeof name === 'string' && (
        name.startsWith('$out.') ||
        name.startsWith('$cache.')||
        ['$out', '$cache'].indexOf(name) >= 0);
};

exports.checkParams = function(params, items) {
    if (params === null){
        return `params is null`
    }
    let notFoundItems = [];
    let ret = "";
    for (let item of items){
        if (!params.hasOwnProperty(item)){
            notFoundItems.push(item);
        }
    }
    if (notFoundItems.length > 0){
        ret = 'parameter(s) "' + notFoundItems.join('","') + '" not found.'
    }

    if (items.indexOf('save') >= 0 && !this.isWritableStorageName(params.save)){
        ret += `save location "${params.save}" can NOT write.`
    }
    if (ret !== ""){
        return ret;
    }
    return true
};

exports.toLog = function(logMap){
    let logArray = [];
    for (let key in logMap){
        if (!logMap.hasOwnProperty(key)){
            continue;
        }
        logArray.push(`${key}=${logMap[key]}`)
    }

    return '`' + logArray.join('`')  + '`'
};


function cartesianProduct(matrix, deep=0) {
    if (deep >= matrix.length) {
        return []
    }
    let subItems = cartesianProduct(matrix, deep + 1);
    let ret = [];
    for (let k = 0; k < matrix[deep].length; k++) {
        if (subItems.length > 0) {
            for (let l = 0; l < subItems.length; l++) {
                let temp = subItems[l].slice(0);
                temp.unshift(matrix[deep][k]);
                ret.push(temp);
            }
        }
        else {
            ret.push([matrix[deep][k]]);
        }
    }
    return ret;
}

exports.cartesianProduct=cartesianProduct;


exports.strftime = function (timestamp, format='yyyy-MM-DD HH:mm:ss') {
    let date = new Date(timestamp);
    let keys = {
        'y': '' + date.getFullYear(),
        'M': '' + (date.getMonth() + 1),
        'D': '' + date.getDate(),
        'H': '' + date.getHours(),
        'm': '' + date.getMinutes(),
        's': '' + date.getSeconds(),
        'f': '' + date.getMilliseconds()
    };
    let items = [];
    let key = '';
    let count = 0;
    let zero = '000';
    let value;
    for (let ch of format){
        if (ch === key){
            count++;
            continue
        }
        else if (keys.hasOwnProperty(key)){
            value = keys[key];
            items.push(count <= value.length ? (key === 'y' ? value.slice(-count): value) : zero.slice(value.length - count) + value);
        }
        else{
            items.push(key)
        }
        key = ch;
        count = 1;
    }
    if (keys.hasOwnProperty(key)){
        value = keys[key];
        items.push(count <= value.length ? (key === 'y' ? value.slice(-count): value) : zero.slice(value.length - count) + value);
    }
    else{
        items.push(key)
    }
    return items.join('')
};


exports.domain = function (url) {
    try{
        return urlLib.parse(url).hostname;
    }
    catch (e){
        return null;
    }
};

exports.hostName = function () {
    return os.hostname();
};

function xmd5(value){
    return md5(stringify(value));
}

exports.xmd5 = xmd5;

exports.AssignType = {
    Append: "append",
    Extend: "extend",
    Unique: "unique",
    Sort: "sort"
};

exports.printIpv4s = function () {
    let ifCaces = os.networkInterfaces();
    for (let dev in ifCaces) {
        let alias=0;
        ifCaces[dev].forEach(function(details){
            if (details.family=='IPv4') {
                console.log(dev+(alias?':'+alias:''),details.address);
                ++alias;
            }
        });
    }
}