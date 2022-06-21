/**
 * <!--
 * 1. Clinet(게시글 모아놓는 곳 board.html) -> Server (게시글 번호 postIdx get Request )
 * 2. Server -> 게시글 읽는 페이지.html + 변수명(게시글 번호)
 * 3. Client (게시글 읽는 페이지.html )->Server ( ajax : 게시글 정보 받아오기)
 * 4. server 로부터 ajax를 통해 받아온 데이터를 javascript 활용해서 html에 데이터 뿌려주기
 * -->
 */
$.ajax({
    type: "GET",
    url: "./getRecord",
    data: {'postIdx': post_num},
    success: function (response) {
        console.log(response)
        $('#textarea').val(response['content'])
        $("#title").text(response['title'])
        if(response['Images'][0]!=null){

            $("#preview-image-header").text('업로드 이미지')
            for(let image of response['Images']){
                let temp_html= `<div class="col">
                        <img src="${image}" alt=""   width="100%" height="225" style="object-fit: contain" >
                        </div>`
                $(`#preview-image-container`).append(temp_html)
            }

        }
    }
})