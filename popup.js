const CODE_PATTERN = /^[A-Za-z0-9]{4}-\d{6}$/;

const input = document.getElementById("extensionCode");
const button = document.getElementById("saveEditButton");
const codeMessage = document.getElementById("codeMessage");
const latestLink = document.getElementById("latestLink");
const savedAt = document.getElementById("savedAt");
const syncStatus = document.getElementById("syncStatus");
const copyButton = document.getElementById("copyButton");
const apiMessageCard = document.getElementById("apiMessageCard");
const apiMessage = document.getElementById("apiMessage");
const activeToggle = document.getElementById("activeToggle");
const activeText = document.getElementById("activeText");
const openWebsiteButton = document.getElementById("openWebsiteButton");

let isLocked = false;

init();

input.addEventListener("input", () => {
  if (!isLocked) {
    input.value = formatCode(input.value);
    clearMessage();
  }
});

button.addEventListener("click", async () => {
  if (isLocked) {
    unlockCode();
    return;
  }

  const code = formatCode(input.value);
  input.value = code;

  if (!CODE_PATTERN.test(code)) {
    showMessage("Please enter a valid code.", "error");
    return;
  }

  await chrome.storage.local.set({ extensionCode: code, lastApiMessage: "", lastApiMessageAt: "" });
  lockCode();
  showMessage("Code saved.", "success");
  chrome.runtime.sendMessage({ type: "CODE_SAVED" });
});

activeToggle.addEventListener("change", async () => {
  const active = activeToggle.checked;
  await chrome.storage.local.set({ extensionActive: active });
  updateActiveUi(active);

  chrome.runtime.sendMessage({
    type: "ACTIVE_CHANGED",
    active
  });
});

openWebsiteButton.addEventListener("click", () => {
  chrome.tabs.create({ url: "http://localhost:54343" });
});

copyButton.addEventListener("click", async () => {
  const link = latestLink.dataset.link || "";

  if (!link) {
    return;
  }

  await navigator.clipboard.writeText(link);
  copyButton.textContent = "Copied";
  setTimeout(() => {
    copyButton.textContent = "Copy";
  }, 1200);
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  if (changes.latestLink || changes.latestLinkSavedAt || changes.extensionCode) {
    loadLatestLink();
  }

  if (changes.lastSyncStatus || changes.lastSyncError || changes.extensionActive) {
    loadStatus();
  }

  if (changes.extensionActive) {
    updateActiveUi(changes.extensionActive.newValue !== false);
  }

  if (changes.lastApiMessage || changes.lastApiMessageAt) {
    loadApiMessage();
  }
});

async function init() {
  const { extensionCode, extensionActive } = await chrome.storage.local.get([
    "extensionCode",
    "extensionActive"
  ]);

  updateActiveUi(extensionActive !== false);

  if (CODE_PATTERN.test(extensionCode || "")) {
    input.value = extensionCode;
    lockCode();
  }

  await loadLatestLink();
  await loadStatus();
  await loadApiMessage();
}

function formatCode(value) {
  const raw = value.replace(/[^A-Za-z0-9]/g, "");
  let prefix = "";
  let digits = "";

  for (const char of raw) {
    if (prefix.length < 4 && /[A-Za-z0-9]/.test(char)) {
      prefix += char;
      continue;
    }

    if (prefix.length === 4 && digits.length < 6 && /\d/.test(char)) {
      digits += char;
    }
  }

  return digits ? `${prefix}-${digits}` : prefix;
}

function lockCode() {
  isLocked = true;
  input.readOnly = true;
  input.classList.add("locked");
  button.textContent = "Edit";
}

function unlockCode() {
  isLocked = false;
  input.readOnly = false;
  input.classList.remove("locked");
  button.textContent = "Save";
  showMessage("", "");
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

async function loadLatestLink() {
  const { extensionCode, latestLink: link, latestLinkSavedAt } = await chrome.storage.local.get([
    "extensionCode",
    "latestLink",
    "latestLinkSavedAt"
  ]);

  if (!CODE_PATTERN.test(extensionCode || "")) {
    setEmptyLink("Save code first");
    return;
  }

  if (!link) {
    setEmptyLink("No link detected yet");
    return;
  }

  latestLink.textContent = link;
  latestLink.href = link;
  latestLink.dataset.link = link;
  latestLink.classList.remove("empty");
  copyButton.disabled = false;
  savedAt.textContent = latestLinkSavedAt ? `Saved ${formatDate(latestLinkSavedAt)}` : "";
}

function setEmptyLink(text) {
  latestLink.textContent = text;
  latestLink.href = "#";
  latestLink.dataset.link = "";
  latestLink.classList.add("empty");
  copyButton.disabled = true;
  savedAt.textContent = "";
}

async function loadStatus() {
  const { lastSyncStatus, lastSyncError, extensionActive } = await chrome.storage.local.get([
    "lastSyncStatus",
    "lastSyncError",
    "extensionActive"
  ]);

  if (extensionActive === false) {
    syncStatus.textContent = "Inactive";
    return;
  }

  if (lastSyncStatus === "sent") {
    syncStatus.textContent = "Synced";
    return;
  }

  if (lastSyncStatus === "sending") {
    syncStatus.textContent = "Sending";
    return;
  }

  if (lastSyncStatus === "failed") {
    syncStatus.textContent = lastSyncError || "Failed";
    return;
  }

  if (lastSyncStatus === "waiting_for_code") {
    syncStatus.textContent = "Code needed";
    return;
  }

  if (lastSyncStatus === "inactive") {
    syncStatus.textContent = "Inactive";
    return;
  }

  syncStatus.textContent = "Ready";
}

function updateActiveUi(active) {
  activeToggle.checked = active;
  activeText.textContent = active ? "Active" : "Inactive";
}

async function loadApiMessage() {
  const { lastApiMessage } = await chrome.storage.local.get("lastApiMessage");

  if (!lastApiMessage) {
    apiMessageCard.classList.add("hidden");
    apiMessage.textContent = "";
    return;
  }

  apiMessage.textContent = lastApiMessage;
  apiMessageCard.classList.remove("hidden");
}

function showMessage(text, type) {
  codeMessage.textContent = text;
  codeMessage.className = `message ${type || ""}`.trim();
}

function clearMessage() {
  showMessage("", "");
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
