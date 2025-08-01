var express = require('express');
var router = express.Router();
const OpenAi = require('openai');
require('dotenv').config();


const client = new OpenAi({
  apiKey: process.env.OPENAI_API_FREE_KEY, // 使用环境变量加载 API 密钥
  baseURL: 'https://api.chatanywhere.tech/v1',
})

router.post('/api/react', async function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Cache-Control', 'no-cache, no-transform');
  const { message } = req.body;
  const newMessage = message + '，以React组件的格式输出，不需要引入和导出，只输出一个纯函数，不需要其他的内容，里面不许用jsx，用React.createElement方法。组件要用function关键字定义，不要用箭头函数。';
    const result = await client.chat.completions.create({
        messages: [
        { role: 'system', content: '你是一个擅长编写React组件的代码助手' },
        { role: 'user', content: newMessage },
        ],
        model: 'gpt-3.5-turbo',
        max_tokens: 5000, // 控制生成的 token 数
    });
    let json = result.choices[0]?.message?.content;
    let comJson = json.replace('jsx', '').replaceAll('```', '').replace('javascript', '');
    comJson = comJson.trim();
    res.json({
        code: 0,
        msg: '生成成功',
        data: comJson,
    });
});

module.exports = router;
