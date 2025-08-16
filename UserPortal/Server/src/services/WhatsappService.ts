// src/services/WhatsappService.ts
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';

let isClientReady = false;

export const whatsappClient = new Client({
    authStrategy: new LocalAuth(),
});

whatsappClient.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR Code generated, scan it with your WhatsApp app.');
});

whatsappClient.on('ready', () => {
    isClientReady = true;
    console.log('WhatsApp client is ready!');
});

whatsappClient.on('disconnected', (reason) => {
    isClientReady = false;
    console.log('WhatsApp client disconnected:', reason);
});

whatsappClient.on('auth_failure', (msg) => {
    isClientReady = false;
    console.error('WhatsApp authentication failed:', msg);
});

whatsappClient.on('connection_lost', () => {
    isClientReady = false;
    console.log('WhatsApp connection lost');
});

whatsappClient.on('message', async (msg) => {
    if (msg.from !== "status@broadcast") {
        const contact = await msg.getContact();
        console.log(`Message from ${contact.pushname || contact.number}: ${msg.body}`);
    }
});

export function isWhatsAppReady() {
    return isClientReady;
}

export async function waitForClientReady(timeout = 30000): Promise<boolean> {
    if (isClientReady) return true;
    
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => reject(new Error('WhatsApp client initialization timeout')), timeout);
        whatsappClient.once('ready', () => {
            clearTimeout(timeoutId);
            resolve(true);
        });
        whatsappClient.once('auth_failure', () => {
            clearTimeout(timeoutId);
            reject(new Error('WhatsApp authentication failed'));
        });
    });
}

export async function sendMessage(phoneNumber: string, message: string) {
    await waitForClientReady();
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    const last9Digits = cleanedNumber.slice(-9);
    const formattedNumber = '94' + last9Digits;
    const chatId = `${formattedNumber}@c.us`;
    await whatsappClient.sendMessage(chatId, message);
}

export async function generateQRCodeImage(data: string): Promise<Buffer> {
    return QRCode.toBuffer(data, { type: 'png', width: 300, margin: 2 });
}

export async function sendQRCode(phoneNumber: string, data: string, caption?: string) {
    await waitForClientReady();
    const qrCodeBuffer = await generateQRCodeImage(data);
    const media = new MessageMedia('image/png', qrCodeBuffer.toString('base64'));
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    const last9Digits = cleanedNumber.slice(-9);
    const formattedNumber = '94' + last9Digits;
    const chatId = `${formattedNumber}@c.us`;
    await whatsappClient.sendMessage(chatId, media, { caption });
}

// Initialize only once at server start
export async function initializeWhatsApp() {
    console.log('Initializing WhatsApp client...');
    await whatsappClient.initialize();
}
