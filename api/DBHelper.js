var mongodb = require('mongodb');
var dbServer = new mongodb.Server('10.3.131.11', 27017);
var db = new mongodb.Db('supermarket', dbServer);
var apiResult = require('./ApiResult.js');

module.exports = {
    insert: function(_collection, _data, _callback){
        db.open(function(error, db){
            if(error){
                _callback(apiResult(false, null, error));
                return false;
            } 

            db.collection(_collection, function(error, collection){
                if(error){
                    _callback(apiResult(false, null, error));
                    return false;
                }
                collection.insert(_data);
                _callback(apiResult(true, _data));

            })
            db.close();
            
        })
    },
    select: function(_collection, _condition, _callback){
        db.open(function(error, db){
            if(error){
                _callback(apiResult(false, null, error));
                return false;
            }
            db.collection(_collection, function(error, collection){
                if(error){
                    _callback(apiResult(false, null, error));
                    return false;
                }
                collection.find(_condition || {}).toArray(function(error, dataset){
                    if(error){
                        _callback(apiResult(false, null, error));
                        return false;
                    }
                    _callback(apiResult(true, dataset));
                }); 
            });
            db.close();
        });
    },
    update: function(_collection, _condition, _newdata, _callback){
        db.open(function(error, db){
            if(error){
                _callback(false, null, error);
                return false;
            }
            db.collection(_collection, function(error, collection){
                if(error){
                    _callback(apiResult(false, null, error));
                    return false;
                }
                collection.update(_condition || {}, _newdata || {}, function(error, dataset){
                    if(error){
                        _callback(apiResult(false, null, error));
                        return false;
                    }
                    _callback(apiResult(true, dataset));
                });
            });
            db.close();
        })
    },
    delete: function(_collection, _condition, _callback){
        db.open(function(error, db){
            if(error){
                _callback(apiResult(false, null, error));
                return false;
            }
            db.collection(_collection, function(error, collection){
                if(error){
                    _callback(apiResult(false, null, error));
                    return false;
                }
                collection.remove(_condition, function(error, dataset){
                    if(error){
                        _callback(apiResult(false, null, "删除错误"));
                        return false;
                    }
                    _callback(apiResult(true, dataset, "删除成功"));
                })
            });
            db.close();    

        })
    },
    //数据分页
    find: function(_collection, _condition, _callback){
        db.open(function(error, db){
            if(error){
                _callback(apiResult(false, null, error));
                return false;
            }
            db.collection(_collection, function(error, collection){
                if(error){
                    _callback(apiResult(false, null, error));
                    return false;
                }
                var qty = Number(_condition.qty);
                var pageNo = Number(_condition.pageNo)-1;
                collection.find().limit(qty).skip(qty*pageNo).toArray(function(error, dataset){
                    if(error){
                        _callback(apiResult(false, null, error));
                        return false;
                    }
                    _callback(apiResult(true, dataset, error));
                });
            })
            db.close(); 
        })
    }
}