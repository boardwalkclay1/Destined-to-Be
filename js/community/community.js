// js/community/community.js
// LocalStorage-backed community feed with photo/video sharing, likes, and search.

const POSTS_KEY = "dtb_community_posts";
const PROFILE_KEY = "destinedToBeState_v1";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getAuthor() {
  try {
    const st = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
    return st?.user?.preferredName || st?.user?.fullName || "Anonymous Soul";
  } catch { return "Anonymous Soul"; }
}

function loadPosts() {
  try {
    return JSON.parse(localStorage.getItem(POSTS_KEY) || "[]");
  } catch { return []; }
}

function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts.slice(0, 200)));
}

function timeAgo(isoStr) {
  const delta = (Date.now() - new Date(isoStr).getTime()) / 1000;
  if (delta < 60) return "just now";
  if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
  if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
  return `${Math.floor(delta / 86400)}d ago`;
}

function categoryIcon(cat) {
  const icons = {
    insight: "💡", question: "❓", numerology: "🔢",
    tarot: "🔮", astrology: "⭐", dream: "🌙",
    synchronicity: "✦", photo: "📷", reading: "📖"
  };
  return icons[cat] || "✦";
}

// ── Render Feed ───────────────────────────────────────────────────────────────

function renderFeed(filter = "all", query = "") {
  const feed = document.getElementById("community-feed");
  if (!feed) return;

  let posts = loadPosts();

  if (filter !== "all") {
    posts = posts.filter(p => (p.category || p.type || "insight") === filter);
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    posts = posts.filter(p =>
      (p.content || "").toLowerCase().includes(q) ||
      (p.author || "").toLowerCase().includes(q)
    );
  }

  if (!posts.length) {
    feed.innerHTML = `<p class="empty-feed-msg" style="color:var(--text-muted);text-align:center;padding:20px 0;">
      No posts found. ${filter !== "all" ? "Try a different filter." : "Be the first to share! ✦"}</p>`;
    return;
  }

  feed.innerHTML = "";
  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "community-post-card";
    card.dataset.id = post.id;

    const cat = post.category || post.type || "insight";
    const icon = categoryIcon(cat);

    let mediaHtml = "";
    if (post.photoDataUrl) {
      if (post.isVideo) {
        mediaHtml = `<video src="${post.photoDataUrl}" controls class="post-media"></video>`;
      } else {
        mediaHtml = `<img src="${post.photoDataUrl}" class="post-media" alt="Shared image" loading="lazy">`;
      }
    }

    const likes = post.likes || 0;
    const likedBy = post.likedBy || [];
    const myName = getAuthor();
    const alreadyLiked = likedBy.includes(myName);

    card.innerHTML = `
      <div class="post-meta">
        <span class="post-author-avatar">${(post.author || "A")[0].toUpperCase()}</span>
        <span class="post-author">${escapeHtml(post.author || "Anonymous")}</span>
        <span class="post-category-badge">${icon} ${cat}</span>
        <span class="post-time">${timeAgo(post.ts)}</span>
      </div>
      ${mediaHtml}
      <div class="post-content">${escapeHtml(post.content || "").replace(/\n/g, "<br>")}</div>
      <div class="post-actions">
        <button class="post-like-btn ${alreadyLiked ? "liked" : ""}" data-id="${post.id}">
          ${alreadyLiked ? "♥" : "♡"} ${likes}
        </button>
        ${post.author === myName
          ? `<button class="post-delete-btn" data-id="${post.id}" title="Delete my post" aria-label="Delete post">✕</button>`
          : ""}
      </div>
    `;

    feed.appendChild(card);
  });

  // Render active members
  renderMembers(loadPosts());
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Members ───────────────────────────────────────────────────────────────────

function renderMembers(posts) {
  const el = document.getElementById("members-list");
  if (!el) return;
  const seen = new Map();
  posts.forEach(p => {
    if (!seen.has(p.author)) seen.set(p.author, p.ts);
  });
  if (!seen.size) {
    el.innerHTML = `<p style="color:var(--text-muted);font-size:13px;">No active members yet.</p>`;
    return;
  }
  el.innerHTML = Array.from(seen.entries())
    .slice(0, 20)
    .map(([name, ts]) => `
      <div class="member-chip">
        <span class="member-avatar">${name[0].toUpperCase()}</span>
        <span class="member-name">${escapeHtml(name)}</span>
        <span class="member-time">${timeAgo(ts)}</span>
      </div>`)
    .join("");
}

// ── Post Actions ──────────────────────────────────────────────────────────────

function addPost(content, category, photoDataUrl = null, isVideo = false) {
  if (!content.trim() && !photoDataUrl) return false;
  const posts = loadPosts();
  posts.unshift({
    id: generateId(),
    author: getAuthor(),
    content: content.trim(),
    category,
    photoDataUrl: photoDataUrl || null,
    isVideo,
    likes: 0,
    likedBy: [],
    ts: new Date().toISOString()
  });
  savePosts(posts);
  return true;
}

function likePost(id) {
  const posts = loadPosts();
  // IDs can be UUID strings or legacy numbers
  const post = posts.find(p => String(p.id) === String(id));
  if (!post) return;
  const me = getAuthor();
  if (!post.likedBy) post.likedBy = [];
  if (post.likedBy.includes(me)) {
    post.likedBy = post.likedBy.filter(n => n !== me);
    post.likes = Math.max(0, (post.likes || 0) - 1);
  } else {
    post.likedBy.push(me);
    post.likes = (post.likes || 0) + 1;
  }
  savePosts(posts);
}

function deletePost(id) {
  const posts = loadPosts().filter(p => String(p.id) !== String(id));
  savePosts(posts);
}

// ── Tab Switching ─────────────────────────────────────────────────────────────

function initTabs() {
  document.querySelectorAll(".composer-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".composer-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".composer-panel").forEach(p => (p.style.display = "none"));
      tab.classList.add("active");
      const panel = document.getElementById(`tab-${tab.dataset.tab}`);
      if (panel) {
        panel.style.display = "block";
        panel.classList.add("active");
      }
    });
  });
}

// ── Photo Upload ──────────────────────────────────────────────────────────────

function initPhotoUpload() {
  const dropZone = document.getElementById("photo-drop-zone");
  const photoInput = document.getElementById("photo-input");
  const photoPreview = document.getElementById("photo-preview");
  const videoPreview = document.getElementById("video-preview");

  if (!dropZone) return;

  // Drag and drop support on drop zone
  dropZone.addEventListener("dragover", e => {
    e.preventDefault();
    dropZone.style.borderColor = "var(--primary)";
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "";
  });

  dropZone.addEventListener("drop", e => {
    e.preventDefault();
    dropZone.style.borderColor = "";
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileSelected(file, photoPreview, videoPreview);
  });

  // Visible file input handles keyboard and click natively
  photoInput?.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    if (file) handleFileSelected(file, photoPreview, videoPreview);
  });
}

let currentMediaDataUrl = null;
let currentMediaIsVideo = false;

function handleFileSelected(file, photoPreview, videoPreview) {
  if (!file) return;
  const isVideo = file.type.startsWith("video/");
  const reader = new FileReader();
  reader.onload = e => {
    currentMediaDataUrl = e.target.result;
    currentMediaIsVideo = isVideo;
    if (isVideo) {
      if (videoPreview) { videoPreview.src = currentMediaDataUrl; videoPreview.style.display = "block"; }
      if (photoPreview) photoPreview.style.display = "none";
    } else {
      if (photoPreview) { photoPreview.src = currentMediaDataUrl; photoPreview.style.display = "block"; }
      if (videoPreview) videoPreview.style.display = "none";
    }
    const label = document.getElementById("photo-drop-label");
    if (label) label.textContent = `✓ ${file.name}`;
  };
  reader.readAsDataURL(file);
}

// ── Seed Demo Posts ───────────────────────────────────────────────────────────

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ── Seed Demo Posts ───────────────────────────────────────────────────────────

function seedDemoPostsIfEmpty() {
  const existing = loadPosts();
  if (existing.length > 0) return;
  const demos = [
    {
      id: generateId(),
      author: "StarSoul",
      content: "Just pulled The Tower in my Celtic Cross reading and it perfectly describes the shake-up happening in my life right now. Has anyone else experienced major synchronicities with their spreads? ✦",
      category: "tarot",
      likes: 7, likedBy: [],
      ts: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: generateId(),
      author: "NumerologyNerd",
      content: "Life Path 11 here — I've been doing daily card pulls for 30 days straight and tracking which cards come up on which personal day number. The correlations are WILD. On Personal Day 7 I almost always pull The Hermit or High Priestess. 🔢🔮",
      category: "numerology",
      likes: 12, likedBy: [],
      ts: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: generateId(),
      author: "MoonChild",
      content: "Keep seeing 333 everywhere this week. The app says: 'Creative expansion, self-expression, and support from your guides.' Starting to think my guides are nudging me to share my art publicly… anyone else in a creative breakthrough?",
      category: "synchronicity",
      likes: 5, likedBy: [],
      ts: new Date(Date.now() - 14400000).toISOString()
    },
    {
      id: generateId(),
      author: "AquariusSoul",
      content: "Question for the community: When The Moon shows up in the 'Root Cause' position of a Career spread, how do you interpret that? My intuition says fear/illusion is blocking my career growth but curious about your takes.",
      category: "question",
      likes: 3, likedBy: [],
      ts: new Date(Date.now() - 86400000).toISOString()
    }
  ];
  savePosts(demos);
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  seedDemoPostsIfEmpty();
  initTabs();
  initPhotoUpload();

  let currentFilter = "all";
  let currentQuery = "";

  renderFeed(currentFilter, currentQuery);

  // Text post
  document.getElementById("post-text-btn")?.addEventListener("click", () => {
    const content = document.getElementById("post-text")?.value || "";
    const cat = document.getElementById("post-category")?.value || "insight";
    if (addPost(content, cat)) {
      document.getElementById("post-text").value = "";
      renderFeed(currentFilter, currentQuery);
    }
  });

  // Photo post
  document.getElementById("post-photo-btn")?.addEventListener("click", () => {
    const caption = document.getElementById("photo-caption")?.value || "";
    if (!currentMediaDataUrl) { alert("Please select a photo or video first."); return; }
    if (addPost(caption, "photo", currentMediaDataUrl, currentMediaIsVideo)) {
      document.getElementById("photo-caption").value = "";
      currentMediaDataUrl = null;
      currentMediaIsVideo = false;
      const photoPreview = document.getElementById("photo-preview");
      const videoPreview = document.getElementById("video-preview");
      if (photoPreview) { photoPreview.src = ""; photoPreview.style.display = "none"; }
      if (videoPreview) { videoPreview.src = ""; videoPreview.style.display = "none"; }
      const label = document.getElementById("photo-drop-label");
      if (label) label.textContent = "📷 Click or drag a photo / video here";
      renderFeed(currentFilter, currentQuery);
    }
  });

  // Reading post
  document.getElementById("post-reading-btn")?.addEventListener("click", () => {
    const content = document.getElementById("reading-text")?.value || "";
    if (addPost(content, "reading")) {
      document.getElementById("reading-text").value = "";
      renderFeed(currentFilter, currentQuery);
    }
  });

  // Feed delegation (like / delete)
  document.getElementById("community-feed")?.addEventListener("click", e => {
    const likeBtn = e.target.closest(".post-like-btn");
    const deleteBtn = e.target.closest(".post-delete-btn");

    if (likeBtn) {
      likePost(likeBtn.dataset.id);
      renderFeed(currentFilter, currentQuery);
    }
    if (deleteBtn) {
      if (confirm("Delete this post?")) {
        deletePost(deleteBtn.dataset.id);
        renderFeed(currentFilter, currentQuery);
      }
    }
  });

  // Filter
  document.getElementById("feed-filter")?.addEventListener("change", e => {
    currentFilter = e.target.value;
    renderFeed(currentFilter, currentQuery);
  });

  // Search
  document.getElementById("feed-search")?.addEventListener("input", e => {
    currentQuery = e.target.value;
    renderFeed(currentFilter, currentQuery);
  });
});
