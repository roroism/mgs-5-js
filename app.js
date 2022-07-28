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
      </div>
    </div>
    <div class="search_result_wrapper">
      
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
  searchInputEl.addEventListener("keyup", (e) => {
    // console.log("input keyup");
    // const reg = /[^a-zA-Z0-9]|[\_]/;
    // if (e.key === "Shift") return;

    console.log(e.key);
    // console.log("reg.test(e.key)", reg.test(e.key));
    // if (reg.test(e.key)) return;
    if (
      e.key === "Tab" ||
      e.key === "Shift" ||
      e.key === "Ctrl" ||
      e.key === "Alt" ||
      e.key === "Pause/Break" ||
      e.key === "Caps Lock" ||
      e.key === "Esc" ||
      e.key === "Page Up" ||
      e.key === "Page Down" ||
      e.key === "End" ||
      e.key === "Home" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowDown" ||
      e.key === "Insert" ||
      e.key === "Delete" ||
      e.key === "Windows" ||
      e.key === "Right click" ||
      e.key === "Num Lock" ||
      e.key === "Scroll Lock"
    ) {
      // console.log("특수키 입력");
      return;
    }

    if (setTimeoutId) {
      clearTimeout(setTimeoutId);
      setTimeoutId = null;
    }

    // 0.5초 후 검색을 진행합니다.
    const searchkeyword = searchInputEl.value.trim();
    if (searchkeyword) {
      setTimeoutId = setTimeout(() => {
        console.log("0.5초후 printNewsList 실행");
        page = 1;
        printNewsList(
          NEWS_URL.replace("@searchkeyword", searchkeyword).replace(
            "@page",
            page
          )
        );
        // 검색에 성공했으므로 검색어를 배열에 저장하고 출력하는 함수로 보냅니다.
        saveSearchWordtoHistory(searchkeyword);

        // 수행된 검색에 대한 결과 정보 출력합니다.
        searchResult();
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
  const newsList = await getData(url.replace("@page", page));

  //가져온 기사가 한개도 없다면 함수를 종료합니다.
  if (newsList.response.docs.length === 0) return;
  // console.log("newsList.response.docs.length", newsList.response.docs.length);
  // console.log(newsList.response);
  // console.log(newsList.response.docs);
  // newsList.response.docs.forEach((news) => {
  const ul = document.createElement("ul");
  newsList.response.docs.forEach((news) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    // <할 일>
    // 1. 템플릿 제작
    // 2. 새로 검색시 기존의 리스트 제거,무한스크롤 검색시에는 기존것 제거 않고 추가

    // const  = document.createElement('button');
    li.innerText = news.headline.main;
    ul.appendChild(li);
    // console.log("foreach");
  });
  // console.log(ul);
  document.querySelector("main").appendChild(ul);
}

// 매개변수로 받은 검색에 성공한 단어를 배열에 저장하고 history에 출력하는 함수를 부릅니다.
function saveSearchWordtoHistory(searchkeyword) {
  console.log("saveSearchWordtoHistory");

  // 배열에 앞에서부터 단어를 넣습니다.
  searchHistories.unshift(searchkeyword);

  // 배열의 길이가 6이상이면 배열의 길이를 5로 맞추어 6번째 이후는 제거합니다.
  if (searchHistories.length >= 6) searchHistories.length = 5;

  // 출력해주는 함수를 부릅니다.
  printSearchHistory();
  console.log("searchHistories");
}

// 검색어들을 history에 츨력해줍니다.
function printSearchHistory() {
  const searchHistoryWrapperEl = document.querySelector(
    ".search_history_wrapper"
  );
  const searchHistoryListEl = document.querySelector(".search_history_list");

  const ulEl = document.createElement("ul");
  ulEl.className = "search_history_list";
  for (let i = 0; i < searchHistories.length; i++) {
    const liEl = document.createElement("li");
    const aEl = document.createElement("a");
    aEl.innerText = searchHistories[i];
    liEl.appendChild(aEl);
    ulEl.appendChild(liEl);
  }

  if (searchHistoryListEl) {
    // searchHistoryWrapperEl.removeChild(searchHistoryListEl);
    searchHistoryListEl.remove();
  }
  searchHistoryWrapperEl.appendChild(ulEl);
}

// 수행된 검색에 대한 결과 정보 출력합니다.
function searchResult() {
  const searchResultWrapperEl = document.querySelector(
    ".search_result_wrapper"
  );
  const spanEl = document.querySelector(".search_result_wrapper > span");

  // console.log("searchHistories[0]", searchHistories[0]);
  // console.log("searchResultWrapperEl", searchResultWrapperEl);
  if (spanEl) searchResultWrapperEl.removeChild(spanEl);
  if (searchHistories[0]) {
    console.log("결과보고 수행");
    const createspanEl = document.createElement("span");
    createspanEl.innerText = `${searchHistories[0]}에 대한 검색 결과`;
    searchResultWrapperEl.appendChild(createspanEl);
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
      ++page;
      printNewsList(NEWS_URL.replace("@searchkeyword", searchkeyword));
    }
    document.querySelector("body").style.backgroundColor = "red";
  } else {
    document.querySelector("body").style.backgroundColor = "blue";
  }
});
