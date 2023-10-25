window.onload = () => {
    console.log(document.getElementById("update_title"));

    request();
}

var previous_img_src = '';

async function request() {
    const url = new URL(window.location.href).searchParams;
    const id = url.get('id');

    const response = await fetch(`http://127.0.0.1:8000/articles/${id}/`, {
        method : 'GET'
    })
    const response_json = await response.json()

    previous_img_src = response_json.image;

    document.getElementById("update_title").value = response_json.title;
    document.getElementById("update_content").value = response_json.content;
    document.getElementById("update_category").value = response_json.category;
    if (response_json.image){
        document.getElementById("previous_image").src = `http://127.0.0.1:8000${response_json.image}/`;
    }
    else {
        document.getElementById("previous_image").src = "/media/defaultThumbnail.jpeg";
    }
}

var del_img = 0; //false

function deleteArticleImage() {
    del_img = (del_img+1)%2;
    if (del_img%2 == 0){
        document.getElementById("img_deletion").innerText = "";
        if (document.getElementById("update_image").files[0]){ // img_delete을 짝수 번 누르고, 업데이트하려 했던 파일이 있는 경우.
            handleArticleImagePreview(document.getElementById("update_image"));
        } else { // img_delete을 짝수 번 누르고, 업데이트하려 했던 파일이 없는 경우. (기존 아티클의 파일을 출력해야 함.)
            if (previous_img_src){
                document.getElementById("previous_image").src = `http://127.0.0.1:8000${previous_img_src}/`;
            }
            else {
                document.getElementById("previous_image").src = "/media/defaultThumbnail.jpeg";
            }
        }
    } else {
        document.getElementById("img_deletion").innerText = "image deleted";
        document.getElementById("previous_image").src = "/media/defaultThumbnail.jpeg";
    }
}

async function handleSubmit() {
    const url = new URL(window.location.href).searchParams;
    const id = url.get('id');

    const formData = new FormData();

    console.log(del_img);

    formData.append("title", document.getElementById("update_title").value);
    formData.append("content", document.getElementById("update_content").value);
    if (document.getElementById("update_image").files[0] && (del_img === 0)){
        formData.append("image", document.getElementById("update_image").files[0]);
    } else if (del_img === 1) {
        formData.append("image", ""); // null로 하면 안 됐음.
    } // 삭제 안 누르면 삭제 안되고 그대로 유지.
    formData.append("category", document.getElementById("update_category").value);

    const response = await fetch(`http://127.0.0.1:8000/articles/${id}/`, {
      method: "PUT",
      headers: {
        "Authorization" : "Bearer " + localStorage.getItem("access")
      },
      body: formData,
    });
    const response_json = await response.json();

    if (response.status == 200) {
        alert("게시글 수정 완료!")

        const url = new URL(window.location.href);
        const article_url = new URL("./articles/detail.html", url.origin);
        article_url.searchParams.append('id', response_json.id)

        window.location.href = article_url;
    } else {
        // 400
        console.log("Bad Request. title과 content는 필수입력값입니다.")
    }
}

async function handleArticleImagePreview(input) {
    console.log(input)
    if (input.files && input.files.length > 0) {
        var reader = new FileReader();
        reader.onload = function (e) {
            if (del_img === 0){
                document.getElementById("previous_image").src = e.target.result;
                document.getElementById("img_deletion").innerText = "";
            }
            // console.log(e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
    }
}