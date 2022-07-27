const ajax = new XMLHttpRequest();
const NEWS_URL =
  'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=headline:("@searchkeyword")&page=1&sort=newest&api-key=atuLPNUKKa8AhV1aMr5zs2c1lNymmGsr';

async function getData(url) {
  const response = await fetch(url);
  const responsejson = await response.json();
  console.log(responsejson);
  return responsejson;
}

// function getData(url) {
//   let result;
//   fetch(url)
//     .then((response) => response.json())
//     .then((docs) => result);
//   return result;
// }

// ajax.open("GET", NEWS_URL, false);
// ajax.send();

// let newsList;

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
  </div>
`;

// 첫 화면 렌더링
init();

// console.log(newsList);
// console.log("response.docs", newsList.response.docs);

// document.getElementById("root").appendChild(ul);

function init() {
  document.getElementById("root").innerHTML = mainPageTemplate;
  const searchInputEl = document.getElementById("inputSearch");

  // 뉴스 리스트 가져오기
  printNewsList(NEWS_URL.replace("@searchkeyword", "korea"));

  searchInputEl.addEventListener("keyup", () => {
    console.log("input keyup");
    setTimeout(() => {
      console.log(searchInputEl.value);
    }, 500);
  });
}

async function printNewsList(url) {
  const ul = document.createElement("ul");

  const newsList = await getData(url);
  console.log(newsList);
  console.log(newsList.response);
  console.log(newsList.response.docs);
  // newsList.response.docs.forEach((news) => {
  newsList.response.docs.forEach((news) => {
    const li = document.createElement("li");
    li.innerText = news.headline.main;
    ul.appendChild(li);
    // console.log("foreach");
  });
  console.log(ul);
  document.querySelector("main").appendChild(ul);
}
