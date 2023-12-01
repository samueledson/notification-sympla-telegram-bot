require('dotenv').config()
const get = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const telegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

const events = {
    'festivalGarden': {
        'id': 2150692,
        'name': 'Festival Garden',
    },
    'deLaMancha': {
        'id': 2240777,
        'name': 'De La Mancha',
    },
    'natalBoticario': {
        'id': 2253636,
        'name': 'Natal O Boticário',
    }
};

const event = events.festivalGarden;

const urlTickets = `https://event-page.svc.sympla.com.br/api/event-bff/purchase/event/${event.id}/tickets`;

const tickets = [];

function onTickets() {
    get(urlTickets)
    .then(response => {
        const data = response.data;
        data.forEach(item => {
            if (item.status === 'STARTED') {
                tickets.push({
                    name: item.name,
                    price: item.salePriceMonetary.decimal,
                    quantity: item.availableQty
                });
            }
        });
    })
    .then(() => {
        if (tickets.length > 0) {
            let message = `Há ingressos disponíveis para o evento ${event.name}!`;
            tickets.forEach(ticket => {
                message += `\n\n${ticket.name}`;
                message += `\n  Qtd: ${ticket.quantity}`;
                message += `\n  Preço: R$ ${ticket.price}`;
            });
            telegramBot.sendMessage(telegramChatId, message);
            /* telegramBot.on('message', (msg) => {
                const chatId = msg.chat.id;
                telegramBot.sendMessage(chatId, `Seu id da conversa é: ${chatId}`);
            }); */
        }
    });
}

setInterval(onTickets, 10000);