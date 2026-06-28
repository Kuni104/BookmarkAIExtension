let lastDetectedUrl = "";
let toastTimer = null;
let pendingSendTimer = null;
let lastSentPayloadKey = "";

const PLATFORM_CONFIGS = {
  youtube: {
    siteName: "Youtube",
    baseUrl: "youtube.com"
  },
  facebook: {
    siteName: "Facebook",
    baseUrl: "facebook.com"
  },
  reddit: {
    siteName: "Reddit",
    baseUrl: "reddit.com"
  },
  tiktok: {
    siteName: "TikTok",
    baseUrl: "tiktok.com"
  }
};

function getHost() {
  try {
    return window.location.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function getPlatform() {
  const host = getHost();

  if (host === "youtube.com" || host === "m.youtube.com") {
    return "youtube";
  }

  if (host === "facebook.com" || host === "m.facebook.com" || host === "web.facebook.com") {
    return "facebook";
  }

  if (host === "reddit.com" || host === "old.reddit.com" || host === "new.reddit.com") {
    return "reddit";
  }

  if (host === "tiktok.com" || host === "m.tiktok.com") {
    return "tiktok";
  }

  return "";
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function cleanTitle(value) {
  return cleanText(value)
    .replace(/\s*[-|]\s*YouTube$/i, "")
    .replace(/\s*[-|]\s*Facebook$/i, "")
    .replace(/\s*[-|]\s*Reddit$/i, "")
    .replace(/\s*[-|]\s*TikTok$/i, "")
    .trim();
}

function stripTracking(urlValue) {
  try {
    const url = new URL(urlValue, window.location.origin);
    const keepParams = new Set(["v", "story_fbid", "id", "fbid"]);

    for (const key of Array.from(url.searchParams.keys())) {
      if (!keepParams.has(key)) {
        url.searchParams.delete(key);
      }
    }

    url.hash = "";
    return url.toString();
  } catch {
    return cleanText(urlValue);
  }
}

function getMetaContent(selector) {
  return document.querySelector(selector)?.getAttribute("content")?.trim() || "";
}

function getLinkHref(selector) {
  return document.querySelector(selector)?.getAttribute("href")?.trim() || "";
}

function getFirstText(selectors) {
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);

    for (const element of elements) {
      const text = cleanText(element?.textContent || "");

      if (text) {
        return text;
      }
    }
  }

  return "";
}

function getCanonicalUrl() {
  return getLinkHref('link[rel="canonical"]') || getMetaContent('meta[property="og:url"]') || "";
}

function getYoutubeUrl() {
  try {
    const url = new URL(window.location.href);
    const host = url.hostname.replace(/^www\./, "");

    if (host !== "youtube.com" && host !== "m.youtube.com") {
      return "";
    }

    if (url.pathname === "/watch") {
      const videoId = url.searchParams.get("v");
      return videoId ? `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}` : "";
    }

    if (url.pathname.startsWith("/shorts/")) {
      const videoId = url.pathname.split("/").filter(Boolean)[1];
      return videoId ? `https://www.youtube.com/shorts/${encodeURIComponent(videoId)}` : "";
    }

    return "";
  } catch {
    return "";
  }
}

function getRedditUrl() {
  try {
    const url = new URL(getCanonicalUrl() || window.location.href);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host !== "reddit.com" && host !== "old.reddit.com" && host !== "new.reddit.com") {
      return "";
    }

    if (!url.pathname.includes("/comments/")) {
      return "";
    }

    return stripTracking(`https://www.reddit.com${url.pathname}`);
  } catch {
    return "";
  }
}

function getTiktokUrl() {
  try {
    const url = new URL(getCanonicalUrl() || window.location.href);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host !== "tiktok.com" && host !== "m.tiktok.com") {
      return "";
    }

    if (!url.pathname.includes("/video/") && !url.pathname.includes("/photo/")) {
      return "";
    }

    return stripTracking(`https://www.tiktok.com${url.pathname}`);
  } catch {
    return "";
  }
}

function isFacebookSupportedUrl(url) {
  try {
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host !== "facebook.com" && host !== "m.facebook.com" && host !== "web.facebook.com") {
      return false;
    }

    return (
      url.pathname.includes("/posts/") ||
      url.pathname.includes("/videos/") ||
      url.pathname.includes("/reel/") ||
      url.pathname.includes("/watch/") ||
      url.pathname.includes("/permalink.php") ||
      url.pathname.includes("/story.php") ||
      url.searchParams.has("story_fbid") ||
      url.searchParams.has("fbid")
    );
  } catch {
    return false;
  }
}

function normalizeFacebookUrl(urlValue) {
  try {
    const url = new URL(urlValue, window.location.origin);

    if (url.hostname.includes("l.facebook.com") && url.searchParams.has("u")) {
      return normalizeFacebookUrl(url.searchParams.get("u"));
    }

    if (!isFacebookSupportedUrl(url)) {
      return "";
    }

    url.hostname = "www.facebook.com";
    return stripTracking(url.toString());
  } catch {
    return "";
  }
}

function getFacebookPostUrlFromVisiblePage() {
  const selectors = [
    'a[href*="story_fbid"]',
    'a[href*="/posts/"]',
    'a[href*="/videos/"]',
    'a[href*="/reel/"]',
    'a[href*="/watch/"]',
    'a[href*="/permalink.php"]'
  ];

  for (const selector of selectors) {
    const links = document.querySelectorAll(selector);

    for (const link of links) {
      const normalized = normalizeFacebookUrl(link.href || link.getAttribute("href") || "");

      if (normalized) {
        return normalized;
      }
    }
  }

  return "";
}

function getFacebookUrl() {
  try {
    const canonical = normalizeFacebookUrl(getCanonicalUrl());
    if (canonical) {
      return canonical;
    }

    const current = normalizeFacebookUrl(window.location.href);
    if (current) {
      return current;
    }

    return getFacebookPostUrlFromVisiblePage();
  } catch {
    return "";
  }
}

function getCurrentSupportedUrl() {
  const platform = getPlatform();

  if (platform === "youtube") {
    return getYoutubeUrl();
  }

  if (platform === "facebook") {
    return getFacebookUrl();
  }

  if (platform === "reddit") {
    return getRedditUrl();
  }

  if (platform === "tiktok") {
    return getTiktokUrl();
  }

  return "";
}

function getVideoIdFromUrl(value) {
  try {
    const url = new URL(value);

    if (url.pathname === "/watch") {
      return url.searchParams.get("v") || "";
    }

    if (url.pathname.startsWith("/shorts/")) {
      return url.pathname.split("/").filter(Boolean)[1] || "";
    }

    return "";
  } catch {
    return "";
  }
}

function findVideoIdInText(value) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value, window.location.origin);

    if (url.pathname === "/watch") {
      return url.searchParams.get("v") || "";
    }

    if (url.pathname.startsWith("/shorts/")) {
      return url.pathname.split("/").filter(Boolean)[1] || "";
    }

    if (url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/").filter(Boolean)[1] || "";
    }
  } catch {}

  const watchMatch = String(value).match(/[?&]v=([\w-]{6,})/);
  if (watchMatch) {
    return watchMatch[1];
  }

  const shortsMatch = String(value).match(/\/shorts\/([\w-]{6,})/);
  if (shortsMatch) {
    return shortsMatch[1];
  }

  const embedMatch = String(value).match(/\/embed\/([\w-]{6,})/);
  if (embedMatch) {
    return embedMatch[1];
  }

  return "";
}

function getPageVideoIds() {
  const ids = new Set();
  const selectors = [
    "ytd-watch-flexy[video-id]",
    "ytd-player[video-id]",
    "meta[itemprop='videoId']",
    "meta[property='og:url']",
    "link[rel='canonical']"
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);

    if (!element) {
      continue;
    }

    const candidates = [
      element.getAttribute("video-id"),
      element.getAttribute("content"),
      element.getAttribute("href")
    ];

    for (const candidate of candidates) {
      const id = findVideoIdInText(candidate) || cleanText(candidate);

      if (/^[\w-]{6,}$/.test(id)) {
        ids.add(id);
      }
    }
  }

  return ids;
}

function pageMatchesVideoId(expectedId) {
  if (!expectedId) {
    return false;
  }

  const ids = getPageVideoIds();
  return ids.has(expectedId);
}

function getJsonLdVideoData(expectedId) {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');

  for (const script of scripts) {
    try {
      const parsed = JSON.parse(script.textContent || "");
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        if (!item || typeof item !== "object") {
          continue;
        }

        const idCandidates = [
          item.videoId,
          item.url,
          item.embedUrl,
          item.contentUrl,
          item.thumbnailUrl
        ];

        const matches = idCandidates.some(candidate => {
          if (Array.isArray(candidate)) {
            return candidate.some(value => findVideoIdInText(value) === expectedId);
          }

          return findVideoIdInText(candidate) === expectedId;
        });

        if (matches) {
          return {
            title: cleanText(item.name),
            channel: cleanText(item.author?.name || item.publisher?.name),
            description: cleanText(item.description)
          };
        }
      }
    } catch {}
  }

  return null;
}

function getYoutubeTitle(expectedId) {
  const jsonLd = getJsonLdVideoData(expectedId);
  if (jsonLd?.title) {
    return jsonLd.title;
  }

  return getFirstText([
    "ytd-watch-metadata h1 yt-formatted-string",
    "ytd-watch-metadata h1",
    "h1 yt-formatted-string",
    "h1"
  ]) || cleanTitle(getMetaContent('meta[property="og:title"]') || getMetaContent('meta[name="title"]') || document.title);
}

function getYoutubeChannel(expectedId) {
  const jsonLd = getJsonLdVideoData(expectedId);
  if (jsonLd?.channel) {
    return jsonLd.channel;
  }

  return getFirstText([
    "ytd-watch-metadata ytd-video-owner-renderer #channel-name a",
    "ytd-watch-metadata #owner ytd-channel-name a",
    "ytd-watch-metadata ytd-channel-name a",
    "#owner ytd-channel-name a",
    "ytd-video-owner-renderer ytd-channel-name a",
    "#upload-info #channel-name a"
  ]) || getMetaContent('meta[itemprop="author"]') || getMetaContent('meta[name="author"]');
}

function getYoutubeDescription(expectedId) {
  const jsonLd = getJsonLdVideoData(expectedId);
  if (jsonLd?.description) {
    return jsonLd.description;
  }

  return cleanText(getMetaContent('meta[name="description"]') || getMetaContent('meta[property="og:description"]')) || getFirstText([
    "ytd-watch-metadata #description-inline-expander yt-attributed-string",
    "ytd-watch-metadata #description-inline-expander span.yt-core-attributed-string",
    "ytd-watch-metadata #description-inline-expander",
    "ytd-watch-metadata ytd-text-inline-expander"
  ]);
}

function getYoutubeData(expectedUrl) {
  const expectedId = getVideoIdFromUrl(expectedUrl);

  if (!expectedId || getCurrentSupportedUrl() !== expectedUrl) {
    return null;
  }

  return {
    ...PLATFORM_CONFIGS.youtube,
    url: expectedUrl
  };
}

function getFacebookChannelFromTitle(title) {
  const cleaned = cleanText(title);

  if (!cleaned) {
    return "";
  }

  const separators = [" | ", " - "];
  for (const separator of separators) {
    if (cleaned.includes(separator)) {
      const first = cleaned.split(separator)[0].trim();
      if (first && !/facebook/i.test(first)) {
        return first;
      }
    }
  }

  return "";
}

function getFacebookArticle() {
  const articles = Array.from(document.querySelectorAll('[role="article"]'));

  for (const article of articles) {
    const link = article.querySelector('a[href*="story_fbid"], a[href*="/posts/"], a[href*="/videos/"], a[href*="/reel/"], a[href*="/watch/"], a[href*="/permalink.php"]');

    if (link) {
      return article;
    }
  }

  return articles[0] || null;
}

function getScopedText(root, selectors) {
  if (!root) {
    return "";
  }

  for (const selector of selectors) {
    const elements = root.querySelectorAll(selector);

    for (const element of elements) {
      const text = cleanText(element?.textContent || "");

      if (text) {
        return text;
      }
    }
  }

  return "";
}

function getFacebookData(expectedUrl) {
  if (getCurrentSupportedUrl() !== expectedUrl) {
    return null;
  }

  const article = getFacebookArticle();
  const metaTitle = getMetaContent('meta[property="og:title"]') || document.title;
  const description = cleanText(
    getMetaContent('meta[property="og:description"]') ||
    getMetaContent('meta[name="description"]') ||
    getScopedText(article, [
      '[data-ad-preview="message"]',
      '[data-testid="post_message"]',
      '[dir="auto"]',
      'span[dir="auto"]'
    ])
  );

  const channel = getScopedText(article, [
    'h2 a[role="link"]',
    'h3 a[role="link"]',
    'strong a[role="link"]'
  ]) || getFirstText(['h1']) || getFacebookChannelFromTitle(metaTitle);

  return {
    ...PLATFORM_CONFIGS.facebook,
    url: expectedUrl,
    title: cleanTitle(metaTitle) || description.slice(0, 120) || "Facebook post",
    channel: cleanText(channel),
    description
  };
}

function getSubredditFromUrl(value) {
  try {
    const url = new URL(value);
    const match = url.pathname.match(/\/r\/([^/]+)/i);
    return match ? `r/${decodeURIComponent(match[1])}` : "";
  } catch {
    return "";
  }
}

function getRedditData(expectedUrl) {
  if (getCurrentSupportedUrl() !== expectedUrl) {
    return null;
  }

  const post = document.querySelector('shreddit-post') || document.querySelector('[data-testid="post-container"]');
  const title = cleanText(
    post?.getAttribute("post-title") ||
    getFirstText([
      'shreddit-post h1',
      '[data-testid="post-container"] h1',
      'h1',
      '[slot="title"]'
    ]) ||
    getMetaContent('meta[property="og:title"]') ||
    document.title
  );

  const channel = cleanText(
    post?.getAttribute("subreddit-prefixed-name") ||
    getFirstText([
      'shreddit-subreddit-header a[href^="/r/"]',
      'a[href^="/r/"][data-testid="subreddit-name"]',
      'a[href^="/r/"]'
    ]) ||
    getSubredditFromUrl(expectedUrl)
  );

  const description = cleanText(
    post?.getAttribute("content-href") ||
    getFirstText([
      'shreddit-post [slot="text-body"]',
      '[data-testid="post-container"] [data-click-id="text"]',
      '[data-testid="post-container"] div[dir="auto"]',
      '[slot="text-body"]'
    ]) ||
    getMetaContent('meta[property="og:description"]') ||
    getMetaContent('meta[name="description"]')
  );

  return {
    ...PLATFORM_CONFIGS.reddit,
    url: expectedUrl,
    title: cleanTitle(title),
    channel,
    description
  };
}

function getTiktokChannelFromUrl(value) {
  try {
    const url = new URL(value);
    const match = url.pathname.match(/\/(@[^/]+)/);
    return match ? decodeURIComponent(match[1]) : "";
  } catch {
    return "";
  }
}

function getTiktokData(expectedUrl) {
  if (getCurrentSupportedUrl() !== expectedUrl) {
    return null;
  }

  const metaTitle = getMetaContent('meta[property="og:title"]') || getMetaContent('meta[name="title"]') || document.title;
  const description = cleanText(
    getMetaContent('meta[property="og:description"]') ||
    getMetaContent('meta[name="description"]') ||
    getFirstText([
      '[data-e2e="browse-video-desc"]',
      '[data-e2e="video-desc"]',
      'h1[data-e2e="browse-video-desc"]',
      'div[data-e2e="browse-video-desc"]'
    ])
  );

  const channel = cleanText(
    getFirstText([
      '[data-e2e="browse-username"]',
      '[data-e2e="video-author-uniqueid"]',
      'a[href^="/@"] h3',
      'a[href^="/@"]'
    ]) ||
    getTiktokChannelFromUrl(expectedUrl)
  );

  return {
    ...PLATFORM_CONFIGS.tiktok,
    url: expectedUrl,
    title: cleanTitle(metaTitle) || description.slice(0, 120) || "TikTok video",
    channel,
    description
  };
}

function getFreshPageData(expectedUrl) {
  const platform = getPlatform();

  if (platform === "youtube") {
    return getYoutubeData(expectedUrl);
  }

  if (platform === "facebook") {
    return getFacebookData(expectedUrl);
  }

  if (platform === "reddit") {
    return getRedditData(expectedUrl);
  }

  if (platform === "tiktok") {
    return getTiktokData(expectedUrl);
  }

  return null;
}

function isDataUsable(data) {
  if (!data?.url) {
    return false;
  }

  if (data.siteName === PLATFORM_CONFIGS.youtube.siteName) {
    return true;
  }

  return Boolean(data.title);
}

function dataKey(data) {
  return [
    data?.siteName || "",
    data?.baseUrl || "",
    data?.url || "",
    data?.title || "",
    data?.channel || "",
    data?.description || ""
  ].join("|");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPageDataWithRetry(expectedUrl) {
  let lastUsable = null;
  let previousKey = "";
  let stableCount = 0;

  for (let i = 0; i < 28; i += 1) {
    if (getCurrentSupportedUrl() !== expectedUrl) {
      return null;
    }

    const current = getFreshPageData(expectedUrl);

    if (isDataUsable(current)) {
      const key = dataKey(current);

      if (key === previousKey) {
        stableCount += 1;
      } else {
        previousKey = key;
        stableCount = 1;
      }

      lastUsable = current;

      if (stableCount >= 2 && (current.channel || i >= 8)) {
        return current;
      }
    }

    await sleep(300);
  }

  return lastUsable;
}

function checkPage(force = false) {
  const url = getCurrentSupportedUrl();

  if (!url) {
    return;
  }

  if (!force && url === lastDetectedUrl) {
    return;
  }

  lastDetectedUrl = url;
  schedulePageSend(url);
}

function isYoutubeBookmarkUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    return host === "youtube.com" || host === "m.youtube.com";
  } catch {
    return false;
  }
}

function schedulePageSend(url) {
  clearTimeout(pendingSendTimer);

  const isYoutube = isYoutubeBookmarkUrl(url);
  const delayMs = isYoutube ? 1000 : 700;

  pendingSendTimer = setTimeout(async () => {
    const pageData = isYoutube ? getFreshPageData(url) : await getPageDataWithRetry(url);

    if (!pageData || getCurrentSupportedUrl() !== url) {
      return;
    }

    const key = dataKey(pageData);
    if (key === lastSentPayloadKey) {
      return;
    }

    lastSentPayloadKey = key;

    chrome.runtime.sendMessage({
      type: "BOOKMARK_PAGE_CHANGED",
      ...pageData
    });
  }, delayMs);
}

function patchHistoryMethod(methodName) {
  const original = history[methodName];

  history[methodName] = function patchedHistoryMethod(...args) {
    const result = original.apply(this, args);
    window.dispatchEvent(new Event("extension-location-change"));
    return result;
  };
}

function showApiMessageToast(message) {
  if (!message) {
    return;
  }

  let toast = document.getElementById("bookmarkai-url-sync-message-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "bookmarkai-url-sync-message-toast";
    toast.setAttribute("role", "alert");
    toast.style.position = "fixed";
    toast.style.top = "18px";
    toast.style.right = "18px";
    toast.style.zIndex = "2147483647";
    toast.style.width = "min(360px, calc(100vw - 36px))";
    toast.style.padding = "13px 15px";
    toast.style.border = "1px solid #5a2b30";
    toast.style.borderRadius = "8px";
    toast.style.background = "#17191f";
    toast.style.color = "#fee2e2";
    toast.style.boxShadow = "0 18px 48px rgba(0, 0, 0, 0.48)";
    toast.style.font = "650 14px/1.4 system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    toast.style.overflowWrap = "anywhere";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-8px)";
    toast.style.transition = "opacity 160ms ease, transform 160ms ease";
    document.documentElement.appendChild(toast);
  }

  toast.textContent = message;

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-8px)";
  }, 7000);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "REQUEST_CURRENT_PAGE_DATA") {
    (async () => {
      const url = getCurrentSupportedUrl();

      if (!url) {
        sendResponse({ ok: false, url: "", pageData: null });
        return;
      }

      const pageData = isYoutubeBookmarkUrl(url)
        ? getFreshPageData(url)
        : await getPageDataWithRetry(url);

      sendResponse({
        ok: Boolean(pageData),
        url,
        pageData
      });
    })();

    return true;
  }

  if (message?.type === "REQUEST_CURRENT_PAGE" || message?.type === "REQUEST_CURRENT_VIDEO") {
    const url = getCurrentSupportedUrl();

    if (url) {
      schedulePageSend(url);
    }

    sendResponse({ ok: true, url });
    return true;
  }

  if (message?.type === "SHOW_API_MESSAGE") {
    showApiMessageToast(message.message || "Request failed");
    sendResponse({ ok: true });
    return true;
  }

  return false;
});

patchHistoryMethod("pushState");
patchHistoryMethod("replaceState");

window.addEventListener("extension-location-change", () => setTimeout(checkPage, 350));
window.addEventListener("popstate", () => setTimeout(checkPage, 350));
window.addEventListener("yt-navigate-finish", () => setTimeout(checkPage, 350));
window.addEventListener("yt-page-data-updated", () => setTimeout(checkPage, 350));
window.addEventListener("pageshow", () => setTimeout(checkPage, 350));

const observer = new MutationObserver(() => {
  setTimeout(checkPage, 250);
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    setTimeout(checkPage, 350);
  }
});

setInterval(checkPage, 1200);
checkPage();
