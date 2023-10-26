window.onload = () => {
    nav();

    request();
}

async function request() {
    const url = new URL(window.location.href).searchParams;
    const id = url.get('id');

    const response = await fetch(`ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com/users/${id}/`, {
        method : 'GET'
    })
    const response_json = await response.json()
    console.log(response_json.image)

    document.getElementById("update_username").innerText = response_json.username;
    document.getElementById("update_age").innerText = response_json.age;

}

async function handleSubmit() {
    const url = new URL(window.location.href).searchParams;
    const id = url.get('id');

    const formData = new FormData();

    formData.append("username", document.getElementById("update_username").value);
    formData.append("age", document.getElementById("update_age").value);
    formData.append("profile_img", document.getElementById("update_image").files[0])

    const response = await fetch(`ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com/users/${id}/`, {
        method: "PUT",
        headers: {
            "Authorization" : "Bearer " + localStorage.getItem("access")
        },
        body: formData,
    });
    const response_json = await response.json();

    if (response.status == 200) {
        alert("프로필 수정 완료!")

        const url = new URL(window.location.href);
        const profile_url = new URL("./users/profileUpdate.html", url.origin);
        profile_url.searchParams.append("id", response_json.id)

        window.location.href = "/";
    } else{
        console.log("Bad Request")
    }
    
}

async function handleputImagePreview(input) {
    console.log(input.files)
    if (input.files && input.files.length > 0) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("putImage").src = e.target.result;
            // console.log(e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
    }
  }