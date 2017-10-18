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
                    response.send(apiResult(true, result.data, "查询成功"));
                    
                } else {
                    response.send(apiResult(false, null, "没有该商品，请重新查询"));
                }
            })
        });
    }
}