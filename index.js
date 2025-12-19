require('dotenv').config();
const { Telegraf } = require('telegraf');
const banned = require('./bannedWords');
const warnings = require('./warnings');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Yangi a'zolar
bot.on('new_chat_members', async (ctx) => {
  for (const user of ctx.message.new_chat_members) {
    const name = user.username ? `@${user.username}` : user.first_name;
    await ctx.reply(`👋 Xush kelibsiz, ${name}!`);
  }
});

// Matnlarni tekshirish
bot.on('message', async (ctx) => {
  if (!ctx.message.text) return; // matn bo'lmasa o'tkazib yubor

  const text = ctx.message.text.toLowerCase();
  const words = banned.getWords();
  const found = words.some(w => text.includes(w));

  if (!found) return;

  const userId = ctx.from.id;
  const name = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;

  // Faqat foydalanuvchi xabarini o'chirishga harakat qilamiz
  if (!ctx.from.is_bot) {
    try {
      await ctx.deleteMessage();
    } catch (err) {
      console.log("❌ Xabarni o'chirishda xato:", err.description);
    }
  }

  const count = (warnings.get(userId) || 0) + 1;
  warnings.set(userId, count);

  if (count < 2) {
    await ctx.reply(`⚠️ ${name}, taqiqlangan so‘z ishlatding!\nOgohlantirish: ${count}/2`);
  } else {
    try {
      await ctx.kickChatMember(userId);
    } catch (err) {
      console.log("❌ Foydalanuvchini ban qilishda xato:", err.description);
    }
    warnings.delete(userId);
    await ctx.reply(`🚫 ${name} bloklandi! Sabab: taqiqlangan so‘zlarni 2 marta ishlatdi.`);
  }
});

// Botni ishga tushirish
bot.launch();
console.log("🛡 QOROVUL BOT ishlayapti...");
