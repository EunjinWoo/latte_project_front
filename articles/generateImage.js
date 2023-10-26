document.addEventListener('DOMContentLoaded', function () {
    const imageForm = document.getElementById('imageForm');
    const generateButton = document.getElementById('generateButton');
    const resultImage = document.getElementById('resultImage');
    const downloadLink = document.getElementById('downloadLink');

    generateButton.addEventListener('click', async function () {
        const formData = new FormData(imageForm);

        try {
            const response = await fetch('http://127.0.0.1:8000/articles/generate_image/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const objectURL = URL.createObjectURL(blob);
                console.log(response)

                resultImage.src = "http://127.0.0.1:8000/uploads/image/generate_image.png";
                resultImage.style.display = 'block';

                downloadLink.href = "http://127.0.0.1:8000/uploads/image/generate_image.png";
                downloadLink.style.display = 'block';
            } else {
                alert('이미지 생성 실패: ' + response.status);
            }
        } catch (error) {
            alert('오류 발생: ' + error);
        }
    });
});

