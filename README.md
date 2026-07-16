# BookmarkAI URL Sync Extension

## RELEASE VERSION #1.0

BookmarkAI URL Sync is a browser extension designed to synchronize URLs from your browser with the BookmarkAI system. This extension is installed directly from the local source code instead of the Chrome Web Store.

The extension allows users to save and send information about the currently viewed webpage to the BookmarkAI backend using an Extension Code. When users visit supported platforms such as YouTube, Facebook, Reddit, or TikTok, the extension automatically detects the current URL and sends it to the system for bookmark storage, video management, playlist organization, and future content retrieval.

 <a href="https://www.producthunt.com/products/bookmarkai?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-bookmarkai" target="_blank" rel="noopener noreferrer"><img alt="Bookmarkai - visual Chrome extension to bookmark &amp; organize YouTube links | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1197128&amp;theme=neutral&amp;t=1784183065985"></a>

INSTALLING INSTRUCTION BELOW
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
<img width="1677" height="745" alt="Screenshot 2026-07-16 132843" src="https://github.com/user-attachments/assets/a9af4eed-e93d-4d3a-98e2-0e22664c101d" />

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
BookmarkAIExtension or BookmarkAIExtension-main
```

**Note:** When loading the extension, make sure you select the folder that contains the `manifest.json` file.

---

## Step 3: Open the Browser Extension Management Page
<p align="center">
  <a href="https://www.youtube.com/watch?v=gPOC7OaPcAA" target="_blank">
    <img src="https://youtube.com" alt="Watch how to enable Developer Mode" width="600">
  </a>
</p>


Open your browser and navigate to the Extensions Management page.

For Google Chrome:

Method 1:
<img width="508" height="443" alt="image" src="https://github.com/user-attachments/assets/c390f1bc-7faa-4f77-8bf3-3a83a379f955" />

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
<img width="1778" height="141" alt="image" src="https://github.com/user-attachments/assets/cc4bc73b-7609-4787-b2db-38a37073a1ed" />
```text
Developer mode
```

Depending on your browser, this switch is usually located in the top-right or top-left corner.

After enabling Developer Mode, additional developer options will appear, including:
<img width="1805" height="124" alt="image" src="https://github.com/user-attachments/assets/a331eeb9-b6b1-46e3-9578-bc6db36a8df0" />

```text
Load unpacked
```

---

## Step 5: Load the Extension
[![Watch how to load an unpacked extension](https://youtube.com)](https://www.youtube.com/watch?v=xiT8c8M1OIw)

Click:

```text
Load unpacked
```

Then select the extracted extension folder:

```text
BookmarkAIExtension or BookmarkAIExtension-main
```

**Important:** Select only the extension folder which is BookmarkAIExtension or BookmarkAIExtension-main .
<img width="1070" height="492" alt="image" src="https://github.com/user-attachments/assets/af91ea66-ac7f-466c-b0ba-1f7dafb4dc1b" />
In this picture when you click extract all it creates 2 folders 
Remember the selected file should have the selected folder **must** contain manifest.json file:

If everything is correct, the extension will appear in your browser with the name:

```text
BookmarkAI URL Sync
```

---

## Step 6: Pin the Extension

After successfully loading the extension, click the Extensions icon in your browser.

If the extension is not visible on the toolbar:

1. Click the Extensions (puzzle) icon<img width="46" height="58" alt="image" src="https://github.com/user-attachments/assets/97acc9f3-6b11-43a9-85f9-392432ecf0e9" />.
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
<img width="345" height="250" alt="image" src="https://github.com/user-attachments/assets/b8bec979-da4e-4417-9c44-e1afa9122af8" />

When enabled, the extension status will display:

```text
Active
```

If the extension is turned off, it will stop sending webpage information to the Server.

---

## Step 4: Visit a Supported Platform

After entering a valid Extension Code and enabling the extension, visit one of the supported platforms, for example:

```text
YouTube
Facebook(Will develop in the future)
Reddit(Will develop in the future)
TikTok(Will develop in the future)
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
BookmarkAIExtension or BookmarkAIExtension-main
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

