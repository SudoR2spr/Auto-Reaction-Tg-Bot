// By - WOODcraft @SudoR2spr
import 'dotenv/config'; 
import express from 'express'; 
import fetch from 'node-fetch'; 
import TelegramBot from 'node-telegram-bot-api'; 

const app = express(); 
const port = process.env.PORT || 3000; 
const BOT_TOKEN = process.env.BOT_TOKEN; 

const emojis = ['😂', '👍', '❤️', '🔥', '👏', '🎉', '😎', '👀', '💯']; 
app.use(express.json()); 

app.get('/', (req, res) => { 
    res.send('Welcome to the reaction bot'); 
}); 

app.post(`/bot${BOT_TOKEN.split(':')[0]}`, async (req, res) => { 
    const update = req.body; 

    if (update.message) { 
        const messageId = update.message.message_id; 
        const chatId = update.message.chat.id; 
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]; 
        await sendReaction(chatId, messageId, randomEmoji); 
    } 

    res.sendStatus(200); 
}); 

const sendReaction = async (chatId, messageId, emoji) => { 
    try { 
        console.log(`Sending reaction: ${emoji} to chatId: ${chatId}, messageId: ${messageId}`);
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${chatId}&reply_to_message_id=${messageId}&text=${encodeURIComponent(emoji)}`); 
        
        if (!response.ok) { 
            console.error('Failed to send reaction:', response.statusText); 
        } 
    } catch (error) { 
        console.error('Error sending reaction:', error); 
    } 
}; 

const setWebhook = async () => { 
    const webhookUrl = `${process.env.WEBHOOK_URL}/bot${BOT_TOKEN.split(':')[0]}`; 
    try { 
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${webhookUrl}`); 
        const data = await response.json(); 
        if (data.ok) { 
            console.log('Webhook set successfully'); 
        } else { 
            console.error('Failed to set webhook:', data.description); 
        } 
    } catch (error) { 
        console.error('Error setting webhook:', error); 
    } 
}; 

app.listen(port, () => { 
    console.log(`Server is running on port ${port}`); 
    setWebhook(); 
});

// By - WOODcraft @SudoR2spr
