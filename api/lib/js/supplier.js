$(function($){
    // 隐藏数据库里的id
    $('#objectID').parents('.form-group').css('display', 'none');

    $('#addSupplier').click(function(){
        var $supplierType = $('#supplierType').val();
        var $supplierName = $('#supplierName').val();
        var $supplierIden = $('#supplierIden').val();
        var $supplierPhone = $('#supplierPhone').val();
        var $supplierCom = $('#supplierCom').val();
        if(supplierType.length <= 0 && $supplierName.length <= 0 
            && $supplierIden.length <= 0 && $supplierPhone.length <= 0 && $supplierCom.length <= 0){
            alert('填写完整数据');
            return false;
        }
        $.post(common.baseUrl + 'addSupplier',{
            supplierType:$('#supplierType').val(),
            supplierName:$('#supplierName').val(),
            supplierIden:$('#supplierIden').val(),
            supplierPhone:$('#supplierPhone').val(),
            supplierCom:$('#supplierCom').val()
        },function(response){
            console.log(response);
            if(response.status){
                alert('增加数据成功');
                $('#tablelist').text('');
                render();
                $('input').val('');
                $('tbody').html('');
                response(response.status,$responseMessage, response.message);
            }
        })  
    });

    render();
    function render(qty, pageNo){
        $.post(common.baseUrl + 'addAll',{
            // qty:qty,
            // pageNo:pageNo
        },
            function(response){
            // console.log(response);
            if(response.status){
                $.each(response.data, function(index, item){
                    var html = `<tr data-guid="${item._id}">
                                <th>${index+1}</th>
                                <td>${item.supplierType}</td>
                                <td>${item.supplierId}</td>
                                <td>${item.supplierName}</td>
                                <td>${item.supplierPhone}</td>
                                <td>${item.supplierCom}</td>
                                </tr>`;
                    $('#tablelist').append(html);
                })
            }
        })
    }

    $('#loadMore').click(function(){
        // var pageNo = 1;
        // pageNo++;
        // console.log(pageNo);
        // if(pageNo > 3){
        //     alert("当前已经是最后一页");
        //     return false;
        // }
        // render(5, pageNo);
        alert('我不能再给你更多了');
    })

    function active(){
        $('tbody').on('click', 'td', function(){
            // console.log($(this));
            // 点击tr高亮
            $(this).parents('tr').css('background-color', '#0e90b2').siblings().css('background-color', '');

            $('#supplierType').val($(this).parents('tr').children().eq(1).text());
            $('#supplierName').val($(this).parents('tr').children().eq(2).text()); 
            $('#supplierIden').val($(this).parents('tr').children().eq(3).text()); 
            $('#supplierPhone').val($(this).parents('tr').children().eq(4).text()); 
            $('#supplierCom').val($(this).parents('tr').children().eq(5).text()); 
            $('#objectID').val($(this).parents('tr').attr('data-guid'));
            console.log($('#objectID').val());
        })
    }
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

    // 删除
    $('#remSupplier').click(function(){
        // console.log($('#objectID').val())
        $.post(common.baseUrl + "delSupplier", {
            _id:$('#objectID').val()
        }, function(res){
            // console.log(res);

            if(!res.status){
                return false;
            }
            // 输入框为空
            $('input').val('');
            $('tbody').html('');
            render(); 
            response(res.status,$responseMessage, res.message); 
        });
    });

    // 查询
    $('#selSupplier').click(function(){
        $.post(common.baseUrl + "selectSupplier", {
            supplierType:$('#supplierType').val(),
            supplierName:$('#supplierName').val(),
            supplierIden:$('#supplierIden').val(),
            supplierPhone:$('#supplierPhone').val(),
            supplierCom:$('#supplierCom').val()
        }, function(res){
            console.log(res);
            $('tbody').html('');
            response(res.status, $responseMessage, res.message);
            if(!res.status){
                $('tbody').html(res.message);
                return false;
            }
            if(res.data.length > 0){
                $.each(res.data, function(idx,item){
                    // console.log(idx,item);
                    var html = `<tr data-guid="${item._id}">
                               <th>${idx+1}</th>
                               <td>${item.supplierType}</td>
                               <td>${item.supplierId}</td>
                               <td>${item.supplierName}</td>
                               <td>${item.supplierPhone}</td>
                               <td>${item.supplierCom}</td>
                               </tr>`;
                    $('#tablelist').append(html);
                    // $('tbody').append(html);
                });
            }
        });
    });
    // var token = $.cookie('token');
    // $.ajax({
    //     type: 'POST',
    //     url: 'http://localhost:88/test1',
    //     headers: {'Authorization': token},
    //     success: function(response){
    //         console.log(response);
    //         if(!response.status){
    //             var a = $('<a/>').text('请先登录在访问本页面').attr('href','login.html').css({'font-size':'36px','color':'#fff'});
    //             var html = $('<div/>').css({'width':'100%','height':'100%','background-color':'rgba(0,0,0,0.5)',
    //                 'position': 'absolute','text-align':'center','padding-top':'20%'}).html(a);
    //             $('body').html(html);
    //         }
    //     }
    // })


})