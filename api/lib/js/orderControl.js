$(function($){
    quanxian();

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
    var arr = [];
    var sum = 0;
    var $responseMessage = $('#responseMessage');
    var $total = $('#total');
    var carlist = [];
    var cookies = document.cookie;
    if(cookies.length>0){
        cookies = cookies.split('; ');
        cookies.forEach(function(cookie){
            var temp = cookie.split('=');
            if(temp[0] === 'carlist'){
                carlist = JSON.parse(temp[1]);
            }
        })
    }
    
    $barCode.keypress(function(e) {  
        // 获取返回的消息显示元素
       
        // 回车键事件  
        if(e.which == 13) {
            var barCode = $barCode.val();
          
            var a = true;
            for(var i=0;i<arr.length; i++){

                if(arr[i]==$('#barCode').val()){
                    a=false;
                    var js=i;
                    
                    break;
                }
            }
            if(!a){
               
               var qtyinp = $('.datalist').find('tr').eq(js).find('td').eq(4);
               
               var qty = qtyinp.html();
               qty++;
               qtyinp.html(qty);
             
            }else{
                 $.post(common.baseUrl + 'orderControl', {proBarCode: barCode}, function(res) {
                    arr.push(res.data[0].proBarCode);
                    console.log(arr);
                    // console.log(res)
                    response(res.status, $responseMessage, res.message);

                    if(res.data != null){
                        $.each(res.data, function(idx,item){
                            console.log(idx,item);
                            var html = `
                                <tr data-guid="${item._id}" qrocde="${item.proBarCode}">
                                    <th scope="row">${idx+1}</th>
                                    <td>${item.proType}</td>
                                    <td>${item.proName}</td>
                                    <td>${item.proDes}</td>
                                    <td>${item.proSalePrice}</td>
                                    <td class="qty">${item.proQty}</td>
                                </tr>
                            `;
                            $('tbody').append(html);
                        });
                    }

                }); 
            }
            setTimeout(function(){
                var $tr = $('.datalist').find('tr');
                for(var i=0;i<$tr.length;i++){
                   var qtys = $('.datalist').find('tr').eq(i).find('td').eq(4).html();
                   var prics = $('.datalist').find('tr').eq(i).find('td').eq(3).html();
                   var res = (qtys*prics)*1;
                   sum += res;
                }
                
                $total.val(sum);
                sum=0;
            }, 300)
           
            $barCode.val('');
        }  
    }); 
    
    // 删除
    $('#cdel').click(function(){
        console.log(777);
        console.log($('#objectID').val());
        $('input').val('');
        $('tbody').html('');
        arr=[];
    });
    $('tbody').click(function(e){
        console.log(e.target.parentNode)
        var $son = $(e.target.parentNode);
        var qrocde = $son.attr('qrocde');
        $('#cdelbtn').click(function(){
            $.post(common.baseUrl + "/delorderControl", {
                _id:$('#objectID').val()
            }, function(res){
                response(res.status, $responseMessage, res.message);  
            });
            $son.remove();
            arr.splice(arr.indexOf(qrocde),1);
        })
        
    });
    var a =parseInt(Math.random()*1000000);
    $('#ackbtn').on('click',function(){

        var $gridSystemModalLabel = $('#gridSystemModalLabel');
        var total = $('#total').val();
        $gridSystemModalLabel.html('总价：'+total+"￥");
        $('.modal').modal({
          keyboard: false
        })

        $(".modal-body").qrcode({ 
            text: "http://10.3.131.14:222/daying.html?a="+a //任意内容 
        }); 
        setTimeout(function(){
            window.location.href="daying.html?a="+a;
        }, 3000);
        
        var $tr = $('.datalist').find('tr');
        var arr1 = [];
        for(var i=0;i<$tr.length;i++){
           var qtys = $('.datalist').find('tr').eq(i).find('td').eq(4).html();
           var prics = $('.datalist').find('tr').eq(i).find('td').eq(3).html();
           var name = $('.datalist').find('tr').eq(i).find('td').eq(1).html();
           var res = (qtys*prics)*1;
           sum += res;
           var obj = {
                name:name,
                prics:prics,
                qtys:qtys
           }
           arr1.push(obj);
        }
        console.log(arr1);
        arr1 = JSON.stringify(arr1);
        $.post(common.baseUrl + 'addOrder',
           {orderid:a,
            total:total,
            status:"false",
            data:arr1}
        , function(res) {
            /*optional stuff to do after success */
        });
        // var $tr = $('.datalist').find('tr');
        // for(var i=0;i<$tr.length;i++){
        //     var qtys = $('.datalist').find('tr').eq(i).find('td').eq(4).html();
        //     var prics = $('.datalist').find('tr').eq(i).find('td').eq(3).html();
        //     var name = $('.datalist').find('tr').eq(i).find('td').eq(1).html();
        //     // var type = $('.datalist').find('tr').eq(i).find('td').eq(0).html();
        //     var goods = {
        //         // type:,
        //         name:name,
        //         price:(prics)*1,
        //         qty:(qtys)*1,
        //         total:$('#total').val()
        //     }
        //     carlist.push(goods)
        // }
        // console.log(carlist);
        // var date = new Date();
        // date.setDate(date.getDate()+15);
        // document.cookie = 'carlist=' + JSON.stringify(carlist) + ';expires=' + date.toUTCString();
        // carlist = [];
    })
    $('.close').click(function(){
        $('.modal-body').html('');
    });
   
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