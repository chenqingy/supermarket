// 将头部引入
$(function($){
    // 隐藏数据库里的id
    $('#objectID').parents('.form-group').css('display', 'none');

    // 点击收起/展开进货单
    $('#packUp').click(function(){
        $(this).parent().next().slideToggle();
    })

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
    
    // 点击进货
    $('#stock').click(function(){
        if($('#purPrice').val() == ''){
            $responseMessage.html('添加失败，请输入进货数量').css('color', '#f00');
            return false;
        }
        $.post(common.baseUrl + "goodsAdd", {
            supName:$('#productType').val(),
            proType:$('#productName').val(),
            proName:$('#productDes').val(),
            proPurPrice:$('#SalePrice').val(),
            proQty:$('#purPrice').val(),
        }, function(res){
            $('#stockList').html('');
            $('#supplyList').html('');
            showSup();
            showStock();
            response(res.status, $responseMessage, res.message);
        });

    });
    // 点击退货
    $('#goodsReturn').click(function(){
        $.post(common.baseUrl + "goodsReturn", {
            _id:$('#objectID').val()
        }, function(res){
            $('#stockList').html('');
            $('#supplyList').html('');
            showSup();
            showStock();
            response(res.status, $responseMessage, res.message);  
        });
    });
    // 修改进货信息
    $('#updateStock').click(function(){
        $.post(common.baseUrl + "goodsUpdate", {
            supName:$('#productType').val(),
            proType:$('#productName').val(),
            proName:$('#productDes').val(),
            proPurPrice:$('#SalePrice').val(),
            proQty:$('#purPrice').val(),
            _id:$('#objectID').val()
        }, function(res){
            console.log(res);
            $('#supplyList').html('');
            $('#stockList').html('');
            showStock();
            showSup();

        });
    });

    /*// 查询
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
    });*/

    // 刷新页面 供应商
    function showSup(){
        $.ajax({
            url:common.baseUrl + "selectSupplier",
            type:"POST",
            data:{},
            success:function(res){
                // console.log(res.data);
                if(!res.status){
                    var html = `<tr><td>${res.message}</td></tr>`;
                    $('#supplyList').html(html).css('text-align', 'center');
                    return false;
                }
                if(res.data.length > 0){
                    $.each(res.data, function(idx,item){
                        // console.log(idx,item);
                        var html = `
                            <tr data-guid="${item._id}">
                                <th scope="row" barcode="${item.proBarCode}">${idx+1}</th>
                                <td>${item.supplierName}</td>
                                <td>${item.supplierType}</td>
                                <td>${item.supplierGoods}</td>
                                <td>${item.supplierCom}</td>
                            </tr>
                        `;
                        $('#supplyList').append(html);
                    });
                }
            }
        });
        
    }
    showSup();
    // 显示进货单
    function showStock(){
        $.ajax({
            url:common.baseUrl + "showStock",
            type:"POST",
            data:{},
            success:function(res){
                if(!res.status){
                    var html = `<tr><td>${res.message}</td></tr>`;
                    $('#stockList').html(html).css('text-align', 'center');
                    return false;
                }
                if(res.data.length > 0){
                    $.each(res.data, function(idx,item){
                        // console.log(idx,item);
                        var total = Number(item.proPurPrice)*Number(item.proQty);
                        var html = `
                            <tr data-guid="${item._id}">
                                <th scope="row" barcode="${item.proBarCode}">${idx+1}</th>
                                <td>${item.supName}</td>
                                <td>${item.proType}</td>
                                <td>${item.proName}</td>
                                <td>${item.proPurPrice}</td>
                                <td>${item.proQty}</td>
                                <td>${total}元</td>
                            </tr>
                        `;
                        $('#stockList').append(html);
                    });
                }
            }
        });
    }
    showStock();
        
});
