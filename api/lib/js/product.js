// 将头部引入
$(function($){
    // 隐藏数据库里的id
    $('#objectID').parents('.form-group').css('display', 'none');

    // 判断input框状态 不能为空
    function format(){
    }

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
    }
    active();
    // 添加
    $('#addPro').click(function(){
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
            // 输入框为空
            $('input').val('');
            $('tbody').html('');
            showProduct();
        });

    });
    // 删除
    $('#delPro').click(function(){

        $.post("http://localhost:88/delProduct", {
            _id:$('#objectID').val()
        }, function(res){
            console.log(res);

            if(!res.status){
                return false;
            }
            // 输入框为空
            $('input').val('');
            $('tbody').html('');
            showProduct();   
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
            if(!res.status){
                $('tbody').html(res.message);
                return false;
            }
            if(res.data.length > 0){
                $.each(res.data, function(idx,item){
                    // console.log(idx,item);
                    var html = `
                        <tr>
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
                console.log(res.data);
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

    // 将数据库的东西显示在value框里
    // 没写完
        
});
