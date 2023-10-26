function nav() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    
    if (payload_parse){
        document.getElementById("nav_login").style.display = "none";
        document.getElementById("nav_signup").style.display = "none";
    }
    else {
        document.getElementById("nav_create").style.display = "none";
        document.getElementById("nav_mypage").style.display = "none";
        document.getElementById("nav_logout").style.display = "none";
    }
}

function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("payload");
    alert("로그아웃 완료");
    window.location.href = "http://127.0.0.1:5500";
}

function handleMypage() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    const id = payload_parse.user_id;

    const url = new URL(window.location.href);
    const mypage_url = new URL("./users/mypage.html", url.origin);
    mypage_url.searchParams.append("id", id);

    window.location.href = mypage_url;
}