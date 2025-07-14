var express = require('express');
var router = express.Router();
const OpenAi = require('openai');
require('dotenv').config();
const cors = require('cors'); // 引入 cors

const client = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY, // 使用环境变量加载 API 密钥
  baseURL: 'https://api.chatanywhere.tech/v1',
})

router.use(cors());

/* GET users listing. */
router.post('/api/picture', async function(req, res) {
  const { message } = req.body;
  console.log(message);
  const imageRes = await client.images.generate({
    prompt: message,
    n: 1,
    size: '1024x1024',
    model: 'dall-e-3',
  });
  console.log(imageRes.data[0])
  res.json({
    code: 0,
    msg: '生成成功',
    data: imageRes.data[0].url,
    cardId: Date.now()
  });

  res.end();
});

module.exports = router;