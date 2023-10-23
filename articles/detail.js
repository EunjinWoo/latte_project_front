window.onload = () => {
    console.log("window loaded");

    request();
}

{/* <p>category : </p><p id="detail_category"></p>
        <p>title : </p><p id="detail_title"></p>
        <img id="detail_image">
        <p>content : </p><p id="detail_content"></p>
        <p>created_at : </p><p id="detail_created_at"></p>
        <p>author : </p><p id="detail_author"></p>
        <p>comments : </p><p id="detail_comments"></p> */}

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

        let comment_data = [response_json.comments[i].content, response_json.comments[i].user.username, response_json.comments[i].created_at]

        for(let j=0;j<comment_data.length;j++){
            if (j === 2){
                let li = document.createElement("li");
                li.textContent = comment_data[j].substr(0,10) + " " + comment_data[j].substr(11).substr(0,5);;
                comment.appendChild(li);
            }
            else {
                let li = document.createElement("li");
                li.textContent = comment_data[j];
                comment.appendChild(li);
            }
        }

        comments.appendChild(comment);
    }
}