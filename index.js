console.log("로딩되었습니다.");

window.onload = () => {
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload);
  console.log(payload_parse.user_id);

  const intro = document.getElementById("intro");
  intro.innerText = payload_parse.user_id;
};

function handleLogout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("payload");
}
