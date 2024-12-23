// 烟花特效类定义
class Firework {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.createParticles();
        });
        
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const velocity = 0.8 + Math.random() * 1.2;
            
            this.particles.push({
                x: this.mouse.x,
                y: this.mouse.y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                color: `hsla(${Math.random() * 360}, 70%, 60%, 0.8)`,
                size: 1 + Math.random() * 1.5
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.03;
            p.life *= 0.98;
            
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            if (p.life < 0.01) {
                this.particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化烟花特效
    const fireworksCanvas = document.getElementById('fireworks');
    if (fireworksCanvas) {
        new Firework(fireworksCanvas);
    }

    // 检查登录状态
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    const token = localStorage.getItem('auth_token');

    if (!token || !userInfo.username) {
        window.location.href = '../index.html';
        return;
    }

    // 显示用户信息
    const userNameElement = document.querySelector('.username');
    if (userNameElement) {
        userNameElement.textContent = userInfo.username;
    }

    // 侧边栏菜单
    const menuItems = document.querySelectorAll('.sidebar-nav > ul > li');
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        const subMenu = item.querySelector('.sub-menu');
        
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // 移除其他菜单的 active 类
                menuItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // 切换当前菜单的 active 类
                item.classList.toggle('active');
                
                // 如果有子菜单，显示/隐藏
                if (subMenu) {
                    const isActive = item.classList.contains('active');
                    subMenu.style.display = isActive ? 'block' : 'none';
                }
            });
        }
    });

    // 子菜单项点击事件
    const subMenuLinks = document.querySelectorAll('.sub-menu a');
    subMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡
            
            const href = link.getAttribute('href');
            if (href === '#salary-query') {
                const salaryModal = document.getElementById('salaryModal');
                if (salaryModal) {
                    salaryModal.style.display = 'flex';
                }
            } else if (href === '#salary-stats') {
                const statsModal = document.getElementById('salaryStatsModal');
                if (statsModal) {
                    statsModal.style.display = 'flex';
                    updateSalaryStats();
                }
            } else if (href === '#incoming' || href === '#outgoing') {
                const documentModal = document.getElementById('documentModal');
                if (documentModal) {
                    documentModal.style.display = 'flex';
                    // 切换到对应标签页
                    const tabType = href.replace('#', '');
                    const tabs = documentModal.querySelectorAll('.tab-btn');
                    tabs.forEach(tab => {
                        tab.classList.toggle('active', tab.dataset.tab === tabType);
                    });
                    // 加载文档列表
                    loadDocuments(tabType);
                }
            }
        });
    });

    // 侧边栏切换按钮
    const toggleBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // 退出登录
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user_info');
            localStorage.removeItem('auth_token');
            window.location.href = '../index.html';
        });
    }

    // 快捷操作卡片点击事件
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const action = this.querySelector('h4').textContent;
            switch(action) {
                case '发起审批':
                    alert('打开审批表单');
                    break;
                case '考勤打卡':
                    alert(`打卡成功！时间：${new Date().toLocaleTimeString()}`);
                    break;
                case '日程安排':
                    alert('打开日程安排');
                    break;
                case '发送邮件':
                    alert('打开邮件编辑器');
                    break;
            }
        });
    });

    // 审批按钮点击事件
    const approveButtons = document.querySelectorAll('.btn-approve');
    approveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const todoItem = this.closest('.todo-item');
            const title = todoItem.querySelector('h4').textContent;
            if (confirm(`确认审批"${title}"？`)) {
                todoItem.style.opacity = '0.5';
                setTimeout(() => {
                    todoItem.remove();
                }, 500);
            }
        });
    });

    // 页面加载完成后的动画
    document.body.classList.add('loaded');

    // 工资条查询功能
    const salaryModal = document.getElementById('salaryModal');
    const searchBtn = salaryModal?.querySelector('.search-btn');
    const salaryYear = salaryModal?.querySelector('#salaryYear');
    const salaryMonth = salaryModal?.querySelector('#salaryMonth');
    const salaryDetails = salaryModal?.querySelector('.salary-details');
    const closeBtn = salaryModal?.querySelector('.close-btn');

    // 工资条查询菜单点击事件
    const salaryQueryLinks = document.querySelectorAll('a[href="#salary-query"]');
    salaryQueryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (salaryModal) {
                salaryModal.style.display = 'flex';
            }
        });
    });

    // 关闭弹窗事件
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            salaryModal.style.display = 'none';
        });
    }

    // 点击弹窗外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === salaryModal) {
            salaryModal.style.display = 'none';
        }
    });

    // ESC键关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && salaryModal?.style.display === 'flex') {
            salaryModal.style.display = 'none';
        }
    });

    // 模拟工资数据
    const salaryData = {
        '2024-1': {
            basic: 8000,
            position: 1200,
            performance: 2000,
            overtime: 500,
            insurance: 800,
            fund: 400,
            date: '2024-01-15'
        },
        '2024-2': {
            basic: 8000,
            position: 1200,
            performance: 2500,
            overtime: 600,
            insurance: 800,
            fund: 400,
            date: '2024-02-15'
        }
    };

    // 查询按钮点击事件
    if (searchBtn && salaryYear && salaryMonth && salaryDetails) {
        searchBtn.addEventListener('click', function() {
            const year = salaryYear.value;
            const month = salaryMonth.value;
            const key = `${year}-${month}`;
            const data = salaryData[key];

            if (data) {
                updateSalaryCard(data, year, month);
            } else {
                alert('该月份暂无工资数据');
            }
        });
    }

    // 更新工资条显示
    function updateSalaryCard(data, year, month) {
        const total = data.basic + data.position + data.performance + data.overtime - data.insurance - data.fund;
        
        const salaryCard = `
            <div class="salary-card">
                <div class="salary-header">
                    <h4>${year}年${month}月工资条</h4>
                    <span class="salary-date">发放日期：${data.date}</span>
                </div>
                <table class="salary-table">
                    <thead>
                        <tr>
                            <th colspan="2">收入项目</th>
                            <th colspan="2">扣除项目</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>基本工资</td>
                            <td>¥${data.basic.toFixed(2)}</td>
                            <td>社保扣除</td>
                            <td class="deduction">-¥${data.insurance.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>岗位津贴</td>
                            <td>¥${data.position.toFixed(2)}</td>
                            <td>公积金</td>
                            <td class="deduction">-¥${data.fund.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>绩效奖金</td>
                            <td>¥${data.performance.toFixed(2)}</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>加班工资</td>
                            <td>¥${data.overtime.toFixed(2)}</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr class="total-row">
                            <td>收入合计</td>
                            <td>¥${(data.basic + data.position + data.performance + data.overtime).toFixed(2)}</td>
                            <td>扣除合计</td>
                            <td class="deduction">-¥${(data.insurance + data.fund).toFixed(2)}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2">实发工资</td>
                            <td colspan="2" class="final-salary">¥${total.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
                <div class="salary-footer">
                    <button class="btn-download">
                        <i class="fas fa-download"></i>
                        下载工资条
                    </button>
                    <button class="btn-print">
                        <i class="fas fa-print"></i>
                        打印工资条
                    </button>
                </div>
            </div>
        `;

        if (salaryDetails) {
            salaryDetails.innerHTML = salaryCard;
            bindButtonEvents();
        }
    }

    // 绑定下载和打印按钮事件
    function bindButtonEvents() {
        const downloadBtn = salaryModal?.querySelector('.btn-download');
        const printBtn = salaryModal?.querySelector('.btn-print');

        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                const year = salaryYear?.value;
                const month = salaryMonth?.value;
                if (year && month) {
                    downloadSalarySlip(year, month);
                }
            });
        }

        if (printBtn) {
            printBtn.addEventListener('click', function() {
                window.print();
            });
        }
    }

    // 修改下载工资条功能
    function downloadSalarySlip(year, month) {
        const data = salaryData[`${year}-${month}`];
        if (!data) return;

        // 准备 Excel 数据
        const workbook = XLSX.utils.book_new();
        const worksheet_data = [
            [`${year}年${month}月工资条`],
            [`发放日期：${data.date}`],
            ['', ''],  // 空行
            ['收入项目', '金额', '扣除项目', '金额'],
            ['基本工资', data.basic, '社保扣除', -data.insurance],
            ['岗位津贴', data.position, '公积金', -data.fund],
            ['绩效奖金', data.performance, '', ''],
            ['加班工资', data.overtime, '', ''],
            ['', ''],  // 空行
            ['收入合计', data.basic + data.position + data.performance + data.overtime, 
             '扣除合计', -(data.insurance + data.fund)],
            ['', ''],  // 空行
            ['实发工资', data.basic + data.position + data.performance + data.overtime - data.insurance - data.fund]
        ];

        // 创建工作表
        const worksheet = XLSX.utils.aoa_to_sheet(worksheet_data);

        // 设置单元格合并
        worksheet['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },  // 标题合并
            { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },  // 日期合并
            { s: { r: 11, c: 0 }, e: { r: 11, c: 1 } }, // 实发工资标签合并
            { s: { r: 11, c: 2 }, e: { r: 11, c: 3 } }  // 实发工资金额合并
        ];

        // 设置列宽
        worksheet['!cols'] = [
            { wch: 15 }, // A列宽
            { wch: 12 }, // B列宽
            { wch: 15 }, // C列宽
            { wch: 12 }  // D列宽
        ];

        // 设置单元格样式
        for (let i = 0; i < worksheet_data.length; i++) {
            for (let j = 0; j < worksheet_data[i].length; j++) {
                const cell_ref = XLSX.utils.encode_cell({ r: i, c: j });
                if (!worksheet[cell_ref]) continue;
                
                // 初始单元格样式
                worksheet[cell_ref].s = {
                    font: { name: "宋体", sz: 11 },
                    alignment: { horizontal: "center", vertical: "center" }
                };

                // 标题样式
                if (i === 0) {
                    worksheet[cell_ref].s.font.bold = true;
                    worksheet[cell_ref].s.font.sz = 14;
                }

                // 表头样式
                if (i === 3) {
                    worksheet[cell_ref].s.font.bold = true;
                    worksheet[cell_ref].s.fill = { fgColor: { rgb: "EEEEEE" } };
                }

                // 合���行样式
                if (i === 9 || i === 11) {
                    worksheet[cell_ref].s.font.bold = true;
                }

                // 金额列右对齐
                if (j === 1 || j === 3) {
                    worksheet[cell_ref].s.alignment.horizontal = "right";
                }
            }
        }

        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(workbook, worksheet, "工资条");

        // 生成并下载文件
        XLSX.writeFile(workbook, `工资条_${year}年${month}月.xlsx`);
    }

    // 薪酬统计功能
    const statsModal = document.getElementById('salaryStatsModal');
    if (statsModal) {
        const closeBtn = statsModal.querySelector('.close-btn');
        const searchBtn = statsModal.querySelector('.search-btn');
        const statsYear = statsModal.querySelector('#statsYear');

        // 关闭按钮事件
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                statsModal.style.display = 'none';
            });
        }

        // 点击弹窗外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === statsModal) {
                statsModal.style.display = 'none';
            }
        });

        // 查询按钮事件
        if (searchBtn && statsYear) {
            searchBtn.addEventListener('click', () => {
                updateSalaryStats();
            });
        }
    }

    // 更新薪酬统计数据
    function updateSalaryStats() {
        const year = document.querySelector('#statsYear')?.value;
        if (!year) return;

        let totalIncome = 0;
        let maxIncome = 0;
        let minIncome = Infinity;
        let monthlyData = [];

        // 生成表格HTML
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>月份</th>
                        <th>基本工资</th>
                        <th>岗位津贴</th>
                        <th>绩效奖金</th>
                        <th>加班工资</th>
                        <th>社保扣除</th>
                        <th>公积金</th>
                        <th>实发工资</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // 遍历每个月份数据
        for (let month = 1; month <= 12; month++) {
            const data = salaryData[`${year}-${month}`];
            if (data) {
                const monthlyTotal = data.basic + data.position + 
                                   data.performance + data.overtime - 
                                   data.insurance - data.fund;
                
                totalIncome += monthlyTotal;
                maxIncome = Math.max(maxIncome, monthlyTotal);
                minIncome = Math.min(minIncome, monthlyTotal);
                monthlyData.push(monthlyTotal);

                tableHTML += `
                    <tr>
                        <td class="month-cell">${month}月</td>
                        <td class="income-cell">¥${data.basic.toFixed(2)}</td>
                        <td class="income-cell">¥${data.position.toFixed(2)}</td>
                        <td class="income-cell">¥${data.performance.toFixed(2)}</td>
                        <td class="income-cell">¥${data.overtime.toFixed(2)}</td>
                        <td class="deduction-cell">-¥${data.insurance.toFixed(2)}</td>
                        <td class="deduction-cell">-¥${data.fund.toFixed(2)}</td>
                        <td class="total-cell">¥${monthlyTotal.toFixed(2)}</td>
                    </tr>
                `;
            } else {
                tableHTML += `
                    <tr>
                        <td class="month-cell">${month}月</td>
                        <td colspan="7">暂无数据</td>
                    </tr>
                `;
            }
        }

        tableHTML += '</tbody></table>';

        // 更��表格显示
        const statsModal = document.getElementById('salaryStatsModal');
        if (statsModal) {
            const statsTable = statsModal.querySelector('.stats-table');
            if (statsTable) {
                statsTable.innerHTML = tableHTML;
            }

            // 更新统计数据
            const avgIncome = monthlyData.length > 0 ? totalIncome / monthlyData.length : 0;

            statsModal.querySelector('.total-income').textContent = 
                `¥${totalIncome.toFixed(2)}`;
            statsModal.querySelector('.avg-income').textContent = 
                `¥${avgIncome.toFixed(2)}`;
            statsModal.querySelector('.max-income').textContent = 
                `¥${maxIncome === 0 ? '0.00' : maxIncome.toFixed(2)}`;
            statsModal.querySelector('.min-income').textContent = 
                `¥${minIncome === Infinity ? '0.00' : minIncome.toFixed(2)}`;
        }
    }

    // 弹窗切换功能
    const switchButtons = document.querySelectorAll('.switch-modal');
    switchButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentModal = button.closest('.salary-modal');
            const targetModalId = button.dataset.target;
            const targetModal = document.getElementById(targetModalId);
            
            if (currentModal && targetModal) {
                // 隐藏当前弹窗
                currentModal.style.display = 'none';
                // 显示目标弹窗
                targetModal.style.display = 'flex';
                
                // 如果切换到薪酬统计，自动更新数据
                if (targetModalId === 'salaryStatsModal') {
                    updateSalaryStats();
                }
            }
        });
    });

    // 修改关闭弹窗的处理，确保两个弹窗都能正确关闭
    window.addEventListener('click', (e) => {
        const salaryModal = document.getElementById('salaryModal');
        const statsModal = document.getElementById('salaryStatsModal');
        
        if (e.target === salaryModal) {
            salaryModal.style.display = 'none';
        }
        if (e.target === statsModal) {
            statsModal.style.display = 'none';
        }
    });

    // ESC键关闭所有弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const salaryModal = document.getElementById('salaryModal');
            const statsModal = document.getElementById('salaryStatsModal');
            
            if (salaryModal?.style.display === 'flex') {
                salaryModal.style.display = 'none';
            }
            if (statsModal?.style.display === 'flex') {
                statsModal.style.display = 'none';
            }
        }
    });

    // 待办事项轮播
    function initTodoCarousel() {
        const todoItems = document.querySelectorAll('.todo-item');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        let currentIndex = 0;
        let autoPlayTimer;

        // 更新显示
        function updateCarousel(newIndex) {
            // 处理索引范围
            if (newIndex < 0) newIndex = todoItems.length - 1;
            if (newIndex >= todoItems.length) newIndex = 0;

            // 更新当前索引
            currentIndex = newIndex;

            // 更新待办事项显示
            todoItems.forEach((item, index) => {
                item.classList.remove('active');
                if (index === currentIndex) {
                    item.classList.add('active');
                }
            });

            // 更新指示点
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // 自动播放
        function startAutoPlay() {
            stopAutoPlay();
            autoPlayTimer = setInterval(() => {
                updateCarousel(currentIndex + 1);
            }, 5000); // 每5秒切换一次
        }

        // 停止自动播放
        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
            }
        }

        // 绑定按钮事件
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                updateCarousel(currentIndex - 1);
                startAutoPlay(); // 点击后重新开始自动播放
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                updateCarousel(currentIndex + 1);
                startAutoPlay(); // 点击后重新开始自动播放
            });
        }

        // 绑定指示点点击事件
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateCarousel(index);
                startAutoPlay(); // 点击后重新开始自动播放
            });
        });

        // 鼠标悬停时暂停自动播放
        const carousel = document.querySelector('.todo-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);
        }

        // 开始自动播放
        startAutoPlay();
    }

    // 初始化轮播
    initTodoCarousel();

    // 公文管理功能
    // 公文管理标签页切换
    const documentTabs = document.querySelectorAll('.tab-btn');
    documentTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有标签的 active 类
            documentTabs.forEach(t => t.classList.remove('active'));
            // 添加当前标签的 active 类
            tab.classList.add('active');
            // 加载对应类型的文档
            const type = tab.dataset.tab;
            loadDocuments(type);
        });
    });

    // 修改子菜单项点击事件处理
    const docMenuItems = document.querySelectorAll('.sub-menu a[href="#incoming"], .sub-menu a[href="#outgoing"]');
    docMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const documentModal = document.getElementById('documentModal');
            if (documentModal) {
                documentModal.style.display = 'flex';
                const type = item.getAttribute('href').replace('#', '');
                
                // 切换到对应标签页
                documentTabs.forEach(tab => {
                    tab.classList.toggle('active', tab.dataset.tab === type);
                });
                
                // 加载文档列表
                loadDocuments(type);
            }
        });
    });

    // 修改文档列表加载函数
    async function loadDocuments(type) {
        try {
            const listContainer = document.querySelector('.document-list');
            if (!listContainer) return;

            // 模拟不同类型的数据
            const mockData = {
                incoming: [
                    {
                        id: 1,
                        title: '关于2024年度工作计划的通知',
                        number: '[2024]001号',
                        date: '2024-01-15',
                        status: '待处理',
                        from: '总公司'
                    },
                    {
                        id: 2,
                        title: '关于开展安全生产检查的通知',
                        number: '[2024]002号',
                        date: '2024-01-14',
                        status: '处理中',
                        from: '安全部'
                    }
                ],
                outgoing: [
                    {
                        id: 3,
                        title: '关于组织开展年度考核的通知',
                        number: '[2024]003号',
                        date: '2024-01-13',
                        status: '已发布',
                        to: '各部门'
                    },
                    {
                        id: 4,
                        title: '关于春节放假安排的通知',
                        number: '[2024]004号',
                        date: '2024-01-12',
                        status: '审核中',
                        to: '全体员工'
                    }
                ]
            };

            const documents = mockData[type] || [];
            
            // 根据不同类型显示不同的列表项
            const html = documents.map(doc => `
                <div class="document-item">
                    <div class="doc-info">
                        <h4>${doc.title}</h4>
                        <p class="doc-meta">
                            <span>文号：${doc.number}</span>
                            <span>日期：${doc.date}</span>
                            <span>状态：${doc.status}</span>
                            ${type === 'incoming' ? 
                                `<span>来自：${doc.from}</span>` : 
                                `<span>发送至：${doc.to}</span>`}
                        </p>
                    </div>
                    <div class="doc-actions">
                        <button class="btn-view" onclick="viewDocument(${doc.id})">
                            <i class="fas fa-eye"></i>
                            查看
                        </button>
                        ${type === 'incoming' ? `
                            <button class="btn-process" onclick="processDocument(${doc.id})">
                                <i class="fas fa-tasks"></i>
                                处理
                            </button>
                        ` : `
                            <button class="btn-edit" onclick="editDocument(${doc.id})">
                                <i class="fas fa-edit"></i>
                                编辑
                            </button>
                        `}
                    </div>
                </div>
            `).join('');

            listContainer.innerHTML = html;
        } catch (error) {
            console.error('加载文档列表失败:', error);
            alert('加载文档列表失败');
        }
    }

    // 添加文档查看功能
    window.viewDocument = function(docId) {
        const documentDetailModal = document.getElementById('documentDetailModal');
        if (documentDetailModal) {
            // 这里可以根据 docId 加载具体文档内容
            documentDetailModal.style.display = 'flex';
        }
    };

    // 添加文档处理功能
    window.processDocument = function(docId) {
        alert(`处理文档 ${docId}`);
    };

    // 添加文档编辑功能
    window.editDocument = function(docId) {
        const documentEditModal = document.getElementById('documentEditModal');
        if (documentEditModal) {
            // 这里可以根据 docId 加载文档内容到编辑器
            documentEditModal.style.display = 'flex';
            initEditor();
        }
    };

    // 统一的关闭按钮事件处理
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.salary-modal, .document-modal, .document-detail-modal, .document-edit-modal').style.display = 'none';
        });
    });

    // 点击弹窗外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === documentModal) {
            documentModal.style.display = 'none';
        }
        if (e.target === documentDetailModal) {
            documentDetailModal.style.display = 'none';
        }
    });

    // 新建公文按钮点击事件
    const newDocBtn = document.querySelector('.btn-new-doc');
    const documentEditModal = document.getElementById('documentEditModal');

    if (newDocBtn) {
        newDocBtn.addEventListener('click', () => {
            if (documentEditModal) {
                documentEditModal.style.display = 'flex';
                initEditor();
            }
        });
    }

    // 初始化编辑器
    function initEditor() {
        const toolbar = document.querySelector('.editor-toolbar');
        if (toolbar) {
            toolbar.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const command = button.dataset.command;
                    document.execCommand(command, false, null);
                });
            });
        }

        // 处理附件上传
        const fileInput = document.getElementById('docAttachment');
        const attachmentList = document.querySelector('.attachment-list');

        if (fileInput && attachmentList) {
            fileInput.addEventListener('change', () => {
                const files = Array.from(fileInput.files);
                files.forEach(file => {
                    const item = document.createElement('div');
                    item.className = 'attachment-item';
                    item.innerHTML = `
                        <i class="fas fa-paperclip"></i>
                        <span>${file.name}</span>
                        <i class="fas fa-times remove-file"></i>
                    `;
                    
                    item.querySelector('.remove-file').addEventListener('click', () => {
                        item.remove();
                    });
                    
                    attachmentList.appendChild(item);
                });
            });
        }

        // 保存按钮事件
        const saveBtn = document.querySelector('.btn-save-doc');
        if (saveBtn) {
            saveBtn.addEventListener('click', saveDocument);
        }
    }

    // 保存公文
    async function saveDocument() {
        const title = document.querySelector('.doc-title-input').value;
        const number = document.querySelector('.doc-number-input').value;
        const security = document.querySelector('.doc-security').value;
        const department = document.querySelector('.doc-department').value;
        const content = document.querySelector('.doc-editor').innerHTML;
        const reviewer = document.querySelector('.doc-reviewer').value;

        if (!title || !number || !content) {
            alert('请填写必要信息');
            return;
        }

        try {
            const response = await fetch('/api/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    title,
                    number,
                    security,
                    department,
                    content,
                    reviewer,
                    date: new Date().toISOString()
                })
            });

            if (!response.ok) throw new Error('保存失败');

            alert('保存成功');
            documentEditModal.style.display = 'none';
            // 刷新文档列表
            loadDocuments('outgoing');
        } catch (error) {
            alert(error.message);
        }
    }

    // 更新关闭按钮和点击外部关闭的处理
    window.addEventListener('click', (e) => {
        if (e.target === documentModal) {
            documentModal.style.display = 'none';
        }
        if (e.target === documentDetailModal) {
            documentDetailModal.style.display = 'none';
        }
        if (e.target === documentEditModal) {
            documentEditModal.style.display = 'none';
        }
    });

    // 添加文档列表加载函数
    async function loadDocuments(type) {
        try {
            // 模拟从后端获取数据
            const mockData = [
                {
                    id: 1,
                    title: '关于2024年度工作计划的通知',
                    number: '[2024]001号',
                    date: '2024-01-15',
                    status: '待处理'
                },
                {
                    id: 2,
                    title: '关于开展安全生产检查的通知',
                    number: '[2024]002号',
                    date: '2024-01-14',
                    status: '处理中'
                },
                {
                    id: 3,
                    title: '关于组织开展年度考核的通知',
                    number: '[2024]003号',
                    date: '2024-01-13',
                    status: '已完成'
                }
            ];

            displayDocuments(mockData);
        } catch (error) {
            alert('加载文档列表失败');
        }
    }

    // 添加文档列表显示函数
    function displayDocuments(documents) {
        const listContainer = document.querySelector('.document-list');
        if (!listContainer) return;

        const html = documents.map(doc => `
            <div class="document-item">
                <div class="doc-info">
                    <h4>${doc.title}</h4>
                    <p class="doc-meta">
                        <span>文号：${doc.number}</span>
                        <span>发文日期：${doc.date}</span>
                        <span>状态：${doc.status}</span>
                    </p>
                </div>
                <div class="doc-actions">
                    <button class="btn-view" onclick="viewDocument(${doc.id})">
                        <i class="fas fa-eye"></i>
                        查看
                    </button>
                    <button class="btn-process" onclick="processDocument(${doc.id})">
                        <i class="fas fa-tasks"></i>
                        处理
                    </button>
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = html;
    }

    // 添加文档列表样式
    const style = document.createElement('style');
    style.textContent = `
    .document-item {
        background: white;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .doc-info h4 {
        margin-bottom: 8px;
        color: #333;
    }

    .doc-meta {
        display: flex;
        gap: 20px;
        color: #666;
        font-size: 14px;
    }

    .doc-actions {
        display: flex;
        gap: 10px;
    }

    .doc-actions button {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.3s ease;
    }

    .btn-view {
        background: #e3f2fd;
        color: #1976d2;
    }

    .btn-process {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .btn-view:hover {
        background: #bbdefb;
    }

    .btn-process:hover {
        background: #c8e6c9;
    }
    `;
    document.head.appendChild(style);

    // 在 DOMContentLoaded 事件监听器中添加消息通知功能
    const notifications = document.querySelector('.notifications');
    const badge = notifications.querySelector('.badge');
    const markAllRead = notifications.querySelector('.mark-all-read');

    // 标记全部已读
    if (markAllRead) {
        markAllRead.addEventListener('click', (e) => {
            e.stopPropagation();
            const unreadItems = notifications.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });
            badge.textContent = '0';
        });
    }

    // 点击单个消息
    const notificationItems = notifications.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('unread')) {
                item.classList.remove('unread');
                const currentCount = parseInt(badge.textContent);
                badge.textContent = Math.max(0, currentCount - 1);
            }
        });
    });
}); 