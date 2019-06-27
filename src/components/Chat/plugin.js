import $ from 'jquery';

$(document).ready(function() {


    // click add friend
    $("#addcontact").click(function() {
        // $(".addFriend").css("visibility", "visible")
        $(".addFriend").css("display", "block");
        $(".addFriend").addClass("bounceInUp");
        $(".addFriend").removeClass("bounceOutDown");

    })

    // close add friends div
    $("#closeAddFriends").click(function() {
        $(".addFriend").removeClass("bounceInUp");
        $(".addFriend").addClass("bounceOutDown");
    })

    


});
