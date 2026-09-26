/* =========================================================
   THE WALL. — Thought View Logic (thought.js)
   ========================================================= */

(function initThoughtPage() {
  /* ==========================================
     1. REACTION TOGGLE SYSTEM
     ========================================== */
  const reactionContainer = document.getElementById("thought-reactions");

  if (reactionContainer) {
    reactionContainer.addEventListener("click", function (e) {
      const btn = e.target.closest(".react-btn");
      if (!btn) return;

      const countEl = btn.querySelector(".count");
      if (!countEl) return;

      let count = parseInt(countEl.textContent, 10);
      if (isNaN(count)) count = 0;

      const isActive = btn.classList.contains("is-active");

      if (isActive) {
        btn.classList.remove("is-active");
        countEl.textContent = Math.max(0, count - 1);
      } else {
        btn.classList.add("is-active");
        countEl.textContent = count + 1;

        btn.style.transform = "scale(0.92)";
        setTimeout(() => (btn.style.transform = "scale(1.05)"), 100);
        setTimeout(() => (btn.style.transform = ""), 200);
      }
    });
  }

  /* ==========================================
     2. CHARACTER COUNTER
     ========================================== */
  const commentField = document.querySelector("textarea");
  const counterEl = document.querySelector(".counter") || document.querySelector("form small") || document.querySelector(".reply-box span");
  const maxLength = commentField ? parseInt(commentField.getAttribute("maxlength"), 10) || 500 : 500;

  if (commentField) {
    commentField.addEventListener("input", () => {
      const currentLength = commentField.value.length;
      if (counterEl) {
        counterEl.textContent = `${currentLength} / ${maxLength}`;
        counterEl.style.color = currentLength >= maxLength - 20 ? "var(--danger, #FFA3B1)" : "var(--ink-3, rgba(247, 244, 238, 0.58))";
      }
    });
  }

  /* ==========================================
     3. ECHO SUBMISSION HANDLER
     ========================================== */
  document.addEventListener("click", function (e) {
    // Detect click on "PUT ECHO ON WALL" button regardless of class
    const submitBtn = e.target.closest("button");
    if (!submitBtn || !submitBtn.textContent.toUpperCase().includes("ECHO")) return;

    e.preventDefault();

    if (!commentField) return;
    const text = commentField.value.trim();

    if (!text) {
      commentField.focus();
      return;
    }

    // Generate random anonymous ID
    const randomId = Math.floor(1000 + Math.random() * 9000);

    // Locate comment container (list or section below form)
    let echoList = document.querySelector(".echoes-list") || document.querySelector(".echo-list") || document.querySelector("ul");

    // Create new echo element matching your page style
    const card = document.createElement("div");
    card.className = "echo-card";
    card.style.animation = "fadeIn 0.3s ease";
    card.style.marginBottom = "16px";
    card.innerHTML = `
      <div class="echo-card__head" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-size: 0.8rem; opacity: 0.8;">⚡ ANONYMOUS #${randomId}</span>
        <time style="font-size: 0.75rem; opacity: 0.5;">JUST NOW</time>
      </div>
      <p class="echo-card__text" style="margin-bottom: 12px; font-size: 0.95rem;">${escapeHTML(text)}</p>
      <div class="echo-card__foot">
        <button class="react-btn react-btn--sm" style="padding: 4px 10px; font-size: 0.8rem;">
          <span class="emoji">💜</span> <span class="count">0</span>
        </button>
      </div>
    `;

    if (echoList) {
      echoList.prepend(card);
    } else {
      // If no list container exists, insert directly after the form
      const form = commentField.closest("form") || commentField.closest("div");
      if (form && form.parentNode) {
        form.parentNode.insertBefore(card, form.nextSibling);
      }
    }

    // Reset textarea & character counter
    commentField.value = "";
    if (counterEl) counterEl.textContent = `0 / ${maxLength}`;

    // Update title counter (e.g., ECHOES (12) -> ECHOES (13))
    const titleEl = document.querySelector("h2, h3, .echoes-title");
    if (titleEl && titleEl.textContent.includes("ECHOES")) {
      const match = titleEl.textContent.match(/\d+/);
      if (match) {
        const currentCount = parseInt(match[0], 10);
        titleEl.textContent = titleEl.textContent.replace(/\d+/, currentCount + 1);
      }
    }
  });

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
})();