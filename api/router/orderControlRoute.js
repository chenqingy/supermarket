var db = require('../DBHelper.js');
var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({extended: false});

var apiResult = require('../ApiResult.js');

module.exports = {
    Register: function(app){
        // 查询商品
        app.post("/orderControl", urlencode, function(request, response){
            
            db.select("product", {proBarCode: request.body.proBarCode}, function(result){
                // console.log(request.body);
                // console.log(result);
                if(!result.status){
                    response.send(apiResult(false, null, error));
                    return false;
                }
                if(result.data.length > 0 ){
                    // console.log(result.data);
                    db.insert("order", result.data, function(result){
                        // console.log(result);
                        // response.send(apiResult(true, request.body, "添加成功"));
                        
                    });
                    response.send(apiResult(true, result.data, "添加成功"));
                    
                } else {
                    response.send(apiResult(false, null, "没有该商品，请重新查询"));
                }
            })
        });
        app.post("/Control", urlencode, function(request, response){
            
            db.select("order", {proBarCode: request.body.proBarCode}, function(result){
                // console.log(request.body);
                // console.log(result);
                if(!result.status){
                    response.send(apiResult(false, null, error));
                    return false;
                }
                if(result.data.length > 0 ){
                    // console.log(result.data);
                    response.send(apiResult(true, result.data, "添加成功"));
                } else {
                    response.send(apiResult(false, null, "没有该商品，请重新查询"));
                }
            })
        });
        // 删除商品
        app.post("/delorderControl", urlencode, function(request, response){
            var doc = {};
            if (request.body) {
                doc = request.body;
            }
            console.log(doc);
            if(doc._id==''){
                response.send(apiResult(false, null, "没有该商品，请重新输入"));
                return false;
            }
            var mongodb = require('mongodb');
            var obj_id = new mongodb.ObjectID.createFromHexString(doc._id);
            db.delete("order", {"_id":obj_id}, function(result){
                if(!result.status){
                    response.send(apiResult(false, null, "删除错误"));
                    return false;
                }
                response.send(apiResult(true, request.body, "删除成功"));
            });
        });
    }
}