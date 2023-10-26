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
  

document.addEventListener('DOMContentLoaded', function () {
  const imageInput = document.getElementById('imageInput');
  const ageInput = document.getElementById('ageInput');
  const editButton = document.getElementById('editButton');
  const resultImage = document.getElementById('resultImage');
  const downloadLink = document.getElementById('downloadLink');

  editButton.addEventListener('click', async function () {
    const imageFile = imageInput.files[0];
    const age = ageInput.value;
    
    if (!imageFile || !age) {
        alert('이미지와 나이를 입력하세요.');
        return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('action_type', 'V2_AGE');
    formData.append('quality_control', 'NONE');
    formData.append('target', age);

    try {
        const response = await fetch('https://www.ailabapi.com/api/portrait/effects/face-attribute-editing', {
            method: 'POST',
            body: formData,
            headers: {
                'ailabapi-api-key': 'key', //키 값에 입력
            },
        });

        if (response.ok) {
            const data = await response.json();
            if (data.error_code === 0) {
                const imageBase64 = data["result"]["image"];
                resultImage.src = 'data:image/jpeg;base64,' + imageBase64;
                downloadLink.href = 'data:image/jpeg;base64,' + imageBase64;
                downloadLink.download = 'edited_image.jpg';
                downloadLink.style.display = 'block';
            } else {
                alert('얼굴 특성 편집에 실패했습니다: ' + data.error_msg);
            }
        } else {
            alert('서버에서 오류가 발생했습니다.');
        }
    } catch (error) {
        alert('오류 발생: ' + error);
    }
  })
});
