/* =========================================================
   THE WALL — Simulated Backend & LocalStorage API (state.js)
   Phase 3 Update: Circle, Messaging, Notifications & Posting
   ========================================================= */

const STORAGE_KEY = "THE_WALL_STATE_V1";

const initialSeedState = {
  currentUser: {
    id: "user_7294",
    label: "🪻 Anonymous",
    code: "7294"
  },
  devUsers: [
    { id: "user_7294", label: "🪻 Anonymous", code: "7294" },
    { id: "user_4821", label: "🌙 Anonymous", code: "4821" },
    { id: "user_7319", label: "🦋 Anonymous", code: "7319" },
    { id: "user_2094", label: "🕯️ Anonymous", code: "2094" },
    { id: "user_9910", label: "☁️ Anonymous", code: "9910" }
  ],
  thoughts: [
    {
      id: 101,
      authorId: "user_4821",
      label: "🌙 Anonymous",
      code: "4821",
      tag: "Rant",
      content: "I genuinely hate when someone says 'we need to talk' and refuses to say what it's about. Just say it. I've already imagined 14 worse versions.",
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
      authorId: "user_7319",
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
      authorId: "user_2094",
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
      authorId: "user_9910",
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
  ],
  crossPathRequests: [
    {
      id: "req_1001",
      fromUserId: "user_4821",
      toUserId: "user_7294",
      status: "pending",
      timestamp: Date.now() - (1 * 60 * 60 * 1000)
    }
  ],
  conversations: [
    {
      id: "conv_1",
      participants: ["user_7294", "user_7319"],
      messages: [
        {
          id: "m_1",
          senderId: "user_7319",
          text: "Hey! Crossed paths from your group projects post. Totally resonated.",
          timestamp: Date.now() - (3 * 60 * 60 * 1000),
          time: "3h ago"
        },
        {
          id: "m_2",
          senderId: "user_7294",
          text: "Right? It's the absolute worst when nobody responds in the group chat.",
          timestamp: Date.now() - (2 * 60 * 60 * 1000),
          time: "2h ago"
        }
      ]
    }
  ],
  notifications: [
    {
      id: "notif_1",
      type: "echo",
      text: "🌙 Anonymous #4821 Echoed your thought",
      time: "10m ago",
      timestamp: Date.now() - (10 * 60 * 1000),
      read: false
    },
    {
      id: "notif_2",
      type: "crosspaths",
      text: "🌙 Anonymous #4821 wants to Cross Paths with you!",
      time: "1h ago",
      timestamp: Date.now() - (60 * 60 * 1000),
      read: false
    }
  ],
  blockedUsers: []
};

class WallState {
  constructor() {
    this.data = this.load();
  }

  load() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeedState));
      return initialSeedState;
    }
    return JSON.parse(saved);
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  // --- USER MANAGEMENT ---
  getCurrentUser() {
    return this.data.currentUser;
  }

  getUserById(userId) {
    return this.data.devUsers.find(u => u.id === userId) || { id: userId, label: "❓ Anonymous", code: "0000" };
  }

  switchUser(userId) {
    const target = this.data.devUsers.find(u => u.id === userId);
    if (target) {
      this.data.currentUser = target;
      this.save();
      window.location.reload();
    }
  }

  // --- THOUGHTS / FEED ---
  getThoughts() {
    return this.data.thoughts.filter(t => !this.data.blockedUsers.includes(t.authorId));
  }

  getThoughtById(id) {
    const numericId = parseInt(id, 10);
    return this.data.thoughts.find(p => p.id === numericId) || this.data.thoughts[0];
  }

  createThought(tag, content) {
    const user = this.getCurrentUser();
    const newThought = {
      id: Date.now(),
      authorId: user.id,
      label: user.label,
      code: user.code,
      tag: tag,
      content: content,
      time: "Just now",
      timestamp: Date.now(),
      tilt: (Math.random() * 3 - 1.5).toFixed(1),
      reactions: {
        felt: { count: 0, active: false, emoji: "💜" },
        real: { count: 0, active: false, emoji: "🙂" },
        mindblown: { count: 0, active: false, emoji: "💀" },
        relatable: { count: 0, active: false, emoji: "👀" },
        deep: { count: 0, active: false, emoji: "😭" },
        funny: { count: 0, active: false, emoji: "😂" },
        sympathy: { count: 0, active: false, emoji: "🫂" }
      },
      comments: []
    };

    this.data.thoughts.unshift(newThought);
    this.save();
    return newThought;
  }

  toggleReaction(postId, reactionKey) {
    const post = this.getThoughtById(postId);
    if (post && post.reactions && post.reactions[reactionKey]) {
      const r = post.reactions[reactionKey];
      r.active = !r.active;
      r.count += r.active ? 1 : -1;
      this.save();
    }
  }

  addComment(postId, text) {
    const post = this.getThoughtById(postId);
    if (post) {
      const user = this.getCurrentUser();
      post.comments.unshift({
        id: Date.now(),
        author: `${user.label} #${user.code}`,
        time: "Just now",
        text: text
      });

      // Add notification to post author if not self
      if (post.authorId !== user.id) {
        this.addNotification({
          type: "echo",
          text: `${user.label} #${user.code} Echoed on your thought`,
          timestamp: Date.now()
        });
      }

      this.save();
    }
  }

  // --- CROSS PATHS & INNER CIRCLE ---
  sendCrossPathsRequest(toUserId) {
    const currentUser = this.getCurrentUser();
    const exists = this.data.crossPathRequests.find(
      r => (r.fromUserId === currentUser.id && r.toUserId === toUserId) ||
           (r.fromUserId === toUserId && r.toUserId === currentUser.id)
    );

    if (!exists) {
      this.data.crossPathRequests.push({
        id: "req_" + Date.now(),
        fromUserId: currentUser.id,
        toUserId: toUserId,
        status: "pending",
        timestamp: Date.now()
      });

      this.addNotification({
        type: "crosspaths",
        text: `${currentUser.label} #${currentUser.code} wants to Cross Paths with you!`,
        timestamp: Date.now()
      });

      this.save();
    }
  }

  getCrossPathRequests() {
    const currentUser = this.getCurrentUser();
    return this.data.crossPathRequests.filter(
      r => r.toUserId === currentUser.id && r.status === "pending"
    ).map(r => ({
      ...r,
      sender: this.getUserById(r.fromUserId)
    }));
  }

  acceptCrossPathsRequest(requestId) {
    const req = this.data.crossPathRequests.find(r => r.id === requestId);
    if (req) {
      req.status = "accepted";
      this.save();
    }
  }

  declineCrossPathsRequest(requestId) {
    this.data.crossPathRequests = this.data.crossPathRequests.filter(r => r.id !== requestId);
    this.save();
  }

  getInnerCircle() {
    const currentUser = this.getCurrentUser();
    const acceptedReqs = this.data.crossPathRequests.filter(
      r => r.status === "accepted" && (r.fromUserId === currentUser.id || r.toUserId === currentUser.id)
    );

    return acceptedReqs.map(r => {
      const partnerId = r.fromUserId === currentUser.id ? r.toUserId : r.fromUserId;
      return {
        requestId: r.id,
        user: this.getUserById(partnerId)
      };
    });
  }

  removeConnection(requestId) {
    this.data.crossPathRequests = this.data.crossPathRequests.filter(r => r.id !== requestId);
    this.save();
  }

  // --- MESSAGING ---
  getConversations() {
    const currentUser = this.getCurrentUser();
    return this.data.conversations
      .filter(c => c.participants.includes(currentUser.id))
      .map(c => {
        const partnerId = c.participants.find(id => id !== currentUser.id);
        const partner = this.getUserById(partnerId);
        const lastMsg = c.messages[c.messages.length - 1] || { text: "No messages yet", time: "" };
        return {
          id: c.id,
          partner: partner,
          lastMessage: lastMsg.text,
          time: lastMsg.time,
          timestamp: lastMsg.timestamp || 0
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getOrCreateConversation(partnerId) {
    const currentUser = this.getCurrentUser();
    let conv = this.data.conversations.find(
      c => c.participants.includes(currentUser.id) && c.participants.includes(partnerId)
    );

    if (!conv) {
      conv = {
        id: "conv_" + Date.now(),
        participants: [currentUser.id, partnerId],
        messages: []
      };
      this.data.conversations.push(conv);
      this.save();
    }
    return conv.id;
  }

  getMessages(conversationId) {
    const conv = this.data.conversations.find(c => c.id === conversationId);
    return conv ? conv.messages : [];
  }

  sendMessage(conversationId, text) {
    const conv = this.data.conversations.find(c => c.id === conversationId);
    if (conv && text.trim()) {
      const currentUser = this.getCurrentUser();
      const msg = {
        id: "m_" + Date.now(),
        senderId: currentUser.id,
        text: text.trim(),
        timestamp: Date.now(),
        time: "Just now"
      };
      conv.messages.push(msg);
      this.save();
      return msg;
    }
    return null;
  }

  // --- NOTIFICATIONS ---
  getNotifications() {
    return this.data.notifications.sort((a, b) => b.timestamp - a.timestamp);
  }

  getUnreadNotificationCount() {
    return this.data.notifications.filter(n => !n.read).length;
  }

  markNotificationsAsRead() {
    this.data.notifications.forEach(n => n.read = true);
    this.save();
  }

  addNotification(notif) {
    this.data.notifications.unshift({
      id: "notif_" + Date.now(),
      type: notif.type || "general",
      text: notif.text,
      time: "Just now",
      timestamp: notif.timestamp || Date.now(),
      read: false
    });
    this.save();
  }

  // --- MODERATION ---
  blockUser(userId) {
    if (!this.data.blockedUsers.includes(userId)) {
      this.data.blockedUsers.push(userId);
      this.save();
    }
  }
}

window.WallAPI = new WallState();

/* =========================================================
   Global Action Handler for Cross Paths Trigger
   ========================================================= */
window.sendCrossPath = function(authorId, event) {
  if (event) event.stopPropagation();

  const currentUser = WallAPI.getCurrentUser();

  if (!authorId) {
    alert("Unable to find user ID for this post.");
    return;
  }

  if (authorId === currentUser.id) {
    alert("You cannot cross paths with yourself!");
    return;
  }

  const existingReq = WallAPI.data.crossPathRequests.find(
    r => (r.fromUserId === currentUser.id && r.toUserId === authorId) ||
         (r.fromUserId === authorId && r.toUserId === currentUser.id)
  );

  if (existingReq) {
    if (existingReq.status === "pending") {
      alert("A Cross Paths request is already pending between you two!");
    } else if (existingReq.status === "accepted") {
      alert("You are already in each other's Inner Circle!");
    }
    return;
  }

  WallAPI.sendCrossPathsRequest(authorId);
  alert("⚡ Cross Paths request sent!");
};