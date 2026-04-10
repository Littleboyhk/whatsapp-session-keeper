const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const axios = require('axios');
const FormData = require('form-data');

// --- Prevent Node from exiting on unhandled rejections ---
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

// --- Environment variables (set on deployment platform) ---
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const QR_TIMEOUT_MS = 30000; // 30 seconds

let client;
let qrTimeout;
let isAuthenticated = false;

// --- Send plain text message to Telegram ---
async function sendTelegramMessage(text) {
    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: 'HTML'
        }, { timeout: 10000 });
        console.log('📨 Telegram message sent');
        return true;
    } catch (error) {
        console.error('❌ Failed to send Telegram message:', error.message);
        return false;
    }
}

// --- Send QR image to Telegram ---
async function sendQRToTelegram(qrString) {
    try {
        const qrBuffer = await qrcode.toBuffer(qrString, { scale: 8 });
        const form = new FormData();
        form.append('chat_id', TELEGRAM_CHAT_ID);
        form.append('photo', qrBuffer, { filename: 'whatsapp-qr.png' });

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, form, {
            headers: form.getHeaders(),
            timeout: 10000
        });

        console.log('✅ QR code image sent to Telegram!');
        return true;
    } catch (error) {
        console.error('❌ Failed to send QR to Telegram:', error.message);
        return false;
    }
}

// --- Client Factory ---
function createClient() {
    if (client) {
        try { client.destroy(); } catch (e) {}
    }

    if (qrTimeout) {
        clearTimeout(qrTimeout);
        qrTimeout = null;
    }

    client = new Client({
        authStrategy: new LocalAuth({ dataPath: '/data/session' }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ],
            executablePath: process.env.CHROME_BIN || '/usr/bin/chromium'
        }
    });

    client.on('qr', async (qr) => {
        console.log('📱 QR code received. Sending to Telegram...');
        qrcode.toString(qr, { type: 'terminal', small: true }, (err, ascii) => {
            if (!err) console.log(ascii);
        });

        await sendQRToTelegram(qr).catch(e => console.error('Telegram send error:', e));

        qrTimeout = setTimeout(() => {
            if (!isAuthenticated) {
                console.log('⏰ QR code expired. Requesting fresh QR...');
                createClient();
                client.initialize();
            }
        }, QR_TIMEOUT_MS);
    });

    client.on('authenticated', () => {
        console.log('🔐 Authentication successful! Session saved.');
        isAuthenticated = true;
        if (qrTimeout) {
            clearTimeout(qrTimeout);
            qrTimeout = null;
        }
    });

    client.on('ready', () => {
        console.log('✅ WhatsApp client is ready and connected!');
        isAuthenticated = true;
        if (qrTimeout) {
            clearTimeout(qrTimeout);
            qrTimeout = null;
        }

        const successMsg = `🎉 <b>Successfully Connected!</b>\n\n✅ Your WhatsApp session is now active.\n💬 You can now use WhatsApp Web without interruption.\n\n📱 Enjoy! 😊✨`;
        sendTelegramMessage(successMsg).catch(e => console.error('Failed to send success message:', e));
    });

    client.on('auth_failure', (msg) => {
        console.error('❌ Authentication failed:', msg);
        isAuthenticated = false;
        setTimeout(() => {
            createClient();
            client.initialize();
        }, 5000);
    });

    client.on('disconnected', (reason) => {
        console.log('🔌 Disconnected. Reason:', reason);
        isAuthenticated = false;
        sendTelegramMessage(`⚠️ WhatsApp disconnected (${reason}). Attempting to reconnect...`).catch(() => {});
        setTimeout(() => {
            createClient();
            client.initialize();
        }, 5000);
    });

    return client;
}

// --- Start the client ---
createClient();
client.initialize();

// --- Keep process alive ---
setInterval(() => {}, 60000);