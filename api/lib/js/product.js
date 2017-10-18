// 将头部引入
$(function($){
    // 隐藏数据库里的id
    $('#objectID').parents('.form-group').css('display', 'none');

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
            $('#objectID').val($(this).parents('tr').attr('data-guid'));

        })
    };
    active();
    // 获取返回的消息显示元素
    var $responseMessage = $('#responseMessage');
    // 返回消息显示
    function response(resSta,$ele,resMessage){
        $ele.html(resMessage);
        if(!resSta){
            $ele.css('color', '#f00');
            return false;
        }
        $ele.css('color', '#58bc58');
    }
    // 添加
    $('#addPro').click(function(){
        if($('#barCode').val() == ''){
            $responseMessage.html('添加失败，请输入条形码').css('color', '#f00');
            return false;
        }
        $.post("http://localhost:88/addProduct", {
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
            // 输入框为空,加载数据库的数据，显示返回消息
            // $('input').val('');
            $('tbody').html('');
            showProduct();
            response(res.status, $responseMessage, res.message);

        });

    });
    // 删除
    $('#delPro').click(function(){

        $.post("http://localhost:88/delProduct", {
            _id:$('#objectID').val()
        }, function(res){
            console.log(res);
            // 输入框为空,加载数据库的数据，显示返回消息
            $('input').val('');
            $('tbody').html('');
            showProduct(); 
            response(res.status, $responseMessage, res.message);  
        });
    });
    // 查询
    $('#selPro').click(function(){
        $.post("http://localhost:88/selectProduct", {
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
                            <th scope="row">${idx+1}</th>
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
        $.post("http://localhost:88/modProduct", {
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
            /*$('tbody').html('');
            showProduct();*/
        });
    })

    // 刷新页面 将所有商品显示在tbody下
    function showProduct(){
        $.ajax({
            url:"http://localhost:88/allProduct",
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
                                <th scope="row">${idx+1}</th>
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
