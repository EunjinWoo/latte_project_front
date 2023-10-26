window.onload = () => {
    nav();

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

    const response = await fetch("ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com/users/api/token/", {
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
        window.location.href = "/";
    } else {
        alert("로그인 실패");
    }
}