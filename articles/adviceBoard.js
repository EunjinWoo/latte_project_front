window.onload = () => {
    console.log("hi")

    loadAdviceArticles();
}

async function loadAdviceArticles() {
    const response = await fetch('http://127.0.0.1:8000/articles/', {
        method : 'GET'
    })
    const response_json = await response.json()

    var colNum = -1;

    for (let i=0; i<response_json.length; i++){
        if (response_json[i].category === 2) {
            // 게시글 출력 공간
            colNum = (colNum+1)%3;
            let col = document.querySelector(`#advice_col${colNum}`)

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

            let ids = ["advice_title","advice_author","advice_content","advice_thumbnail","advice_created_at"]

            let post_data = [response_json[i].title, response_json[i].user.username, response_json[i].content, response_json[i].image, response_json[i].created_at];
                    
            //게시글 생성
            for(let j=0;j<ids.length;j++){
                if (j === 3){ //thumbnail
                    let img = document.createElement("img");
                    img.id = ids[j];
                    if (post_data[j] === null){
                        console.log("hiii")
                        img.src = "/media/defaultThumbnail.jpeg";
                    } 
                    else {
                        img.src = `http://127.0.0.1:8000${post_data[j]}/`;
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
                else if (j === 4){ // created_at
                    let li = document.createElement("li");
                    li.id = ids[j];
                    li.textContent = post_data[j].substr(0,10) + " " + post_data[j].substr(11).substr(0,5);
                    li.style.color = "gray";
                    li.classList.add("list-group-item");
                    a.appendChild(li);
                }
                else if (j == 0){ // title
                    let li = document.createElement("li");
                    li.id = ids[j];
                    li.textContent = post_data[j];
                    li.style = "font-size: 20px; font-weight: bold; background-color: rgb(70,185,221, 0.1);";
                    li.classList.add("list-group-item");
                    a.appendChild(li);
                }
                else {
                    let li = document.createElement("li");
                    li.id = ids[j];
                    li.textContent = post_data[j];
                    li.classList.add("list-group-item");
                    a.appendChild(li);
                }
            }

            // 게시글 추가
            post.appendChild(a);
            col.appendChild(post);
        }
    }

}

// 참고 : https://stickode.tistory.com/646
