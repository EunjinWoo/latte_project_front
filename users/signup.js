window.onload = () => {
    console.log("로딩되었음");
};
  
async function handleSignup() {
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
  
    if (response.status === 201) {
      alert("회원가입 완료");
      window.location.href = "http://127.0.0.1:5500";
    } else {
      alert("회원가입 실패");
    }
  
    console.log(response);
}
  

  