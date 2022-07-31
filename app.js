const NEWS_URL =
  'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=headline:("@searchkeyword")&page=@page&sort=newest&api-key=atuLPNUKKa8AhV1aMr5zs2c1lNymmGsr';

const NEW_SEARCH = "NEW_SEARCH";
const ADD_SEARCH = "ADD_SEARCH";

const store = {
  // 불러올 page 를 저장합니다.
  // '페이지 첫 렌더링시'와 '검색에 성공했을 시' 에는 1로 초기화 합니다.
  page: 1,
  // 받아온 데이터를 보관합니다.
  newList: [],
  // 검색 성공한 단어들을 저장할 배열입니다.
  searchHistories: [],
  // clip된 기사를 저장할 배열입니다.
  clipList: [],
};

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
    <div class="clipped_news_wrapper">
      <button>Clipped News</button>
    </div>

    <div class="search_wrapper on">
      <div class="search">
        <label for="inputSearch">Search</label>
        <input type="text" id="inputSearch">
        <div class="search_history_wrapper">
        </div>
      </div>
      <div class="search_result_wrapper">
      </div>
    </div>

    <main class="newslist_wrapper on">
    </main>
    <main class="cliplist_wrapper">
    </main>
  </div>
`;

// input 태그의 Element입니다.
let searchInputEl;

// 첫 화면을 렌더링 하고, event를 등록합니다.
// init();

// function init() {
document.getElementById("root").innerHTML = mainPageTemplate;
searchInputEl = document.getElementById("inputSearch");

const cliplistWrapperEl = document.querySelector("main.cliplist_wrapper");

let setTimeoutId;

// 검색창의 이벤트입니다.
searchInputEl.addEventListener("keyup", (e) => {
  if (
    e.key === "Tab" ||
    e.key === "CapsLock" ||
    e.key === "Shift" ||
    e.key === "Control" ||
    e.key === "HanjaMode" ||
    e.key === "HangulMode" ||
    e.key === "ContextMenu" ||
    e.key === "Meta" ||
    e.key === "Alt" ||
    e.key === "Pause" ||
    e.key === "Caps Lock" ||
    e.key === "Escape" ||
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
    e.key === "NumLock" ||
    e.key === "ScrollLock" ||
    e.key === "PrintScreen" ||
    e.key === "PageDown" ||
    e.key === "PageUp" ||
    e.key === "F1" ||
    e.key === "F2" ||
    e.key === "F3" ||
    e.key === "F4" ||
    e.key === "F5" ||
    e.key === "F6" ||
    e.key === "F7" ||
    e.key === "F8" ||
    e.key === "F9" ||
    e.key === "F10" ||
    e.key === "F11" ||
    e.key === "F12"
  ) {
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
      store.page = 1;
      printNewsList(
        NEWS_URL.replace("@searchkeyword", searchkeyword),
        NEW_SEARCH
      );
      // 검색에 성공했으므로 검색어를 배열에 저장하고 출력하는 함수로 보냅니다.
      saveSearchWordtoHistory(searchkeyword);

      // 수행된 검색에 대한 결과 정보 출력합니다.
      searchResult();
    }, 500);
  }
});

const searchHistoryEl = document.querySelector(".search_history_wrapper");
//검색창에 focus를 하면 history가 나오게하는 이벤트입니다.
searchInputEl.addEventListener("focus", () => {
  searchHistoryEl.classList.add("on");
});
searchInputEl.addEventListener("focusout", () => {
  searchHistoryEl.classList.remove("on");
});

// 무한 스크롤을 위한 스크롤 이벤트입니다. 스크롤의 위치를 감지합니다.
window.addEventListener("scroll", () => {
  // clip된 뉴스들이 보이는 화면에서는 동작하지 않게 합니다.
  if (cliplistWrapperEl.classList.contains("on")) return;

  let scrollLocation = document.documentElement.scrollTop; // 현재 스크롤바 위치
  let windowHeight = window.innerHeight; // 스크린 창
  let fullHeight = document.body.scrollHeight; //  margin 값은 포함 x

  // 스크롤이 맨 마지막에 도달하면..
  if (scrollLocation + windowHeight >= fullHeight) {
    const searchkeyword = searchInputEl.value.trim();
    console.log("searchkeyword", searchkeyword);
    // 검색어가 null이 아니라면
    if (searchkeyword) {
      ++store.page;
      printNewsList(
        NEWS_URL.replace("@searchkeyword", searchkeyword),
        ADD_SEARCH
      );
    }
    document.querySelector("body").style.backgroundColor = "red";
  } else {
    document.querySelector("body").style.backgroundColor = "blue";
  }
});

// 버튼을 클릭하면 clip화면과 검색화면을 switching 해주는 이벤트입니다.
const searchWrapperEl = document.querySelector(".search_wrapper");
const newslistWrapperEl = document.querySelector("main.newslist_wrapper");

document
  .querySelector(".clipped_news_wrapper > button")
  .addEventListener("click", () => {
    if (searchWrapperEl.classList.contains("on")) {
      searchWrapperEl.classList.remove("on");
      newslistWrapperEl.classList.remove("on");
      cliplistWrapperEl.classList.add("on");
    } else {
      cliplistWrapperEl.classList.remove("on");
      searchWrapperEl.classList.add("on");
      newslistWrapperEl.classList.add("on");
    }
  });

// 렌더 된 검색목록에 있는 clip this / unclip this 버튼 이벤트입니다.
const newslistMainEl = document.querySelector("main.newslist_wrapper");
newslistMainEl.addEventListener("click", (e) => {
  // click 한 요소가 clip this 버튼인지 확인합니다.
  if (e.target.classList.contains("clip_button")) {
    // 이미 clip된 요소인지 아닌지 검사하고,
    // clip된 것이라면 clipList 배열에서 삭제합니다.
    if (e.target.parentElement.classList.contains("clipped")) {
      const index = store.clipList.findIndex((clippedNews) => {
        return clippedNews._id === e.target.parentElement.dataset._id;
      });
      store.clipList.splice(index, 1);

      e.target.parentElement.classList.remove("clipped");
      e.target.innerText = "Clip this";
      // console.log(store.clipList);
    } else {
      // clip안 된 것이라면,
      // newsList 배열에서 해당 item을 찾아서 clipList에 넣습니다.
      store.clipList.push(
        store.newsList.find(
          (item) => item._id === e.target.parentElement.dataset._id
        )
      );
      e.target.parentElement.classList.add("clipped");
      e.target.innerText = "Unclip this";
      // console.log(store.clipList);
    }
    // 'clip된 뉴스만 보기' 화면에 재반영합니다.
    printClipList();
  }
});

// 렌더 된 clip목록에 있는 unclip this 버튼 이벤트입니다.

cliplistWrapperEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("clip_button")) {
    // cliplist에서 해당 item을 삭제하고, 렌더된 해당 엘리먼트도 삭제합니다.
    const index = store.clipList.findIndex((clippedNews) => {
      return clippedNews._id === e.target.parentElement.dataset._id;
    });
    store.clipList.splice(index, 1);
    e.target.parentElement.remove();

    // 레더 된 검색된 기사목록에서도 해당 기사가 있는지 찾아서 있다면,
    // unclip으로 된 버튼을 clip으로 바꾸고 class="clipped"도 삭제합니다.
    const willChangeEl = document.querySelector(
      `main.newslist_wrapper > ul > li[data-_id='${e.target.parentElement.dataset._id}']`
    );
    if (willChangeEl) {
      willChangeEl.classList.remove("clipped");
      willChangeEl.querySelector(".clip_button").innerText = "Clip this";
      console.log("진입성공");
    }
  }
});
// }

// json데이터를 가져와서 화면에 뉴스리스트를 출력합니다.
async function printNewsList(url, searchType) {
  const newsList = await getData(url.replace("@page", store.page));

  // 새로검색하면 기존 데이터를 지우고 저장하고,
  // 추가검색하면 기존 데이터에 추가로 저장합니다.
  if (searchType === NEW_SEARCH) {
    store.newsList = newsList.response.docs;
  } else {
    // searchType === ADD_SEARCH
    store.newsList.push(...newsList.response.docs);
  }

  // console.log("store.newsList", store.newsList);

  const mainEl = document.querySelector("main.newslist_wrapper");
  const mainChildUlEl = document.querySelector("main.newslist_wrapper > ul");
  console.log("mainChildUlEl", mainChildUlEl);
  // 새로 검색한 경우에는 기존의 출력된 뉴스 리스트를 전부 삭제합니다.
  if (searchType === NEW_SEARCH && mainChildUlEl !== null) {
    mainEl.removeChild(mainChildUlEl);
  }

  //가져온 기사가 한개도 없다면 함수를 종료합니다.
  if (store.newsList.length === 0) return;

  const ul = document.createElement("ul");

  for (let i = (store.page - 1) * 10; i < store.newsList.length; i++) {
    const li = document.createElement("li");
    li.dataset._id = store.newsList[i]._id;
    // 기사 엘리먼트(p)를 생성합니다.
    const p = document.createElement("p");
    p.innerText = store.newsList[i].headline.main;
    li.appendChild(p);
    // 날짜 엘리먼트(span)를 생성합니다.
    const span = document.createElement("span");
    span.innerText = store.newsList[i].pub_date;
    li.appendChild(span);
    // clip하기 혹은 unclip하기 버튼을 생성합니다.
    const clipBtn = document.createElement("button");
    clipBtn.className = "clip_button";

    // 이미 clip 된 뉴스인지 아닌지 검사합니다.
    if (
      store.clipList.find((clippedNews) => {
        // console.log("store.newList[i]._id", store.newsList[i]._id);
        // console.log("clippedNews._id", clippedNews._id);
        return store.newsList[i]._id === clippedNews._id;
      })
    ) {
      clipBtn.innerText = "Unclip this";
      li.classList.add("clipped");
    } else {
      clipBtn.innerText = "Clip this";
    }

    li.appendChild(clipBtn);
    // 뉴스보러가기 anchor를 생성합니다.
    const a = document.createElement("a");
    a.href = store.newsList[i].web_url;
    a.target = "_blank";
    a.title = "open in new window";
    li.appendChild(a);
    // 뉴스보러가기 버튼을 생성합니다.
    const detailBtn = document.createElement("button");
    detailBtn.innerText = "See Detail";
    a.appendChild(detailBtn);

    if (searchType === NEW_SEARCH) {
      ul.appendChild(li);
    } else {
      // searchType === ADD_SEARCH
      mainChildUlEl.appendChild(li);
    }
  }

  if (searchType === NEW_SEARCH) {
    mainEl.appendChild(ul);
  }
}

// 매개변수로 받은 검색에 성공한 단어를 배열에 저장하고 history에 출력하는 함수를 부릅니다.
function saveSearchWordtoHistory(searchkeyword) {
  console.log("saveSearchWordtoHistory");

  // 배열에 앞에서부터 단어를 넣습니다.
  store.searchHistories.unshift(searchkeyword);

  // 배열의 길이가 6이상이면 배열의 길이를 5로 맞추어 6번째 이후는 제거합니다.
  if (store.searchHistories.length >= 6) store.searchHistories.length = 5;

  // 출력해주는 함수를 부릅니다.
  printSearchHistory();
  // console.log("store.searchHistories");
}

// 검색어들을 history에 츨력해줍니다.
function printSearchHistory() {
  const searchHistoryWrapperEl = document.querySelector(
    ".search_history_wrapper"
  );
  const searchHistoryListEl = document.querySelector(".search_history_list");

  const ulEl = document.createElement("ul");
  ulEl.className = "search_history_list";
  for (let i = 0; i < store.searchHistories.length; i++) {
    const liEl = document.createElement("li");
    const aEl = document.createElement("a");
    aEl.innerText = store.searchHistories[i];
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

  // console.log("store.searchHistories[0]", store.searchHistories[0]);
  // console.log("searchResultWrapperEl", searchResultWrapperEl);
  if (spanEl) searchResultWrapperEl.removeChild(spanEl);
  if (store.searchHistories[0]) {
    console.log("결과보고 수행");
    const createspanEl = document.createElement("span");
    createspanEl.innerText = `${store.searchHistories[0]}에 대한 검색 결과`;
    searchResultWrapperEl.appendChild(createspanEl);
  }
}

// clip된 기사들을 출력합니다.
function printClipList() {
  // console.log("printClipList() 진입");
  const mainChildUlEl = document.querySelector("main.cliplist_wrapper > ul");

  // 출력되어있는 목록을 전부 삭제합니다.
  if (mainChildUlEl !== null) {
    cliplistWrapperEl.removeChild(mainChildUlEl);
  }

  // clip 된 뉴스가 없다면 함수를 종료합니다.
  if (store.clipList.length === 0) return;

  const ul = document.createElement("ul");
  store.clipList.forEach((item) => {
    const li = document.createElement("li");
    li.dataset._id = item._id;
    // 기사 엘리먼트(p)을 생성합니다.
    const p = document.createElement("p");
    p.innerText = item.headline.main;
    li.appendChild(p);
    // 날짜 엘리먼트(span)을 생성합니다.
    const span = document.createElement("span");
    span.innerText = item.pub_date;
    li.appendChild(span);
    // unclip하기 버튼 생성합니다.
    const clipBtn = document.createElement("button");
    clipBtn.className = "clip_button";
    clipBtn.innerText = "Unclip this";
    li.classList.add("clipped");
    li.appendChild(clipBtn);
    // 뉴스보러가기 anchor를 생성합니다.
    const a = document.createElement("a");
    a.href = item.web_url;
    a.target = "_blank";
    a.title = "open in new window";
    li.appendChild(a);
    // 뉴스보러가기 버튼을 생성합니다.
    const detailBtn = document.createElement("button");
    detailBtn.innerText = "See Detail";
    a.appendChild(detailBtn);

    ul.appendChild(li);
  });

  cliplistWrapperEl.appendChild(ul);
}
