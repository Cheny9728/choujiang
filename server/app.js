const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 数据库连接配置
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'oa_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);

// 添加数据库连接测试
pool.getConnection()
    .then(connection => {
        console.log('数据库连接成功');
        connection.release();
    })
    .catch(err => {
        console.error('数据库连接失败:', err);
    });

// 添加token验证中间件
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: '未提供认证令牌' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ error: '令牌无效' });
        }
        req.user = user;
        next();
    });
};

// Token验证接口
app.get('/api/validate-token', authenticateToken, (req, res) => {
    res.json({ 
        valid: true, 
        user: req.user 
    });
});

// 获取用户信息接口
app.get('/api/user-profile', authenticateToken, async (req, res) => {
    try {
        const [profiles] = await pool.query(
            'SELECT * FROM user_profiles WHERE user_id = ?',
            [req.user.userId]
        );

        if (profiles.length === 0) {
            return res.status(404).json({ error: '用户档案不存在' });
        }

        res.json(profiles[0]);
    } catch (error) {
        console.error('获取用户档案错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 注册API
app.post('/api/register', async (req, res) => {
    try {
        console.log('收到注册请求:', req.body);
        const { username, email, password } = req.body;
        
        // 输入验证
        if (!username || !email || !password) {
            console.log('缺少必填字段');
            return res.status(400).json({ 
                error: '请填写所有必填字段' 
            });
        }

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('邮箱格式不正确');
            return res.status(400).json({ 
                error: '邮箱格式不正确' 
            });
        }

        // 验证密码强度
        if (password.length < 6) {
            console.log('密码长度不足');
            return res.status(400).json({ 
                error: '密码长度至少6位' 
            });
        }

        console.log('开始检查用户是否存在...');
        // 验证用户名和邮箱是否已存在
        const [existingUsers] = await pool.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            console.log('用户名或邮箱已存在');
            return res.status(400).json({ 
                error: '用户名或邮箱已存在' 
            });
        }

        console.log('开始加密密码...');
        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('开始插入用户数据...');
        // 插入新用户
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        console.log('用户数据插入成功，ID:', result.insertId);

        console.log('开始创建用户档案...');
        // 创建用户档案
        await pool.query(
            'INSERT INTO user_profiles (user_id) VALUES (?)',
            [result.insertId]
        );

        console.log('注册成功');
        res.status(201).json({ 
            message: '注册成功' 
        });
    } catch (error) {
        console.error('注册错误详情:', error);
        res.status(500).json({ 
            error: '注册失败: ' + (error.message || '服务器错误')
        });
    }
});

// 登录API
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 查询用户
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                error: '用户名或密码错误' 
            });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ 
                error: '用户名或密码错误' 
            });
        }

        // 生成JWT令牌
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            'your_jwt_secret',
            { expiresIn: '24h' }
        );

        res.json({ 
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ 
            error: '服务器错误' 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}); 