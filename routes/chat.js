var express = require('express');
var router = express.Router();
const OpenAi = require('openai');
require('dotenv').config();
const cors = require('cors'); // 引入 cors
const fs = require('fs');
const path = require('path');


const client = new OpenAi({
  apiKey: process.env.OPENAI_API_FREE_KEY, // 使用环境变量加载 API 密钥
  baseURL: 'https://api.chatanywhere.tech/v1',
})

let historyList = [];

const getChat = async (message, sessionId ,res) => {
  try {
    const majorData = {id: Date.now()};
    if (!sessionId) {
      sessionId = Date.now();
      majorData.sessionId = sessionId;
      historyList = [];
    }
    const stream = await client.chat.completions.create({
      messages: [
        { role: 'system', content: '你是一个风趣幽默的中文助手' },
        ...historyList,
        { role: 'user', content: message },
      ],
      model: 'gpt-3.5-turbo',
      stream: true,
      max_tokens: 5000, // 控制生成的 token 数
    });

    const eventName = 'major';
    res.write(`event: ${eventName}\n`);
    res.write(`data: ${JSON.stringify(majorData)}\n\n`);
    let answer = '';
    for await (const part of stream) {
      const eventName = 'message';
      if (Object.keys(part.choices[0]?.delta || {}).length > 0) {
        res.write(`event: ${eventName}\n`);
        res.write(`data: ${JSON.stringify(part.choices[0].delta)}\n\n`);
        answer += part.choices[0].delta.content || '';
      }
    }
    historyList.push({
      role: 'user',
      content: message,
    });
    historyList.push({
      role: 'assistant',
      content: answer,
    });
    console.log(historyList)
    res.end(); // 结束连接
  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    res.end(); // 结束连接
  }
};

const getHtml = async (message, sessionId, res) => {
  try {
    const majorData = {id: Date.now()};
    if (!sessionId) {
      sessionId = Date.now();
      majorData.sessionId = sessionId;
      historyList = [];
    }
    const stream = await client.chat.completions.create({
      messages: [
        { role: 'system', content: '你是一个擅长编写html的代码助手' },
        ...historyList,
        { role: 'user', content: message + ',请以html的格式输出 ,请确保生成的HTML代码是合法的，并且包含基本的结构和语义' },
      ],
      model: 'gpt-3.5-turbo',
      stream: true,
      max_tokens: 5000, // 控制生成的 token 数
    });
    let eventName = 'major';
    res.write(`event: ${eventName}\n`);
    res.write(`data: ${JSON.stringify(majorData)}\n\n`);
    let answer = '';
    for await (const part of stream) {
      const eventName = 'message';
      if (Object.keys(part.choices[0]?.delta || {}).length > 0) {
        console.log(part.choices[0].delta.content)
        res.write(`event: ${eventName}\n`);
        res.write(`data: ${JSON.stringify(part.choices[0].delta)}\n\n`);
        answer += part.choices[0].delta.content || '';
      }
    }
    const startIndex = answer.indexOf('<html');
    const endIndex = answer.lastIndexOf('</html>');
    const html = answer.slice(startIndex, endIndex + 7);
    const folderPath = path.join(__dirname, '../public/html');
    const fileName = Date.now() + '.html';
    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, html, 'utf8');
    eventName = 'source';
    res.write(`event: ${eventName}\n`);
    res.write(`data: ${JSON.stringify({html: `/html/${fileName}`})}\n\n`)
    historyList.push({
      role: 'user',
      content: message,
    });
    historyList.push({
      role: 'assistant',
      content: answer,
    });
    res.end(); // 结束连接
  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    res.end(); // 结束连接
  }
}

router.use(cors());

/* GET users listing. */
router.post('/api/chat', function(req, res) {
  res.set('Content-Type', 'text/event-stream;charset=utf-8');
  res.set('Access-Control-Allow-Origin', '*');
  res.set('X-Accel-Buffering', 'no');
  res.set('Cache-Control', 'no-cache, no-transform');
  const { message, sessionId, type } = req.body;

  if (type === 'html') {
    getHtml(message, sessionId, res);
    return;
  }

  getChat(message, sessionId, res);
});

module.exports = router;
