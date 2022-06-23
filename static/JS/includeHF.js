$(document).ready(function (){

        $("#header").load("./header",function(){
            changeHeaderClass()
        });  // 원하는 파일 경로를 삽입하면 된다
        $("#footer").load("./footer");  // 추가 인클루드를 원할 경우 이런식으로 추가하면 된다
});

function changeHeaderClass(){

    $('ul.nav >li >a.active').removeClass('active')
    $('ul.nav >li >a#'+page).addClass('active')
    // let nav = $('ul.nav').children("li");
    //     for (let i = 0; i < nav.length; i++) {
    //             console.log(nav[i])
    //             if ($(nav[i]).children("a").hasClass('active')) {
    //
    //                     $(nav[i]).children("a").removeClass('active')
    //             }
    //     }
    //     console.log($('ul.nav').children("li"));
}