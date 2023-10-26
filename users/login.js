window.onload = () => {
    console.log("로딩되었음");

    // enter key로 로그인할 수 있게 설정.
    const userInput_username = document.querySelector('#username');
    const userInput_password = document.querySelector('#password');

    userInput_username.addEventListener('keyup', (event) => { 
        if (event.key === 'Enter') {
            handleLogin();
        }
    });
    userInput_password.addEventListener('keyup', (event) => { 
        if (event.key === 'Enter') {
            handleLogin();
        }
    });
};

  
async function handleLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://127.0.0.1:8000/users/api/token/", {
        headers: {
        "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
        username: username,
        password: password,
        }),
    });

    const response_json = await response.json();

    console.log(response_json);

    localStorage.setItem("access", response_json.access);
    localStorage.setItem("refresh", response_json.refresh);

    const base64url = response_json.access.split(".")[1];
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
        .split("")
        .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    localStorage.setItem("payload", jsonPayload);

    if (response.status === 200) {
        alert("로그인 완료");
        window.location.href = "http://127.0.0.1:5500";
    } else {
        alert("로그인 실패");
    }
}
