/* =========================================================
   THE WALL. — Create Thought Logic (post.js)
   ========================================================= */

(function initPostPage() {
  const postForm = document.getElementById("postForm");
  const thoughtText = document.getElementById("thoughtText");
  const charCounter = document.getElementById("charCounter");
  const charWarning = document.getElementById("charWarning");
  const tagButtons = document.querySelectorAll("[data-tag]");
  const postingAsMeta = document.getElementById("postingAsMeta");
  const submitBtn = document.getElementById("submitPostBtn");

  let selectedTag = "Rant";
  const MAX_CHARS = 500;

  // 1. DISPLAY CURRENT USER METADATA
  const currentUser = window.WallAPI.getCurrentUser();
  if (postingAsMeta) {
    postingAsMeta.innerHTML = `Posting as <b>${currentUser.label} #${currentUser.code}</b>`;
  }

  // 2. CATEGORY TAG SELECTION
  tagButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tagButtons.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      selectedTag = btn.dataset.tag;
    });
  });

  // 3. LIVE CHARACTER COUNTING & VALIDATION
  if (thoughtText && charCounter) {
    thoughtText.addEventListener("input", () => {
      const len = thoughtText.value.length;
      charCounter.textContent = `${len} / ${MAX_CHARS}`;

      if (len >= MAX_CHARS) {
        charCounter.style.color = "#e74c3c";
        if (charWarning) charWarning.style.display = "inline";
      } else {
        charCounter.style.color = "var(--text-muted, #888)";
        if (charWarning) charWarning.style.display = "none";
      }
    });
  }

  // 4. SUBMIT POST HANDLER
  if (postForm) {
    postForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const text = thoughtText.value.trim();
      if (!text) {
        alert("Please write something before posting.");
        return;
      }

      if (text.length > MAX_CHARS) {
        alert("Your thought exceeds the maximum allowed character limit.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Posting...";

      // Persist to State API
      window.WallAPI.createThought(selectedTag, text);

      // Redirect back to main feed
      window.location.href = "feed.html";
    });
  }
})();