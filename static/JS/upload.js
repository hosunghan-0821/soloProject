let formData = new FormData();

/**
 * @param input : <input = file> 요소 객체
 *
 * 파일 미리보기 창 만들고, 아래 해당 이미지 reader를 통해 preview 제공해주는 함수.
 *
 */
function readURL(input){
    let fileList = input.files;
    console.log(fileList)
    $('#preview-image-header:not(:has(.preview-header))').append(`<div class="text-primary my-4 preview-header">미리보기</div>`)

    for (let i = 0 ; i <fileList.length;i++){
        console.log("실행")
        formData.append('files',fileList[i])
        var reader = new FileReader()
        reader.onload = function (e){
            let temp_html= `
                            <div class="col">
                            <img src="${e.target.result}" alt=""   width="100%" height="225" style="object-fit: contain" >
                            </div>
                            `
            $(`#preview-image-container`).append(temp_html)
        }
        reader.readAsDataURL(fileList[i])
    }

    //이미 미리보기 div 가 존재하다면, 파일 formdata 개수에 따라 몇개의 미리보기가 있는지 text 변경
    if(($('#preview-image-header').length)!=0 ){
        $('.preview-header').text('미리보기 '+(image_num+formData.getAll('files').length)+'개')
    }
}


/**
 * 서버로 데이터 보내는 함수
 *  ajax 비동기를 통해 flask 서버로 데이터 정보 저장 및 응답 대기
 */
$(`#postSaveBtn`).on("click",function (){
    sendData()
})
function sendData(){

    for (let key of formData.values()) {
        console.log(key);
    }
    if($('#textarea').val() =="" || $('#title').val()=="" ){
        alert("제목 혹은 내용 쓰세요")
        return;
    }
    formData.append("text",$('#textarea').val())
    formData.append("title",$('#title').val())
    $.ajax({
        type: "POST",
        url: "./savePost",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if(response['msg']=='success'){
                window.location.href=("/board")
            }

        }
    })
}