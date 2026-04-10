
# 📱 WhatsApp Web Session Keeper

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A persistent WhatsApp Web session manager that delivers QR codes via Telegram for seamless re‑authentication. Built to maintain long‑lived connections even after forced logouts (though recent regulations have relaxed the 6‑hour rule).

## ✨ Features

- 🔁 **Auto‑Reconnect** – Detects disconnections and automatically re‑initializes the client.
- 🤖 **Telegram Integration** – Sends a clean PNG QR code to your Telegram bot for easy scanning.
- ⏱️ **QR Auto‑Refresh** – Generates a fresh QR every 30 seconds if not scanned.
- ✅ **Success Notification** – Sends a cheerful confirmation message once connected.
- 💾 **Persistent Session** – Saves WhatsApp login state to a Docker volume, surviving restarts.
- 🐳 **Dockerized** – Runs reliably on Railway (or any Docker host) with all Chromium dependencies pre‑installed.
- 🔒 **Secure** – Uses environment variables for tokens (never committed to code).

## 🛠️ Tech Stack

| Component       | Technology |
| :-------------- | :--------- |
| Runtime         | Node.js 22 |
| WhatsApp Client | [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) |
| Browser Engine  | Puppeteer (Chromium) |
| QR Generation   | `qrcode` |
| Notifications   | Telegram Bot API (`axios` + `form-data`) |
| Deployment      | Railway / Docker |

## 📁 Project Structure

├── Dockerfile # Container with Chromium & dependencies

├── .dockerignore # Excludes local session data from image

├── .gitignore # Prevents committing node_modules & sessions

├── index.js # Main bot logic

├── package.json # Dependencies & npm scripts

└── README.md # You are here!



## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Telegram Bot](https://core.telegram.org/bots#6-botfather) (for receiving QR codes)
- A Railway account (or any Docker‑compatible host)

### 1. Create a Telegram Bot

1. Open Telegram and search for **@BotFather**.
2. Send `/newbot` and follow the prompts.
3. Save the **token** you receive.
4. Start a chat with your new bot and send `/start`.
5. Visit `https://api.telegram.org/bot<TOKEN>/getUpdates` to find your **chat ID**.

### 2. Local Setup (Optional)

```bash
git clone https://github.com/yourusername/whatsapp-session-keeper.git

cd whatsapp-session-keeper

npm install



Create a .env file (never commit it!):

TELEGRAM_TOKEN=your_bot_token

TELEGRAM_CHAT_ID=your_chat_id

Run locally:

npm start

3. Deploy to Railway

1.Push this repository to GitHub.
2.On Railway, create a New Project → Deploy from GitHub repo.
3.Railway will auto‑detect the Dockerfile.
4.Add a Volume: Mount path /data (1 GB) to persist the WhatsApp session.
5.Add Environment Variables:

Variable	          Description

TELEGRAM_TOKEN	    Your Telegram Bot token
TELEGRAM_CHAT_ID	Your personal Telegram chat ID

6.Deploy! The logs will show a QR code sent to your Telegram bot.

7.Scan the QR with WhatsApp (Linked Devices) – you'll receive a success message when connected.


🤔 How It Works


1.The bot launches a headless Chromium instance and navigates to WhatsApp Web.

2.A QR code is generated and sent to your Telegram chat as a PNG image.

3.After scanning, the session is saved to /data/session (persistent volume).

4.If the session expires or disconnects, the bot automatically re‑authenticates using the saved session.

5.A new QR is only sent if the saved session is invalid.

⚙️ Environment Variables

Variable	      Required	   Description

TELEGRAM_TOKEN	    Yes  	Token from BotFather
TELEGRAM_CHAT_ID	Yes	    Your Telegram user ID
CHROME_BIN	        No	    Path to Chromium (defaults to /usr/bin/chromium)


🔧 Customization
QR Refresh Interval: Change QR_TIMEOUT_MS in index.js (default 30 seconds).

Success Message: Edit the successMsg string inside the ready event.

⚠️ Important Notes
Educational Use Only – This project is for learning purposes. Automating personal WhatsApp accounts may violate WhatsApp's Terms of Service.

Session Security – The .wwebjs_auth folder contains sensitive tokens. It is excluded from Git and stored only on your private volume.

Telegram Privacy – Keep your TELEGRAM_TOKEN and CHAT_ID secret. Use Railway environment variables.

Indian Regulations (2026) – The mandatory 6‑hour logout rule has been removed, making long‑lived sessions easier. SIM‑binding compliance is still expected by December 2026.

📜 License

This project is licensed under the MIT License – see the LICENSE file for details.

🙏 Acknowledgements

pedroslopez/whatsapp-web.js
Railway
Telegram Bot API

7. LICENSE (MIT)

MIT License

Copyright (c) 2026 Littleboyhk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

<p align="center"> Made with ❤️ for educational exploration </p>
