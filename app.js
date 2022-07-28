const NEWS_URL =
  'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=headline:("@searchkeyword")&page=@page&sort=newest&api-key=atuLPNUKKa8AhV1aMr5zs2c1lNymmGsr';

async function getData(url) {
  const response = await fetch(url);
  const responsejson = await response.json();
  console.log(responsejson);
  return responsejson;
}

const mainPageTemplate = `
  <div class="wrapper">
    <header>
    </header>
    <div class="search">
      <label for="inputSearch">Search</label>
      <input type="text" id="inputSearch">
      <div class="search_history_wrapper">
        <ul class="search_history">
        </ul>
      </div>
    </div>
    <main>
    </main>
  </div>
`;
const mainPageListTemplate = `

`;

// 검색 성공한 단어들을 저장할 배열입니다.
const searchHistories = [];

// 불러올 page 수를 저장합니다.
// '페이지 첫 렌더링시'와 '검색에 성공했을 시' 에는 1로 초기화 합니다.
let page = 1;

//input 태그의 Element입니다.
let searchInputEl;

// 첫 화면을 렌더링 합니다.
init();

function init() {
  document.getElementById("root").innerHTML = mainPageTemplate;
  searchInputEl = document.getElementById("inputSearch");

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
    const searchkeyword = searchInputEl.value.trim();
    if (searchkeyword) {
      setTimeoutId = setTimeout(() => {
        console.log("0.5초후 printNewsList 실행");
        printNewsList(
          NEWS_URL.replace("@searchkeyword", searchkeyword).replace(
            "@page",
            page
          )
        );
        searchHistories.shift(searchkeyword);
        saveSearchWordtoHistory();
      }, 500);
    }
  });

  const searchHistoryEl = document.querySelector(".search_history_wrapper");
  //검색창에 focus를 하면 history가 나옵니다.
  searchInputEl.addEventListener("focus", () => {
    searchHistoryEl.classList.add("on");
  });
  searchInputEl.addEventListener("focusout", () => {
    searchHistoryEl.classList.remove("on");
  });
}

// json데이터를 가져와서 화면에 뉴스리스트를 출력합니다.
async function printNewsList(url) {
  const newsList = await getData(url);

  //가져온 기사가 한개도 없다면 함수를 종료합니다.
  if (newsList.response.docs.length === 0) return;
  // console.log("newsList.response.docs.length", newsList.response.docs.length);
  // console.log(newsList.response);
  // console.log(newsList.response.docs);
  // newsList.response.docs.forEach((news) => {
  const ul = document.createElement("ul");
  newsList.response.docs.forEach((news) => {
    const li = document.createElement("li");
    li.innerText = news.headline.main;
    ul.appendChild(li);
    // console.log("foreach");
  });
  // console.log(ul);
  document.querySelector("main").appendChild(ul);
}

// 검색에 성공한 단어를 보관하고 history영역에 렌더합니다.
function saveSearchWordtoHistory() {
  for (let i = 0; i <= 4; i++) {
    const liEl = document.createElement("li");
    const aEl = document.createElement("a");
    aEl.innerText = searchHistories[i];
    liEl.appendChild(aEl);
    document.querySelector(".search_history").appendChild(liEl);
  }
}

// function infinityScroll() {}
// 무한 스크롤을 위한 스크롤 이벤트입니다. 스크롤의 위치를 감지합니다.
window.addEventListener("scroll", () => {
  let scrollLocation = document.documentElement.scrollTop; // 현재 스크롤바 위치
  let windowHeight = window.innerHeight; // 스크린 창
  let fullHeight = document.body.scrollHeight; //  margin 값은 포함 x

  // 스크롤이 맨 마지막에 도달하면..
  if (scrollLocation + windowHeight >= fullHeight) {
    const searchkeyword = searchInputEl.value.trim();
    console.log("searchkeyword", searchkeyword);
    // 검색어가 null이 아니라면
    if (searchkeyword) {
      printNewsList(
        NEWS_URL.replace("@searchkeyword", searchkeyword).replace(
          "@page",
          ++page
        )
      );
    }
    document.querySelector("body").style.backgroundColor = "red";
  } else {
    document.querySelector("body").style.backgroundColor = "blue";
  }
});
