window.onload = () => {
    console.log("hi")

    loadAdviceArticles();
}

async function loadAdviceArticles() {
    const response = await fetch('http://127.0.0.1:8000/articles/', {
        method : 'GET'
    })
    const response_json = await response.json()

    for (let i=0; i<response_json.length; i++){
        if (response_json[i].category === 2) {
            // 게시글 출력 공간
            let advice_board = document.querySelector("#advice_board");

            let post = document.createElement("ul");
            post.id = "board_list";

            // 각 게시글의 id를 포함한 url 생성
            const url = new URL(window.location.href);
            const article_url = new URL("./articles/detail.html", url.origin);
            article_url.searchParams.append('id', response_json[i].id)

            let a = document.createElement("a");
            a.href = article_url.href;

            let ids = ["advice_title","advice_author","advice_content","advice_created_at","advice_thumbnail","advice_category"]

            let post_data = [response_json[i].title, response_json[i].user.username, response_json[i].content, response_json[i].created_at, response_json[i].image, response_json[i].category];
                    
            //게시글 생성
            for(let j=0;j<ids.length;j++){
                if (j === 4){
                    let img = document.createElement("img");
                    img.id = ids[j];
                    if (post_data[j] === null){
                        console.log("hiii")
                        img.src = "/media/defaultThumbnail.jpeg";
                    } 
                    else {
                        img.src = `http://127.0.0.1:8000${post_data[j]}/`;
                    }
                    img.style.height = "200px";
                    a.appendChild(img);
                }
                else if (j === 3){
                    let li = document.createElement("li");
                    li.id = ids[j];
                    li.textContent = post_data[j].substr(0,10) + " " + post_data[j].substr(11).substr(0,5);
                    a.appendChild(li);
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

}

// 참고 : https://stickode.tistory.com/646
