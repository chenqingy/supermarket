$(function($){
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
        $.post('http://localhost:88/addSupplier',{
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
            }
        })  
    });

    render();
    function render(qty, pageNo){
        $.post('http://localhost:88/addAll',{
            // qty:qty,
            // pageNo:pageNo
        },
            function(response){
            // console.log(response);
            if(response.status){
                $.each(response.data, function(index, item){
                    var html = `<tr>
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
})