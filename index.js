console.log("로딩되었습니다.");

window.onload = () => {
  requestUser()
};

function handleLogout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("payload");
}

async function requestUser() {
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload);
  const id = payload_parse.user_id;
  const response = await fetch (`http://127.0.0.1:8000/users/${id}/`, {
      method : "GET"
  })
  const response_json = await response.json()
  document.getElementById("intro").innerText = response_json.username;
}