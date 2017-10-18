$(function($){
    var $barCode = $('#main_content #event .menu #barCode');
    
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

    var $responseMessage = $('#responseMessage');
    $barCode.keypress(function(e) {  
        // 获取返回的消息显示元素
       
        console.log($responseMessage);   
            
        // 回车键事件  
        if(e.which == 13) {
            var barCode = $barCode.val();
            console.log(barCode)
            $.post('http://localhost:88/orderControl', {proBarCode: barCode}, function(res) {
                /*optional stuff to do after success */
                console.log(res)
                response(res.status, $responseMessage, res.message);

                // if(!res.status){
                //     // var html = `<tr><td>${res.message}</td></tr>`;
                //     // $('tbody').html(html).css('text-align', 'center');
                //     return false;
                // }
               
                if(res.data != null){
                    $.each(res.data, function(idx,item){
                        console.log(idx,item);
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
            $barCode.val('');
        }  
    }); 
    // 删除
    $('#cdel').click(function(){
        console.log(777);
        console.log($('#objectID').val());
        $('input').val('');
        $('tbody').html('');
    });
    $('tbody').click(function(e){
        console.log(e.target.parentNode)
        var $son = $(e.target.parentNode);
        $('#cdelbtn').click(function(){
            $.post("http://localhost:88/delorderControl", {
                _id:$('#objectID').val()
            }, function(res){
                response(res.status, $responseMessage, res.message);  
            });
            $son.remove();
        })
    });

    $('ackbtn').click(function(){

    })
        
    // 返回消息显示
    function response(resSta,$ele,resMessage){
        $ele.html(resMessage);
        if(!resSta){
            $ele.css('color', '#f00');
            return false;
        }
        $ele.css('color', '#58bc58');
    }
})