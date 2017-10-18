var db = require('../DBHelper.js');
var bodyparser = require('body-parser');
var cookie = require('cookie-parser');
var session = require('express-session');
var url = require('url');
var urlencode = bodyparser.urlencoded({extended: false});
var jwt = require('jsonwebtoken');//用来创建和确认用户信息摘要

var apiResult = require('../ApiResult.js');

module.exports = {
    Register: function(app){

        app.use(cookie());
        app.use(session({
            secret: '12345',//用来对session数据进行加密的字符串.这个属性值为必须指定的属性
            name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
            cookie: {maxAge: 800000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
            resave: false,
            saveUninitialized: true,    
        }))

        // //过滤器
        // app.use(function(request, response, next){console.log(request.session);
        //     if(!request.session.name && url.parse(request.url).pathname != "/login"){
        //         response.send(apiResult(false, null, "当前没有权限访问"))
        //         next('{state: false, message: "当前没有权限访问"}');
        //     } else {
        //         next();
        //     }        
        // })

        // app.use(function(req, res, next){
        //     // || req.body.token;
        //     var token = req.headers['authorization']; 
        //     jwt.verify(token, 'secret', function(error, result){
        //         if(error){
        //             res.send({status: false, message: error});
        //         } else {
        //             res.send({status: true});
        //             next();
        //         }
        //     })
        // })

        app.post("/test1", function(req, res){
            // var token = req.body.token;
            var token = req.headers['authorization'];
            jwt.verify(token, 'secret', function(error, result){
                if(error){
                    res.send({status: false, message: error});
                } else {
                    res.send({status: true});
                }
            })
            // console.log(req.session);
            // res.send({state: true});         
        })
        

        app.post("/register", urlencode, function(request, response){
            db.select("user", {username: request.body.username}, function(result){
                // console.log(result);
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
                // console.log(result);
                if(!result.status){
                    response.send(apiResult(false, null, error));
                    return false;
                }
                if(result.data.length > 0 ){
                    var user = {username: request.body.username, password: request.body.password}
                    var token = jwt.sign(user, "secret",  {
                        'expiresIn': 1440 // 设置过期时间
                    })
                    console.log(token);
                    response.send(apiResult(true, {token:token}, "登录成功"));
                } else {
                    response.send(apiResult(false, null, "用户名和密码不匹配"));
                }
            })
        })
    }
}