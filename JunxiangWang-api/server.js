// server.js - 简化版本，确保能运行
console.log('🔧 开始启动服务器...');

const express = require('express');
const app = express();
const PORT = 3000;

// 基本中间件
app.use(express.json());

// 测试路由
app.get('/', (req, res) => {
  res.json({ 
    message: '服务器正常运行!',
    timestamp: new Date().toISOString()
  });
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('🚀 服务器启动成功!');
  console.log(`📍 访问地址: http://localhost:${PORT}`);
  console.log(`📍 健康检查: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  console.error('❌ 服务器启动失败:', err.message);
});

console.log('🔧 服务器配置完成，正在启动...');