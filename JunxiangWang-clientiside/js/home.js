// home.js - 首页JavaScript逻辑

// 当页面完全加载后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 首页加载完成，开始初始化...');
    
    // 获取页面元素
    const eventsContainer = document.getElementById('events-container');
    const loadingElement = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    
    // 初始化页面
    initializePage();
    
    function initializePage() {
        console.log('🔄 开始加载活动数据...');
        loadEvents();
        setupModal();
    }
    
    // 加载活动数据
    function loadEvents() {
        // 显示加载状态
        showLoading();
        
        // 调用API获取活动数据
        fetch('http://localhost:3000/api/events/home')
            .then(handleResponse)
            .then(displayEvents)
            .catch(handleError);
    }
    
    // 处理API响应
    function handleResponse(response) {
        console.log('📡 接收到API响应，状态:', response.status);
        
        if (!response.ok) {
            throw new Error(`网络请求失败: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }
    
    // 显示活动数据
    function displayEvents(events) {
        console.log('✅ 成功获取活动数据:', events.length + '个活动');
        
        // 隐藏加载状态
        hideLoading();
        
        if (events.length === 0) {
            showNoEventsMessage();
            return;
        }
        
        // 生成活动卡片HTML
        const eventsHTML = events.map(createEventCard).join('');
        eventsContainer.innerHTML = eventsHTML;
        
        console.log('🎉 活动列表渲染完成');
    }
    
    // 创建单个活动卡片
    function createEventCard(event) {
        // 计算筹款进度
        const progressPercent = calculateProgress(event.current_amount, event.goal_amount);
        
        // 格式化日期
        const formattedDate = formatEventDate(event.event_date);
        
        return `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-image">
                    ${event.image_url ? 
                        `<img src="${event.image_url}" alt="${event.title}" onerror="this.style.display='none'">` : 
                        '<div class="no-image">📷 活动图片</div>'
                    }
                </div>
                <div class="event-card-content">
                    <div class="event-header">
                        <span class="category">${event.category_name}</span>
                        <span class="status upcoming">即将开始</span>
                    </div>
                    <h3 class="event-title">${escapeHtml(event.title)}</h3>
                    <div class="event-details">
                        <p class="event-time">📅 ${formattedDate}</p>
                        <p class="event-location">📍 ${escapeHtml(event.location)}</p>
                        <p class="event-description">${escapeHtml(event.description)}</p>
                    </div>
                    <div class="progress-section">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="progress-text">
                            <span class="progress-percent">${progressPercent}% 已完成</span>
                            <span class="progress-amount">$${event.current_amount} / $${event.goal_amount}</span>
                        </div>
                    </div>
                    <a href="event-detail.html?id=${event.id}" class="btn view-details-btn">查看详情</a>
                </div>
            </div>
        `;
    }
    
    // 计算进度百分比
    function calculateProgress(current, goal) {
        if (!goal || goal === 0) return 0;
        const percent = (current / goal * 100);
        return Math.min(percent, 100).toFixed(1);
    }
    
    // 格式化活动日期
    function formatEventDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // HTML转义，防止XSS攻击
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 显示加载状态
    function showLoading() {
        loadingElement.style.display = 'block';
        errorDiv.style.display = 'none';
    }
    
    // 隐藏加载状态
    function hideLoading() {
        loadingElement.style.display = 'none';
    }
    
    // 显示无活动消息
    function showNoEventsMessage() {
        eventsContainer.innerHTML = `
            <div class="no-events-message">
                <h3>暂无活动</h3>
                <p>目前没有正在进行的慈善活动，请稍后再来查看。</p>
            </div>
        `;
    }
    
    // 处理错误
    function handleError(error) {
        console.error('❌ 加载活动失败:', error);
        
        hideLoading();
        showError(error.message);
    }
    
    // 显示错误信息
    function showError(message) {
        errorDiv.style.display = 'block';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>加载失败</h3>
                <p>${escapeHtml(message)}</p>
                <div class="error-suggestions">
                    <p>请检查：</p>
                    <ul>
                        <li>后端服务器是否运行</li>
                        <li>网络连接是否正常</li>
                        <li>API服务是否可用</li>
                    </ul>
                </div>
                <button onclick="window.location.reload()" class="btn retry-btn">重新加载</button>
            </div>
        `;
    }
    
    // 设置模态框
    function setupModal() {
        const registerModal = document.getElementById('registerModal');
        const closeModalBtn = document.querySelector('.close-modal');
        
        if (!registerModal || !closeModalBtn) return;
        
        // 全局函数，用于显示注册模态框
        window.showRegisterModal = function() {
            console.log('🔄 显示注册模态框');
            registerModal.style.display = 'flex';
        };
        
        // 关闭模态框
        closeModalBtn.onclick = function() {
            console.log('🔄 关闭注册模态框');
            registerModal.style.display = 'none';
        };
        
        // 点击模态框外部关闭
        window.onclick = function(event) {
            if (event.target === registerModal) {
                registerModal.style.display = 'none';
            }
        };
    }
    
    console.log('✅ 首页JavaScript初始化完成');
});