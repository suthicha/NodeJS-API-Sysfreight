var db = require('./db');
var httpMsg = require('./httpMsg');

exports.QuoteEncoding = function(strvalue) {
    var strquotes = /(')/g;
    return strvalue.replace(strquotes, "''");
};

exports.NumberNull = function(value){
    return value == null? 0 : value;
}

exports.StringNull = function(value){
   return value == null || value == undefined || value == ""? "": FixQuote(value);
}

exports.execCommand = function(req, resp, sql) {
    db.executeSql(sql, function(data, err) {
        if (err){
            httpMsg.show500(req, resp, err);
        }
        else {
            httpMsg.sendJson(req, resp, data);
        }
    })
}

exports.execCommandWithConnection = function(req, resp, sql, connection) {
    db.executeSqlWithConnection(connection, sql, function(data, err) {
        if (err){
            httpMsg.show500(req, resp, err);
        }
        else {
            httpMsg.sendJson(req, resp, data);
        }
    })
}

function FixQuote(strvalue){
     var strquotes = /(')/g;
    return strvalue.replace(strquotes, "''");
}