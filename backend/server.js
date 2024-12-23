const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// 路由
app.use('/api/users', userRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 