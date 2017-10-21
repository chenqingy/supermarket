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


 
//获取浏览器页面可见高度和宽度  
var _PageHeight = document.documentElement.clientHeight,  
    _PageWidth = document.documentElement.clientWidth;  
//计算loading框距离顶部和左部的距离（loading框的宽度为215px，高度为61px）  
var _LoadingTop = _PageHeight > 61 ? (_PageHeight - 61) / 2 : 0,  
    _LoadingLeft = _PageWidth > 215 ? (_PageWidth - 215) / 2 : 0;  
//在页面未加载完毕之前显示的loading Html自定义内容  
var _LoadingHtml = '<div id="loadingDiv" style="position:absolute;left:0;width:100%;height:' + _PageHeight + 'px;top:0;background:#f3f8ff;opacity:1;filter:alpha(opacity=80);z-index:10000;"><div style="position: absolute; cursor1: wait; left: ' + _LoadingLeft + 'px; top:' + _LoadingTop + 'px; width: auto; height: 57px; line-height: 57px; padding-left: 50px; padding-right: 5px; background: #fff  scroll 5px 10px; border: 2px solid #95B8E7; color: #696969; font-family:\'Microsoft YaHei\';">页面加载中，请等待...</div></div>';  
//呈现loading效果  
document.write(_LoadingHtml);  
  
// window.onload = function () {  
//    var loadingMask = document.getElementById('loadingDiv');  
//    loadingMask.parentNode.removeChild(loadingMask);  
// };  
  
//监听加载状态改变  
document.onreadystatechange = completeLoading;  
  
//加载状态为complete时移除loading效果  
function completeLoading() {  
    if (document.readyState == "complete") {  
        var loadingMask = document.getElementById('loadingDiv');  
        loadingMask.parentNode.removeChild(loadingMask);  
    }  
}  