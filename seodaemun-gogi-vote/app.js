// 실시간 투표 집계: 키 없이 쓸 수 있는 공개 카운터 API (abacus.jasoncameron.dev)
// 1위 선택 = +10점, 2위 선택 = +7점. 총점 = (1위 선택 수 * 10) + (2위 선택 수 * 7)
const NAMESPACE = "sdm-gogi-vote-0817-v1";
const POLL_INTERVAL_MS = 10000;
const VOTED_KEY = "sdmGogiVote_voted_v1";

const API_BASE = "https://abacus.jasoncameron.dev";

const state = {
  counts: {}, // { [id]: { first: n, second: n } }
  customRestaurants: [], // [{ id, name, region, custom: true }]
  selectedFirst: null,
  selectedSecond: null,
  submitting: false,
  apiOk: true
};

function counterKey(id, place) {
  return `${id}-${place}`;
}

function allRestaurants() {
  return RESTAURANTS.concat(state.customRestaurants);
}

// 짧은 결정론적 해시: 같은 이름+지역을 입력하면 항상 같은 카운터 키로 모여서 집계됨
function hashString(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

function buildCustomId(name, region) {
  const norm = `${name.trim().toLowerCase()}|${region.trim().toLowerCase()}`.replace(/\s+/g, "");
  return `custom-${hashString(norm)}`;
}

function encodeCustomHash(list) {
  return list.map((r) => `${encodeURIComponent(r.name)}~${encodeURIComponent(r.region)}`).join("|");
}

function parseCustomHash() {
  const hash = location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hash);
  const raw = params.get("custom");
  if (!raw) return [];
  return raw
    .split("|")
    .map((entry) => {
      const [nameEnc, regionEnc] = entry.split("~");
      if (!nameEnc || !regionEnc) return null;
      const name = decodeURIComponent(nameEnc);
      const region = decodeURIComponent(regionEnc);
      return { id: buildCustomId(name, region), name, region, custom: true };
    })
    .filter(Boolean);
}

function syncShareUrl() {
  const encoded = encodeCustomHash(state.customRestaurants);
  const newHash = encoded ? `custom=${encoded}` : "";
  history.replaceState(null, "", newHash ? `#${newHash}` : location.pathname + location.search);
}

function loadLocalCache() {
  try {
    const raw = localStorage.getItem("sdmGogiVote_cache_v1");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLocalCache(counts) {
  try {
    localStorage.setItem("sdmGogiVote_cache_v1", JSON.stringify(counts));
  } catch (e) {
    /* ignore */
  }
}

function getVotedState() {
  try {
    const raw = localStorage.getItem(VOTED_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setVotedState(firstId, secondId) {
  localStorage.setItem(VOTED_KEY, JSON.stringify({ first: firstId, second: secondId, at: Date.now() }));
}

async function fetchCount(id, place) {
  const key = counterKey(id, place);
  const res = await fetch(`${API_BASE}/get/${NAMESPACE}/${key}`);
  if (!res.ok) throw new Error("count fetch failed");
  const data = await res.json();
  return typeof data.value === "number" ? data.value : 0;
}

async function hitCount(id, place) {
  const key = counterKey(id, place);
  const res = await fetch(`${API_BASE}/hit/${NAMESPACE}/${key}`);
  if (!res.ok) throw new Error("count hit failed");
  const data = await res.json();
  return typeof data.value === "number" ? data.value : 0;
}

async function refreshCounts() {
  const cache = loadLocalCache();
  const list = allRestaurants();
  try {
    const results = await Promise.all(
      list.flatMap((r) => [
        fetchCount(r.id, "first").then((n) => [r.id, "first", n]),
        fetchCount(r.id, "second").then((n) => [r.id, "second", n])
      ])
    );
    const counts = { ...state.counts };
    list.forEach((r) => {
      if (!counts[r.id]) counts[r.id] = { first: 0, second: 0 };
    });
    results.forEach(([id, place, n]) => (counts[id][place] = n));
    state.counts = counts;
    state.apiOk = true;
    saveLocalCache(counts);
  } catch (e) {
    const merged = Object.keys(cache).length ? cache : {};
    list.forEach((r) => {
      if (!merged[r.id]) merged[r.id] = { first: 0, second: 0 };
    });
    state.counts = merged;
    state.apiOk = false;
  }
}

function score(id) {
  const c = state.counts[id] || { first: 0, second: 0 };
  return c.first * 10 + c.second * 7;
}

function rankedRestaurants() {
  return [...allRestaurants()].sort((a, b) => score(b.id) - score(a.id));
}

function buildGallery(restaurant) {
  if (restaurant.custom) {
    return `
      <div class="gallery-placeholder">
        <span class="placeholder-emoji">🍽️</span>
        <span class="placeholder-label">참가자 추천 식당</span>
      </div>`;
  }
  const imgs = restaurant.images;
  const thumbs = imgs
    .map(
      (src, i) =>
        `<button type="button" class="thumb ${i === 0 ? "active" : ""}" data-idx="${i}" aria-label="사진 ${i + 1}"><img src="${src}" loading="lazy" onerror="this.closest('.thumb').style.display='none'"></button>`
    )
    .join("");
  return `
    <div class="gallery" data-id="${restaurant.id}">
      <div class="gallery-main">
        <img class="gallery-main-img" src="${imgs[0]}" alt="${restaurant.name} 사진" loading="lazy" onerror="this.src='';this.alt='이미지를 불러올 수 없습니다';this.classList.add('broken')">
      </div>
      <div class="thumb-row">${thumbs}</div>
    </div>`;
}

function buildMenu(restaurant) {
  if (restaurant.custom || !restaurant.menu) {
    return `<p class="custom-note">메뉴/사진 정보가 없어요. 추천한 분에게 물어봐주세요!</p>`;
  }
  return `
    <ul class="menu-list">
      ${restaurant.menu.map((m) => `<li><span>${m.name}</span><span class="menu-price">${m.price}</span></li>`).join("")}
    </ul>`;
}

function buildCard(restaurant, rank) {
  const c = state.counts[restaurant.id] || { first: 0, second: 0 };
  const total = score(restaurant.id);
  const isLeader = rank === 1 && total > 0;
  const isFirstSel = state.selectedFirst === restaurant.id;
  const isSecondSel = state.selectedSecond === restaurant.id;
  const mapQuery = restaurant.custom ? `${restaurant.name} ${restaurant.region}` : restaurant.mapQuery;
  const mapUrl = `https://map.naver.com/p/search/${encodeURIComponent(mapQuery)}`;
  const category = restaurant.custom ? `🙋 참가자 추천 · ${restaurant.region}` : restaurant.category;
  const desc = restaurant.custom ? "다른 참가자가 직접 추천한 식당이에요." : restaurant.desc;

  return `
    <article class="card ${isLeader ? "leader" : ""} ${restaurant.custom ? "custom-card" : ""}" data-id="${restaurant.id}">
      ${isLeader ? `<div class="leader-badge">👑 실시간 1위</div>` : `<div class="rank-badge">#${rank}</div>`}
      ${buildGallery(restaurant)}
      <div class="card-body">
        <h2 class="card-title">${restaurant.name}</h2>
        <p class="card-category">${category}</p>
        <p class="card-desc">${desc}</p>
        <p class="card-address">📍 ${restaurant.custom ? restaurant.region : restaurant.address} · <a href="${mapUrl}" target="_blank" rel="noopener">네이버지도에서 보기</a></p>
        ${buildMenu(restaurant)}
        <div class="vote-stats">
          <span>🥇 1위 ${c.first}표</span>
          <span>🥈 2위 ${c.second}표</span>
          <span class="total-score">총점 ${total}점</span>
        </div>
        <div class="card-actions">
          <button type="button" class="pick-btn pick-first ${isFirstSel ? "active" : ""}" data-id="${restaurant.id}" data-place="first">🥇 1위로 선택</button>
          <button type="button" class="pick-btn pick-second ${isSecondSel ? "active" : ""}" data-id="${restaurant.id}" data-place="second">🥈 2위로 선택</button>
        </div>
      </div>
    </article>`;
}

function render() {
  const board = document.getElementById("board");
  const ranked = rankedRestaurants();
  board.innerHTML = `
    ${!state.apiOk ? `<p class="api-warning">⚠️ 실시간 서버와 연결이 원활하지 않아 이 기기의 마지막 집계 결과를 보여주고 있어요.</p>` : ""}
    ${ranked.map((r, i) => buildCard(r, i + 1)).join("")}
  `;
  attachGalleryHandlers();
  attachPickHandlers();
  updateVoteBar();
}

function attachGalleryHandlers() {
  document.querySelectorAll(".gallery").forEach((gallery) => {
    const id = gallery.dataset.id;
    const restaurant = allRestaurants().find((r) => r.id === id);
    const mainImg = gallery.querySelector(".gallery-main-img");
    gallery.querySelectorAll(".thumb").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx);
        mainImg.src = restaurant.images[idx];
        gallery.querySelectorAll(".thumb").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  });
}

function attachPickHandlers() {
  document.querySelectorAll(".pick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (getVotedState()) return;
      const id = btn.dataset.id;
      const place = btn.dataset.place;
      if (place === "first") {
        state.selectedFirst = state.selectedFirst === id ? null : id;
        if (state.selectedSecond === id) state.selectedSecond = null;
      } else {
        state.selectedSecond = state.selectedSecond === id ? null : id;
        if (state.selectedFirst === id) state.selectedFirst = null;
      }
      render();
    });
  });
}

function nameOf(id) {
  const r = allRestaurants().find((r) => r.id === id);
  return r ? r.name : "";
}

function updateVoteBar() {
  const voted = getVotedState();
  const firstValueEl = document.getElementById("slot-first-value");
  const secondValueEl = document.getElementById("slot-second-value");
  const submitBtn = document.getElementById("submit-btn");
  const msg = document.getElementById("vote-msg");

  if (voted) {
    firstValueEl.textContent = nameOf(voted.first);
    secondValueEl.textContent = nameOf(voted.second);
    submitBtn.textContent = "투표 완료 ✅";
    submitBtn.disabled = true;
    msg.textContent = "이미 투표해주셨어요. 참여해주셔서 감사합니다!";
    return;
  }

  firstValueEl.textContent = state.selectedFirst ? nameOf(state.selectedFirst) : "미선택";
  secondValueEl.textContent = state.selectedSecond ? nameOf(state.selectedSecond) : "미선택";
  const ready = state.selectedFirst && state.selectedSecond && !state.submitting;
  submitBtn.disabled = !ready;
  submitBtn.textContent = state.submitting ? "제출 중..." : "투표 제출하기";
  if (!msg.dataset.sticky) msg.textContent = "";
}

async function submitVote() {
  if (state.submitting || !state.selectedFirst || !state.selectedSecond) return;
  if (getVotedState()) return;

  state.submitting = true;
  updateVoteBar();
  const msg = document.getElementById("vote-msg");

  try {
    const [firstVal, secondVal] = await Promise.all([
      hitCount(state.selectedFirst, "first"),
      hitCount(state.selectedSecond, "second")
    ]);
    state.counts[state.selectedFirst].first = firstVal;
    state.counts[state.selectedSecond].second = secondVal;
    saveLocalCache(state.counts);
    setVotedState(state.selectedFirst, state.selectedSecond);
    msg.textContent = "투표가 반영됐어요. 감사합니다! 🙌";
    msg.dataset.sticky = "1";
  } catch (e) {
    msg.textContent = "네트워크 오류로 투표에 실패했어요. 다시 시도해주세요.";
  } finally {
    state.submitting = false;
    render();
  }
}

async function tick() {
  if (state.submitting) return;
  await refreshCounts();
  render();
}

function showCustomMsg(text) {
  document.getElementById("custom-msg").textContent = text;
}

async function addCustomRestaurant(name, region) {
  const id = buildCustomId(name, region);
  if (allRestaurants().some((r) => r.id === id)) {
    showCustomMsg("이미 추가된 식당이에요. 목록에서 골라주세요!");
    return;
  }
  state.customRestaurants.push({ id, name: name.trim(), region: region.trim(), custom: true });
  syncShareUrl();
  if (!state.counts[id]) state.counts[id] = { first: 0, second: 0 };
  render();
  showCustomMsg("추가했어요! 아래 '링크 복사'로 단톡방에 공유해주세요 🔗");
  await tick();
}

function setupCustomForm() {
  document.getElementById("custom-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("custom-name");
    const regionInput = document.getElementById("custom-region");
    const name = nameInput.value.trim();
    const region = regionInput.value.trim();
    if (!name || !region) {
      showCustomMsg("식당 이름과 지역을 모두 입력해주세요.");
      return;
    }
    addCustomRestaurant(name, region);
    nameInput.value = "";
    regionInput.value = "";
  });

  document.getElementById("copy-link-btn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      showCustomMsg("링크를 복사했어요! 단톡방에 붙여넣기 해주세요 📋");
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = location.href;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showCustomMsg("링크를 복사했어요! 단톡방에 붙여넣기 해주세요 📋");
      } catch (e2) {
        showCustomMsg(`복사에 실패했어요. 직접 복사해주세요: ${location.href}`);
      }
      document.body.removeChild(ta);
    }
  });
}

async function init() {
  state.customRestaurants = parseCustomHash();
  document.getElementById("submit-btn").addEventListener("click", submitVote);
  setupCustomForm();
  await tick();
  setInterval(tick, POLL_INTERVAL_MS);
}

init();
