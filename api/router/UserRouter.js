var db = require('../DBHelper.js');
var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({extended: false});

var apiResult = require('../ApiResult.js');

module.exports = {
    Register: function(app){
        app.post("/register", urlencode, function(request, response){
            db.select("user", {username: request.body.username}, function(result){
                console.log(result);
                if(!result.status){
                    response.send(apiResult(false, null, error));
                } else if(result.data.length > 0) {
                    response.send(apiResult(false, null, "当前用户已存在"));
                } else {
                    db.insert("user", request.body, function(result){
                        response.send(apiResult(true, request.body, "注册成功"));
                    })
                }
            })
        });

        app.post("/login", urlencode, function(request, response){
            db.select("user", request.body, function(result){
                console.log(result);
                if(!result.status){
                    response.send(apiResult(false, null, error));
                    return false;
                }
                if(result.data.length > 0 ){
                    response.send(apiResult(true, request.body, "登录成功"));
                } else {
                    response.send(apiResult(false, null, "用户名和密码不匹配"));
                }
            })
        })
    }
}