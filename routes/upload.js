var express = require('express');
var router = express.Router();
require('dotenv').config();
const cors = require('cors'); // 引入 cors
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { fileStore } = require('../store/index');

router.use(cors());

router.post('/api/upload', upload.array('files'), function(req, res) {
    try {
        console.log(req.body)
        const fileList = req.files;
        console.log(fileList);
        if (fileList.length > 0) {
            fileList.forEach(file => {
                let content = '';
                if (file.mimetype.startsWith('text/')) {
                    // 文本文件（.txt, .csv 等）直接转字符串
                    content = file.buffer.toString('utf8');
                } else if (file.mimetype.startsWith('image/')) {
                    // 图片文件转 base64
                    content = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                } else {
                    content = `暂不支持解析 ${file.mimetype} 类型文件`;
                }
                fileStore.fileContentList.push({
                    id: Date.now() + file.originalname,
                    name: file.originalname,
                    content: content
                })
            });
        }
        res.json({
            code: 0,
            msg: '生成成功',
            data: fileStore.fileContentList.map(item => item.id),
        });
    } catch (error) {
        res.json({
            code: 1,
            msg: '生成失败',
            data: error.message,
        });
    }
})

module.exports = router;