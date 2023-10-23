window.onload = () => {
    console.log("hi");
}

async function handleSubmit() {
    const formData = new FormData();

    formData.append("title", document.getElementById("create_title").value);
    formData.append("content", document.getElementById("create_content").value);
    if (document.getElementById("create_image").files[0]){
        formData.append("image", document.getElementById("create_image").files[0]);
    }
    formData.append("category", document.getElementById("create_category").value);

    const response = await fetch("http://127.0.0.1:8000/articles/", {
      method: "POST",
      headers: {
        "Authorization" : "Bearer " + localStorage.getItem("access")
      },
      body: formData,
    });

    console.log(response)

    if (response.status == 200) {
        alert("게시글 작성 완료!")
        // window.location.href = "/articles/freeBoard.html";
    } else {
        // 400
        console.log("Bad Request. title과 content는 필수입력값입니다.")
    }
}