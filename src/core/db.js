var sqlDb = require('mssql');
var settings = require('../settings');

// ---------------------------------------------------------
// Execute to sql server.
// ---------------------------------------------------------
exports.executeSql = function(sql, callback){
    var conn = new sqlDb.Connection(settings.dbConfig);
    conn.connect()
        .then(function(){
            var req = new sqlDb.Request(conn);
            req.query(sql).then(function(recordset) {
                callback(recordset);
            })
            .catch(function(err){
                console.log(err);
                callback(null, err);
            });
        })
        .catch(function(err){
            console.log(err);
            callback(null, err);
        });
};

exports.executeSqlWithConnection = function(connection, sql, callback){
    var conn = new sqlDb.Connection(connection);
    conn.connect()
        .then(function(){
            var req = new sqlDb.Request(conn);
            req.query(sql).then(function(recordset) {
                callback(recordset);
            })
            .catch(function(err){
                console.log(err);
                callback(null, err);
            });
        })
        .catch(function(err){
            console.log(err);
            callback(null, err);
        });
};
