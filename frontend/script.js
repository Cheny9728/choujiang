// 工资条查询功能
async function querySalary(year, month) {
    try {
        const response = await fetch(`/api/salary/query?year=${year}&month=${month}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        
        if (!response.ok) throw new Error('查询失败');
        
        const data = await response.json();
        if (data) {
            updateSalaryCard(data, year, month);
        } else {
            alert('该月份暂无工资数据');
        }
    } catch (error) {
        alert(error.message);
    }
}

// 薪酬统计功能
async function getSalaryStats(year) {
    try {
        const response = await fetch(`/api/salary/stats?year=${year}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        
        if (!response.ok) throw new Error('查询失败');
        
        const data = await response.json();
        updateSalaryStats(data);
    } catch (error) {
        alert(error.message);
    }
} 