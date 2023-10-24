window.onload = () => {
    console.log("hi")

    loadAdviceArticles();
}

async function loadAdviceArticles() {
    const response = await fetch('http://127.0.0.1:8000/users/', {
        method : 'GET'
    })
    const response_json = await response.json()
    console.log(response_json)

    for (let i=0; i<response_json.length; i++){
        // 게시글 출력 공간
        let advice_board = document.querySelector("#profile_board");

        let post = document.createElement("ul");
        post.id = "board_list";

        // 각 프로필의 username를 포함한 url 생성 (response에서 user id값이 제공되지 않음.)
        const url = new URL(window.location.href);
        const profile_url = new URL("./users/mypage.html", url.origin);
        profile_url.searchParams.append('username', response_json[i].username)

        let a = document.createElement("a");
        a.href = profile_url.href;

        let ids = ["profile_username","profile_profile_image","profile_age"]

        let post_data = [response_json[i].username, response_json[i].profile_img, response_json[i].age];
                
        //게시글 생성
        for(let j=0;j<ids.length;j++){
            if (j === 1){
                let img = document.createElement("img");
                img.id = ids[j];
                if (post_data[j] === null){
                    img.src = "/media/defaultProfile.png";
                } 
                else {
                    img.src = `http://127.0.0.1:8000${post_data[j]}/`;
                }
                img.style.height = "200px";
                a.appendChild(img);
            }
            else {
                let li = document.createElement("li");
                li.id = ids[j];
                li.textContent = post_data[j];
                a.appendChild(li);
            }
        }

        // 게시글 추가
        post.appendChild(a);
        advice_board.appendChild(post);
    }

}

// 참고 : https://stickode.tistory.com/646
