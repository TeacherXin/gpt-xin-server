var express = require('express');
var router = express.Router();
const OpenAi = require('openai');
require('dotenv').config();
const cors = require('cors'); // 引入 cors

const client = new OpenAi({
  apiKey: process.env.OPENAI_API_FREE_KEY, // 使用环境变量加载 API 密钥
  baseURL: 'https://api.chatanywhere.tech/v1',
})

const getChat = async (message, res) => {
  try {
    const stream = await client.chat.completions.create({
      messages: [
        { role: 'system', content: '你是一个风趣幽默的中文助手' },
        { role: 'user', content: message },
      ],
      model: 'gpt-3.5-turbo',
      stream: true,
    });

    for await (const part of stream) {
      const eventName = 'message';
      if (Object.keys(part.choices[0]?.delta || {}).length > 0) {
        console.log(part.choices[0].delta);
        res.write(`event: ${eventName}\n`);
        res.write(`data: ${JSON.stringify(part.choices[0].delta)}\n\n`);
      }
    }
    res.end(); // 结束连接
  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    res.end(); // 结束连接
  }
};

router.use(cors());

/* GET users listing. */
router.post('/chat', function(req, res) {
  res.set('Content-Type', 'text/event-stream;charset=utf-8');
  res.set('Access-Control-Allow-Origin', '*');
  res.set('X-Accel-Buffering', 'no');
  res.set('Cache-Control', 'no-cache, no-transform');
  const { message } = req.body;

  getChat(message, res);
});

module.exports = router;
