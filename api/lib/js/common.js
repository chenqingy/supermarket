// 将头部引入
$(function($){
    $('#Head').load('../../common.html #header', function(){
        $('#logout').click(function(){
            $.cookie('token', null);console.log(660)
        })
    });
    $('#Main_nav').load('../../common.html #main_nav');

    $('#Main_nav').load('../../common.html #main_nav', function(){
        $navHeight = $('#main_content').height();
        // console.log($navHeight);
        $('#Main_nav').height($navHeight);
    });



});
var common = common || {};
common.baseUrl = 'http://localhost:88/';

// 返回消息显示 
// resSta为返回的状态
// $ele为显示返回消息的元素
// resMessage为返回的消息内容
function response(resSta,$ele,resMessage){
    $ele.html(resMessage);
    if(!resSta){
        $ele.css('color', '#f00');
        return false;
    }
    $ele.css('color', '#58bc58');
}

function quanxian(){
    var token = $.cookie('token');
    $.ajax({
        type: 'POST',
        url: 'http://localhost:88/test1',
        headers: {'Authorization': token},
        success: function(response){
            // console.log(response);
            if(!response.status){
                var a = $('<a/>').text('请先登录在访问本页面').attr('href','login.html').css({'font-size':'36px','color':'#fff'});
                var html = $('<div/>').css({'width':'100%','height':'100%','background-color':'rgba(0,0,0,0.5)',
                    'position': 'absolute','text-align':'center','padding-top':'20%'}).html(a);
                $('body').html(html);
            }
        }
    })
}