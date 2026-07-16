# BookmarkAI URL Sync Extension

## RELEASE VERSION #1.0

BookmarkAI URL Sync is a browser extension designed to synchronize URLs from your browser with the BookmarkAI system. This extension is installed directly from the local source code instead of the Chrome Web Store.

The extension allows users to save and send information about the currently viewed webpage to the BookmarkAI backend using an Extension Code. When users visit supported platforms such as YouTube, Facebook, Reddit, or TikTok, the extension automatically detects the current URL and sends it to the system for bookmark storage, video management, playlist organization, and future content retrieval.

 <a href="https://www.producthunt.com/products/bookmarkai?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-bookmarkai" target="_blank" rel="noopener noreferrer"><img alt="Bookmarkai - visual Chrome extension to bookmark &amp; organize YouTube links | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1197128&amp;theme=neutral&amp;t=1784183065985"></a>
 
---

# 1. Prerequisites

Before installing the extension, make sure you have:

* A Chromium-based browser, such as:

  * Google Chrome
  * Microsoft Edge
  * Brave
  * Cốc Cốc
* The project source code downloaded to your computer.
* A valid **Extension Code** provided by the BookmarkAI system.

Extension Code format:

```text
xxxx-123456
```

Where:

* `xxxx`: The first 4 characters, which can be letters or numbers.
* `123456`: The last 6 digits.

Example:

```text
a1b2-123456
```

---

# 2. Installing the Extension Locally

## Step 1: Download the Source Code

Download the project source code to your computer.

If the source code is provided as a `.zip` file, save it to an easy-to-find location, for example:

```text
Downloads
Desktop
D:\Projects
```

---

## Step 2: Extract the ZIP File

Right-click the `.zip` file and choose:

```text
Extract All...
```

or

```text
Extract Here
```

After extraction, the project will contain the extension folder.

For this project, the extension folder is:

```text
bookmarkai-url-sync-extension-v25
```

**Note:** When loading the extension, make sure you select the folder that contains the `manifest.json` file.

---

## Step 3: Open the Browser Extension Management Page

Open your browser and navigate to the Extensions Management page.

For Google Chrome:

Method 1:

```text
Three-dot Menu → Extensions → Manage Extensions
```

Method 2:

Enter the following URL into the address bar:

```text
chrome://extensions/
```

For Microsoft Edge:

```text
edge://extensions/
```

For Brave:

```text
brave://extensions/
```

For Cốc Cốc:

```text
coccoc://extensions/
```

---

## Step 4: Enable Developer Mode

On the Extensions page, enable:

```text
Developer mode
```

Depending on your browser, this switch is usually located in the top-right or top-left corner.

After enabling Developer Mode, additional developer options will appear, including:

```text
Load unpacked
```

---

## Step 5: Load the Extension

Click:

```text
Load unpacked
```

Then select the extracted extension folder:

```text
bookmarkai-url-sync-extension-v25
```

**Important:** Select only the extension folder—not the entire backend project if it contains multiple folders.

The selected folder **must** contain:

```text
manifest.json
```

If everything is correct, the extension will appear in your browser with the name:

```text
BookmarkAI URL Sync
```

---

## Step 6: Pin the Extension

After successfully loading the extension, click the Extensions icon in your browser.

If the extension is not visible on the toolbar:

1. Click the Extensions (puzzle) icon.
2. Find **BookmarkAI URL Sync**.
3. Click the Pin icon.

Pinning the extension allows quick access whenever you need to enter your Extension Code or check the synchronization status.

---

# 3. How to Use the Extension

## Step 1: Open the Extension

Click the **BookmarkAI URL Sync** icon on your browser toolbar.

The popup interface includes:

* Extension status
* Extension Code input field
* Save/Edit button
* Latest detected URL
* Copy Link button
* Go to Web button

---

## Step 2: Enter Your Extension Code

Enter the Extension Code provided by the BookmarkAI system into the:

```text
Extension Code
```

field.

Example:

```text
a1b2-123456
```

Then click:

```text
Save
```

If the code is valid, it will be saved locally in the browser. After saving, the input field will be locked to prevent accidental modifications.

To change the Extension Code:

1. Click:

```text
Edit
```

2. Enter the new code.
3. Click:

```text
Save
```

---

## Step 3: Enable Active Status

The extension popup includes a toggle switch.

When enabled, the extension status will display:

```text
Active
```

If the extension is turned off, it will stop sending webpage information to the backend.

---

## Step 4: Visit a Supported Platform

After entering a valid Extension Code and enabling the extension, visit one of the supported platforms, for example:

```text
YouTube
Facebook
Reddit
TikTok
```

Whenever you open or navigate to new content, the extension automatically detects the current URL and sends it to the BookmarkAI API.

---

## Step 5: Check the Latest Detected Link

The popup contains a section called:

```text
Latest Link
```

This displays the most recent URL detected by the extension.

Click:

```text
Copy
```

to copy the URL to your clipboard.

---

## Step 6: Open the BookmarkAI Website

The extension also provides a button:

```text
Go to Web
```

Clicking this button opens the local BookmarkAI website:

```text
https://bookmarkai.site/
```

From there, users can log in, view saved bookmarks and videos, manage playlists, and access their account information.

---

# 4. Notes

* This extension is installed from local source code and is **not** distributed through the Chrome Web Store.
* If your browser displays a warning about Developer Mode extensions, this is expected behavior for locally installed extensions.
* Do not delete or move the extension folder after installation. Otherwise, the extension may stop working.
* After modifying the extension source code, go to the Extensions page and click **Reload** to load the latest changes.
* The backend server must be running with the correct API configuration for synchronization to work.
* If the Extension Code is invalid or does not exist in the system, synchronization will fail.

---

# 5. Project Overview

BookmarkAI is a platform designed to help users save and organize content they discover on the Internet, especially videos and articles from popular online platforms. Instead of manually saving URLs, users can rely on the browser extension to automatically send webpage URLs to the BookmarkAI system. The backend then processes the data and associates it with the appropriate user account using the Extension Code.

The project is built using a Backend API architecture integrated with a browser extension. The backend manages user authentication, videos, tags, playlists, bookmarks, premium subscriptions, and dashboard analytics. The extension serves as a bridge between the user's browser and the BookmarkAI system, making content collection fast and seamless.

One of the system's key features is video and playlist management. Users can save videos, search them by title or tag, organize videos into playlists, and manage their personal collections. The system also supports automatic playlist generation based on tags, helping users categorize and retrieve content more efficiently.

In addition, the platform includes role-based access control for both users and administrators. Regular users can manage their profiles, Extension Codes, bookmarks, and playlists, while administrators have access to user management, video management, tag management, and system analytics through an administrative dashboard. This architecture makes BookmarkAI suitable for both personal use and large-scale content management.

BookmarkAI aims to save users time by simplifying content collection and retrieval. With the locally installed extension, developers and testers can quickly verify URL synchronization functionality in a development environment without publishing the extension to the Chrome Web Store.

---

# 6. Common Issues

## "Load unpacked" Button Is Missing

**Cause**

Developer Mode has not been enabled.

**Solution**

```text
Open the Extensions page → Enable Developer Mode
```

---

## Manifest Error When Loading the Extension

**Cause**

The wrong folder was selected.

**Solution**

Select the folder that contains:

```text
manifest.json
```

For this project, the correct folder is:

```text
bookmarkai-url-sync-extension-v25
```

---


---

## The Extension Still Uses the Old Code

**Solution**

1. Open the extension popup.
2. Click **Edit**.
3. Enter the new Extension Code.
4. Click **Save**.
5. Refresh the current webpage if necessary.

---

# 7. Release Notes for Version 1.0

This release is intended for local installation and testing purposes. Users do not need to download the extension from the Chrome Web Store. Simply download the project source code, extract it, enable Developer Mode, and load the extension folder into a Chromium-based browser.

This version is suitable for development, demonstrations, and testing the URL synchronization workflow between the browser extension and the BookmarkAI backend.

