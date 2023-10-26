window.onload = () => {
    nav();
}

async function handleSubmit() {
    const formData = new FormData();

    formData.append("title", document.getElementById("create_title").value);
    formData.append("content", document.getElementById("create_content").value);
    if (document.getElementById("create_image").files[0]){
        formData.append("image", document.getElementById("create_image").files[0]);
    }
    formData.append("category", document.getElementById("create_category").value);

    const response = await fetch("ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com/articles/", {
      method: "POST",
      headers: {
        "Authorization" : "Bearer " + localStorage.getItem("access")
      },
      body: formData,
    });

    const response_json = await response.json()
    // console.log(response_json)

    if (response.status == 200) {
        alert("게시글 작성 완료!")

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
    console.log(input.files)
    if (input.files && input.files.length > 0) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("preview_image").src = e.target.result;
            // console.log(e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
    }
}