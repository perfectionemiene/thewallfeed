/* =========================================================
   THE WALL. — Private 1-on-1 Messaging Logic (messages.js)
   ========================================================= */

(function initMessagesPage() {
  const threadsContainer = document.getElementById("threadsContainer");
  const chatLayout = document.getElementById("chatLayout");
  const activePartnerMeta = document.getElementById("activePartnerMeta");
  const chatBody = document.getElementById("chatBody");
  const messageForm = document.getElementById("messageForm");
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");
  const backToListBtn = document.getElementById("backToListBtn");

  let activeConversationId = null;
  const currentUser = window.WallAPI.getCurrentUser();

  // 1. EXTRACT QUERY PARAMS (e.g. ?cid=conv_1)
  const urlParams = new URLSearchParams(window.location.search);
  const targetCid = urlParams.get("cid");

  // 2. RENDER CONVERSATION THREAD LIST
  function renderThreads() {
    if (!threadsContainer) return;
    const conversations = window.WallAPI.getConversations();

    if (conversations.length === 0) {
      threadsContainer.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--text-muted, #888); font-size: 0.85rem;">
          No active conversations yet.<br>Accept a Cross Paths request in Circle to chat.
        </div>
      `;
      return;
    }

    threadsContainer.innerHTML = conversations.map(c => `
      <div 
        class="conversation-item ${c.id === activeConversationId ? 'is-active' : ''}" 
        onclick="selectConversation('${c.id}')"
      >
        <div style="font-weight: 700; font-size: 0.95rem;">
          ${c.partner.label} <b>#${c.partner.code}</b>
        </div>
        <div style="font-size: 0.82rem; color: var(--text-muted, #888); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 4px;">
          ${c.lastMessage}
        </div>
      </div>
    `).join("");
  }

  // 3. SELECT AND LOAD CONVERSATION
  window.selectConversation = function(conversationId) {
    activeConversationId = conversationId;
    const conversations = window.WallAPI.getConversations();
    const conv = conversations.find(c => c.id === conversationId);

    if (!conv) return;

    if (chatLayout) chatLayout.classList.add("has-active");
    if (backToListBtn) backToListBtn.style.display = "inline-block";

    // Enable Inputs
    if (messageInput) messageInput.disabled = false;
    if (sendBtn) sendBtn.disabled = false;

    // Header Partner Info
    if (activePartnerMeta) {
      activePartnerMeta.innerHTML = `${conv.partner.label} <b>#${conv.partner.code}</b>`;
    }

    renderMessages();
    renderThreads();
  };

  // 4. RENDER MESSAGES IN ACTIVE THREAD
  function renderMessages() {
    if (!activeConversationId || !chatBody) return;

    const messages = window.WallAPI.getMessages(activeConversationId);

    if (messages.length === 0) {
      chatBody.innerHTML = `
        <div style="text-align: center; color: var(--text-muted, #888); margin: auto; font-size: 0.88rem;">
          This is the beginning of your private anonymous chat.
        </div>
      `;
      return;
    }

    chatBody.innerHTML = messages.map(m => {
      const isOutgoing = m.senderId === currentUser.id;
      return `
        <div class="msg-bubble ${isOutgoing ? 'msg-bubble--outgoing' : 'msg-bubble--incoming'}">
          ${m.text}
          <div style="font-size: 0.7rem; opacity: 0.7; text-align: right; margin-top: 4px;">
            ${m.time || 'Just now'}
          </div>
        </div>
      `;
    }).join("");

    // Auto-scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // 5. SEND MESSAGE HANDLER
  if (messageForm) {
    messageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = messageInput.value.trim();

      if (text && activeConversationId) {
        window.WallAPI.sendMessage(activeConversationId, text);
        messageInput.value = "";
        renderMessages();
        renderThreads();
      }
    });
  }

  // 6. BACK TO LIST (MOBILE RESPONSIVE HANDLER)
  if (backToListBtn) {
    backToListBtn.addEventListener("click", () => {
      if (chatLayout) chatLayout.classList.remove("has-active");
      backToListBtn.style.display = "none";
    });
  }

  // Initial Load Phase
  renderThreads();

  if (targetCid) {
    selectConversation(targetCid);
  } else {
    const conversations = window.WallAPI.getConversations();
    if (conversations.length > 0) {
      selectConversation(conversations[0].id);
    }
  }
})();