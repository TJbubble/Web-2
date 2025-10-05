const mysql = require('mysql2');

// 创建数据库连接池（推荐使用连接池）
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',           // 改成你的MySQL用户名
  password: 'wjx040130', // 改成你的MySQL密码
  database: 'charityevents_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试连接
pool.getConnection((err, connection) => {
  if (err) {
    console.error('数据库连接失败: ', err);
    return;
  }
  console.log('成功连接到MySQL数据库');
  connection.release();
});

module.exports = pool;