window.onload = () => {
    console.log(document.getElementById("update_title"));

    request();
}

async function request() {
    const response = await fetch('http://127.0.0.1:8000/articles/4/', {
        method : 'GET'
    })
    const response_json = await response.json()
    console.log(response_json)

    document.getElementById("update_title").value = response_json.title;
    document.getElementById("update_content").value = response_json.content;
    document.getElementById("update_category").value = response_json.category;
    document.getElementById("previous_image").src = `http://127.0.0.1:8000${response_json.image}/`;
}

var del_img = false;

function deleteArticleImage() {
    del_img = true;
    document.getElementById("img_deletion").innerText = "image deleted";
}

async function handleSubmit() {
    const formData = new FormData();

    console.log(del_img);

    formData.append("title", document.getElementById("update_title").value);
    formData.append("content", document.getElementById("update_content").value);
    if (document.getElementById("update_image").files[0]){
        formData.append("image", document.getElementById("update_image").files[0]);
    } else if (del_img === true) {
        formData.append("image", ""); // null로 하면 안 됐음.
    } // 삭제 안 누르면 삭제 안되고 그대로 유지.
    formData.append("category", document.getElementById("update_category").value);

    const response = await fetch("http://127.0.0.1:8000/articles/4/", {
      method: "PUT",
      headers: {
        "Authorization" : "Bearer " + localStorage.getItem("access")
      },
      body: formData,
    });

    console.log(response)

    if (response.status == 200) {
        alert("게시글 수정 완료!")
    } else {
        // 400
        console.log("Bad Request. title과 content는 필수입력값입니다.")
    }
}