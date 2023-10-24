console.log("자바스크립트 불러옴");

window.onload = async function loadArticles() {
    const response = await fetch ("http://127.0.0.1:8000/articles/", {method: "GET"})

    response_json = await response.json()
    console.log(response_json)

    const articles = document.getElementById("articles")

    response_json.forEach(element => {
        console.log(element.title)
        const newArticle = document.createElement("div")
        newArticle.innerText = element.title
        articles.appendChild(newArticle)
    })
}