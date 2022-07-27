const ajax = new XMLHttpRequest();
const NEWS_URL =
  'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=headline:("korea")&page=1&sort=newest&api-key=atuLPNUKKa8AhV1aMr5zs2c1lNymmGsr';

ajax.open("GET", NEWS_URL, false);
ajax.send();

const newsList = JSON.parse(ajax.response);

const mainPageTemplate = `
  <div class="wrapper">
    <header>
    </header>
    <div class="search">
      <label for="inputSearch">검색</label>
      <input type="text" id="inputSearch">
    </div>
    <main>
    </main>
    <footer>
    </footer>
  </div>
`;

// 첫 화면 렌더링
init();
// 뉴스 리스트 가져오기
printNewsList();

console.log(newsList);
console.log("response.docs", newsList.response.docs);

// document.getElementById("root").appendChild(ul);

function init() {
  document.getElementById("root").innerHTML = mainPageTemplate;
}

function printNewsList() {
  const ul = document.createElement("ul");
  newsList.response.docs.forEach((news) => {
    const li = document.createElement("li");
    li.innerText = news.headline.main;
    ul.appendChild(li);
    // console.log("foreach");
  });
  document.querySelector("main").appendChild();
}
