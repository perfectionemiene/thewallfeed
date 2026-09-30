/* =========================================================
   THE WALL. — Inner Circle & Requests Logic (circle.js)
   ========================================================= */

(function initCirclePage() {
  const requestsContainer = document.getElementById("requestsContainer");
  const circleContainer = document.getElementById("circleContainer");
  const pendingCountBadge = document.getElementById("pendingCountBadge");

  // 1. RENDER PENDING CROSS PATHS REQUESTS
  function renderRequests() {
    if (!requestsContainer) return;
    const requests = window.WallAPI.getCrossPathRequests();

    if (pendingCountBadge) {
      pendingCountBadge.textContent = `(${requests.length})`;
    }

    if (requests.length === 0) {
      requestsContainer.innerHTML = `
        <div class="card" style="padding: 20px; text-align: center; color: var(--text-muted, #888);">
          <p style="margin: 0; font-size: 0.9rem;">No pending Cross Paths requests at the moment.</p>
        </div>
      `;
      return;
    }

    requestsContainer.innerHTML = requests.map(req => `
      <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;">
        <div>
          <div style="font-weight: 700; font-size: 1rem;">
            ${req.sender.label} <b>#${req.sender.code}</b>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted, #888); margin-top: 2px;">
            Wants to connect into your Inner Circle
          </div>
        </div>

        <div style="display: flex; gap: 10px;">
          <button 
            class="btn-action" 
            style="padding: 6px 14px; font-size: 0.82rem;" 
            onclick="acceptRequest('${req.id}')"
          >
            Accept
          </button>
          <button 
            class="btn-action btn-action--secondary" 
            style="padding: 6px 14px; font-size: 0.82rem;" 
            onclick="declineRequest('${req.id}')"
          >
            Decline
          </button>
        </div>
      </div>
    `).join("");
  }

  // 2. RENDER ACTIVE INNER CIRCLE CONNECTIONS
  function renderCircle() {
    if (!circleContainer) return;
    const connections = window.WallAPI.getInnerCircle();

    if (connections.length === 0) {
      circleContainer.innerHTML = `
        <div class="card" style="padding: 24px; text-align: center; color: var(--text-muted, #888);">
          <p style="margin: 0 0 8px 0; font-size: 0.95rem; font-weight: 600;">Your Inner Circle is empty.</p>
          <p style="margin: 0; font-size: 0.85rem;">Send or accept Cross Paths requests on thoughts in the feed to build your private network.</p>
        </div>
      `;
      return;
    }

    circleContainer.innerHTML = connections.map(conn => `
      <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;">
        <div>
          <div style="font-weight: 700; font-size: 1rem;">
            ${conn.user.label} <b>#${conn.user.code}</b>
          </div>
          <div style="font-size: 0.8rem; color: #22c55e; margin-top: 2px;">
            ● Connected in Inner Circle
          </div>
        </div>

        <div style="display: flex; gap: 8px; align-items: center;">
          <button 
            class="btn-action" 
            style="padding: 6px 12px; font-size: 0.82rem;" 
            onclick="openChat('${conn.user.id}')"
          >
            💬 Message
          </button>
          <button 
            class="btn-action btn-action--secondary" 
            style="padding: 6px 12px; font-size: 0.82rem;" 
            onclick="disconnect('${conn.requestId}')"
          >
            Disconnect
          </button>
          <button 
            class="btn-action btn-action--secondary" 
            style="padding: 6px 10px; font-size: 0.82rem; color: #ef4444;" 
            title="Block User"
            onclick="blockUser('${conn.user.id}')"
          >
            🚫
          </button>
        </div>
      </div>
    `).join("");
  }

  // 3. EVENT HANDLERS
  window.acceptRequest = function(requestId) {
    window.WallAPI.acceptCrossPathsRequest(requestId);
    renderRequests();
    renderCircle();
  };

  window.declineRequest = function(requestId) {
    window.WallAPI.declineCrossPathsRequest(requestId);
    renderRequests();
  };

  window.disconnect = function(requestId) {
    if (confirm("Are you sure you want to remove this connection from your Inner Circle?")) {
      window.WallAPI.removeConnection(requestId);
      renderCircle();
    }
  };

  window.openChat = function(partnerId) {
    const convId = window.WallAPI.getOrCreateConversation(partnerId);
    window.location.href = `messages.html?cid=${convId}`;
  };

  window.blockUser = function(userId) {
    if (confirm("Block this user? Their thoughts and messages will no longer appear for you.")) {
      window.WallAPI.blockUser(userId);
      renderCircle();
    }
  };

  // Initial Paint
  renderRequests();
  renderCircle();
})();