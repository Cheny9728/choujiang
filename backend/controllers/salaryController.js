const pool = require('../config/db');

const salaryController = {
    // 查询工资条
    async getSalary(req, res) {
        try {
            const { year, month } = req.query;
            const userId = req.user.id;
            
            const [rows] = await pool.query(
                'SELECT * FROM salary_records WHERE user_id = ? AND year = ? AND month = ?',
                [userId, year, month]
            );
            
            res.json(rows[0] || null);
        } catch (error) {
            res.status(500).json({ error: '查询失败' });
        }
    },

    // 获取工资统计
    async getSalaryStats(req, res) {
        try {
            const { year } = req.query;
            const userId = req.user.id;
            
            const [rows] = await pool.query(
                'SELECT * FROM salary_records WHERE user_id = ? AND year = ? ORDER BY month',
                [userId, year]
            );
            
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: '查询失败' });
        }
    },

    // 添加工资记录
    async addSalary(req, res) {
        try {
            const { year, month, basic, position, performance, overtime, insurance, fund } = req.body;
            const userId = req.user.id;
            
            await pool.query(
                `INSERT INTO salary_records 
                (user_id, year, month, basic, position, performance, overtime, insurance, fund) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, year, month, basic, position, performance, overtime, insurance, fund]
            );
            
            res.json({ message: '添加成功' });
        } catch (error) {
            res.status(500).json({ error: '添加失败' });
        }
    },

    // 更新工资记录
    async updateSalary(req, res) {
        try {
            const { id, basic, position, performance, overtime, insurance, fund } = req.body;
            const userId = req.user.id;
            
            await pool.query(
                `UPDATE salary_records 
                SET basic = ?, position = ?, performance = ?, overtime = ?, insurance = ?, fund = ? 
                WHERE id = ? AND user_id = ?`,
                [basic, position, performance, overtime, insurance, fund, id, userId]
            );
            
            res.json({ message: '更新成功' });
        } catch (error) {
            res.status(500).json({ error: '更新失败' });
        }
    }
};

module.exports = salaryController; 