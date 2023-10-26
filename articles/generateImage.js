document.addEventListener('DOMContentLoaded', function () {
    nav();

    const imageForm = document.getElementById('imageForm');
    const generateButton = document.getElementById('generateButton');
    const resultImage = document.getElementById('resultImage');
    const downloadLink = document.getElementById('downloadLink');

    generateButton.addEventListener('click', async function () {
        const formData = new FormData(imageForm);

        try {
            const response = await fetch('ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com/articles/generate_image/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const objectURL = URL.createObjectURL(blob);
                console.log(response)

                resultImage.src = "ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com/uploads/image/generate_image.png";
                resultImage.style.display = 'block';

                downloadLink.href = "ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com/uploads/image/generate_image.png";
                downloadLink.style.display = 'block';
            } else {
                alert('이미지 생성 실패: ' + response.status);
            }
        } catch (error) {
            alert('오류 발생: ' + error);
        }
    });
});

