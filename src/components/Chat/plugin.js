import $ from 'jquery';

$(document).ready(function() {

    console.log("Ready...")

    // click add friend
    $("#addcontact").click(function() {
        // $(".addFriend").css("visibility", "visible")
        $(".addFriend").css("display", "block");
        $(".addFriend").addClass("bounceInUp");
        $(".addFriend").removeClass("bounceOutDown");

    })
    
    
    // close add friends div when click on X Btn 
    $("#closeAddFriends").click(function() {
        $(".addFriend").removeClass("bounceInUp");
        $(".addFriend").addClass("bounceOutDown");
    }) ;

    // close add friends div when ESC Key Pressed  
    $(document).keydown((k)=>{
        if (k.key === 'Escape'){
            // alert("ESC Pressed");
            $(".addFriend").removeClass("bounceInUp");
            $(".addFriend").addClass("bounceOutDown");
        }
    })
    
    // add "active" class to clicked contact  
    $(".cont").click(()=>{
        alert("item Clickd")
        // $(this).addClass("active");
    });

    
    

});

