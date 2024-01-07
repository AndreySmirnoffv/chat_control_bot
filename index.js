const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot("6469092107:AAHGy98-NCRBkmPnCt_A1T5ip2JC7_H1z5E", {
  polling: true,
});
const fs = require("fs").promises;
const db = require("./assets/db/database.json");

async function containsProfanity(text) {
  try {
    const jsonData = await fs.readFile("./assets/db/db.json", "utf-8");
    const profanityList = JSON.parse(jsonData);

    const lowercaseText = text;
    return profanityList.some((profanity) => lowercaseText.includes(profanity));
  } catch (error) {
    console.error("Ошибка при чтении файла JSON:", error);
    return false;
  }
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const userId = msg.from.id;
  try {
    const hasProfanity = await containsProfanity(text);

    const isAdmin = await bot
      .getChatAdministrators(chatId)
      .then((admins) => admins.some((admin) => admin.user.id === userId));

    if (!isAdmin && hasProfanity) {
      await bot.deleteMessage(chatId, msg.message_id);
    } else {
      const messageType = msg.photo
        ? "photo"
        : msg.sticker
        ? "sticker"
        : "text";

      if (messageType === "photo" && !isAdmin) {
        await bot.deleteMessage(chatId, msg.message_id);
      } else if (messageType === "sticker" && !isAdmin) {
        await bot.deleteMessage(chatId, msg.message_id);
      } else {
        await bot.sendMessage(userId, "Присоединитесь к нашей группе!");
      }
    }
  } catch (error) {
    console.error("Ошибка при обработке сообщения:", error);
  }
});
