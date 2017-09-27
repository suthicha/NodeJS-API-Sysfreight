var jwt = require('jsonwebtoken');
var squel = require('squel');
var db = require('../core/db');
var httpMsg = require('../core/httpMsg');
var helper = require('../core/helper');
var settings = require('../settings');

exports.authenticate = function(req, resp) {
    try{
        if (!req.body) throw new Error("Input not valid");
        var data = req.body;

        if(data){

            var sql = squel.select()
                    .from("API_SysfUsers")
                    .field("Username")
                    .field("Fullname")
                    .field("UserType")
                    .field("Company")
                    .field("Email")
                    .field("Department")
                    .where("Username = ?", data.Username)
                    .where("UPassword = ?", data.Password)
                    .where("UStatus = ?", "A")
                    .toString();

            db.executeSqlWithConnection(settings.db2Config, sql, function(callback, err) {
                if (err){
                    httpMsg.show500(req, resp, err);
                }else {
                    if (data && callback.length > 0){
                        var user = callback[0];
                        if (user.Username === req.body.Username)
                        {
                            var token = jwt.sign({
                                Username: user.Username,
                                FullName: user.Fullname
                                }, settings.secert, {
                                expiresIn: 86400 // expires in 24 hours
                            });

                            resp.writeHead(200, {"Content-Type":"application/json"});
                            resp.write(JSON.stringify({
                              auth:{
                                authenticated:true,
                                message:'',
                                token: token
                              },
                              user:{
                                Username: user.Username,
                                Fullname: user.Fullname,
                                UserType: user.UserType,
                                Company: user.Company,
                                Department: user.Department
                                }
                              }));
                            resp.end();

                        }else{
                            httpMsg.sendAuthFail(req, resp, "Username not match.");
                        }
                    }
                    else {
                        httpMsg.sendAuthFail(req, resp, "Find not found Username: " + data.Username + " or Password incorrect.");
                    }
                }
            });
        }
        else {
            throw new Error("Input not valid");
        }

    }catch (ex) {
        httpMsg.show500(req, resp, ex);
    }
};

exports.add = function(req, resp){
    try{
      if (!req.body) throw new Error("Input not valid");
      var data = req.body;

      if (data){

          var sql = squel.insert()
                .into("API_SysfUsers")
                .set("Username", helper.StringNull(data.Username))
                .set("UPassword", helper.StringNull(data.UPassword))
                .set("FullName", helper.StringNull(data.Fullname))
                .set("Email", helper.StringNull(data.Email))
                .set("UserType", helper.StringNull(data.UserType))
                .set("Company", helper.StringNull(data.Company))
                .set("Department", helper.StringNull(data.Department))
                .set("RegisterDate", "GETDATE()", { dontQuote: true })
                .set("UStatus", "A")
                .toString();
          helper.execCommandWithConnection(req, resp, sql, settings.db2Config);
      }
      else {
        throw new Error("Input not valid");
      }

    }
    catch (ex) {
        httpMsg.show500(req, resp, ex);
    }
}

exports.update = function(req, resp){
    try{
      if (!req.body) throw new Error("Input not valid");
      var data = req.body;

      if (data){

          var sql = squel.update()
                .table("API_SysfUsers")
                .set("UPassword", helper.StringNull(data.UPassword))
                .set("FullName", helper.StringNull(data.Fullname))
                .set("Email", helper.StringNull(data.Email))
                .set("UserType", helper.StringNull(data.UserType))
                .set("Company", helper.StringNull(data.Company))
                .set("Department", helper.StringNull(data.Department))
                .where("TrxNo = ?", data.TrxNo)
                .toString();
          helper.execCommandWithConnection(req, resp, sql, settings.db2Config);
      }
    }
    catch (ex) {
        httpMsg.show500(req, resp, ex);
    }
}

exports.delete = function(req, resp){
    try{
      if (!req.body) throw new Error("Input not valid");
      var data = req.body;

      if (data){

          var sql = squel.update()
                .table("SFT_Users")
                .set("UserStatus", "I")
                .where("TrxNo = ?", data.TrxNo)
                .toString();
          helper.execCommandWithConnection(req, resp, sql, settings.db2Config);
      }
    }
    catch (ex) {
        httpMsg.show500(req, resp, ex);
    }
}

exports.getList = function(req, resp){

    var sql = squel.select()
        .from("API_SysfUsers")
        .field("Username")
        .field("Fullname")
        .field("UserType")
        .field("Company")
        .field("Email")
        .field("Department")
        .field("RegisterDate")
        .field("TrxNo")
        .where("UStatus = ?", "A")
        .toString();
    helper.execCommandWithConnection(req, resp, sql, settings.db2Config);
}
