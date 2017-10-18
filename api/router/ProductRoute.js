var db = require('../DBHelper.js');
var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({extended: false});

var apiResult = require('../ApiResult.js');

module.exports = {
    Register: function(app){
        // 增加商品
        app.post("/addProduct", urlencode, function(request, response){
            // console.log(request.body);
            db.select("product", {proBarCode: request.body.proBarCode}, function(result){
                if(!result.status){
                    return false;
                }
                if(result.data.length > 0){
                    response.send(apiResult(false, null, "该商品已存在"));
                    // db.update("product", request.body.proQty, function(result){
                    //     response.send(apiResult(true, request.body, "添加成功"));
                    // });
                } else {
                    db.insert("product", request.body, function(result){
                        // console.log(result);
                        response.send(apiResult(true, request.body, "添加成功"));
                    });
                }
            })
            
        });
        // 删除商品
        app.post("/delProduct", urlencode, function(request, response){
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
            // console.log(request.body);
            var obj = {};
            for(var key in request.body){
                if(request.body[key]){
                    var value = request.body[key];
                    obj[key] = value;
                }
            }
            // console.log(obj);
            db.select("product", obj, function(result){
                if(!result.status){
                    response.send(apiResult(false, null, error));
                    return false;
                }
                if(result.data.length > 0 ){
                    // console.log(result.data);
                    response.send(apiResult(true, result.data, "查询成功"));
                } else {
                    response.send(apiResult(false, null, "没有该商品，请重新查询"));
                }
            })
        });

        app.post("/modProduct", urlencode, function(request, response){
            console.log(response.body);
            response.send('请求成功');
        })
        // 所有商品
        app.post("/allProduct", urlencode, function(request, response){
            db.select("product", {}, function(result){
                // console.log(result);
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
        })
    }
}