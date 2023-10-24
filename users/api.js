window.onload = () => {
  console.log("로딩되었음");
};

async function handleSignin() {
  const formData = new FormData();
  formData.append("username", document.getElementById("username").value);
  formData.append("age", document.getElementById("age").value);
  formData.append(
    "profile_img",
    document.getElementById("profile_img").files[0]
  );
  formData.append("password", document.getElementById("password").value);

  //   const username = document.getElementById("username").value;
  //   const age = document.getElementById("age").value;
  //   const profile_img = document.getElementById("profile_img").files[0];
  //   const password = document.getElementById("password").value;
  console.log(username, age, profile_img, password);

  const response = await fetch("http://127.0.0.1:8000/users/signup/", {
    headers: {},
    method: "POST",
    body: formData,
  });

  console.log(response);
}

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
}
