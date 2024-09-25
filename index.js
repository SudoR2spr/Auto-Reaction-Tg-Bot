import 'dotenv/config'; 
import express from 'express'; 
import fetch from 'node-fetch'; 

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
        const chatId = update.message.chat.id; 
        const messageId = update.message.message_id; 
        const text = update.message.text;

        if (text === '/start') {
            // Send welcome message logic
        } else {
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]; 
            await sendReaction(chatId, messageId, randomEmoji); 
        }
    } 

    res.sendStatus(200); 
}); 

const sendReaction = async (chatId, messageId, emoji) => { 
    try { 
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                reply_to_message_id: messageId,
                text: emoji,
                disable_notification: true,
                reply_markup: {
                    inline_keyboard: [[
                        { text: emoji, url: 'https://t.me/Opleech_WD' }
                    ]]
                }
            }),
        }); 
        
        if (!response.ok) { 
            console.error('Failed to send reaction:', response.statusText); 
            return; // যদি রিএকশন পাঠাতে ব্যর্থ হয়, এখানে ফিরে আসুন
        }

        const messageData = await response.json(); // রেসপন্স থেকে মেসেজ ডেটা নিন
        const newMessageId = messageData.result.message_id; // নতুন মেসেজের ID নিন

        // 3 সেকেন্ড পরে মেসেজটি ডিলিট করুন
        setTimeout(async () => {
            await deleteReaction(chatId, newMessageId);
        }, 3000); // 3000 মিলিসেকেন্ড = 3 সেকেন্ড
    } catch (error) { 
        console.error('Error sending reaction:', error); 
    } 
};

const deleteReaction = async (chatId, messageId) => {
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
            }),
        });

        if (!response.ok) {
            console.error('Failed to delete reaction:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting reaction:', error);
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
