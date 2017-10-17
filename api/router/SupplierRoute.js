var db = require('../DBHelper.js');
var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({extended: false});

var apiResult = require('../ApiResult.js');

module.exports = {
    Register: function(app){
        app.post("/addSupplier", urlencode, function(request, response){
            db.select("supplier", {supplierName: request.body.supplierName}, function(result){
                console.log(result);
                if(!result.status){
                    response.send(apiResult(false, null, error));
                } else if(result.data.length > 0) {
                    response.send(apiResult(false, null, "供应商已经存在"));
                } else {
                    db.insert("supplier", request.body, function(result){
                        response.send(apiResult(true, request.body, "供应商添加成功"));
                        console.log(result);
                    })
                }
            })
        })

        app.post("/addAll", urlencode, function(request, response){
            db.find("supplier", {qty:request.body.qty, pageNo:request.body.pageNo}, function(result){
                if(!result.status){
                    response.send(apiResult(false, null, 'error'));
                } else if(result.data.length > 0) {
                    response.send(apiResult(true, result.data, "所有数据在此"));
                } 
            })
        });
        
        /*app.post("/login", urlencode, function(request, response){
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
        })*/
    }
}