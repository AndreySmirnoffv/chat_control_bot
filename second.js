const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot("6757162234:AAHAwxpuj9SNAphqtOOHG9tNab0DAgFhAgg", {polling: true})
const db = require('./assets/db/database.json')
const keyboard = require('./assets/keyboard/keyboard')
const fs = require('fs')

bot.on('message', async msg => {
    if (msg.text === '/start'){
        await bot.sendMessage(msg.chat.id, "Кнопки для добавления ссылок", keyboard)
    }else if (msg.text === 'Добавить первую ссылку'){
        await bot.sendMessage(msg.chat.id, "Пришлите мне ссылку")
        db.push({
            firstLink: msg.text, 
        })
        fs.writeFileSync('./assets/db/database.json', JSON.stringify(db, null, '\t'))
        bot.removeListener()
        await bot.sendMessage(msg.chat.id, "Ссылка успешно добавлена в базу данных")
    }else if (msg.text === "Добавить вторую ссылку"){
        await bot.sendMessage(msg.chat.id, "Пришлите мне ссылку")
        db.push({
            secondLink: msg.text,
        })
        fs.writeFileSync('./assets/db/database.json', JSON.stringify(db, null, '\t'))
        bot.removeListener()
        await bot.sendMessage(msg.chat.id, "Ссылка успешно добавлена в базу данных")
    }else{
        await bot.sendMessage(msg.chat.id, "Такой команды не существует")
    }
})