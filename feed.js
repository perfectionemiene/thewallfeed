/* =========================================================
   THE WALL. — Feed Logic (feed.js)
   ========================================================= */

let activeFilter = "all";
let activeSort = "latest";

const postsContainer = document.getElementById("postsContainer");
const filterButtons = document.querySelectorAll(".filter");
const filterStatus = document.getElementById("filterStatus");
const feedSortSelect = document.getElementById("feedSort");
const showMeSomethingBtn = document.getElementById("showMeSomethingBtn");

function getTotalReactions(post) {
  return Object.values(post.reactions || {}).reduce((sum, r) => sum + r.count, 0);
}

function getSortedPosts(postList) {
  const postsCopy = [...postList];

  switch (activeSort) {
    case "trending":
      return postsCopy.sort((a, b) => {
        const scoreA = getTotalReactions(a) + a.comments.length * 3;
        const scoreB = getTotalReactions(b) + b.comments.length * 3;
        return scoreB - scoreA;
      });
    
    case "rising":
      return postsCopy.sort((a, b) => {
        const scoreA = (getTotalReactions(a) + a.comments.length * 2) / ((Date.now() - a.timestamp) / 3600000 + 1);
        const scoreB = (getTotalReactions(b) + b.comments.length * 2) / ((Date.now() - b.timestamp) / 3600000 + 1);
        return scoreB - scoreA;
      });

    case "discussed":
      return postsCopy.sort((a, b) => b.comments.length - a.comments.length);

    case "latest":
    default:
      return postsCopy.sort((a, b) => b.timestamp - a.timestamp);
  }
}

function renderPosts() {
  if (!postsContainer) return;
  postsContainer.innerHTML = "";

  const posts = window.WallAPI.getThoughts();

  let filteredPosts = activeFilter === "all"
    ? posts
    : posts.filter(p => p.tag.toLowerCase() === activeFilter.toLowerCase());

  filteredPosts = getSortedPosts(filteredPosts);

  if (filteredPosts.length === 0) {
    postsContainer.innerHTML = `
      <div class="empty">
        <h3 class="empty__title">Nothing here yet</h3>
        <p>No thoughts posted under this filter yet.</p>
      </div>
    `;
    return;
  }

  filteredPosts.forEach((post, index) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.setProperty("--tilt", `${post.tilt || 0}deg`);
    card.style.setProperty("--i", index);

    const reactionsHTML = Object.entries(post.reactions || {}).map(([key, data]) => `
      <button 
        class="react-btn ${data.active ? 'is-active' : ''}" 
        data-reaction="${key}"
        onclick="toggleReaction(event, ${post.id}, '${key}')"
      >
        <span class="emoji">${data.emoji}</span>
        <span class="count">${data.count}</span>
      </button>
    `).join("");

    card.innerHTML = `
      <div class="card__head">
        <div class="anon" style="display: flex; align-items: center; gap: 10px;">
          <span class="anon__name">${post.label} <b>#${post.code}</b></span>
          <button 
            class="btn-action btn-action--secondary" 
            style="padding: 2px 8px; font-size: 0.72rem;" 
            onclick="sendCrossPath('${post.authorId}', event)"
          >
            ⚡ Cross Paths
          </button>
        </div>
        <span class="card__cat">${post.tag}</span>
      </div>

      <p class="card__text">"${post.content}"</p>

      <div class="card__foot">
        <div class="react-group">
          ${reactionsHTML}
        </div>

        <div class="card__meta">
          <span class="card__comments">💬 ${post.comments.length} Echoes</span>
          <time>${post.time}</time>
        </div>
      </div>
    `;

    card.addEventListener("click", (e) => {
      if (!e.target.closest('.react-btn') && !e.target.closest('.btn-action')) {
        window.location.href = `thought.html?id=${post.id}`;
      }
    });

    postsContainer.appendChild(card);
  });
}

window.toggleReaction = function(e, postId, reactionKey) {
  e.stopPropagation();
  window.WallAPI.toggleReaction(postId, reactionKey);
  renderPosts();
};

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => {
      b.setAttribute("aria-selected", "false");
      b.setAttribute("aria-pressed", "false");
    });
    btn.setAttribute("aria-selected", "true");
    btn.setAttribute("aria-pressed", "true");
    
    activeFilter = btn.dataset.filter;
    if (filterStatus) {
      filterStatus.textContent = activeFilter === "all" 
        ? "Showing all thoughts" 
        : `Showing ${btn.textContent.toLowerCase()}`;
    }

    renderPosts();
  });
});

if (feedSortSelect) {
  feedSortSelect.addEventListener("change", (e) => {
    activeSort = e.target.value;
    renderPosts();
  });
}

if (showMeSomethingBtn) {
  showMeSomethingBtn.addEventListener("click", () => {
    const posts = window.WallAPI.getThoughts();
    if (posts.length === 0) return;
    const randomIndex = Math.floor(Math.random() * posts.length);
    window.location.href = `thought.html?id=${posts[randomIndex].id}`;
  });
}

renderPosts();