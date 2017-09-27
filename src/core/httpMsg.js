var settings = require("../settings");

exports.show500 = function(req, resp, err){
    resp.writeHead(500, "Internal Error occurred", { "Content-Type": "application/json" });
    resp.write(JSON.stringify({ data: "ERROR occurred: " + err }));
    resp.end();
}

exports.sendJson = function(req, resp, data){
    resp.writeHead(200, { "Content-Type": "application/json"});
    if(data){
      resp.write(JSON.stringify(data));
    }
    resp.end();
}

exports.show405 = function(req, resp){
    resp.writeHead(405, "Method not supported", { "Content-Type": "application/json" });
    resp.write(JSON.stringify({ data: "Method not supported" }));
    resp.end();
}


exports.show404 = function(req, resp){
    resp.writeHead(404, "Resource not found.", { "Content-Type": "application/json" });
    resp.write(JSON.stringify({ data: "Resource not found" }));
    resp.end();
}

exports.show403 = function(req, resp){
    resp.writeHead(403, "Failed to authenticate token.", { "Content-Type": "application/json" });
    resp.write(JSON.stringify({ data: "Failed to authenticate token" }));
    resp.end();
}


exports.show413 = function(req, resp){
    resp.writeHead(413, "Request Entity too Large", { "Content-Type": "application/json" });
    resp.write(JSON.stringify({ data: "Request Entity too Large" }));
    resp.end();
}

exports.show200 = function(req, resp){
    resp.writeHead(200,{ "Content-Type": "application/json" });
    resp.end();
}

exports.showHome = function(req, resp){
    resp.writeHead(200, {"Content-Type": "application/json"});
    resp.write(JSON.stringify([
      { url: "/users", operations: "GET", description:"To List all users." },
      { url: "/users/<id>", operations: "GET", description:"To Search a user." }
    ]));
    resp.end();
}

exports.sendAuthFail = function(req, resp, errText){
    resp.writeHead(200, {"Content-Type": "application/json"});
    resp.write(JSON.stringify({ auth: {
                authenticated: false,
                message: errText,
                token: ''
            }}))
    resp.end();
}
