window.onload = () => {
    nav();

    loadMyArticles();

    requestUser();
}

async function loadMyArticles() {
    // 기존 게시글을 삭제
    const myArticleBoard = document.querySelector("#my_articles");
    while (myArticleBoard.firstChild) {
        myArticleBoard.removeChild(myArticleBoard.firstChild);
    }

    const url = new URL(window.location.href).searchParams;
    const id = url.get("id");

    const response = await fetch("ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com/articles/", { method: "GET" });
    const response_json = await response.json();

    for (let i = 0; i < response_json.length; i++) {
        if (response_json[i].user.id == id) {
            let my_article_board = document.querySelector("#my_articles");

            let post = document.createElement("ul");
            post.id = "board_list";

            const url = new URL(window.location.href);
            const article_url = new URL("./articles/detail.html", url.origin);
            article_url.searchParams.append('id', response_json[i].id);

            let a = document.createElement("a");
            a.href = article_url.href;

            let ids = ["my_title", "my_content", "my_category"];

            let post_data = [response_json[i].title, response_json[i].content, response_json[i].category];

            for (let j = 0; j < ids.length; j++) {
                let li = document.createElement("li");
                li.id = ids[j];
                li.textContent = post_data[j];
                a.appendChild(li);
            }
            post.appendChild(a);
            my_article_board.appendChild(post);
        }
    }
}

async function requestId() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    console.log(payload_parse.user_id);
}

async function requestUser() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    console.log(payload_parse);

    const url = new URL(window.location.href).searchParams;
    const id = url.get("id");
    console.log(id)
    const response = await fetch (`ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com/users/${id}/`, {
        method : "GET"
    })
    const response_json = await response.json()
    console.log(response_json)

    document.getElementById("profile_img").src = `ec2-13-209-29-12.ap-northeast-2.compute.amazonaws.com${response_json.profile_img}/`;
    document.getElementById("username").innerText = response_json.username;
    document.getElementById("age").innerText = response_json.age;

    if (payload_parse.user_id == response_json.id) {
        document.getElementById("profile_update_btn").style.display = "block";
    }
}

function handleUpdateProfile() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");

    const update_url = new URL("./users/profileUpdate.html", url.origin);
    update_url.searchParams.append("id", id)

    window.location.href = update_url
}