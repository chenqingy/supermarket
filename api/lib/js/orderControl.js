$(function($){
    var $barCode = $('#main_content #event .menu #barCode');
    
    $barCode.keypress(function(e) {  
        
        
    // 回车键事件  
       if(e.which == 13) {
        var barCode = $barCode.val();
        console.log(barCode)
            $.post('http://localhost:88/orderControl', {proBarCode: barCode}, function(response) {
                /*optional stuff to do after success */
                console.log(response)
            }); 
       }  
   }); 
})