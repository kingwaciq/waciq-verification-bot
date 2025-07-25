const { Telegraf } = require('telegraf');
const multer = require('multer');
const upload = multer();

const bot = new Telegraf(process.env.BOT_TOKEN); // add your token in vercel project env

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const form = await new Promise((resolve, reject) => {
    upload.single('photo')(req, {}, err => {
      if (err) reject(err);
      else resolve(req);
    });
  });

  const uid = form.body.uid;
  const photoBuffer = form.file.buffer;

  try {
    await bot.telegram.sendPhoto(uid, { source: photoBuffer }, {
      caption: `🖼️ ستاسو عکس ترلاسه شو!\n\n👤 *WACIQ Verified Bot*`,
      parse_mode: "Markdown"
    });
    res.status(200).send("✅ Photo sent successfully!");
  } catch (e) {
    console.error("Telegram error:", e.message);
    res.status(500).send("❌ Failed to send photo.");
  }
}; 
