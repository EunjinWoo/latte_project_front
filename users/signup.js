window.onload = () => {
    console.log("로딩되었음");
};  

document.addEventListener('DOMContentLoaded', function () {
  const imageInput = document.getElementById('imageInput');
  const ageInput = document.getElementById('ageInput');
  const editButton = document.getElementById('editButton');
  const signupButton = document.getElementById('signupButton');
  const downloadLink = document.getElementById('downloadLink');

  var file = '';
  var changed_image_url = '';

  // 얼굴 특성 편집 -> changed_image_url을 얻음.
  editButton.addEventListener('click', async function () {
    const imageFile = imageInput.files[0];
    const age = ageInput.value;
    
    if (!imageFile || !age) {
        alert('이미지와 나이를 입력하세요.');
        return;
    }

    const formData = new FormData();
    formData.append('image_route', imageFile);
    formData.append('target', age);

    // DB의 Temp_Profile_Image에 변환된 프로필 이미지 저장. (이 url이 changed_image_url)
    const response = await fetch("http://127.0.0.1:8000/users/change_profile_image/", {
      method: "POST",
      body: formData,
    });

    const response_json = await response.json()

    if (response.status === 200){
      // 변환된 결과 이미지 화면에 출력
      document.getElementById("resultImage").src = `http://127.0.0.1:8000${response_json['changed_image_url']}`;

      console.log(response_json)

      downloadLink.href = 'data:image/jpeg;base64,' + response_json['image_data'];
      downloadLink.download = 'edited_image.jpg';
      downloadLink.style.display = 'block';

      changed_image_url = response_json['changed_image_url'];
    } else { 
      document.getElementById("imageChangeError").style.opacity = "100%";
      document.getElementById("imageChangeError").innerText = response_json['error_msg'].split("-").slice(-1);
    }

  })

  signupButton.addEventListener('click', async function () {
    if (changed_image_url === ''){
      // 아직 프로필 이미지 안 바꾼 경우 다른 나이로.
      document.getElementById("signupFailedError").style.opacity = "100%";
      document.getElementById("signupFailedError").innerText = "프로필 이미지 변환은 필수 사항입니다.";
    }
    else { // 프로필 이미지 나이 바꿔서 돌린 경우. 
      fetch(`http://127.0.0.1:8000${changed_image_url}`) // 이미지의 URL을 지정하세요.
      .then(response => response.blob())
      .then(blob => {
        // Blob 객체를 얻었습니다.
        // 여기서 blob을 파일로 변환할 수 있습니다.
  
        file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

        // 이미지 변환 안 한 경우 아예 회원 가입 버튼을 disable해야할 듯.
        handleSignup();
  
        // 이제 'file'은 JavaScript에서 파일 객체로 사용할 수 있음.
      })
      .catch(error => {
        console.error('이미지 가져오기 실패:', error);
      });
    }
  })

  async function handleSignup() {
    const formData = new FormData();
    formData.append("username", document.getElementById("username").value);
    formData.append("age", document.getElementById("age").value);
    formData.append("profile_img", file)
    formData.append("password", document.getElementById("password").value);
  
    const response = await fetch("http://127.0.0.1:8000/users/signup/", {
      headers: {},
      method: "POST",
      body: formData,
    });
  
    if (response.status === 201) {
      alert("회원가입 완료");
      window.location.href = "http://127.0.0.1:5500";
    } else {
      document.getElementById("signupFailedError").style.opacity = "100%";
      document.getElementById("signupFailedError").innerText = "회원가입 실패";
    }
  }
  
});

async function handleputImagePreview(input) {
  console.log(input.files)
  if (input.files && input.files.length > 0) {
      var reader = new FileReader();
      reader.onload = function (e) {
          document.getElementById("putImage").src = e.target.result;
          // console.log(e.target.result)
      };
      reader.readAsDataURL(input.files[0]);
  }
}