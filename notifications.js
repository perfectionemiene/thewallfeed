/* =========================================================
   THE WALL. — Activity & Notifications Logic (notifications.js)
   ========================================================= */

(function initNotificationsPage() {
  const notificationsContainer = document.getElementById("notificationsContainer");
  const markReadBtn = document.getElementById("markReadBtn");
  const navUnreadBadge = document.getElementById("navUnreadBadge");
  const filterButtons = document.querySelectorAll("[data-filter]");

  let activeFilter = "all";

  // 1. UPDATE NAVIGATION UNREAD BADGE COUNTER
  function updateNavBadge() {
    const unreadCount = window.WallAPI.getUnreadNotificationCount();
    if (navUnreadBadge) {
      if (unreadCount > 0) {
        navUnreadBadge.textContent = unreadCount;
        navUnreadBadge.style.display = "inline-block";
      } else {
        navUnreadBadge.style.display = "none";
      }
    }
  }

  // 2. MAP NOTIFICATION ICON BASED ON TYPE
  function getNotificationIcon(type) {
    switch (type) {
      case "crosspaths": return "⚡";
      case "echo": return "💬";
      case "reaction": return "💜";
      default: return "🔔";
    }
  }

  // 3. RENDER NOTIFICATIONS LIST
  function renderNotifications() {
    if (!notificationsContainer) return;

    let notifications = window.WallAPI.getNotifications();

    if (activeFilter === "unread") {
      notifications = notifications.filter(n => !n.read);
    }

    if (notifications.length === 0) {
      notificationsContainer.innerHTML = `
        <div class="card" style="padding: 24px; text-align: center; color: var(--text-muted, #888);">
          <p style="margin: 0; font-size: 0.95rem;">
            ${activeFilter === "unread" ? "No unread alerts." : "You have no activity alerts yet."}
          </p>
        </div>
      `;
      return;
    }

    notificationsContainer.innerHTML = notifications.map(n => `
      <div class="notif-card ${!n.read ? 'is-unread' : ''}">
        <div class="notif-icon">
          ${getNotificationIcon(n.type)}
        </div>

        <div style="flex: 1; padding-right: 16px;">
          <div style="font-size: 0.95rem; color: #eee; line-height: 1.4;">
            ${n.text}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted, #888); margin-top: 4px;">
            ${n.time || 'Recently'}
          </div>
        </div>

        ${!n.read ? '<div class="unread-dot"></div>' : ''}
      </div>
    `).join("");
  }

  // 4. FILTER TOGGLE HANDLERS
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      activeFilter = btn.dataset.filter;
      renderNotifications();
    });
  });

  // 5. MARK ALL AS READ HANDLER
  if (markReadBtn) {
    markReadBtn.addEventListener("click", () => {
      window.WallAPI.markNotificationsAsRead();
      updateNavBadge();
      renderNotifications();
    });
  }

  // Initial Paint
  updateNavBadge();
  renderNotifications();
})();