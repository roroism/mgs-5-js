import API_TOKEN from "./api.js";

const NEWS_URL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=headline:("@searchkeyword")&page=@page&sort=newest&api-key=${API_TOKEN}`;

const NEW_SEARCH = "NEW_SEARCH";
const ADD_SEARCH = "ADD_SEARCH";

const store = {
  // 불러올 page 를 저장합니다.
  // '페이지 첫 렌더링시'와 '검색에 성공했을 시' 에는 1로 초기화 합니다.
  page: 1,
  // 받아온 데이터를 보관합니다.
  newsList: [],
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
      <button type="button">clipped News</button>
    </div>

    <div class="search_wrapper on">
      <div class="search">
        <label for="inputSearch" class="hidden">Search</label>
        <input type="text" id="inputSearch" placeholder="Search">
        <div class="search_btn_wrapper">
          <button type="button" id="search_btn">검색</button>
        </div>
        <div class="search_history_wrapper">
        </div>
      </div>
    </div>
    <div class="search_result_wrapper on">
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
searchInputEl.addEventListener("input", () => {
  // if (
  //   e.key === "Tab" ||
  //   e.key === "CapsLock" ||
  //   e.key === "Shift" ||
  //   e.key === "Control" ||
  //   e.key === "HanjaMode" ||
  //   e.key === "HangulMode" ||
  //   e.key === "ContextMenu" ||
  //   e.key === "Meta" ||
  //   e.key === "Alt" ||
  //   e.key === "Pause" ||
  //   e.key === "Caps Lock" ||
  //   e.key === "Escape" ||
  //   e.key === "Page Up" ||
  //   e.key === "Page Down" ||
  //   e.key === "End" ||
  //   e.key === "Home" ||
  //   e.key === "ArrowLeft" ||
  //   e.key === "ArrowUp" ||
  //   e.key === "ArrowRight" ||
  //   e.key === "ArrowDown" ||
  //   e.key === "Insert" ||
  //   e.key === "Delete" ||
  //   e.key === "Windows" ||
  //   e.key === "Right click" ||
  //   e.key === "NumLock" ||
  //   e.key === "ScrollLock" ||
  //   e.key === "PrintScreen" ||
  //   e.key === "PageDown" ||
  //   e.key === "PageUp" ||
  //   e.key === "F1" ||
  //   e.key === "F2" ||
  //   e.key === "F3" ||
  //   e.key === "F4" ||
  //   e.key === "F5" ||
  //   e.key === "F6" ||
  //   e.key === "F7" ||
  //   e.key === "F8" ||
  //   e.key === "F9" ||
  //   e.key === "F10" ||
  //   e.key === "F11" ||
  //   e.key === "F12"
  // ) {
  //   return;
  // }

  // setTimeout 함수를 취소합니다.
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
//검색창에 focus를 하면 history가 나오는 이벤트입니다.
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
    // document.querySelector("body").style.backgroundColor = "red";
  } else {
    // document.querySelector("body").style.backgroundColor = "blue";
  }
});

// 버튼을 클릭하면 clip화면과 검색화면을 switching 해주는 이벤트입니다.
const searchWrapperEl = document.querySelector(".search_wrapper");
const newslistWrapperEl = document.querySelector("main.newslist_wrapper");
const searchResultWrapperEl = document.querySelector(".search_result_wrapper");

document
  .querySelector(".clipped_news_wrapper > button")
  .addEventListener("click", (e) => {
    if (searchWrapperEl.classList.contains("on")) {
      searchWrapperEl.classList.remove("on");
      newslistWrapperEl.classList.remove("on");
      searchResultWrapperEl.classList.remove("on");
      cliplistWrapperEl.classList.add("on");
      e.currentTarget.innerText = "searched News";
    } else {
      cliplistWrapperEl.classList.remove("on");
      searchWrapperEl.classList.add("on");
      newslistWrapperEl.classList.add("on");
      searchResultWrapperEl.classList.add("on");
      e.currentTarget.innerText = "clipped News";
    }
  });

// 렌더 된 검색된뉴스목록에 있는 clip this / unclip this 버튼 이벤트입니다.
const newslistMainEl = document.querySelector("main.newslist_wrapper");
newslistMainEl.addEventListener("click", (e) => {
  // click 한 요소가 clip this 버튼인지 확인합니다.
  if (e.target.classList.contains("clip_button")) {
    // clip된 뉴스인지 아닌지 확인하는 방법으로 li태그에 class로 넣어둔 값을 얻기 위해, li엘리먼트를 가져옵니다.
    const parentLiEl = e.target.parentElement.parentElement.parentElement;
    // 이미 clip된 요소인지 아닌지 검사하고,
    // if) clip된 것이라면 clipList 배열에서 삭제합니다.
    if (parentLiEl.classList.contains("clipped")) {
      // clipList에서 _id 값으로 해당하는 item의 index값을 얻어서 배열에서 삭제합니다.
      const index = store.clipList.findIndex((clippedNews) => {
        // console.log(parentLiEl);
        return clippedNews._id === parentLiEl.dataset._id;
      });
      store.clipList.splice(index, 1);
      // li엘리먼트의 class로 있었던 clipped를 제거합니다.
      parentLiEl.classList.remove("clipped");
      // 버튼의 클래스에서 'unclip'을 삭제합니다.
      e.target.classList.remove("unclip");
      // 버튼의 이름을 Unclip this에서 Clip this로 변경합니다.
      e.target.innerText = "Clip this";
      // console.log(store.clipList);
    } else {
      // if) clip안 된 것이라면,
      // newsList 배열에서 해당 item을 찾아서 clipList에 넣습니다.
      store.clipList.push(
        store.newsList.find((item) => item._id === parentLiEl.dataset._id)
      );
      // li엘리먼트의 클래스로 clipped를 추가합니다.
      parentLiEl.classList.add("clipped");
      // 버튼의 클래스에 'unclip'을 추가합니다.
      e.target.classList.add("unclip");
      // 버튼의 이름을 clip this에서 Unclip this로 변경합니다.
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
    const parentLiEl = e.target.parentElement.parentElement.parentElement;
    // cliplist에서 해당 item을 삭제하고, 렌더된 해당 엘리먼트도 삭제합니다.
    const index = store.clipList.findIndex((clippedNews) => {
      return clippedNews._id === parentLiEl.dataset._id;
    });
    store.clipList.splice(index, 1);
    parentLiEl.remove();

    // 렌더 된 검색된 기사목록에서도 해당 기사가 있는지 찾아서 있다면,
    // unclip으로 된 버튼이름을 clip으로 바꾸고, 버튼의 클래스 unclip을 삭제합니다.
    // 그리고 li 엘리먼트의 클래스"clipped"도 삭제합니다.
    const willChangeEl = document.querySelector(
      `main.newslist_wrapper > ul > li[data-_id='${parentLiEl.dataset._id}']`
    );
    if (willChangeEl) {
      willChangeEl.classList.remove("clipped");
      willChangeEl.querySelector(".clip_button").innerText = "Clip this";
      willChangeEl.querySelector(".clip_button").classList.remove("unclip");
      // console.log("진입성공");
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
    // id값을 li엘리먼트에 data로 주입합니다.
    li.dataset._id = store.newsList[i]._id;
    // img를 출력하는 엘리먼트를 생성합니다.
    const imgWrap = document.createElement("div");
    imgWrap.className = "img_wrapper";
    const imgEl = document.createElement("img");
    // console.log(store.newsList[i].multimedia[0].url);
    if (store.newsList[i].multimedia.length === 0) {
      imgEl.src = "./The_New_York_Times_logo.png";
    } else {
      // imgEl.src = `https://static01.nyt.com/${store.newsList[i].multimedia[0].url}`;
      imgEl.src = `http://www.nytimes.com/${store.newsList[i].multimedia[0].url}`;
    }
    imgEl.alt = store.newsList[i].headline.main;
    imgWrap.appendChild(imgEl);
    li.appendChild(imgWrap);
    // 오른쪽 div 를 생성합니다.
    const rightdiv = document.createElement("div");
    rightdiv.className = "right_div";
    // section출력을 위한 엘리먼트(span)을 생성합니다.
    const sectionEl = document.createElement("span");
    sectionEl.innerText = store.newsList[i].section_name;
    rightdiv.appendChild(sectionEl);
    // 기사 엘리먼트(strong)를 생성합니다.
    const strong = document.createElement("strong");
    strong.innerText = store.newsList[i].headline.main;
    rightdiv.appendChild(strong);
    // 날짜 엘리먼트(span)를 생성합니다.
    const span = document.createElement("span");
    span.className = "pub_date";
    // span.innerText = store.newsList[i].pub_date;
    span.innerText = store.newsList[i].pub_date.replace("T", " ").split("+")[0];
    // console.log(new Date(store.newsList[i].pub_date));
    rightdiv.appendChild(span);
    // clip하기 혹은 unclip하기 버튼을 생성합니다.
    const clipBtn = document.createElement("button");
    clipBtn.className = "clip_button";

    // 이미 clip 된 뉴스인지 아닌지 검사합니다.
    if (
      store.clipList.find((clippedNews) => {
        // console.log("clippedNews._id", clippedNews._id);
        return store.newsList[i]._id === clippedNews._id;
      })
    ) {
      // if) 이미 clip된 뉴스라면,
      // clip 버튼에 이름을 Unclip this으로 설정하고, unclip 클래스를 추가합니다.
      clipBtn.innerText = "Unclip this";
      clipBtn.classList.add("unclip");
      // li엘리먼트에 clipped 클래스를 추가합니다.
      li.classList.add("clipped");
    } else {
      // if) clip되지 않은 뉴스라면
      clipBtn.innerText = "Clip this";
    }

    rightdiv.appendChild(clipBtn);
    // 뉴스보러가기 anchor를 생성합니다.
    const a = document.createElement("a");
    a.href = store.newsList[i].web_url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.title = "open in new window";
    rightdiv.appendChild(a);
    // 뉴스보러가기 버튼을 생성합니다.
    const detailBtn = document.createElement("button");
    detailBtn.innerText = "See Detail";
    detailBtn.className = "detail_news_button";
    a.appendChild(detailBtn);

    // article 엘리먼트를 생성합니다.
    const articleEl = document.createElement("article");
    articleEl.appendChild(imgWrap);
    articleEl.appendChild(rightdiv);

    li.appendChild(articleEl);

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
  // const searchResultWrapperEl = document.querySelector(
  //   ".search_result_wrapper"
  // );
  const spanEl = document.querySelector(".search_result_wrapper > span");

  // console.log("store.searchHistories[0]", store.searchHistories[0]);
  // console.log("searchResultWrapperEl", searchResultWrapperEl);
  if (spanEl) searchResultWrapperEl.removeChild(spanEl);
  if (store.searchHistories[0]) {
    // console.log("결과보고 수행");
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
    // id값을 li엘리먼트에 data로 주입합니다.
    li.dataset._id = item._id;
    // img를 출력하는 엘리먼트를 생성합니다.
    const imgWrap = document.createElement("div");
    imgWrap.className = "img_wrapper";
    const imgEl = document.createElement("img");
    // console.log(item.multimedia[0].url);
    if (item.multimedia.length === 0) {
      imgEl.src = "./The_New_York_Times_logo.png";
    } else {
      // imgEl.src = `https://static01.nyt.com/${item.multimedia[0].url}`;
      imgEl.src = `http://www.nytimes.com/${item.multimedia[0].url}`;
    }
    imgEl.alt = item.headline.main;
    imgWrap.appendChild(imgEl);
    // 오른쪽 div 를 생성합니다.
    const rightdiv = document.createElement("div");
    rightdiv.className = "right_div";
    // section출력을 위한 엘리먼트(span)을 생성합니다.
    const sectionEl = document.createElement("span");
    sectionEl.innerText = item.section_name;
    rightdiv.appendChild(sectionEl);
    // 기사 엘리먼트(strong)을 생성합니다.
    const strong = document.createElement("strong");
    strong.innerText = item.headline.main;
    rightdiv.appendChild(strong);
    // 날짜 엘리먼트(span)을 생성합니다.
    const span = document.createElement("span");
    span.className = "pub_date";
    span.innerText = item.pub_date.replace("T", " ").split("+")[0];
    // span.innerText = item.pub_date;
    rightdiv.appendChild(span);
    // unclip하기 버튼 생성합니다.
    const clipBtn = document.createElement("button");
    clipBtn.classList.add("clip_button", "unclip");
    clipBtn.innerText = "Unclip this";
    li.classList.add("clipped");
    rightdiv.appendChild(clipBtn);
    // 뉴스보러가기 anchor를 생성합니다.
    const a = document.createElement("a");
    a.href = item.web_url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.title = "open in new window";
    rightdiv.appendChild(a);
    // 뉴스보러가기 버튼을 생성합니다.
    const detailBtn = document.createElement("button");
    detailBtn.innerText = "See Detail";
    detailBtn.className = "detail_news_button";
    a.appendChild(detailBtn);

    // article 엘리먼트를 생성합니다.
    const articleEl = document.createElement("article");
    articleEl.appendChild(imgWrap);
    articleEl.appendChild(rightdiv);

    li.appendChild(articleEl);
    ul.appendChild(li);
  });

  cliplistWrapperEl.appendChild(ul);
}
