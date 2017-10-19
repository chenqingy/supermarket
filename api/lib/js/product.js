// 将头部引入
$(function($){
    // 隐藏数据库里的id
    $('#objectID').parents('.form-group').css('display', 'none');

    // 执行权限
    quanxian();

    // 点击tr高亮,并把数据库的内容显示在val框里
    function active(){
        $('tbody').on('click', 'td', function(){
            // console.log($(this));
            // 点击tr高亮
            $(this).parents('tr').css('background-color', '#0e90b2').siblings().css('background-color', '');

            $('#productType').val($(this).parents('tr').children().eq(1).text());
            $('#productName').val($(this).parents('tr').children().eq(2).text()); 
            $('#productDes').val($(this).parents('tr').children().eq(3).text()); 
            $('#SalePrice').val($(this).parents('tr').children().eq(4).text()); 
            $('#purPrice').val($(this).parents('tr').children().eq(5).text());
            $('#barCode').val($(this).parents('tr').children('th').attr('barcode'));
            $('#objectID').val($(this).parents('tr').attr('data-guid'));
        })
    };
    active();
    // 获取返回的消息显示元素
    var $responseMessage = $('#responseMessage');
    
    // 添加上架
    $('#addPro').click(function(){
        if($('#barCode').val() == ''){
            $responseMessage.html('添加失败，请输入条形码').css('color', '#f00');
            return false;
        }
        // 上架商品 上架之前先查询是否有这个商品
        $.post(common.baseUrl + "showStock",{proName:$('#productName').val()}, function(yeyeresult){
            // console.log(yeyeresult);
            // 如果仓库里没有该商品，提示信息
            if(!yeyeresult.status){
                $responseMessage.html(yeyeresult.message);
                return false;
            }
            // 仓库里有商品， 发送请求添加进上架库
            $.post(common.baseUrl + "addProduct", {
                proType:$('#productType').val(),
                proName:$('#productName').val(),
                proDes:$('#productDes').val(),
                proSalePrice:$('#SalePrice').val(),
                proPurPrice:$('#purPrice').val(),
                proBarCode:$('#barCode').val(),
                proSelect:$('#select').val(),
                proQty:1
            }, function(res){
                // 输入框为空,加载数据库的数据，显示返回消息
                $('tbody').html('');
                showProduct();
                // 提示上架信息
                response(res.status, $responseMessage, res.message);

                // 每上架一件同名商品，仓库的数量-1 发送仓库请求搜索对应名字的商品 获取仓库商品id去更改qty
                $.post(common.baseUrl + "showStock", {
                    proName:$('#productName').val()
                }, function(cangkuresult){
                    // 显示的是每次点击时，对应名字的仓库的商品信息
                    var obj = {
                        proName: cangkuresult.data[0].proName,
                        proPurPrice: cangkuresult.data[0].proPurPrice,
                        proQty: Number(cangkuresult.data[0].proQty),
                        proType: cangkuresult.data[0].proType,
                        supName: cangkuresult.data[0].supName,
                        _id:cangkuresult.data[0]._id
                    }
                    obj.proQty--;
                    // 发信息更改仓库数量
                    $.post(common.baseUrl + "goodsUpdate", obj, function(result1){
                        console.log("仓库数量-1");

                    });
                });
            });
        })       
    });
    // 删除
    $('#delPro').click(function(){

        $.post(common.baseUrl + "delProduct", {
            _id:$('#objectID').val()
        }, function(res){
            // 输入框为空,加载数据库的数据，显示返回消息
            $('tbody').html('');
            showProduct(); 
            response(res.status, $responseMessage, "下架成功");  

            // 每下架一件同名商品，仓库的数量+1,发送仓库请求搜索对应名字的商品 获取仓库商品id去更改qty
            $.post(common.baseUrl + "showStock", {
                proName:$('#productName').val()
            }, function(cangkuresult){
                // 仓库数量更改之后清空val框
                $('input').val('');
                // 显示的是每次点击时，对应名字的仓库的商品信息
                var obj = {
                    proName: cangkuresult.data[0].proName,
                    proPurPrice: cangkuresult.data[0].proPurPrice,
                    proQty: Number(cangkuresult.data[0].proQty),
                    proType: cangkuresult.data[0].proType,
                    supName: cangkuresult.data[0].supName,
                    _id:cangkuresult.data[0]._id
                }
                obj.proQty++;
                // 发信息更改仓库数量
                $.post(common.baseUrl + "goodsUpdate", obj, function(result1){
                    console.log("仓库数量+1");

                });
            });
        });
    });
    // 查询
    $('#selPro').click(function(){
        $.post(common.baseUrl + "selectProduct", {
            proType:$('#productType').val(),
            proName:$('#productName').val(),
            proDes:$('#productDes').val(),
            proSalePrice:$('#SalePrice').val(),
            proPurPrice:$('#purPrice').val(),
            proBarCode:$('#barCode').val(),
            proSelect:$('#select').val(),
            proQty:1
        }, function(res){
            console.log(res);
            $('tbody').html('');
            response(res.status, $responseMessage, res.message);
            if(!res.status){
                return false;
            }
            if(res.data.length > 0){
                $.each(res.data, function(idx,item){
                    // console.log(idx,item);
                    var html = `
                        <tr data-guid="${item._id}">
                            <th scope="row" barcode="${item.proBarCode}">${idx+1}</th>
                            <td>${item.proType}</td>
                            <td>${item.proName}</td>
                            <td>${item.proDes}</td>
                            <td>${item.proSalePrice}</td>
                            <td>${item.proPurPrice}</td>
                            <td>${item.proSelect}</td>
                        </tr>
                    `;
                    $('tbody').append(html);
                });
            }
        });
    });
    // 修改
    $('#modPro').click(function(){
        $.post(common.baseUrl + "modProduct", {
            proType:$('#productType').val(),
            proName:$('#productName').val(),
            proDes:$('#productDes').val(),
            proSalePrice:$('#SalePrice').val(),
            proPurPrice:$('#purPrice').val(),
            proBarCode:$('#barCode').val(),
            proSelect:$('#select').val(),
            proQty:1,
            _id:$('#objectID').val()
        }, function(res){
            console.log(res);
            $('tbody').html('');
            showProduct();
        });
    })

    
    // 刷新页面 将上架的商品
    function showProduct(){
        $.ajax({
            url:common.baseUrl + "allProduct",
            type:"POST",
            data:{},
            success:function(res){
                // console.log(res.data);
                if(!res.status){
                    var html = `<tr><td>${res.message}</td></tr>`;
                    $('tbody').html(html).css('text-align', 'center');
                    return false;
                }
                if(res.data.length > 0){
                    $.each(res.data, function(idx,item){
                        // console.log(idx,item);
                        var html = `
                            <tr data-guid="${item._id}">
                                <th scope="row" barcode="${item.proBarCode}">${idx+1}</th>
                                <td>${item.proType}</td>
                                <td>${item.proName}</td>
                                <td>${item.proDes}</td>
                                <td>${item.proSalePrice}</td>
                                <td>${item.proPurPrice}</td>
                                <td>${item.proSelect}</td>
                            </tr>
                        `;
                        $('tbody').append(html);
                    });                        
                }
            }
        });
        
    }
    showProduct();
        
});
