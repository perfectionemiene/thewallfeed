document.addEventListener("DOMContentLoaded", () => {
  /* GLOBAL REACTION HANDLER */
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id") || "thought_103";
  const storageKey = `reactions_${postId}`;
  let userReactions = JSON.parse(localStorage.getItem(storageKey)) || {};

  // Restore saved reaction states on load
  const reactionButtons = document.querySelectorAll(".react-btn");
  reactionButtons.forEach((btn) => {
    const type = btn.dataset.reaction;
    if (userReactions[type]) {
      btn.classList.add("is-active");
    }
  });

  // Global click listener for reactions (works on feed cards & single thought card)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".react-btn");
    if (!btn) return;

    const reactionType = btn.dataset.reaction;
    const countEl = btn.querySelector(".count");
    if (!countEl) return;

    let count = parseInt(countEl.textContent, 10) || 0;
    const isActive = btn.classList.contains("is-active");

    if (isActive) {
      btn.classList.remove("is-active");
      count = Math.max(0, count - 1);
      userReactions[reactionType] = false;
    } else {
      btn.classList.add("is-active");
      count += 1;
      userReactions[reactionType] = true;

      // Pop animation
      btn.style.transform = "scale(0.92)";
      setTimeout(() => (btn.style.transform = "scale(1.05)"), 100);
      setTimeout(() => (btn.style.transform = ""), 200);
    }

    countEl.textContent = count;
    localStorage.setItem(storageKey, JSON.stringify(userReactions));
  });

  /* ==========================================
     2. COMMENT / ECHO COUNTER & SUBMISSION (Thought page only)
     ========================================== */
  const commentField = document.querySelector(".field");
  const counterEl = document.querySelector(".counter");
  const maxLength = commentField ? parseInt(commentField.getAttribute("maxlength"), 10) || 500 : 500;

  if (commentField && counterEl) {
    commentField.addEventListener("input", () => {
      const currentLength = commentField.value.length;
      counterEl.textContent = `${currentLength} / ${maxLength}`;
      
      counterEl.style.color = currentLength >= maxLength - 20 
        ? "var(--danger, #FFA3B1)" 
        : "var(--ink-3, rgba(247, 244, 238, 0.58))";
    });
  }

  const submitBtn = document.querySelector(".btn--submit");
  const echoList = document.querySelector(".echo-list");
  const echoesTitle = document.querySelector(".echoes-title span");

  if (submitBtn && commentField && echoList) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const text = commentField.value.trim();
      if (!text) return commentField.focus();

      const randomId = Math.floor(1000 + Math.random() * 9000);

      const li = document.createElement("li");
      li.className = "echo-card";
      li.innerHTML = `
        <div class="echo-card__head">
          <span>✨ Anonymous #${randomId}</span>
          <time>Just now</time>
        </div>
        <p class="echo-card__text">${escapeHTML(text)}</p>
        <div class="echo-card__foot">
          <button class="react-btn react-btn--sm" data-reaction="felt">
            <span class="emoji">💜</span> <span class="count">0</span>
          </button>
        </div>
      `;

      echoList.prepend(li);
      commentField.value = "";
      counterEl.textContent = `0 / ${maxLength}`;

      if (echoesTitle) {
        const currentCount = parseInt(echoesTitle.textContent.replace(/\D/g, ""), 10) || 0;
        echoesTitle.textContent = `(${currentCount + 1})`;
      }
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
});