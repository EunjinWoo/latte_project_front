window.onload = () => {
    console.log("window loaded");

    request();
}

async function request() {
    const response = await fetch('http://127.0.0.1:8000/articles/4/', {
        method : 'GET'
    })
    const response_json = await response.json()
    console.log(response_json)

    document.getElementById("detail_category").innerText = response_json.category;
    document.getElementById("detail_title").innerText = response_json.title;
    document.getElementById("detail_image").src = `http://127.0.0.1:8000${response_json.image}/`;
    document.getElementById("detail_content").innerText = response_json.content;
    document.getElementById("detail_created_at").innerText = response_json.created_at.substr(0,10) + " " + response_json.created_at.substr(11).substr(0,5);;
    document.getElementById("detail_author").innerText = response_json.user.username;
    
    for (let i = 0 ; i < response_json.comments.length; i++){
        let comments= document.querySelector("#detail_comments");

        let comment = document.createElement("ul");
        comment.id = `comment${i}`

        let ids = [`update_comment_content${i}`, `update_comment_username${i}`, `update_comment_created_at${i}`]
        let comment_data = [response_json.comments[i].content, response_json.comments[i].user.username, response_json.comments[i].created_at]

        for(let j=0;j<comment_data.length;j++){
            if (j === 2){
                let li = document.createElement("li");
                li.id = ids[j];
                li.textContent = comment_data[j].substr(0,10) + " " + comment_data[j].substr(11).substr(0,5);;
                comment.appendChild(li);
            }
            else {
                let li = document.createElement("li");
                li.id = ids[j];
                li.textContent = comment_data[j];
                comment.appendChild(li);
            }
        }

        const payload = localStorage.getItem("payload")
        const payload_parse = JSON.parse(payload)
        
        if (payload_parse.user_id === response_json.comments[i].user.id){
            let btn1 = document.createElement("button");
            btn1.textContent = "수정";
            btn1.id = `detail_update_comment_btn${i}`;
            // btn1.onclick = "handleUpdateComment();";
            btn1.addEventListener("click", () => handleUpdateComment(i, response_json.comments[i].id));
            comment.appendChild(btn1);
    
            let btn2 = document.createElement("button");
            btn2.textContent = "삭제";
            btn2.id = `detail_delete_comment_btn${i}`;
            btn2.addEventListener("click", () => handleDeleteComment(response_json.comments[i].id));
            comment.appendChild(btn2);
        }

        comments.appendChild(comment);
    }
}

async function handleCreateComment() {
    const content = document.getElementById("detail_create_comment").value
    console.log(content)

    const response = await fetch('http://127.0.0.1:8000/articles/4/comment/', {
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
        alert('작성 완료');
        window.location.href = "/articles/detail.html";
    } else {
        document.getElementById("detail_create_comment_failed").innerText = "  작성 실패. 내용을 입력해주세요."
    }
}

async function handleUpdateComment(i, comment_id) {
    // 수정, 삭제 버튼과 <li></li> content 부분 안 보이게 설정.
    document.getElementById(`update_comment_content${i}`).style.display = "none";
    document.getElementById(`detail_update_comment_btn${i}`).style.display = "none";
    document.getElementById(`detail_delete_comment_btn${i}`).style.display = "none";


    // content 있던 자리에 textarea와 수정 버튼 추가.
    let previous_content_cell = document.querySelector(`#comment${i}`);

    let update_content = document.createElement("textarea");
    update_content.id = "update_content";
    update_content.value = document.getElementById(`update_comment_content${i}`).textContent;

    let update_content_btn = document.createElement("button");
    update_content_btn.textContent = "수정";
    update_content_btn.addEventListener("click", () => updateComment(document.getElementById("update_content").value, comment_id));

    let update_comment_failed = document.createElement("span");
    update_comment_failed.style.color = "red";
    update_comment_failed.id = "detail_update_comment_failed";

    previous_content_cell.prepend(update_content);
    previous_content_cell.appendChild(update_content_btn);
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
        window.location.href = "/articles/detail.html";
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
        alert('삭제 완료');
        window.location.href = "/articles/detail.html";
    } else {
        alert('삭제 실패');
    }
}