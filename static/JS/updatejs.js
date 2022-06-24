    let image_num=0;
    let image_list;
    window.onload = function () {
        if (post_num != "") {
            $('#postSaveBtn').text("기록수정")
            console.log("수정")
            $.ajax({
                type: "GET",
                url: "./getRecord",
                data: {'postIdx': post_num},
                success: function (response) {
                    console.log(response)

                    $('#textarea').val(response['content'])
                    $("#title").val(response['title'])
                    if (response['Images'][0] != null) {
                        image_list=response['Images']
                        console.log("image_list",image_list)
                        $('#preview-image-header:not(:has(.preview-header))').append(`<div class="text-primary my-4 preview-header">미리보기</div>`)
                        image_num= response['Images'].length + formData.getAll('files').length
                        if (($('#preview-image-header').length) != 0) {
                            $('.preview-header').text('미리보기 ' + image_num + '개')
                        }

                        for (let image of response['Images']) {
                            let temp_html = `<div class="col">
                        <img src="${image}" alt=""   width="100%" height="225" style="object-fit: contain" >
                        </div>`
                            $(`#preview-image-container`).append(temp_html)
                        }

                    }
                }
            })
        }
    }