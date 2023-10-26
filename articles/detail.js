window.onload = () => {
    nav();

    request();
}

async function request() {
    const url = new URL(window.location.href).searchParams;
    const id = url.get('id');

    const response = await fetch(`http://127.0.0.1:8000/articles/${id}/`, {
        method : 'GET'
    })
    const response_json = await response.json()

    // 로그인 한 유저의 정보 받기
    const payload = localStorage.getItem("payload")
    const payload_parse = JSON.parse(payload)
    const login_user_id = payload_parse.user_id;

    const user_response = await fetch(`http://127.0.0.1:8000/users/${login_user_id}/`, {
        method : 'GET'
    })
    const user_response_json = await user_response.json()
    
    if (user_response_json.age < 30){
        document.getElementById("detail_create_comment_div").style.display = "none";
        document.getElementById("detail_create_comment_div_warning").innerText = "30대 이상부터 댓글 달기 가능합니다.";
        document.getElementById("detail_create_comment_div_warning").style.color = "red";
    }


    // 로그인한 유저와 게시글의 유저가 동일할 경우 수정 버튼 보이게 함.
    if (login_user_id === response_json.user.id) {
        document.getElementById("detail_update_btn").style.display = "block";
    }

    // 게시글 정보 띄워주기
    //category
    if (response_json.category == 1){
        let option = document.createElement("option");
        option.innerText = "자유 게시판";
        document.getElementById("detail_category").appendChild(option);
    } else {
        let option = document.createElement("option");
        option.innerText = "조언 구하기";
        document.getElementById("detail_category").appendChild(option);
    }
    document.getElementById("detail_title").innerText = response_json.title;
    // article_image
    if (response_json.image){
        document.getElementById("detail_image").src = `http://127.0.0.1:8000${response_json.image}/`;
    }
    else {
        document.getElementById("detail_image").src = "/media/defaultThumbnail.jpeg";
    }

    document.getElementById("detail_content").innerText = response_json.content;
    document.getElementById("detail_created_at").innerText = response_json.created_at.substr(0,10) + " " + response_json.created_at.substr(11).substr(0,5);;
    // user
    document.getElementById("detail_author").innerText = response_json.user.username;
    if (response_json.user.profile_img){
        document.getElementById("detail_author_profile").src = `http://127.0.0.1:8000${response_json.user.profile_img}/`;
    }
    
    // 댓글 띄우기
    for (let i = 0 ; i < response_json.comments.length; i++){
        let comments= document.querySelector("#detail_comments");

        let comment = document.createElement("ul");
        comment.id = `comment${i}`
        comment.classList.add("list-group");
        comment.style.marginTop = "20px";

        let ids = [`update_comment_userprofile${i}`, `update_comment_username${i}`, `update_comment_content${i}`, `update_comment_created_at${i}`]
        let comment_data = [response_json.comments[i].user.profile_img, response_json.comments[i].user.username, response_json.comments[i].content, response_json.comments[i].created_at]

        let dateNbtnGroup = document.createElement("div");
        dateNbtnGroup.style = "display: flex; align-items: center; justify-content: space-between;";

        let commentUser = document.createElement("div");
        commentUser.style = "height: fit-content; background-color: rgb(211,211,211,0.2);";
        commentUser.classList.add("list-group-item");

        for(let j=0;j<comment_data.length;j++){
            if (j === 3){ //created_at
                let li = document.createElement("li");
                li.id = ids[j];
                li.classList.add("list-group-item", "text-secondary", "fw-light");
                if (login_user_id === response_json.comments[i].user.id) {
                    li.style = "width: calc(100% - 120px);"
                }
                else {
                    li.style = "width: 100%;"
                }
                li.textContent = comment_data[j].substr(0,10) + " " + comment_data[j].substr(11).substr(0,5);

                dateNbtnGroup.appendChild(li);
            }
            else if (j == 0){ // userprofile
                let img = document.createElement("img");
                img.id = ids[j];
                img.classList.add("border", "border-1", "rounded-circle");
                img.src = `http://127.0.0.1:8000${comment_data[0]}/`;
                img.style =  "height: 30px; width: 30px; object-fit: cover; margin-right: 8px;";
                commentUser.appendChild(img);
            }
            else if (j == 1){ // username
                let span = document.createElement("span");
                span.id = ids[j];
                span.classList.add("fw-medium");
                span.textContent = comment_data[j];
                commentUser.appendChild(span);
            }
            else {
                let li = document.createElement("li");
                li.id = ids[j];
                li.classList.add("list-group-item");
                li.textContent = comment_data[j];
                comment.appendChild(li);
            }
        }
         
        let btnGroup = document.createElement("div");
        
        // 로그인한 유저와 댓글 작성자가 동일할 경우 댓글 수정/삭제 버튼이 보이게 함
        if (login_user_id === response_json.comments[i].user.id){
            let btn1 = document.createElement("button");
            btn1.textContent = "수정";
            btn1.id = `detail_update_comment_btn${i}`;
            btn1.classList.add("btn","btn-outline-secondary");
            btn1.style.width = "60px";
            // btn1.onclick = "handleUpdateComment();";
            btn1.addEventListener("click", () => handleUpdateComment(i, response_json.comments[i].id));
            btnGroup.appendChild(btn1);
    
            let btn2 = document.createElement("button");
            btn2.textContent = "삭제";
            btn2.id = `detail_delete_comment_btn${i}`;
            btn2.classList.add("btn","btn-outline-secondary");
            btn2.style.width = "60px";
            btn2.addEventListener("click", () => handleDeleteComment(response_json.comments[i].id));
            btnGroup.appendChild(btn2);
        }

        dateNbtnGroup.appendChild(btnGroup);
        comment.prepend(commentUser);
        comment.appendChild(dateNbtnGroup);
        comments.appendChild(comment);
    }
}

async function handleCreateComment() {
    // 현재 특정 게시글의 id를 받아와 이 게시글에 댓글을 작성할 수 있도록 설정.
    const url = new URL(window.location.href).searchParams;
    const id = url.get('id');

    const content = document.getElementById("detail_create_comment").value
    console.log(content)

    const response = await fetch(`http://127.0.0.1:8000/articles/${id}/comment/`, {
        headers:{
            "Authorization" : "Bearer " + localStorage.getItem("access"),
            'content-type':'application/json',
        },
        method:'POST',
        body: JSON.stringify({
            "content":content,
        })
    })

    const response_json = await response.json()
    console.log(response.status)
    if (response.status === 200) {
        window.location.href = window.location.href;
    } else {
        document.getElementById("detail_create_comment_failed").innerText = "  작성 실패. 내용을 입력해주세요."
    }
}

async function handleUpdateComment(i, comment_id) {
    // 수정, 삭제 버튼과 <li></li> content 부분 안 보이게 설정.
    document.getElementById(`update_comment_content${i}`).style.display = "none";
    document.getElementById(`detail_update_comment_btn${i}`).style.display = "none";
    document.getElementById(`detail_delete_comment_btn${i}`).style.display = "none";

    // content 있던 자리 선택.
    let previous_content_cell = document.querySelector(`#comment${i}`);

    // 수정 내용 작성할 textarea 요소 생성, 기존 작성되어있던 comment content를 textarea 안에 띄워줌.
    let update_content = document.createElement("textarea");
    update_content.id = "update_content";
    update_content.value = document.getElementById(`update_comment_content${i}`).textContent;
    update_content.classList.add("list-group-item", "border", "border-2", "border-dark-subtle");

    // created_at과 수정 버튼 같이 띄워 줄 div
    let dateNbtnGroup = document.createElement("div");
    dateNbtnGroup.style = "display: flex; align-items: center; justify-content: space-between;";

    // 기존 created_at width 변경
    let created_at = document.getElementById(`update_comment_created_at${i}`);
    created_at.style.display = "none";
    let new_created_at = document.getElementById(`update_comment_created_at${i}`);
    new_created_at.style = "width: calc(100% - 60px);";

    // 댓글 수정 버튼
    let update_content_btn = document.createElement("button");
    update_content_btn.textContent = "수정";
    update_content_btn.addEventListener("click", () => updateComment(document.getElementById("update_content").value, comment_id));
    update_content_btn.classList.add("btn","btn-secondary");
    update_content_btn.style.width = "60px";

    // 댓글 수정 실패 시 띄워 줄 오류 메시지
    let update_comment_failed = document.createElement("span");
    update_comment_failed.style.color = "red";
    update_comment_failed.id = "detail_update_comment_failed";

    // content 있던 자리에 textarea와 수정 버튼 추가.
    dateNbtnGroup.appendChild(new_created_at);
    dateNbtnGroup.appendChild(update_content_btn);

    previous_content_cell.appendChild(update_content);
    previous_content_cell.appendChild(dateNbtnGroup);
    previous_content_cell.appendChild(update_comment_failed);
}

async function updateComment(content, comment_id) {
    const response = await fetch(`http://127.0.0.1:8000/articles/comment/${comment_id}/`, {
        headers:{
            "Authorization" : "Bearer " + localStorage.getItem("access"),
            'content-type':'application/json',
        },
        method:'PUT',
        body: JSON.stringify({
            "content":content,
        })
    })

    if (response.status === 200) {
        alert('수정 완료');
        window.location.href = window.location.href;
    } else {
        document.getElementById("detail_update_comment_failed").innerText = "  수정 실패. 내용을 입력해주세요."
    }
}

async function handleDeleteComment(comment_id) {
    const response = await fetch(`http://127.0.0.1:8000/articles/comment/${comment_id}/`, {
        headers:{
            "Authorization" : "Bearer " + localStorage.getItem("access"),
        },
        method:'DELETE'
    })

    if (response.status === 204) {
        window.location.href = window.location.href;
    } else {
        alert('삭제 실패');
    }
}

async function handleUpdateArtcle() {
    // update url로 이동.
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');

    const update_url = new URL("./articles/update.html", url.origin);
    update_url.searchParams.append('id', id)

    window.location.href = update_url;
}