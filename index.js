console.log("로딩되었습니다.");

window.onload = () => {
  requestUser()

};

function handleLogout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("payload");
  alert("로그아웃 완료");
  window.location.href = "http://127.0.0.1:5500";
}

async function requestUser() {
  try {
    const payload = localStorage.getItem("payload");

    if (!payload) {
      // Handle the case where "payload" is not found in localStorage.
      document.getElementById("login_btn").style.display = "block";
      document.getElementById("signup_btn").style.display = "block";
      return;
    }

    const payload_parse = JSON.parse(payload);
    const id = payload_parse.user_id;

    const response = await fetch(`http://127.0.0.1:8000/users/${id}/`, {
      method: "GET",
    });

    if (!response.ok) {
      // Handle the case where the fetch request is not successful.
      console.error("Failed to fetch user data.");
      return;
    }

    const response_json = await response.json();
    document.getElementById("intro").innerText = response_json.username;

    if (!id) {
      document.getElementById("login_btn").style.display = "block";
      document.getElementById("signup_btn").style.display = "block";
    } else {
      document.getElementById("logout_btn").style.display = "block";
      document.getElementById("mypage_btn").style.display = "block";
    }
  } catch (error) {
    // Handle any unexpected errors.
    console.error("An error occurred:", error);
  }
}


function handleMypage() {
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload);
  const id = payload_parse.user_id;

  const url = new URL(window.location.href);
  const mypage_url = new URL("./users/mypage.html", url.origin);
  mypage_url.searchParams.append("id", id)

  window.location.href = mypage_url
}
