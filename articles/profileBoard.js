window.onload = () => {
    nav();

    loadAdviceArticles();
}

async function loadAdviceArticles() {
    const response = await fetch('ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com/users/', {
        method : 'GET'
    })
    const response_json = await response.json()
    console.log(response_json)

    for (let i=0; i<response_json.length; i++){
        // 게시글 출력 공간
        let profile_board = document.querySelector("#profile_board");

        // 각 프로필의 username를 포함한 url 생성 (response에서 user id값이 제공되지 않음.)
        const url = new URL(window.location.href);
        const profile_url = new URL("./users/mypage.html", url.origin);
        profile_url.searchParams.append('id', response_json[i].id)

        let post = document.createElement("a");
        post.id = "profile_post";
        post.href = profile_url.href;
        post.style.textDecoration = "none";
        post.classList.add("row", "align-items-center");
        post.style.height = "250px";

        let div1 = document.createElement("div");
        div1.id = "profile_col_img";
        div1.classList.add("text-center");
        div1.style.height = "80%";
        div1.style.width = "225px";

        let div2 = document.createElement("div");
        div2.id = "profile_col_text";
        div2.classList.add("col-8");
        div2.style.padding = "40px";
        div2.style.color = "black";

        let hr = document.createElement("hr");
        hr.style.color = "black";
        hr.style.marginTop = "20px";

        let ids = ["profile_username","profile_profile_image","profile_age"]

        let post_data = [response_json[i].username, response_json[i].profile_img, response_json[i].age];
                
        //게시글 생성
        for(let j=0;j<ids.length;j++){
            if (j === 1){ // profile_img
                let img = document.createElement("img");
                img.id = ids[j];
                if (post_data[j] === null){
                    img.src = "/media/defaultProfile.png";
                } 
                else {
                    img.src = `ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com${post_data[j]}/`;
                }
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.objectFit = "cover";
                img.classList.add("shadow", "rounded-circle");

                div1.appendChild(img);
            }
            else if (j == 0){ //username
                let p = document.createElement("p");
                p.id = ids[j];
                p.textContent = post_data[j];
                p.classList.add("fw-semibold", "fs-2");
                div2.appendChild(p);
            }
            else { //age
                let p = document.createElement("p");
                p.id = ids[j];
                p.textContent = "나이 : " + post_data[j];
                p.classList.add("fw-normal", "fs-5");
                div2.appendChild(p);
            }
        }

        // 게시글 추가
        post.appendChild(div1);
        post.appendChild(div2);
        post.appendChild(hr);
        profile_board.appendChild(post);
    }

}

// 참고 : https://stickode.tistory.com/646
