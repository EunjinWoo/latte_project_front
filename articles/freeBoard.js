window.onload = () => {
    nav();

    loadAdviceArticles();
}

async function loadAdviceArticles() {
    const response = await fetch('ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com/articles/', {
        method : 'GET'
    })
    const response_json = await response.json()
    
    var colNum = -1;

    for (let i=0; i<response_json.length; i++){
        if (response_json[i].category === 1) {
            // 게시글 출력 공간
            colNum = (colNum+1)%3;
            let col = document.querySelector(`#free_col${colNum}`)

            let post = document.createElement("ul");
            post.id = "board_list";
            post.classList.add("list-group");
            post.style.marginTop = "20px";

            // 각 게시글의 id를 포함한 url 생성
            const url = new URL(window.location.href);
            const article_url = new URL("./articles/detail.html", url.origin);
            article_url.searchParams.append('id', response_json[i].id)

            let a = document.createElement("a");
            a.href = article_url.href;
            a.classList.add("list-group");
            a.style.textDecoration = "none";

            let ids = ["free_title","free_author","free_content","free_thumbnail","free_created_at"]

            let post_data = [response_json[i].title, response_json[i].user.username, response_json[i].content, response_json[i].image, response_json[i].created_at];
                    
            //게시글 생성
            for(let j=0;j<ids.length;j++){
                if (j === 3){ //thumbnail
                    let img = document.createElement("img");
                    img.id = ids[j];
                    if (post_data[j] === null){
                        img.src = "/media/defaultThumbnail.jpeg";
                    } 
                    else {
                        img.src = `ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com${post_data[j]}/`;
                    }
                    img.style.width = "100%";
                    img.style.height = "100%";
                    img.style.objectFit = "cover";
                    img.classList.add("list-group-item");

                    let img_box = document.createElement("span");
                    img_box.style.height = "265px";
                    
                    img_box.appendChild(img);
                    a.appendChild(img_box);
                }
                else if (j === 4){ //created_at
                    let li = document.createElement("li");
                    li.id = ids[j];
                    li.textContent = post_data[j].substr(0,10) + " " + post_data[j].substr(11).substr(0,5);
                    li.style = "color: gray; display: flex; justify-content: flex-end;"
                    li.classList.add("list-group-item", "fw-light", "fs-6");
                    a.appendChild(li);
                }
                else if (j == 0){ //title
                    let li = document.createElement("li");
                    li.id = ids[j];
                    li.textContent = post_data[j];
                    li.style = "display: flex; padding-left: 20px;";
                    li.classList.add("list-group-item", "fw-semibold", "fs-5");
                    a.appendChild(li);
                }
                else if (j == 2){ // content
                    let li = document.createElement("li");
                    li.id = ids[j];
                    li.textContent = post_data[j];
                    li.style = "display: flex; max-height: 120px; overflow: hidden; color: gray;"
                    li.classList.add("fw-normal");

                    let content_box = document.createElement("span");
                    content_box.style = "max-height: 150px; overflow: clip; height:fit-content;";
                    content_box.classList.add("list-group-item");

                    content_box.appendChild(li);
                    a.appendChild(content_box);
                }
                else { // username
                    let div = document.createElement("div");
                    div.style = "display: flex; height: fit-content; align-items: center; background-color: rgb(211,211,211,0.2);"
                    div.classList.add("list-group-item");

                    let img = document.createElement("img");
                    let span = document.createElement("span");

                    //profile_img
                    img.src = `ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com${response_json[i].user.profile_img}/`;
                    img.classList.add("border", "border-1", "rounded-circle");
                    img.style =  "height: 45px; width: 45px; object-fit: cover; margin-right: 10px;";

                    //username
                    span.id = ids[j];
                    span.textContent = post_data[j];
                    span.classList.add("fw-medium");

                    div.appendChild(img);
                    div.appendChild(span);

                    a.prepend(div);
                }
            }

            // 게시글 추가
            post.appendChild(a);
            col.appendChild(post);
        }
    }

}

// 참고 : https://stickode.tistory.com/646
