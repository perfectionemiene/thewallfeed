// INITIAL DUMMY FEED DATA
const initialPosts = [
  {
    id: 101,
    label: "🌙 Anonymous",
    code: "4821",
    tag: "Rant",
    content: "I genuinely hate when someone says “we need to talk” and refuses to say what it’s about. Just say it. I’ve already imagined 14 worse versions.",
    time: "2h ago",
    timestamp: Date.now() - (2 * 60 * 60 * 1000),
    tilt: -1,
    reactions: {
      felt: { count: 42, active: false, emoji: "💜" },
      real: { count: 18, active: false, emoji: "🙂" },
      mindblown: { count: 9, active: false, emoji: "💀" },
      relatable: { count: 15, active: false, emoji: "👀" },
      deep: { count: 6, active: false, emoji: "😭" },
      funny: { count: 18, active: false, emoji: "😂" },
      sympathy: { count: 18, active: false, emoji: "🫂" }
    },
    comments: [
      { id: 1, author: "Anonymous · 9281", time: "1h ago", text: "Especially when they take 3 hours to reply after saying it 😭" },
      { id: 2, author: "Anonymous · 1048", time: "30m ago", text: "Instant anxiety spike every single time." }
    ]
  },
  {
    id: 102,
    label: "🦋 Anonymous",
    code: "7319",
    tag: "Hot Take",
    content: "Hot take: university group projects should be illegal.",
    time: "4h ago",
    timestamp: Date.now() - (4 * 60 * 60 * 1000),
    tilt: 1,
    reactions: {
      felt: { count: 108, active: false, emoji: "💜" },
      real: { count: 45, active: false, emoji: "🙂" },
      mindblown: { count: 12, active: false, emoji: "💀" },
      relatable: { count: 88, active: false, emoji: "👀" },
      deep: { count: 3, active: false, emoji: "😭" },
      funny: { count: 64, active: false, emoji: "😂" },
      sympathy: { count: 21, active: false, emoji: "🫂" }
    },
    comments: [
      { id: 1, author: "Anonymous · 5512", time: "2h ago", text: "THIS. Doing 90% of the work while everyone shares the grade." }
    ]
  },
  {
    id: 103,
    label: "🕯️ Anonymous",
    code: "2094",
    tag: "Confession",
    content: "I think I'm falling for my best friend and I'd rather lose the feeling than lose them.",
    time: "6h ago",
    timestamp: Date.now() - (6 * 60 * 60 * 1000),
    tilt: -0.5,
    reactions: {
      felt: { count: 84, active: false, emoji: "💜" },
      real: { count: 12, active: false, emoji: "🙂" },
      mindblown: { count: 5, active: false, emoji: "💀" },
      relatable: { count: 34, active: false, emoji: "👀" },
      deep: { count: 52, active: false, emoji: "😭" },
      funny: { count: 2, active: false, emoji: "😂" },
      sympathy: { count: 40, active: false, emoji: "🫂" }
    },
    comments: []
  },
  {
    id: 104,
    label: "☁️ Anonymous",
    code: "9910",
    tag: "Random",
    content: "Adulthood is the real definition of what I ordered vs what I got.",
    time: "8h ago",
    timestamp: Date.now() - (8 * 60 * 60 * 1000),
    tilt: 1.5,
    reactions: {
      felt: { count: 215, active: false, emoji: "💜" },
      real: { count: 94, active: false, emoji: "🙂" },
      mindblown: { count: 18, active: false, emoji: "💀" },
      relatable: { count: 110, active: false, emoji: "👀" },
      deep: { count: 14, active: false, emoji: "😭" },
      funny: { count: 130, active: false, emoji: "😂" },
      sympathy: { count: 28, active: false, emoji: "🫂" }
    },
    comments: []
  }
];

let posts = [...initialPosts];
let activeFilter = "all";
let activeSort = "latest";

// DOM SELECTORS
const postsContainer = document.getElementById("postsContainer");
const filterButtons = document.querySelectorAll(".filter");
const filterStatus = document.getElementById("filterStatus");
const feedSortSelect = document.getElementById("feedSort");
const showMeSomethingBtn = document.getElementById("showMeSomethingBtn");

// HELPER: CALCULATE TOTAL REACTIONS FOR SORTING
function getTotalReactions(post) {
  return Object.values(post.reactions).reduce((sum, r) => sum + r.count, 0);
}

// SORTING ALGORITHMS
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

// RENDER STREAM POSTS
function renderPosts() {
  if (!postsContainer) return;
  postsContainer.innerHTML = "";

  let filteredPosts = activeFilter === "all"
    ? posts
    : posts.filter(p => p.tag.toLowerCase() === activeFilter.toLowerCase());

  filteredPosts = getSortedPosts(filteredPosts);

  if (filteredPosts.length === 0) {
    postsContainer.innerHTML = `
      <div class="empty">
        <h3 class="empty__title">Nothing here yet</h3>
        <p>No thoughts posted under this filter yet. Be the first.</p>
        <div class="actions">
          <a href="post.html" class="btn btn--primary btn--sm">Put It On The Wall</a>
        </div>
      </div>
    `;
    return;
  }

  filteredPosts.forEach((post, index) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.setProperty("--tilt", `${post.tilt || 0}deg`);
    card.style.setProperty("--i", index);

    // Build markup for all 7 reaction buttons
    const reactionsHTML = Object.entries(post.reactions).map(([key, data]) => `
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
        <div class="anon">
          <span class="anon__name">${post.label} <b>#${post.code}</b></span>
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

    // Direct routing to dedicated page view (ignoring reaction button clicks)
    card.addEventListener("click", (e) => {
      if (!e.target.closest('.react-btn')) {
        window.location.href = `thought.html?id=${post.id}`;
      }
    });

    postsContainer.appendChild(card);
  });
}

// TOGGLE REACTION HANDLER
window.toggleReaction = function(e, postId, reactionKey) {
  e.stopPropagation();
  const post = posts.find(p => p.id === postId);
  
  if (post && post.reactions[reactionKey]) {
    const r = post.reactions[reactionKey];
    r.active = !r.active;
    r.count += r.active ? 1 : -1;
    renderPosts();
  }
};

// FILTER TABS HANDLER
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

    postsContainer.classList.add("is-leaving");
    setTimeout(() => {
      renderPosts();
      postsContainer.classList.remove("is-leaving");
    }, 180);
  });
});

// SORT SELECT HANDLER
if (feedSortSelect) {
  feedSortSelect.addEventListener("change", (e) => {
    activeSort = e.target.value;
    renderPosts();
  });
}

// "SURPRISE ME" RANDOM DISCOVERY BUTTON
if (showMeSomethingBtn) {
  showMeSomethingBtn.addEventListener("click", () => {
    if (posts.length === 0) return;
    const randomIndex = Math.floor(Math.random() * posts.length);
    const randomPost = posts[randomIndex];
    window.location.href = `thought.html?id=${randomPost.id}`;
  });
}

// INITIAL RENDER
renderPosts();