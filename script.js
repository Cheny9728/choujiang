document.addEventListener('DOMContentLoaded', function() {
    // 初始化烟花特效
    const fireworksCanvas = document.getElementById('fireworks');
    const fireworks = new Firework(fireworksCanvas);

    // 动态生成轮播图
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    const slideTexts = [
        { title: '智领风电 慧享未来', desc: '打造高质量新能源应用系统集成商' },
        { title: '创新引领 科技赋能', desc: '专注风电整机装备研制与服务' },
        { title: '海上风电引领者', desc: '打造海上风电整体解决方案' },
        { title: '智慧运维服务', desc: '全生命周期智能化运维管理' },
        // ... 可以为每张图片添加对应的文字
    ];

    // 生成20张图片的轮播
    for (let i = 1; i <= 20; i++) {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.setAttribute('data-swiper-parallax', '30%');
        
        const img = document.createElement('img');
        img.src = `Imgs/${i}.jpg`;
        img.alt = `轮播图${i}`;
        
        const textDiv = document.createElement('div');
        textDiv.className = 'slide-text';
        
        // 如果有对应的文字就使用，否则使用默认文字
        const text = slideTexts[i - 1] || { 
            title: '中船海装风电', 
            desc: '引领绿色能源发展' 
        };
        
        textDiv.innerHTML = `
            <h2>${text.title}</h2>
            <p>${text.desc}</p>
        `;
        
        slide.appendChild(img);
        slide.appendChild(textDiv);
        swiperWrapper.appendChild(slide);
    }

    // 初始化Swiper轮播图
    const mainSwiper = new Swiper('.main-swiper', {
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        speed: 1000,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    });

    // 导航栏滚动效果
    let lastScrollTop = 0;
    const mainNav = document.querySelector('.main-nav');
    const topBar = document.querySelector('.top-bar');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 顶部栏隐藏效果
        if (scrollTop > lastScrollTop && scrollTop > 50) {
            topBar.style.transform = 'translateY(-100%)';
            mainNav.style.transform = 'translateY(-' + topBar.offsetHeight + 'px)';
        } else {
            topBar.style.transform = 'translateY(0)';
            mainNav.style.transform = 'translateY(0)';
        }

        // 导航栏背景透明度变化
        if (scrollTop > 0) {
            mainNav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            mainNav.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        } else {
            mainNav.style.backgroundColor = '#fff';
            mainNav.style.boxShadow = 'none';
        }

        lastScrollTop = scrollTop;
    });

    // 导航链接hover效果
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = '#0066cc';
        });

        link.addEventListener('mouseleave', function() {
            this.style.color = '#333';
        });
    });

    // 快速入口动画
    const linkItems = document.querySelectorAll('.link-item');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    linkItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease-out';
        observer.observe(item);
    });

    // 新闻列表hover效果
    const newsItems = document.querySelectorAll('.news-list .news-item');
    newsItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f5f5f5';
            this.querySelector('h3').style.color = '#0066cc';
        });

        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.querySelector('h3').style.color = '#333';
        });
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = mainNav.offsetHeight;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 图片懒加载
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // 语言切换
    const langSwitch = document.querySelector('.lang-switch');
    if (langSwitch) {
        langSwitch.addEventListener('click', function() {
            // 这里添加语言换逻辑
            const currentLang = this.textContent.includes('中文') ? 'English' : '中文';
            this.textContent = currentLang === '中文' ? '中文 | English' : 'English | 中文';
        });
    }

    // 页面加载完成后的���画
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // 添加首屏动画
        const heroContent = document.querySelector('.slide-text');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'all 1s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 500);
        }
    });

    // 登录和注册功能
    const loginBtn = document.querySelector('.oa-login-btn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeBtns = document.querySelectorAll('.close-btn');
    const registerLink = document.querySelector('.register-link');
    const loginLink = document.querySelector('.login-link');

    // 打开登录弹窗
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'flex';
    });

    // 切换到注册弹窗
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'flex';
    });

    // 切换到登录弹窗
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'flex';
    });

    // 关闭弹窗
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });

    // 点击弹窗外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });

    // 密码可见性切换
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // 输入框焦点效果
    document.querySelectorAll('.form-group input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // 社交登录按钮效果
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 这里添加社交登录逻辑
            alert('社交登录功能开发中...');
        });
    });

    // 登录表单处理
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // 默认账户登录验证（临时方案）
        const defaultAccounts = [
            { username: 'admin', password: 'admin123' },
            { username: 'user', password: 'user123' },
            { username: 'test', password: 'test123' }
        ];

        // 检查是否匹配默认账��
        const matchedAccount = defaultAccounts.find(
            account => account.username === username && account.password === password
        );

        if (matchedAccount) {
            // 登录成功
            const mockUserData = {
                id: 1,
                username: matchedAccount.username,
                role: matchedAccount.username === 'admin' ? 'admin' : 'user'
            };

            // 存储用户信息
            localStorage.setItem('user_info', JSON.stringify(mockUserData));
            localStorage.setItem('auth_token', 'mock_token_' + Date.now());

            // 显示成功消息
            alert('登录成功！');

            // 跳转到OA系统
            window.location.href = 'oa-system/index.html';
        } else {
            // 登录失败
            showError('username', '用户名或密码错误');
        }
    });

    // 显示错误信息函数
    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        // 移除已存在的错误消息
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    }
});

// 烟花特效类定义
class Firework {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        // 调整画布大小
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 监听鼠标移动
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
        // 减少粒子数量，缩小粒子大小
        for (let i = 0; i < 8; i++) { // 从15个减少到8个
            const angle = (Math.PI * 2 / 8) * i;
            const velocity = 0.8 + Math.random() * 1.2; // 降低速度
            
            this.particles.push({
                x: this.mouse.x,
                y: this.mouse.y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                color: `hsla(${Math.random() * 360}, 70%, 60%, 0.8)`, // 添加透明度
                size: 1 + Math.random() * 1.5 // 缩小粒子尺寸
            });
        }
    }
    
    animate() {
        // 完全透明的背景，不会遮挡网页内容
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // 更新位置
            p.x += p.vx;
            p.y += p.vy;
            
            // 减小重力效果
            p.vy += 0.03; // 减小重力
            
            // 减慢生命值衰减
            p.life *= 0.98;
            
            // 绘制粒子，添加模糊效果使其更柔和
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            // 如果生命值太低，移除粒子
            if (p.life < 0.01) {
                this.particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
} 