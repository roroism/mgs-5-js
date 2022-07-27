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

// 첫 화면을 렌더링 합니다.
init();

function init() {
  document.getElementById("root").innerHTML = mainPageTemplate;
  const searchInputEl = document.getElementById("inputSearch");

  // 뉴스 리스트를 가져와서 화면에 출력합니다.
  // printNewsList(NEWS_URL.replace("@searchkeyword", "korea"));

  let setTimeoutId;

  // 검색창의 이벤트리스너입니다.
  searchInputEl.addEventListener("keyup", () => {
    // console.log("input keyup");

    // console.log("before", setTimeoutId);
    if (setTimeoutId) {
      clearTimeout(setTimeoutId);
      setTimeoutId = null;
    }
    // console.log("after", setTimeoutId);

    // 0.5초 후 검색을 진행합니다.
    setTimeoutId = setTimeout(() => {
      console.log("0.5초후 printNewsList 실행");
      printNewsList(NEWS_URL.replace("@searchkeyword", searchInputEl.value));
    }, 500);

    // searchInputEl.addEventListener("keyup", (e) => {
    //   console.log("clearTimeout 실행");
    //   clearTimeout(setTimeoutId);
    //   removeEventListener('keyup');
    // });
  });
}

// json데이터를 가져와서 화면에 뉴스리스트를 출력합니다.
async function printNewsList(url) {
  const ul = document.createElement("ul");

  const newsList = await getData(url);
  // console.log(newsList);
  // console.log(newsList.response);
  // console.log(newsList.response.docs);
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
