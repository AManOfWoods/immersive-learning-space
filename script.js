// 导航栏滚动效果
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 移动端菜单切换
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// 点击导航链接后关闭移动端菜单
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// 场景标签切换
const tabBtns = document.querySelectorAll('.tab-btn');
const scenarioPanels = document.querySelectorAll('.scenario-panel');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // 移除所有active状态
        tabBtns.forEach(b => b.classList.remove('active'));
        scenarioPanels.forEach(p => p.classList.remove('active'));
        
        // 添加当前active状态
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// 滚动动画
const revealElements = document.querySelectorAll('.feature-card, .overview-card, .construct-item, .spec-item, .impact-card, .scenario-card, .element-item');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - revealPoint) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// 初始设置
revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
});

// 为不同元素设置延迟
revealElements.forEach((el, index) => {
    el.style.transitionDelay = `${(index % 6) * 0.1}s`;
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 数字计数动画
const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// 检测specs区域进入视口时触发动画
const specsSection = document.querySelector('.specs-grid');
let specsAnimated = false;

const animateSpecs = () => {
    if (specsAnimated) return;
    
    const rect = specsSection?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight - 100) {
        specsAnimated = true;
        // 这里可以添加数字动画效果
    }
};

window.addEventListener('scroll', animateSpecs);

// 视差效果（英雄区粒子）
window.addEventListener('mousemove', (e) => {
    const particles = document.querySelector('.hero-particles');
    if (particles) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        particles.style.transform = `translate(${x}px, ${y}px)`;
    }
});

console.log('%c🎓 沉浸式数智学习空间', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%c让知识"活"起来，让学习"动"起来', 'font-size: 14px; color: #94a3b8;');
