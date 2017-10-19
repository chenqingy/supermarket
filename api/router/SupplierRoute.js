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
        // 删除商品
        app.post("/delSupplier", urlencode, function(request, response){
            var doc = {};
            if (request.body) {
                doc = request.body;
            }
            // console.log(doc);
            var mongodb = require('mongodb');
            var obj_id = new mongodb.ObjectID.createFromHexString(doc._id);
            db.delete("supplier", {"_id":obj_id}, function(result){
                if(!result.status){
                    response.send(apiResult(false, null, "删除错误"));
                    return false;
                }
                response.send(apiResult(true, request.body, "删除成功"));
            });
        });

        // 查询商品
        app.post("/selectSupplier", urlencode, function(request, response){
            // console.log(request.body);
            var obj = {};
            for(var key in request.body){
                if(request.body[key]){
                    var value = request.body[key];
                    obj[key] = value;
                }
            }
            // console.log(obj);
            db.select("supplier", obj, function(result){
                // console.log(obj);
                // console.log(result);
                if(!result.status){
                    response.send(apiResult(false, null, error));
                    return false;
                }
                // if(result.data){
                //     // console.log(result.data);
                //     response.send(apiResult(true, result.data, "查询成功"));
                // } else {
                //     response.send(apiResult(false, null, "没有该商品，请重新查询"));
                // }
                response.send(apiResult(true, result.data, "查询成功"));
            })
        });
        app.post("/modSupplier", urlencode, function(request, response){
            var doc = {};
            if (request.body) {
                doc = request.body;
            }
            if(doc._id == ''){
                response.send(apiResult(false, null, "更改失败没有该商品，请重新输入"));
                return false;
            }
            var mongodb = require('mongodb');
            var obj_id = new mongodb.ObjectID.createFromHexString(doc._id);
            // obj为将传进来的参数id过滤。obj为更新后的对象
            var obj = {};
            for(var key in request.body){
                if(request.body[key] && key != '_id'){
                    var value = request.body[key];
                    obj[key] = value;
                }
            }
            db.update("supplier", {"_id":obj_id}, obj, function(result){
                if(!result.status){
                    response.send(apiResult(false, null, "服务器链接错误"));
                    return false;
                }
                response.send(apiResult(true, request.body, "更新成功"));
            });
            
        })



    }
}