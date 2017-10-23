var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var db;
MongoClient.connect("mongodb://10.3.131.22:27017/supermarket", function(err, database) {
  if(err) throw err;
  db = database;
});
var apiResult = require('./ApiResult.js');

module.exports = {
    insert: function(_collection, _data, _callback){
        
        db.collection(_collection).insert(_data).then(function(result){
           _callback(apiResult(true, _data));
        });
    },
    select: function(_collection, _condition, _callback){
        
        db.collection(_collection).find(_condition || {}).toArray(function(error, dataset){
            _callback(apiResult(true, dataset));
        });
    },
    update: function(_collection, _condition, _newdata, _callback){
        
        db.collection(_collection).update(_condition || {}, _newdata || {}).then(function(error, dataset){
            _callback(apiResult(true, dataset));
        });
    },
    delete: function(_collection, _condition, _callback){
        
        db.collection(_collection).remove(_condition || {}).then(function(error, dataset){
            _callback(apiResult(true, dataset));
        });
    },
    //数据分页
    find: function(_collection, _condition, _callback){
        db.open(function(error, db){
            if(error){
                _callback(apiResult(false, null, "服务器链接错误"));
                return false;
            }
            db.collection(_collection, function(error, collection){
                if(error){
                    _callback(apiResult(false, null, "数据库链接错误"));
                    return false;
                }
                var qty = Number(_condition.qty);
                var pageNo = Number(_condition.pageNo)-1;
                collection.find().limit(qty).skip(qty*pageNo).toArray(function(error, dataset){
                    if(error){
                        _callback(apiResult(false, null, "分页失败"));
                        return false;
                    }
                    _callback(apiResult(true, dataset, "成功分页"));
                });
            })
            db.close(); 
        })
    }
}