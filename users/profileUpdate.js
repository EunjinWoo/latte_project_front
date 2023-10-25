window.onload = () => {
    console.log("업데이트 자바스크립트");

    request();
}

async function request() {
    const url = new URL(window.location.href).searchParams;
    const id = url.get('id');

    const response = await fetch(`http://127.0.0.1:8000/users/${id}/`, {
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
}