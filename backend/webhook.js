const express = require('express');
const axios = require('axios');

const router = express.Router();

const BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const WEBHOOK_URL = `https://f1a07255bfc6.ngrok.app/webhook`; // Replace with your actual webhook URL

router.post('/', async (req, res) => {
    console.log('Received webhook');
    const { message } = req.body;

    if (message && message.text && message.text === '/start') {
        const chatId = message.chat.id;

        const replyMarkup = {
            inline_keyboard: [[
                {
                    text: 'Play',
                    web_app: {
                        url: 'https://dc26e00cbe0c.ngrok.app'
                    }
                }
            ]]
        };

        try {
            const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
                chat_id: chatId,
                text: 'Click the button below to play!',
                reply_markup: replyMarkup
            });

            if (response.data.ok) {
                console.log('Message sent successfully');
                res.status(200).send('Message sent');
            } else {
                console.log('Failed to send message:', response.data);
                res.status(500).send('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).send('Error sending message');
        }
    } else {
        res.status(200).send('Not a /start command');
    }
});

async function setWebhook() {
    try {
        const response = await axios.post(`${TELEGRAM_API_URL}/setWebhook`, {
            url: WEBHOOK_URL
        });

        if (response.data.ok) {
            console.log('Webhook set successfully');
        } else {
            console.log('Failed to set webhook:', response.data);
        }
    } catch (error) {
        console.error('Error setting webhook:', error);
    }
}

module.exports = { router, setWebhook };
