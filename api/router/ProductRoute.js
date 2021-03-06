var db = require('../DBHelper.js');
var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({extended: false});

var apiResult = require('../ApiResult.js');

module.exports = {
    Register: function(app){
        // 增加商品
        app.post("/addProduct", urlencode, function(request, response){
            db.select("product", {proBarCode: request.body.proBarCode}, function(result){
                if(!result.status){
                    return false;
                }
                if(result.data.length > 0){
                    response.send(apiResult(false, null, "该商品已存在"));
                    
                } else {
                    db.insert("product", request.body, function(result){
                        response.send(apiResult(true, request.body, "添加成功"));
                    });
                }
            })
        });
        // 删除商品
        app.post("/delProduct", urlencode, function(request, response){
            // 定义doc来接收出传进来的id
            var doc = {};
            if (request.body) {
                doc = request.body;
            }
            if(doc._id == ''){
                response.send(apiResult(false, null, "删除失败没有该商品，请重新输入"));
                return false;
            }
            // 转换为objectid
            var mongodb = require('mongodb');
            var obj_id = new mongodb.ObjectID.createFromHexString(doc._id);
            db.delete("product", {"_id":obj_id}, function(result){
                if(!result.status){
                    response.send(apiResult(false, null, "删除错误"));
                    return false;
                }
                response.send(apiResult(true, request.body, "删除成功"));
            });
        });
        // 查询商品
        app.post("/selectProduct", urlencode, function(request, response){
            var obj = {};
            for(var key in request.body){
                if(request.body[key]){
                    var value = request.body[key];
                    obj[key] = value;
                }
            }
            db.select("product", obj, function(result){
                if(!result.status){
                    response.send(apiResult(false, null, error));
                    return false;
                }
                if(result.data.length > 0 ){
                    response.send(apiResult(true, result.data, "查询成功"));
                } else {
                    response.send(apiResult(false, null, "没有该商品，请重新查询"));
                }
            })
        });
        // 修改
        app.post("/modProduct", urlencode, function(request, response){
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
            db.update("product", {"_id":obj_id}, obj, function(result){
                if(!result.status){
                    response.send(apiResult(false, null, "服务器链接错误"));
                    return false;
                }
                response.send(apiResult(true, request.body, "更新成功"));
            });
            
        });
        // 所有商品
        app.post("/allProduct", urlencode, function(request, response){
            db.select("product", {}, function(result){
                if(!result.status){
                    response.send(apiResult(false, null, "数据请求错误"));
                    return false;
                }
                if(result.data.length > 0){
                    response.send(apiResult(true, result.data, "仓库所有商品"));
                } else {
                    response.send(apiResult(false, null, "仓库里没有商品了"))
                } 
            })
        });


        // 以下是仓库管理
        // 点击进货
        app.post('/goodsAdd', urlencode, function(request, response){
            db.select("stock", {supName: request.body.supName}, function(result){
                if(!result.status){
                    response.send(apiResult(false, null, "服务器链接错误"));
                    return false;
                }
                if(result.data.length > 0){
                    // 做修改qty+
                    response.send(apiResult(false, null, "该商品已在进货单中，请点击修改来更改进货信息"));
                    
                } else {
                    db.insert("stock", request.body, function(result){
                        response.send(apiResult(true, request.body, "进货成功"));
                    });
                }
            });
        });
        // 点击修改进货信息
        app.post("/goodsUpdate", urlencode, function(request, response){
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
            db.update("stock", {"_id":obj_id}, obj, function(result){
                if(!result.status){
                    response.send(apiResult(false, null, "服务器链接错误"));
                    return false;
                }
                response.send(apiResult(true, request.body, "更新成功"));
            });
            
        });
        // 点击退货
        app.post("/goodsReturn", urlencode, function(request, response){
            // 定义doc来接收出传进来的id
            var doc = {};
            if (request.body) {
                doc = request.body;
            }
            if(doc._id == ''){
                response.send(apiResult(false, null, "没有该货品退货失败"));
                return false;
            }
            // 转换为objectid
            var mongodb = require('mongodb');
            var obj_id = new mongodb.ObjectID.createFromHexString(doc._id);
            db.delete("stock", {"_id":obj_id}, function(result){
                if(!result.status){
                    response.send(apiResult(false, null, "供应商未接收到消息，退货错误"));
                    return false;
                }
                response.send(apiResult(true, request.body, "退货成功，供应商已接收到消息"));
            });
        });
        // 查询仓库商品
        app.post('/showStock', urlencode, function(request, response){
            db.select("stock", request.body, function(result){
                // console.log(result);
                if(!result.status){
                    response.send(apiResult(false, null, "数据请求错误"));
                    return false;
                }
                if(result.data.length > 0){
                    response.send(apiResult(true, result.data, "仓库所有商品"));
                } else {
                    response.send(apiResult(false, null, "仓库里该没有商品"))
                } 
            })
        })


    }
}