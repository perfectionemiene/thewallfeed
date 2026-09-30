/* =========================================================
   THE WALL. — Thought View Logic (thought.js)
   ========================================================= */

(function initThoughtPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id") || 101;
  const post = window.WallAPI.getThoughtById(postId);

  if (!post) return;

  // 1. POPULATE MAIN THOUGHT CARD
  const anonEl = document.querySelector(".thought-card .anon");
  const tagEl = document.querySelector(".thought-card .tag");
  const textEl = document.querySelector(".thought-card__text");
  const timeEl = document.querySelector(".thought-card__time");
  const reactionContainer = document.getElementById("thought-reactions");

  if (anonEl) {
    anonEl.innerHTML = `
      <span>${post.label}</span> <b>#${post.code}</b>
      <button 
        class="btn-action btn-action--secondary" 
        style="padding: 4px 10px; font-size: 0.75rem; margin-left: 10px;" 
        onclick="sendCrossPath('${post.authorId}', event)"
      >
        ⚡ Cross Paths
      </button>
    `;
  }
  if (tagEl) tagEl.textContent = post.tag;
  if (textEl) textEl.textContent = `"${post.content}"`;
  if (timeEl) timeEl.textContent = `Posted ${post.time}`;

  // Render Reactions Bar
  if (reactionContainer && post.reactions) {
    reactionContainer.innerHTML = Object.entries(post.reactions).map(([key, data]) => `
      <button class="react-btn ${data.active ? 'is-active' : ''}" data-reaction="${key}">
        <span class="emoji">${data.emoji}</span> <span class="count">${data.count}</span>
      </button>
    `).join("");

    reactionContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".react-btn");
      if (!btn) return;
      const key = btn.dataset.reaction;
      window.WallAPI.toggleReaction(post.id, key);
      
      // Update UI state
      const countEl = btn.querySelector(".count");
      const updatedPost = window.WallAPI.getThoughtById(post.id);
      const rData = updatedPost.reactions[key];
      btn.classList.toggle("is-active", rData.active);
      if (countEl) countEl.textContent = rData.count;
    });
  }

  // 2. RENDER ECHOES LIST & TITLE
  const echoList = document.querySelector(".echo-list");
  const echoesTitle = document.querySelector(".echoes-title");

  function renderEchoes() {
    if (echoesTitle) echoesTitle.innerHTML = `Echoes <span>(${post.comments.length})</span>`;
    if (!echoList) return;

    echoList.innerHTML = post.comments.map(c => `
      <li class="echo-card">
        <div class="echo-card__head">
          <span>⚡ ${c.author}</span>
          <time>${c.time}</time>
        </div>
        <p class="echo-card__text">${escapeHTML(c.text)}</p>
        <div class="echo-card__foot">
          <button class="react-btn react-btn--sm"><span class="emoji">💜</span> <span class="count">0</span></button>
        </div>
      </li>
    `).join("");
  }

  renderEchoes();

  // 3. SUBMIT NEW ECHO
  const submitBtn = document.querySelector(".btn--submit");
  const commentField = document.querySelector(".field");
  const counterEl = document.querySelector(".counter");
  const currentUser = window.WallAPI.getCurrentUser();
  const metaUserEl = document.querySelector(".comment-box__meta");

  if (metaUserEl) {
    metaUserEl.innerHTML = `Replying as <b>${currentUser.label} #${currentUser.code}</b>`;
  }

  if (submitBtn && commentField) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const text = commentField.value.trim();
      if (!text) return;

      window.WallAPI.addComment(post.id, text);
      commentField.value = "";
      if (counterEl) counterEl.textContent = "0 / 500";

      renderEchoes();
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
  }
})();