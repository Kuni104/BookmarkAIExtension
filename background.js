// ====== CONFIGURATION ======
const IS_PRODUCTION = true; // Set to true to use your live secure server!

const LOCAL_API = "https://localhost:7224/api/Bookmark/video/save";
const PROD_API  = "https://bookmarkai.site/api/Bookmark/video/save";

const API_URL = IS_PRODUCTION ? PROD_API : LOCAL_API;
const CODE_PATTERN = /^[A-Za-z0-9]{4}-\d{6}$/;
const DEFAULT_SEND_MODE = "auto";
// ===========================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const url = message?.url || message?.link || "";

  if ((message?.type === "BOOKMARK_PAGE_CHANGED" || message?.type === "YOUTUBE_VIDEO_CHANGED") && url) {
    handleBookmarkPage(
      {
        siteName: message.siteName || "Youtube",
        baseUrl: message.baseUrl || "youtube.com",
        url,
        title: message.title || message.videoName || "",
        channel: message.channel || "",
        description: message.description || ""
      },
      sender?.tab?.id
    );
  }

  if (message?.type === "CODE_SAVED") {
    handleCodeSaved().then(() => sendResponse({ ok: true }));
    return true;
  }

  if (message?.type === "ACTIVE_CHANGED") {
    handleActiveChanged(Boolean(message.active)).then(() => sendResponse({ ok: true }));
    return true;
  }

  if (message?.type === "SEND_MODE_CHANGED") {
    handleSendModeChanged(message.mode).then(() => sendResponse({ ok: true }));
    return true;
  }

  if (message?.type === "MANUAL_SEND_CURRENT_PAGE") {
    handleManualSendCurrentPage().then(sendResponse);
    return true;
  }

  return false;
});

async function handleBookmarkPage(pageData, tabId) {
  const { extensionCode, lastSentLink, extensionActive, sendMode } = await chrome.storage.local.get([
    "extensionCode",
    "lastSentLink",
    "extensionActive",
    "sendMode"
  ]);

  const effectiveSendMode = normalizeSendMode(sendMode);

  if (extensionActive === false) {
    await chrome.storage.local.set({
      lastSyncStatus: "inactive",
      lastSyncError: "",
      lastApiMessage: ""
    });
    await clearBadge();
    return;
  }

  if (!CODE_PATTERN.test(extensionCode || "")) {
    await chrome.storage.local.set({
      latestLink: "",
      latestLinkSavedAt: "",
      lastSyncStatus: "waiting_for_code",
      lastSyncError: "",
      lastApiMessage: ""
    });
    await clearBadge();
    return;
  }

  if (effectiveSendMode === "auto" && lastSentLink === pageData.url) {
    return;
  }

  await chrome.storage.local.set({
    latestLink: pageData.url,
    latestLinkSavedAt: new Date().toISOString()
  });

  if (effectiveSendMode === "manual") {
    await chrome.storage.local.set({
      lastSyncStatus: "manual_ready",
      lastSyncError: "",
      lastApiMessage: ""
    });
    await clearBadge();
    return;
  }

  await sendBookmark(extensionCode, pageData, tabId);
}

async function handleCodeSaved() {
  const { extensionCode, extensionActive } = await chrome.storage.local.get([
    "extensionCode",
    "extensionActive"
  ]);

  if (extensionActive === false) {
    await chrome.storage.local.set({
      lastSyncStatus: "inactive",
      lastSyncError: "",
      lastApiMessage: ""
    });
    await clearBadge();
    return;
  }

  if (!CODE_PATTERN.test(extensionCode || "")) {
    await chrome.storage.local.set({
      latestLink: "",
      latestLinkSavedAt: "",
      lastSyncStatus: "waiting_for_code",
      lastSyncError: "",
      lastApiMessage: ""
    });
    await clearBadge();
    return;
  }

  await askSupportedTabsForCurrentPage();
}

async function handleActiveChanged(active) {
  if (!active) {
    await chrome.storage.local.set({
      lastSyncStatus: "inactive",
      lastSyncError: "",
      lastApiMessage: ""
    });
    await clearBadge();
    return;
  }

  await chrome.storage.local.set({
    lastSyncStatus: "ready",
    lastSyncError: "",
    lastApiMessage: ""
  });
  await clearBadge();
  await askSupportedTabsForCurrentPage();
}

async function handleSendModeChanged(mode) {
  const sendMode = normalizeSendMode(mode);

  await chrome.storage.local.set({
    sendMode,
    lastSyncStatus: sendMode === "manual" ? "manual_ready" : "ready",
    lastSyncError: "",
    lastApiMessage: ""
  });

  await clearBadge();
  await askSupportedTabsForCurrentPage();
}

async function handleManualSendCurrentPage() {
  const { extensionCode, extensionActive } = await chrome.storage.local.get([
    "extensionCode",
    "extensionActive"
  ]);

  if (extensionActive === false) {
    await chrome.storage.local.set({ lastSyncStatus: "inactive" });
    return { ok: false, message: "Extension is inactive." };
  }

  if (!CODE_PATTERN.test(extensionCode || "")) {
    await chrome.storage.local.set({
      latestLink: "",
      latestLinkSavedAt: "",
      lastSyncStatus: "waiting_for_code",
      lastSyncError: "",
      lastApiMessage: ""
    });
    await clearBadge();
    return { ok: false, message: "Save code first." };
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id || !isSupportedTabUrl(tab.url || "")) {
    await chrome.storage.local.set({
      lastSyncStatus: "manual_ready",
      lastSyncError: "",
      lastApiMessage: ""
    });
    return { ok: false, message: "Open a supported page first." };
  }

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: "REQUEST_CURRENT_PAGE_DATA" });
    const pageData = response?.pageData;

    if (!pageData?.url) {
      return { ok: false, message: "No supported link detected." };
    }

    await chrome.storage.local.set({
      latestLink: pageData.url,
      latestLinkSavedAt: new Date().toISOString()
    });

    return await sendBookmark(extensionCode, pageData, tab.id);
  } catch (error) {
    const message = error?.message || "Cannot read current page.";
    await saveAndShowError(message, tab.id);
    return { ok: false, message };
  }
}

async function askSupportedTabsForCurrentPage() {
  const tabs = await chrome.tabs.query({
    url: [
      "https://www.youtube.com/*",
      "https://youtube.com/*",
      "https://m.youtube.com/*",
      "https://www.facebook.com/*",
      "https://facebook.com/*",
      "https://m.facebook.com/*",
      "https://web.facebook.com/*",
      "https://www.reddit.com/*",
      "https://reddit.com/*",
      "https://old.reddit.com/*",
      "https://new.reddit.com/*",
      "https://www.tiktok.com/*",
      "https://tiktok.com/*",
      "https://m.tiktok.com/*"
    ]
  });

  for (const tab of tabs) {
    if (!tab.id) {
      continue;
    }

    try {
      await chrome.tabs.sendMessage(tab.id, { type: "REQUEST_CURRENT_PAGE" });
    } catch {}
  }
}

async function sendBookmark(extensionCode, pageData, tabId) {
  await chrome.storage.local.set({
    lastSyncStatus: "sending",
    lastSyncError: "",
    lastApiMessage: ""
  });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildRequestBody(extensionCode, pageData))
    });

    const responseText = await response.text();

    if (response.status !== 200) {
      const serverMessage = getServerMessage(responseText) || response.statusText || `HTTP ${response.status}`;
      await saveAndShowError(serverMessage, tabId);
      return { ok: false, message: serverMessage };
    }

    await chrome.storage.local.set({
      lastSentLink: pageData.url,
      lastSyncedAt: new Date().toISOString(),
      lastSyncStatus: "sent",
      lastSyncError: "",
      lastApiMessage: ""
    });

    await clearBadge();
    return { ok: true, url: pageData.url };
  } catch (error) {
    const message = error?.message || "Request failed";
    await saveAndShowError(message, tabId);
    return { ok: false, message };
  }
}

async function saveAndShowError(message, tabId) {
  await chrome.storage.local.set({
    lastSyncStatus: "failed",
    lastSyncError: message,
    lastApiMessage: message,
    lastApiMessageAt: new Date().toISOString(),
    lastSyncedAt: new Date().toISOString()
  });

  await showUserMessage(message, tabId);
}

async function showUserMessage(message, tabId) {
  await setErrorBadge();
  await showChromeNotification(message);

  if (!tabId) {
    return;
  }

  try {
    await chrome.tabs.sendMessage(tabId, {
      type: "SHOW_API_MESSAGE",
      message
    });
  } catch {}
}

async function showChromeNotification(message) {
  try {
    await chrome.notifications.create(`bookmarkai-url-sync-${Date.now()}`, {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "BookmarkAI Url Sync",
      message: message || "Request failed",
      priority: 2
    });
  } catch {}
}

async function setErrorBadge() {
  try {
    await chrome.action.setBadgeText({ text: "!" });
    await chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
  } catch {}
}

async function clearBadge() {
  try {
    await chrome.action.setBadgeText({ text: "" });
  } catch {}
}

function normalizeSendMode(value) {
  return value === "manual" ? "manual" : DEFAULT_SEND_MODE;
}

function isSupportedTabUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    return (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "facebook.com" ||
      host === "m.facebook.com" ||
      host === "web.facebook.com" ||
      host === "reddit.com" ||
      host === "old.reddit.com" ||
      host === "new.reddit.com" ||
      host === "tiktok.com" ||
      host === "m.tiktok.com"
    );
  } catch {
    return false;
  }
}

function buildRequestBody(extensionCode, pageData) {
  const body = {
    ExtensionCode: extensionCode,
    SiteName: cleanText(pageData.siteName),
    BaseUrl: cleanText(pageData.baseUrl),
    Url: cleanText(pageData.url)
  };

  if (body.SiteName !== "Youtube") {
    body.Title = cleanText(pageData.title);
    body.Channel = cleanText(pageData.channel);
    body.Description = cleanText(pageData.description);
  }

  return body;
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function getServerMessage(text) {
  if (!text) {
    return "";
  }

  const trimmed = text.trim();

  try {
    const parsed = JSON.parse(trimmed);
    return extractMessage(parsed) || JSON.stringify(parsed);
  } catch {
    return trimmed;
  }
}

function extractMessage(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(extractMessage).filter(Boolean).join(" ");
  }

  if (typeof value !== "object") {
    return String(value);
  }

  const directMessage = value.message ?? value.Message ?? value.error ?? value.Error ?? value.title ?? value.Title;
  if (directMessage) {
    return extractMessage(directMessage);
  }

  if (value.errors || value.Errors) {
    return extractMessage(value.errors || value.Errors);
  }

  for (const nestedKey of ["data", "Data", "result", "Result", "response", "Response"]) {
    const nestedMessage = extractMessage(value[nestedKey]);
    if (nestedMessage) {
      return nestedMessage;
    }
  }

  return "";
}
