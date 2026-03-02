// FindIt School Lost & Found System - Professional Version (Updated)

// ===== APPLICATION STATE =====
const state = {
    currentUser: null,
    users: [],
    items: [],
    comments: [],
    messages: [],
    passwordRequests: [],
    currentPage: 'home',
    notifications: [],
    search: {
        lost: '',
        found: ''
    }
};

// ===== DOM ELEMENTS =====
const elements = {
    // Navigation
    navMenu: document.getElementById('navMenu'),
    mobileToggle: document.getElementById('mobileToggle'),
    navLinks: document.querySelectorAll('.nav-link'),
    authBtn: document.getElementById('authBtn'),
    adminBtn: document.getElementById('adminBtn'),
    userProfile: document.getElementById('userProfile'),
    profileTrigger: document.getElementById('profileTrigger'),
    profileMenu: document.getElementById('profileMenu'),
    userName: document.getElementById('userName'),
    logoutBtn: document.getElementById('logoutBtn'),
    viewProfileBtn: document.getElementById('viewProfileBtn'),
    myReportsBtn: document.getElementById('myReportsBtn'),
    myInboxBtn: document.getElementById('myInboxBtn'),
    
    // Pages
    pages: document.querySelectorAll('.page'),
    
    // Auth Modals
    modals: {
        signin: document.getElementById('signinModal'),
        signup: document.getElementById('signupModal'),
        forgotPassword: document.getElementById('forgotPasswordModal'),
        profile: document.getElementById('profileModal'),
        userView: document.getElementById('userViewModal'),
        inbox: document.getElementById('inboxModal'),
        adminPanel: document.getElementById('adminPanelModal'),
        resetPassword: document.getElementById('resetPasswordModal')
    },
    
    // Forms
    forms: {
        signin: document.getElementById('signinForm'),
        signup: document.getElementById('signupForm'),
        forgotPassword: document.getElementById('forgotPasswordForm'),
        itemReport: document.getElementById('itemReportForm'),
        contact: document.getElementById('contactForm'),
        resetPassword: document.getElementById('resetPasswordForm')
    },
    
    // Report Form
    reporterGrade: document.getElementById('reporterGrade'),
    itemImage: document.getElementById('itemImage'),
    selectImageBtn: document.getElementById('selectImageBtn'),
    imagePreview: document.getElementById('imagePreview'),
    previewImage: document.getElementById('previewImage'),
    removeImageBtn: document.getElementById('removeImageBtn'),
    uploadBox: document.getElementById('uploadBox'),
    submitReportBtn: document.getElementById('submitReportBtn'),
    
    // Search
    searchLostInput: document.getElementById('searchLostInput'),
    searchFoundInput: document.getElementById('searchFoundInput'),
    
    // Items Containers
    lostItemsGrid: document.getElementById('lostItemsGrid'),
    foundItemsGrid: document.getElementById('foundItemsGrid'),
    noLostItems: document.getElementById('noLostItems'),
    noFoundItems: document.getElementById('noFoundItems'),
    
    // Profile
    profileName: document.getElementById('profileName'),
    profileEmail: document.getElementById('profileEmail'),
    profileGrade: document.getElementById('profileGrade'),
    profileRole: document.getElementById('profileRole'),
    reportedCount: document.getElementById('reportedCount'),
    recoveredCount: document.getElementById('recoveredCount'),
    profileAvatarContainer: document.getElementById('profileAvatarContainer'),
    profileAvatarIcon: document.getElementById('profileAvatarIcon'),
    profileAvatarImage: document.getElementById('profileAvatarImage'),
    avatarUploadBtn: document.getElementById('avatarUploadBtn'),
    avatarUpload: document.getElementById('avatarUpload'),
    
    // User View Profile
    viewProfileName: document.getElementById('viewProfileName'),
    viewProfileEmail: document.getElementById('viewProfileEmail'),
    viewProfileGrade: document.getElementById('viewProfileGrade'),
    viewProfileRole: document.getElementById('viewProfileRole'),
    viewProfileAvatar: document.getElementById('viewProfileAvatar'),
    viewProfileAvatarIcon: document.getElementById('viewProfileAvatarIcon'),
    viewProfileAvatarImage: document.getElementById('viewProfileAvatarImage'),
    viewReportedCount: document.getElementById('viewReportedCount'),
    viewRecoveredCount: document.getElementById('viewRecoveredCount'),
    
    // Admin Panel
    inboxBadge: document.getElementById('inboxBadge'),
    messageList: document.getElementById('messageList'),
    messageView: document.getElementById('messageView'),
    searchUsersInput: document.getElementById('searchUsersInput'),
    usersList: document.getElementById('usersList'),
    passwordRequests: document.getElementById('passwordRequests'),
    searchAdminItemsInput: document.getElementById('searchAdminItemsInput'),
    adminItemsList: document.getElementById('adminItemsList'),
    
    // User Inbox
    userMessageList: document.getElementById('userMessageList'),
    userMessageView: document.getElementById('userMessageView')
};

// ===== INITIALIZATION =====
function init() {
    loadData();
    setupEventListeners();
    checkAuth();
    showPage('home');
    cleanupOldItems(); // Clean up old found items
    
    setTimeout(() => {
        document.querySelector('.intro-animation').style.display = 'none';
    }, 2000);
    
    console.log('FindIt System Initialized');
}

// ===== DATA MANAGEMENT =====
function loadData() {
    try {
        // Load users
        const savedUsers = localStorage.getItem('findit_users');
        if (savedUsers) {
            state.users = JSON.parse(savedUsers);
        } else {
            // Add default admin user
            state.users = [{
                id: 1,
                name: 'Admin',
                email: 'howardemia37@gmail.com',
                password: 'AdminPanel67',
                grade: 'Grade 12',
                role: 'admin',
                profileImage: '',
                createdAt: new Date().toISOString(),
                reportedItems: [],
                recoveredItems: [],
                unreadMessages: 0
            }];
            saveUsers();
        }
        
        // Load items
        const savedItems = localStorage.getItem('findit_items');
        state.items = savedItems ? JSON.parse(savedItems) : [];
        
        // Load comments
        const savedComments = localStorage.getItem('findit_comments');
        state.comments = savedComments ? JSON.parse(savedComments) : [];
        
        // Load messages
        const savedMessages = localStorage.getItem('findit_messages');
        state.messages = savedMessages ? JSON.parse(savedMessages) : [];
        
        // Load password requests
        const savedRequests = localStorage.getItem('findit_password_requests');
        state.passwordRequests = savedRequests ? JSON.parse(savedRequests) : [];
        
        // Load current user
        const savedUser = localStorage.getItem('findit_currentUser');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            const user = state.users.find(u => u.email === userData.email);
            if (user && user.password === userData.password) {
                state.currentUser = user;
            } else {
                localStorage.removeItem('findit_currentUser');
            }
        }
    } catch (error) {
        console.error('Error loading data:', error);
        resetData();
    }
}

function saveData() {
    localStorage.setItem('findit_items', JSON.stringify(state.items));
    localStorage.setItem('findit_comments', JSON.stringify(state.comments));
    localStorage.setItem('findit_messages', JSON.stringify(state.messages));
    localStorage.setItem('findit_password_requests', JSON.stringify(state.passwordRequests));
    saveUsers();
    if (state.currentUser) {
        localStorage.setItem('findit_currentUser', JSON.stringify({
            email: state.currentUser.email,
            password: state.currentUser.password
        }));
    }
}

function saveUsers() {
    localStorage.setItem('findit_users', JSON.stringify(state.users));
}

function resetData() {
    localStorage.clear();
    state.users = [];
    state.items = [];
    state.comments = [];
    state.messages = [];
    state.passwordRequests = [];
    state.currentUser = null;
    loadData();
}

// ===== CLEANUP OLD ITEMS =====
function cleanupOldItems() {
    const now = new Date();
    const twentyDaysAgo = new Date(now.getTime() - (20 * 24 * 60 * 60 * 1000));
    
    state.items = state.items.filter(item => {
        if (item.status === 'found' && item.isFound) {
            const foundDate = new Date(item.foundAt || item.createdAt);
            return foundDate > twentyDaysAgo;
        }
        return true;
    });
    
    saveData();
    console.log('Cleaned up old found items');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Mobile Toggle
    elements.mobileToggle.addEventListener('click', () => {
        elements.navMenu.classList.toggle('show');
    });
    
    // Navigation Links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
            elements.navMenu.classList.remove('show');
        });
    });
    
    // Footer Links
    document.querySelectorAll('.footer-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Hero Section Buttons
    document.querySelectorAll('.hero-actions a').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Auth Button
    elements.authBtn.addEventListener('click', () => showModal('signin'));
    
    // Admin Button
    elements.adminBtn.addEventListener('click', () => {
        showModal('adminPanel');
        loadAdminPanel();
    });
    
    // Profile Menu
    elements.profileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.profileMenu.classList.toggle('show');
    });
    
    // Close profile menu when clicking outside
    document.addEventListener('click', () => {
        elements.profileMenu.classList.remove('show');
    });
    
    // Profile Actions
    elements.viewProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('profile');
        updateProfile();
        elements.profileMenu.classList.remove('show');
    });
    
    elements.myReportsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('lost');
        filterMyItems();
        elements.profileMenu.classList.remove('show');
    });
    
    elements.myInboxBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('inbox');
        loadUserInbox();
        elements.profileMenu.classList.remove('show');
    });
    
    elements.logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
        elements.profileMenu.classList.remove('show');
    });
    
    // Modal Close Buttons
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Auth Form Switches
    document.querySelectorAll('.switch-to-signup').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            showModal('signup');
        });
    });
    
    document.querySelectorAll('.switch-to-signin').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            showModal('signin');
        });
    });
    
    document.querySelectorAll('.forgot-password-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            showModal('forgotPassword');
        });
    });
    
    // Form Submissions
    elements.forms.signin.addEventListener('submit', handleSignIn);
    elements.forms.signup.addEventListener('submit', handleSignUp);
    elements.forms.forgotPassword.addEventListener('submit', handleForgotPassword);
    elements.forms.itemReport.addEventListener('submit', handleItemReport);
    elements.forms.contact.addEventListener('submit', handleContact);
    elements.forms.resetPassword.addEventListener('submit', handlePasswordReset);
    
    // Toggle Password Visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const input = document.getElementById(target);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
    
    // Image Upload for Report
    elements.selectImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.itemImage.click();
    });
    
    elements.itemImage.addEventListener('change', handleItemImageUpload);
    elements.removeImageBtn.addEventListener('click', removeItemImage);
    
    elements.uploadBox.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn')) {
            elements.itemImage.click();
        }
    });
    
    // Profile Image Upload
    elements.avatarUploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.avatarUpload.click();
    });
    
    elements.avatarUpload.addEventListener('change', handleProfileImageUpload);
    
    // Search Functionality
    elements.searchLostInput.addEventListener('input', debounce(() => {
        state.search.lost = elements.searchLostInput.value;
        displayItems('lost');
    }, 300));
    
    elements.searchFoundInput.addEventListener('input', debounce(() => {
        state.search.found = elements.searchFoundInput.value;
        displayItems('found');
    }, 300));
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('itemDate').value = today;
    
    // Date input fix for 6-digit year
    document.getElementById('itemDate').addEventListener('input', function(e) {
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });
    
    // Admin Panel Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchAdminTab(tab);
        });
    });
}

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    // Update active page
    elements.pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
        }
    });
    
    // Update active nav link
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    state.currentPage = pageId;
    
    // Page-specific actions
    switch(pageId) {
        case 'lost':
            displayItems('lost');
            break;
        case 'found':
            displayItems('found');
            break;
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== AUTHENTICATION =====
function checkAuth() {
    if (state.currentUser) {
        elements.authBtn.style.display = 'none';
        elements.userProfile.style.display = 'block';
        elements.userName.textContent = state.currentUser.name.split(' ')[0];
        
        // Show admin button for admin users
        if (state.currentUser.role === 'admin') {
            elements.adminBtn.style.display = 'flex';
        } else {
            elements.adminBtn.style.display = 'none';
        }
        
        // Load profile image if exists
        if (state.currentUser.profileImage) {
            elements.profileAvatarImage.src = state.currentUser.profileImage;
            elements.profileAvatarImage.style.display = 'block';
            elements.profileAvatarIcon.style.display = 'none';
        }
        
        // Update admin inbox badge
        updateInboxCount();
    } else {
        elements.authBtn.style.display = 'flex';
        elements.userProfile.style.display = 'none';
        elements.adminBtn.style.display = 'none';
    }
}

function handleSignIn(e) {
    e.preventDefault();
    
    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const user = state.users.find(u => u.email === email && u.password === password);
    
    if (user) {
        state.currentUser = user;
        saveData();
        checkAuth();
        closeAllModals();
        showNotification(`Welcome back, ${user.name}!`, 'success');
        elements.forms.signin.reset();
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleSignUp(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const grade = document.getElementById('signupGrade').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validation
    if (!name || !email || !grade || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Check if user exists
    if (state.users.some(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }
    
    // Create user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        grade: `Grade ${grade}`,
        role: 'student',
        profileImage: '',
        createdAt: new Date().toISOString(),
        reportedItems: [],
        recoveredItems: [],
        unreadMessages: 0
    };
    
    state.users.push(newUser);
    state.currentUser = newUser;
    saveData();
    checkAuth();
    
    closeAllModals();
    showNotification('Account created successfully!', 'success');
    elements.forms.signup.reset();
}

function handleForgotPassword(e) {
    e.preventDefault();
    
    const name = document.getElementById('resetName').value.trim();
    const email = document.getElementById('resetEmail').value.trim();
    const message = document.getElementById('resetMessage').value.trim();
    
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Check if user exists
    const user = state.users.find(u => u.email === email);
    if (!user) {
        showNotification('Email not found in our system', 'error');
        return;
    }
    
    // Create password reset request
    const request = {
        id: Date.now(),
        userId: user.id,
        userName: name,
        userEmail: email,
        message: message,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    state.passwordRequests.unshift(request);
    saveData();
    
    // Send notification to admin
    sendMessageToAdmin({
        fromName: name,
        fromEmail: email,
        subject: 'Password Reset Request',
        message: `User ${name} (${email}) requested a password reset. Message: ${message}`,
        type: 'password_reset'
    });
    
    closeAllModals();
    showModal('signin');
    showNotification('Password reset request sent to admin. You will be contacted soon.', 'success');
    elements.forms.forgotPassword.reset();
}

function logout() {
    state.currentUser = null;
    localStorage.removeItem('findit_currentUser');
    checkAuth();
    showNotification('Signed out successfully', 'success');
    showPage('home');
}

// ===== ITEM MANAGEMENT =====
function handleItemReport(e) {
    e.preventDefault();
    
    if (!state.currentUser) {
        showNotification('Please sign in to report items', 'warning');
        showModal('signin');
        return;
    }
    
    // Get form values
    const itemData = {
        id: Date.now(),
        name: document.getElementById('itemName').value.trim(),
        category: document.getElementById('itemCategory').value,
        description: document.getElementById('itemDescription').value.trim(),
        date: document.getElementById('itemDate').value,
        location: document.getElementById('itemLocation').value.trim(),
        status: document.querySelector('input[name="itemStatus"]:checked').value,
        grade: document.getElementById('reporterGrade').value,
        reporterId: state.currentUser.id,
        reporterName: state.currentUser.name,
        reporterEmail: state.currentUser.email,
        image: elements.previewImage.src || '',
        createdAt: new Date().toISOString(),
        isFound: false,
        comments: []
    };
    
    // If item is found, set isFound and foundAt
    if (itemData.status === 'found') {
        itemData.isFound = true;
        itemData.foundAt = new Date().toISOString();
    }
    
    // Validation
    if (!itemData.name || !itemData.category || !itemData.description || 
        !itemData.date || !itemData.location || !itemData.grade) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Add item
    state.items.unshift(itemData);
    state.currentUser.reportedItems.push(itemData.id);
    
    saveData();
    showNotification(`Item reported as ${itemData.status}!`, 'success');
    
    // Reset form
    elements.forms.itemReport.reset();
    removeItemImage();
    document.getElementById('itemDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('reporterGrade').value = '12';
    
    // Redirect to items page
    setTimeout(() => {
        showPage(itemData.status);
    }, 1500);
}

function displayItems(type) {
    const container = type === 'lost' ? elements.lostItemsGrid : elements.foundItemsGrid;
    const noItems = type === 'lost' ? elements.noLostItems : elements.noFoundItems;
    const searchQuery = state.search[type].toLowerCase();
    
    // Filter items
    let items = state.items.filter(item => item.status === type);
    
    // Apply search filter
    if (searchQuery) {
        items = items.filter(item => 
            item.name.toLowerCase().includes(searchQuery) ||
            item.description.toLowerCase().includes(searchQuery) ||
            item.location.toLowerCase().includes(searchQuery) ||
            item.category.toLowerCase().includes(searchQuery)
        );
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Display items
    if (items.length === 0) {
        noItems.style.display = 'block';
    } else {
        noItems.style.display = 'none';
        items.forEach(item => {
            const itemCard = createItemCard(item);
            container.appendChild(itemCard);
        });
    }
}

function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = item.id;
    
    const badgeClass = item.status === 'lost' ? 'badge-lost' : 'badge-found';
    const badgeText = item.status === 'lost' ? 'LOST' : 'FOUND';
    
    // Show image or no-image message
    let imageHtml = '';
    if (item.image) {
        imageHtml = `<img src="${item.image}" class="item-image" alt="${item.name}">`;
    } else {
        imageHtml = '<div class="item-image no-image"><span>This user didn\'t upload a photo.</span></div>';
    }
    
    // Get user profile image or icon
    const reporter = state.users.find(u => u.id === item.reporterId);
    let reporterAvatar = '<i class="fas fa-user"></i>';
    if (reporter && reporter.profileImage) {
        reporterAvatar = `<img src="${reporter.profileImage}" class="reporter-avatar-img" alt="${reporter.name}">`;
    }
    
    card.innerHTML = `
        ${imageHtml}
        <div class="item-content">
            <div class="item-header">
                <h3 class="item-title">${item.name}</h3>
                <span class="item-badge ${badgeClass}">${badgeText}</span>
            </div>
            <div class="item-meta">
                <span><i class="far fa-calendar"></i> ${formatDate(item.date)}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${item.location}</span>
                <span><i class="fas fa-tag"></i> ${item.category}</span>
            </div>
            <p class="item-description">${item.description}</p>
            <div class="item-footer">
                <div class="reporter-info">
                    <div class="reporter-avatar" data-user-id="${item.reporterId}">
                        ${reporterAvatar}
                    </div>
                    <span class="reporter-name" data-user-id="${item.reporterId}">${item.reporterName} • ${item.grade}</span>
                </div>
                <button class="btn btn-outline btn-view" data-id="${item.id}">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
    `;
    
    // Add event listener for view button
    card.querySelector('.btn-view').addEventListener('click', (e) => {
        e.stopPropagation();
        showItemDetail(item.id);
    });
    
    // Add event listener for user profile click
    const reporterElements = card.querySelectorAll('[data-user-id]');
    reporterElements.forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const userId = parseInt(el.getAttribute('data-user-id'));
            viewUserProfile(userId);
        });
    });
    
    // Make card clickable
    card.addEventListener('click', () => {
        showItemDetail(item.id);
    });
    
    return card;
}

function showItemDetail(itemId) {
    const item = state.items.find(i => i.id === itemId);
    if (!item) return;
    
    // Get comments for this item
    const itemComments = state.comments.filter(comment => comment.itemId === itemId);
    
    // Get reporter user
    const reporter = state.users.find(u => u.id === item.reporterId);
    
    // Create modal content
    const modalContent = `
        <div class="modal" id="itemDetailModal">
            <div class="modal-content" style="max-width: 700px; padding: 2rem;">
                <button class="close-modal-btn">&times;</button>
                <h2 style="display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem;">
                    <i class="fas ${item.status === 'lost' ? 'fa-search' : 'fa-hand-holding-heart'}"></i>
                    ${item.name}
                </h2>
                
                ${item.image ? 
                    `<img src="${item.image}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: var(--radius); margin-bottom: 1.5rem;">` : 
                    `<div style="width: 100%; height: 200px; background: var(--gray-light); display: flex; align-items: center; justify-content: center; border-radius: var(--radius); margin-bottom: 1.5rem; color: var(--gray);">This user didn\'t upload a photo.</div>`
                }
                
                <div style="display: grid; gap: 1.5rem;">
                    <div>
                        <h3 style="margin-bottom: 0.5rem; color: var(--primary);">Description</h3>
                        <p style="color: var(--dark); line-height: 1.6;">${item.description}</p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <h4 style="margin-bottom: 0.3rem; color: var(--gray); font-size: 0.9rem;">Category</h4>
                            <p style="color: var(--dark);">${item.category}</p>
                        </div>
                        <div>
                            <h4 style="margin-bottom: 0.3rem; color: var(--gray); font-size: 0.9rem;">Date</h4>
                            <p style="color: var(--dark);">${formatDate(item.date)}</p>
                        </div>
                        <div>
                            <h4 style="margin-bottom: 0.3rem; color: var(--gray); font-size: 0.9rem;">Location</h4>
                            <p style="color: var(--dark);">${item.location}</p>
                        </div>
                        <div>
                            <h4 style="margin-bottom: 0.3rem; color: var(--gray); font-size: 0.9rem;">Status</h4>
                            <p style="color: var(--dark); font-weight: 500; text-transform: uppercase;">${item.status}</p>
                            ${item.status === 'found' ? '<p style="color: var(--warning); font-size: 0.9rem; margin-top: 0.5rem;"><i class="fas fa-clock"></i> This item will be deleted within 20 days.</p>' : ''}
                        </div>
                    </div>
                    
                    <div style="background: var(--gray-light); padding: 1rem; border-radius: var(--radius);">
                        <h4 style="margin-bottom: 0.5rem; color: var(--dark);">Reporter Information</h4>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem;">
                            ${reporter && reporter.profileImage ? 
                                `<img src="${reporter.profileImage}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` :
                                `<i class="fas fa-user" style="font-size: 1.5rem; color: var(--primary);"></i>`
                            }
                            <div>
                                <p style="color: var(--dark); margin: 0; font-weight: 500;">${item.reporterName}</p>
                                <p style="color: var(--gray); margin: 0; font-size: 0.9rem;">${item.grade}</p>
                            </div>
                        </div>
                        <p style="color: var(--dark); margin: 0;"><strong>Email:</strong> ${item.reporterEmail}</p>
                    </div>
                    
                    <!-- Comments Section -->
                    <div class="comments-section">
                        <h3 style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; color: var(--primary);">
                            <i class="fas fa-comments"></i> Comments
                        </h3>
                        
                        <div class="comments-list" id="commentsList-${item.id}" style="max-height: 300px; overflow-y: auto; margin-bottom: 1rem;">
                            ${itemComments.length === 0 ? 
                                '<p style="color: var(--gray); text-align: center; padding: 2rem;">No comments yet. Be the first to comment!</p>' : 
                                itemComments.map(comment => {
                                    const commentUser = state.users.find(u => u.id === comment.userId);
                                    const commentTime = timeAgo(comment.createdAt);
                                    const totalLikes = comment.likes ? comment.likes.length : 0;
                                    return `
                                        <div class="comment" style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-light);">
                                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                    ${commentUser && commentUser.profileImage ? 
                                                        `<img src="${commentUser.profileImage}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;">` :
                                                        `<i class="fas fa-user-circle" style="color: var(--primary);"></i>`
                                                    }
                                                    <div>
                                                        <strong style="color: var(--dark);">${commentUser ? commentUser.name : 'Unknown User'}</strong>
                                                        <span style="color: var(--gray); font-size: 0.8rem; margin-left: 10px;">${commentTime}</span>
                                                    </div>
                                                </div>
                                                ${(state.currentUser && state.currentUser.id === comment.userId) || (state.currentUser && state.currentUser.role === 'admin') ? 
                                                    `<button onclick="deleteComment(${comment.id}, ${item.id})" style="background: none; border: none; color: var(--danger); cursor: pointer;">
                                                        <i class="fas fa-trash"></i>
                                                    </button>` : ''
                                                }
                                            </div>
                                            <p style="color: var(--dark); margin: 0;">${comment.text}</p>
                                            <div style="display: flex; align-items: center; gap: 15px; margin-top: 0.5rem;">
                                                <button onclick="likeComment(${comment.id})" style="background: none; border: none; color: ${comment.likes && comment.likes.includes(state.currentUser?.id) ? 'var(--primary)' : 'var(--gray)'}; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                                                    <i class="fas fa-thumbs-up"></i>
                                                    <span>${totalLikes}</span>
                                                </button>
                                                ${state.currentUser ? `
                                                    <button onclick="replyToComment(${comment.id}, ${item.id}, '${commentUser ? commentUser.name : 'User'}')" style="background: none; border: none; color: var(--gray); cursor: pointer;">
                                                        Reply
                                                    </button>
                                                ` : ''}
                                            </div>
                                            <!-- Replies -->
                                            ${comment.replies && comment.replies.length > 0 ? `
                                                <div style="margin-top: 1rem; padding-left: 2rem; border-left: 2px solid var(--gray-light);">
                                                    ${comment.replies.map(reply => {
                                                        const replyUser = state.users.find(u => u.id === reply.userId);
                                                        const replyTime = timeAgo(reply.createdAt);
                                                        return `
                                                            <div style="margin-bottom: 0.75rem; padding: 0.75rem; background: rgba(0,0,0,0.02); border-radius: var(--radius);">
                                                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
                                                                    <div style="display: flex; align-items: center; gap: 8px;">
                                                                        ${replyUser && replyUser.profileImage ? 
                                                                            `<img src="${replyUser.profileImage}" style="width: 25px; height: 25px; border-radius: 50%; object-fit: cover;">` :
                                                                            `<i class="fas fa-user-circle" style="color: var(--primary); font-size: 0.9rem;"></i>`
                                                                        }
                                                                        <strong style="color: var(--dark); font-size: 0.9rem;">${replyUser ? replyUser.name : 'Unknown User'}</strong>
                                                                        <span style="color: var(--gray); font-size: 0.7rem;">${replyTime}</span>
                                                                    </div>
                                                                    ${(state.currentUser && state.currentUser.id === reply.userId) || (state.currentUser && state.currentUser.role === 'admin') ? 
                                                                        `<button onclick="deleteReply(${comment.id}, ${reply.id}, ${item.id})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 0.8rem;">
                                                                            <i class="fas fa-trash"></i>
                                                                        </button>` : ''
                                                                    }
                                                                </div>
                                                                <p style="color: var(--dark); margin: 0; font-size: 0.9rem;">${reply.text}</p>
                                                            </div>
                                                        `;
                                                    }).join('')}
                                                </div>
                                            ` : ''}
                                        </div>
                                    `;
                                }).join('')
                            }
                        </div>
                        
                        ${state.currentUser ? `
                            <div class="comment-form">
                                <textarea id="commentInput-${item.id}" placeholder="Add a comment..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--gray-light); border-radius: var(--radius); margin-bottom: 0.5rem; resize: vertical;"></textarea>
                                <button onclick="addComment(${item.id})" class="btn btn-primary" style="width: 100%;">
                                    <i class="fas fa-paper-plane"></i> Post Comment
                                </button>
                            </div>
                        ` : `
                            <div style="text-align: center; padding: 1rem; background: var(--gray-light); border-radius: var(--radius);">
                                <p style="color: var(--gray); margin: 0;">Please <a href="#" onclick="showModal('signin'); return false;" style="color: var(--primary);">sign in</a> to add comments</p>
                            </div>
                        `}
                    </div>
                    
                    ${(state.currentUser && state.currentUser.id === item.reporterId) || (state.currentUser && state.currentUser.role === 'admin') ? `
                        <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                            ${item.status === 'lost' ? `
                                <button class="btn btn-success" onclick="markItemAsFound(${item.id})">
                                    <i class="fas fa-check"></i> Mark as Found
                                </button>
                            ` : ''}
                            <button class="btn btn-outline" onclick="deleteItem(${item.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Create and show modal
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalContent;
    document.body.appendChild(modalContainer);
    
    const modal = modalContainer.querySelector('#itemDetailModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Close button event
    modal.querySelector('.close-modal-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        setTimeout(() => modalContainer.remove(), 300);
    });
    
    // Don't close on outside click - only X button
}

function markItemAsFound(itemId) {
    const itemIndex = state.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    state.items[itemIndex].status = 'found';
    state.items[itemIndex].isFound = true;
    state.items[itemIndex].foundAt = new Date().toISOString();
    
    if (state.currentUser && !state.currentUser.recoveredItems.includes(itemId)) {
        state.currentUser.recoveredItems.push(itemId);
    }
    
    saveData();
    
    // Close modal
    const modal = document.querySelector('#itemDetailModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            const modalContainer = modal.parentElement;
            if (modalContainer) modalContainer.remove();
        }, 300);
    }
    
    showNotification('Item marked as found!', 'success');
    displayItems('lost');
    displayItems('found');
    updateProfile();
}

function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const itemIndex = state.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    // Check permissions
    const item = state.items[itemIndex];
    if (state.currentUser.role !== 'admin' && state.currentUser.id !== item.reporterId) {
        showNotification('You can only delete your own items', 'error');
        return;
    }
    
    state.items.splice(itemIndex, 1);
    
    // Remove comments for this item
    state.comments = state.comments.filter(comment => comment.itemId !== itemId);
    
    // Remove from user's reported items
    if (state.currentUser) {
        state.currentUser.reportedItems = state.currentUser.reportedItems.filter(id => id !== itemId);
    }
    
    saveData();
    
    // Close modal
    const modal = document.querySelector('#itemDetailModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            const modalContainer = modal.parentElement;
            if (modalContainer) modalContainer.remove();
        }, 300);
    }
    
    showNotification('Item deleted successfully', 'success');
    displayItems(state.currentPage);
    updateProfile();
}

// ===== COMMENTS SYSTEM =====
function addComment(itemId) {
    if (!state.currentUser) {
        showNotification('Please sign in to add comments', 'warning');
        showModal('signin');
        return;
    }
    
    const commentInput = document.getElementById(`commentInput-${itemId}`);
    const text = commentInput.value.trim();
    
    if (!text) {
        showNotification('Comment cannot be empty', 'error');
        return;
    }
    
    const newComment = {
        id: Date.now(),
        itemId: itemId,
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        text: text,
        likes: [],
        replies: [],
        createdAt: new Date().toISOString()
    };
    
    state.comments.unshift(newComment);
    saveData();
    
    // Clear input
    commentInput.value = '';
    
    // Refresh comments list
    refreshComments(itemId);
    
    showNotification('Comment added successfully', 'success');
}

function refreshComments(itemId) {
    const commentsList = document.getElementById(`commentsList-${itemId}`);
    if (!commentsList) return;
    
    const itemComments = state.comments.filter(comment => comment.itemId === itemId);
    
    commentsList.innerHTML = itemComments.length === 0 ? 
        '<p style="color: var(--gray); text-align: center; padding: 2rem;">No comments yet. Be the first to comment!</p>' : 
        itemComments.map(comment => {
            const commentUser = state.users.find(u => u.id === comment.userId);
            const commentTime = timeAgo(comment.createdAt);
            const totalLikes = comment.likes ? comment.likes.length : 0;
            return `
                <div class="comment" style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-light);">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            ${commentUser && commentUser.profileImage ? 
                                `<img src="${commentUser.profileImage}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;">` :
                                `<i class="fas fa-user-circle" style="color: var(--primary);"></i>`
                            }
                            <div>
                                <strong style="color: var(--dark);">${commentUser ? commentUser.name : 'Unknown User'}</strong>
                                <span style="color: var(--gray); font-size: 0.8rem; margin-left: 10px;">${commentTime}</span>
                            </div>
                        </div>
                        ${(state.currentUser && state.currentUser.id === comment.userId) || (state.currentUser && state.currentUser.role === 'admin') ? 
                            `<button onclick="deleteComment(${comment.id}, ${itemId})" style="background: none; border: none; color: var(--danger); cursor: pointer;">
                                <i class="fas fa-trash"></i>
                            </button>` : ''
                        }
                    </div>
                    <p style="color: var(--dark); margin: 0;">${comment.text}</p>
                    <div style="display: flex; align-items: center; gap: 15px; margin-top: 0.5rem;">
                        <button onclick="likeComment(${comment.id})" style="background: none; border: none; color: ${comment.likes && comment.likes.includes(state.currentUser?.id) ? 'var(--primary)' : 'var(--gray)'}; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                            <i class="fas fa-thumbs-up"></i>
                            <span>${totalLikes}</span>
                        </button>
                        ${state.currentUser ? `
                            <button onclick="replyToComment(${comment.id}, ${itemId}, '${commentUser ? commentUser.name : 'User'}')" style="background: none; border: none; color: var(--gray); cursor: pointer;">
                                Reply
                            </button>
                        ` : ''}
                    </div>
                    <!-- Replies -->
                    ${comment.replies && comment.replies.length > 0 ? `
                        <div style="margin-top: 1rem; padding-left: 2rem; border-left: 2px solid var(--gray-light);">
                            ${comment.replies.map(reply => {
                                const replyUser = state.users.find(u => u.id === reply.userId);
                                const replyTime = timeAgo(reply.createdAt);
                                return `
                                    <div style="margin-bottom: 0.75rem; padding: 0.75rem; background: rgba(0,0,0,0.02); border-radius: var(--radius);">
                                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
                                            <div style="display: flex; align-items: center; gap: 8px;">
                                                ${replyUser && replyUser.profileImage ? 
                                                    `<img src="${replyUser.profileImage}" style="width: 25px; height: 25px; border-radius: 50%; object-fit: cover;">` :
                                                    `<i class="fas fa-user-circle" style="color: var(--primary); font-size: 0.9rem;"></i>`
                                                }
                                                <strong style="color: var(--dark); font-size: 0.9rem;">${replyUser ? replyUser.name : 'Unknown User'}</strong>
                                                <span style="color: var(--gray); font-size: 0.7rem;">${replyTime}</span>
                                            </div>
                                            ${(state.currentUser && state.currentUser.id === reply.userId) || (state.currentUser && state.currentUser.role === 'admin') ? 
                                                `<button onclick="deleteReply(${comment.id}, ${reply.id}, ${itemId})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 0.8rem;">
                                                    <i class="fas fa-trash"></i>
                                                </button>` : ''
                                            }
                                        </div>
                                        <p style="color: var(--dark); margin: 0; font-size: 0.9rem;">${reply.text}</p>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
}

function likeComment(commentId) {
    if (!state.currentUser) {
        showNotification('Please sign in to like comments', 'warning');
        showModal('signin');
        return;
    }
    
    const commentIndex = state.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return;
    
    if (!state.comments[commentIndex].likes) {
        state.comments[commentIndex].likes = [];
    }
    
    const comment = state.comments[commentIndex];
    const userIndex = comment.likes.indexOf(state.currentUser.id);
    
    if (userIndex === -1) {
        comment.likes.push(state.currentUser.id);
    } else {
        comment.likes.splice(userIndex, 1);
    }
    
    saveData();
    
    // Find which item this comment belongs to
    const itemId = comment.itemId;
    refreshComments(itemId);
}

function replyToComment(commentId, itemId, userName) {
    if (!state.currentUser) {
        showNotification('Please sign in to reply', 'warning');
        showModal('signin');
        return;
    }
    
    const replyText = prompt(`Reply to ${userName}:`);
    if (!replyText || !replyText.trim()) return;
    
    const commentIndex = state.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return;
    
    if (!state.comments[commentIndex].replies) {
        state.comments[commentIndex].replies = [];
    }
    
    const reply = {
        id: Date.now(),
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        text: replyText.trim(),
        createdAt: new Date().toISOString()
    };
    
    state.comments[commentIndex].replies.push(reply);
    saveData();
    
    // Refresh comments
    refreshComments(itemId);
    
    showNotification('Reply added successfully', 'success');
}

function deleteComment(commentId, itemId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    const commentIndex = state.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return;
    
    // Check permissions
    if (state.currentUser.role !== 'admin' && state.comments[commentIndex].userId !== state.currentUser.id) {
        showNotification('You can only delete your own comments', 'error');
        return;
    }
    
    state.comments.splice(commentIndex, 1);
    saveData();
    
    refreshComments(itemId);
    showNotification('Comment deleted successfully', 'success');
}

function deleteReply(commentId, replyId, itemId) {
    if (!confirm('Are you sure you want to delete this reply?')) return;
    
    const commentIndex = state.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return;
    
    const replyIndex = state.comments[commentIndex].replies.findIndex(r => r.id === replyId);
    if (replyIndex === -1) return;
    
    // Check permissions
    if (state.currentUser.role !== 'admin' && state.comments[commentIndex].replies[replyIndex].userId !== state.currentUser.id) {
        showNotification('You can only delete your own replies', 'error');
        return;
    }
    
    state.comments[commentIndex].replies.splice(replyIndex, 1);
    saveData();
    
    refreshComments(itemId);
    showNotification('Reply deleted successfully', 'success');
}

// ===== USER PROFILE VIEW =====
function viewUserProfile(userId) {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;
    
    elements.viewProfileName.textContent = user.name;
    elements.viewProfileEmail.textContent = user.email;
    elements.viewProfileGrade.textContent = user.grade;
    elements.viewProfileRole.textContent = user.role === 'admin' ? 'Administrator' : 'Student';
    
    // Set profile image
    if (user.profileImage) {
        elements.viewProfileAvatarImage.src = user.profileImage;
        elements.viewProfileAvatarImage.style.display = 'block';
        elements.viewProfileAvatarIcon.style.display = 'none';
    } else {
        elements.viewProfileAvatarImage.style.display = 'none';
        elements.viewProfileAvatarIcon.style.display = 'block';
    }
    
    // Calculate stats
    const reportedItems = state.items.filter(item => item.reporterId === user.id);
    const recoveredItems = reportedItems.filter(item => item.isFound);
    
    elements.viewReportedCount.textContent = reportedItems.length;
    elements.viewRecoveredCount.textContent = recoveredItems.length;
    
    showModal('userView');
}

// ===== PROFILE MANAGEMENT =====
function updateProfile() {
    if (!state.currentUser) return;
    
    elements.profileName.textContent = state.currentUser.name;
    elements.profileEmail.textContent = state.currentUser.email;
    elements.profileGrade.textContent = state.currentUser.grade;
    elements.profileRole.textContent = state.currentUser.role === 'admin' ? 'Administrator' : 'Student';
    
    // Calculate stats
    const reportedItems = state.items.filter(item => item.reporterId === state.currentUser.id);
    const recoveredItems = reportedItems.filter(item => item.isFound);
    
    elements.reportedCount.textContent = reportedItems.length;
    elements.recoveredCount.textContent = recoveredItems.length;
}

function handleProfileImageUpload() {
    const file = this.files[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image must be less than 5MB', 'error');
        return;
    }
    
    // Read and save image
    const reader = new FileReader();
    reader.onload = (e) => {
        state.currentUser.profileImage = e.target.result;
        saveData();
        
        // Update profile display
        elements.profileAvatarImage.src = e.target.result;
        elements.profileAvatarImage.style.display = 'block';
        elements.profileAvatarIcon.style.display = 'none';
        
        // Update navigation if needed
        checkAuth();
        
        showNotification('Profile picture updated successfully', 'success');
    };
    reader.readAsDataURL(file);
}

// ===== MESSAGING SYSTEM =====
function sendMessageToAdmin(messageData) {
    const message = {
        id: Date.now(),
        fromId: messageData.fromId || null,
        fromName: messageData.fromName,
        fromEmail: messageData.fromEmail,
        toId: 1, // Admin ID
        toName: 'Admin',
        subject: messageData.subject,
        message: messageData.message,
        type: messageData.type || 'general',
        read: false,
        createdAt: new Date().toISOString()
    };
    
    state.messages.unshift(message);
    
    // Increment admin's unread message count
    const admin = state.users.find(u => u.id === 1);
    if (admin) {
        admin.unreadMessages = (admin.unreadMessages || 0) + 1;
    }
    
    saveData();
    updateInboxCount();
}

function sendMessageToUser(userId, messageData) {
    const message = {
        id: Date.now(),
        fromId: state.currentUser.id,
        fromName: state.currentUser.name,
        fromEmail: state.currentUser.email,
        toId: userId,
        toName: messageData.toName,
        subject: messageData.subject,
        message: messageData.message,
        type: messageData.type || 'general',
        read: false,
        createdAt: new Date().toISOString()
    };
    
    state.messages.unshift(message);
    
    // Increment user's unread message count
    const user = state.users.find(u => u.id === userId);
    if (user) {
        user.unreadMessages = (user.unreadMessages || 0) + 1;
    }
    
    saveData();
    updateInboxCount();
}

function updateInboxCount() {
    if (!state.currentUser) return;
    
    // Update admin panel badge
    if (state.currentUser.role === 'admin') {
        const adminUnread = state.messages.filter(m => 
            m.toId === state.currentUser.id && !m.read
        ).length;
        elements.inboxBadge.textContent = adminUnread > 99 ? '99+' : adminUnread;
    }
}

function loadUserInbox() {
    if (!state.currentUser) return;
    
    const userMessages = state.messages.filter(m => 
        m.toId === state.currentUser.id || m.fromId === state.currentUser.id
    );
    
    // Sort by date
    userMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Clear message list
    elements.userMessageList.innerHTML = '';
    
    if (userMessages.length === 0) {
        elements.userMessageList.innerHTML = `
            <div class="no-messages">
                <i class="fas fa-envelope-open"></i>
                <h3>No Messages</h3>
                <p>Your inbox is empty</p>
            </div>
        `;
        return;
    }
    
    userMessages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message-item ${!message.read && message.toId === state.currentUser.id ? 'unread' : ''}`;
        messageElement.dataset.id = message.id;
        
        messageElement.innerHTML = `
            <div class="message-header">
                <div class="message-sender">${message.fromName}</div>
                <div class="message-time">${timeAgo(message.createdAt)}</div>
            </div>
            <div class="message-subject">${message.subject}</div>
            <div class="message-preview">${message.message.substring(0, 60)}...</div>
        `;
        
        messageElement.addEventListener('click', () => {
            viewUserMessage(message.id);
        });
        
        elements.userMessageList.appendChild(messageElement);
    });
}

function viewUserMessage(messageId) {
    const message = state.messages.find(m => m.id === messageId);
    if (!message) return;
    
    // Mark as read if user is the recipient
    if (message.toId === state.currentUser.id && !message.read) {
        message.read = true;
        saveData();
        updateInboxCount();
    }
    
    elements.userMessageView.innerHTML = `
        <div class="message-detail">
            <div class="message-detail-header">
                <div class="message-detail-subject">${message.subject}</div>
                <div class="message-detail-time">${formatDateTime(message.createdAt)}</div>
            </div>
            <div class="message-detail-info">
                <div><strong>From:</strong> ${message.fromName} (${message.fromEmail})</div>
                <div><strong>To:</strong> ${message.toName}</div>
                <div><strong>Type:</strong> ${message.type}</div>
            </div>
            <div class="message-detail-content">
                ${message.message.replace(/\n/g, '<br>')}
            </div>
            ${message.fromId !== state.currentUser.id ? `
                <div class="message-reply">
                    <textarea id="replyMessage-${message.id}" placeholder="Type your reply..." rows="3"></textarea>
                    <button onclick="sendReply(${message.id})" class="btn btn-primary">
                        <i class="fas fa-reply"></i> Send Reply
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

function sendReply(messageId) {
    const originalMessage = state.messages.find(m => m.id === messageId);
    if (!originalMessage) return;
    
    const replyText = document.getElementById(`replyMessage-${messageId}`).value.trim();
    if (!replyText) {
        showNotification('Please enter a reply message', 'error');
        return;
    }
    
    const replyMessage = {
        id: Date.now(),
        fromId: state.currentUser.id,
        fromName: state.currentUser.name,
        fromEmail: state.currentUser.email,
        toId: originalMessage.fromId,
        toName: originalMessage.fromName,
        subject: `Re: ${originalMessage.subject}`,
        message: replyText,
        type: 'reply',
        read: false,
        createdAt: new Date().toISOString()
    };
    
    state.messages.unshift(replyMessage);
    
    // Increment recipient's unread message count
    const recipient = state.users.find(u => u.id === originalMessage.fromId);
    if (recipient) {
        recipient.unreadMessages = (recipient.unreadMessages || 0) + 1;
    }
    
    saveData();
    updateInboxCount();
    loadUserInbox();
    
    document.getElementById(`replyMessage-${messageId}`).value = '';
    showNotification('Reply sent successfully', 'success');
}

// ===== ADMIN PANEL =====
function loadAdminPanel() {
    if (!state.currentUser || state.currentUser.role !== 'admin') return;
    
    // Load inbox
    loadAdminInbox();
    
    // Load users
    loadAdminUsers();
    
    // Load password requests
    loadPasswordRequests();
    
    // Load items
    loadAdminItems();
}

function loadAdminInbox() {
    const adminMessages = state.messages.filter(m => m.toId === state.currentUser.id);
    
    // Sort by date
    adminMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Clear message list
    elements.messageList.innerHTML = '';
    
    if (adminMessages.length === 0) {
        elements.messageList.innerHTML = `
            <div class="no-messages">
                <i class="fas fa-envelope-open"></i>
                <h3>No Messages</h3>
                <p>Admin inbox is empty</p>
            </div>
        `;
        return;
    }
    
    adminMessages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message-item ${!message.read ? 'unread' : ''}`;
        messageElement.dataset.id = message.id;
        
        messageElement.innerHTML = `
            <div class="message-header">
                <div class="message-sender">${message.fromName}</div>
                <div class="message-time">${timeAgo(message.createdAt)}</div>
            </div>
            <div class="message-subject">${message.subject}</div>
            <div class="message-preview">${message.message.substring(0, 60)}...</div>
        `;
        
        messageElement.addEventListener('click', () => {
            viewAdminMessage(message.id);
        });
        
        elements.messageList.appendChild(messageElement);
    });
}

function viewAdminMessage(messageId) {
    const message = state.messages.find(m => m.id === messageId);
    if (!message) return;
    
    // Mark as read
    if (!message.read) {
        message.read = true;
        saveData();
        updateInboxCount();
    }
    
    elements.messageView.innerHTML = `
        <div class="message-detail">
            <div class="message-detail-header">
                <div class="message-detail-subject">${message.subject}</div>
                <div class="message-detail-time">${formatDateTime(message.createdAt)}</div>
            </div>
            <div class="message-detail-info">
                <div><strong>From:</strong> ${message.fromName} (${message.fromEmail})</div>
                <div><strong>Type:</strong> ${message.type}</div>
            </div>
            <div class="message-detail-content">
                ${message.message.replace(/\n/g, '<br>')}
            </div>
            ${message.type === 'password_reset' ? `
                <div class="message-actions">
                    <button onclick="resetUserPassword('${message.fromEmail}')" class="btn btn-success">
                        <i class="fas fa-key"></i> Reset Password
                    </button>
                    <button onclick="markRequestComplete('${message.fromEmail}')" class="btn btn-outline">
                        <i class="fas fa-check"></i> Mark Complete
                    </button>
                </div>
            ` : `
                <div class="message-reply">
                    <textarea id="adminReply-${message.id}" placeholder="Type your reply..." rows="3"></textarea>
                    <button onclick="sendAdminReply(${message.id})" class="btn btn-primary">
                        <i class="fas fa-reply"></i> Send Reply
                    </button>
                </div>
            `}
        </div>
    `;
}

function sendAdminReply(messageId) {
    const originalMessage = state.messages.find(m => m.id === messageId);
    if (!originalMessage) return;
    
    const replyText = document.getElementById(`adminReply-${messageId}`).value.trim();
    if (!replyText) {
        showNotification('Please enter a reply message', 'error');
        return;
    }
    
    sendMessageToUser(originalMessage.fromId, {
        toName: originalMessage.fromName,
        subject: `Re: ${originalMessage.subject}`,
        message: replyText,
        type: 'reply'
    });
    
    document.getElementById(`adminReply-${messageId}`).value = '';
    showNotification('Reply sent successfully', 'success');
    loadAdminInbox();
}

// Store the target user ID for password reset modal
let resetTargetUserId = null;

function resetUserPassword(email) {
    const user = state.users.find(u => u.email === email);
    if (user) {
        resetTargetUserId = user.id;
        document.getElementById('resetUserId').value = user.id;
        showModal('resetPassword');
    } else {
        showNotification('User not found', 'error');
    }
}

function markRequestComplete(email) {
    state.passwordRequests = state.passwordRequests.map(req => {
        if (req.userEmail === email) {
            req.status = 'completed';
        }
        return req;
    });
    
    saveData();
    loadPasswordRequests();
    showNotification('Request marked as complete', 'success');
}

function loadAdminUsers() {
    const users = state.users.filter(u => u.id !== state.currentUser.id); // Exclude admin
    
    elements.usersList.innerHTML = '';
    
    if (users.length === 0) {
        elements.usersList.innerHTML = `
            <div class="no-users">
                <i class="fas fa-users"></i>
                <h3>No Other Users</h3>
                <p>Only admin user exists</p>
            </div>
        `;
        return;
    }
    
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'admin-user-item';
        userElement.dataset.id = user.id;
        
        const reportedItems = state.items.filter(item => item.reporterId === user.id).length;
        const recoveredItems = state.items.filter(item => item.reporterId === user.id && item.isFound).length;
        
        userElement.innerHTML = `
            <div class="user-info">
                <div class="user-avatar">
                    ${user.profileImage ? 
                        `<img src="${user.profileImage}" alt="${user.name}">` :
                        `<i class="fas fa-user"></i>`
                    }
                </div>
                <div class="user-details">
                    <div class="user-name">${user.name}</div>
                    <div class="user-email">${user.email}</div>
                    <div class="user-grade">${user.grade} • ${user.role}</div>
                </div>
            </div>
            <div class="user-stats">
                <div class="user-stat">
                    <div class="stat-number">${reportedItems}</div>
                    <div class="stat-label">Items</div>
                </div>
                <div class="user-stat">
                    <div class="stat-number">${recoveredItems}</div>
                    <div class="stat-label">Recovered</div>
                </div>
            </div>
            <div class="user-actions">
                <button onclick="adminResetUserPassword(${user.id})" class="btn btn-sm btn-outline">
                    <i class="fas fa-key"></i> Reset Pass
                </button>
                <button onclick="adminSendMessage(${user.id})" class="btn btn-sm btn-primary">
                    <i class="fas fa-envelope"></i> Message
                </button>
            </div>
        `;
        
        elements.usersList.appendChild(userElement);
    });
}

function adminResetUserPassword(userId) {
    resetTargetUserId = userId;
    document.getElementById('resetUserId').value = userId;
    showModal('resetPassword');
}

function adminSendMessage(userId) {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;
    
    const subject = prompt('Enter message subject:');
    if (!subject) return;
    
    const message = prompt('Enter message:');
    if (!message) return;
    
    sendMessageToUser(userId, {
        toName: user.name,
        subject: subject,
        message: message,
        type: 'admin_message'
    });
    
    showNotification('Message sent successfully', 'success');
}

function loadPasswordRequests() {
    const pendingRequests = state.passwordRequests.filter(req => req.status === 'pending');
    
    elements.passwordRequests.innerHTML = '';
    
    if (pendingRequests.length === 0) {
        elements.passwordRequests.innerHTML = `
            <div class="no-requests">
                <i class="fas fa-key"></i>
                <h3>No Pending Requests</h3>
                <p>All password reset requests have been handled</p>
            </div>
        `;
        return;
    }
    
    pendingRequests.forEach(request => {
        const requestElement = document.createElement('div');
        requestElement.className = 'password-request-item';
        
        requestElement.innerHTML = `
            <div class="request-header">
                <div class="request-user">${request.userName}</div>
                <div class="request-time">${timeAgo(request.createdAt)}</div>
            </div>
            <div class="request-email">${request.userEmail}</div>
            <div class="request-message">${request.message}</div>
            <div class="request-actions">
                <button onclick="resetUserPassword('${request.userEmail}')" class="btn btn-success">
                    <i class="fas fa-key"></i> Reset Password
                </button>
                <button onclick="markRequestComplete('${request.userEmail}')" class="btn btn-outline">
                    <i class="fas fa-check"></i> Mark Complete
                </button>
            </div>
        `;
        
        elements.passwordRequests.appendChild(requestElement);
    });
}

function loadAdminItems() {
    // Load all items for admin
    const allItems = [...state.items];
    
    elements.adminItemsList.innerHTML = '';
    
    if (allItems.length === 0) {
        elements.adminItemsList.innerHTML = `
            <div class="no-items">
                <i class="fas fa-box"></i>
                <h3>No Items</h3>
                <p>No items have been reported yet</p>
            </div>
        `;
        return;
    }
    
    allItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'admin-item-item';
        itemElement.dataset.id = item.id;
        
        const reporter = state.users.find(u => u.id === item.reporterId);
        
        itemElement.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-meta">
                    <span class="item-status ${item.status}">${item.status.toUpperCase()}</span>
                    <span class="item-category">${item.category}</span>
                    <span class="item-date">${formatDate(item.date)}</span>
                </div>
                <div class="item-reporter">Reported by: ${reporter ? reporter.name : 'Unknown'} (${item.grade})</div>
            </div>
            <div class="item-actions">
                <button onclick="adminDeleteItem(${item.id})" class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i> Delete
                </button>
                <button onclick="showItemDetail(${item.id})" class="btn btn-sm btn-outline">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        `;
        
        elements.adminItemsList.appendChild(itemElement);
    });
}

function adminDeleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item as admin?')) return;
    
    const itemIndex = state.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    state.items.splice(itemIndex, 1);
    
    // Remove comments for this item
    state.comments = state.comments.filter(comment => comment.itemId !== itemId);
    
    saveData();
    loadAdminItems();
    displayItems('lost');
    displayItems('found');
    showNotification('Item deleted by admin', 'success');
}

function switchAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `${tabName}Tab`) {
            pane.classList.add('active');
        }
    });
}

// New function to handle password reset from admin modal
function handlePasswordReset(e) {
    e.preventDefault();
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    const userId = parseInt(document.getElementById('resetUserId').value);

    if (!newPass || !confirmPass) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    if (newPass !== confirmPass) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    if (newPass.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    const user = state.users.find(u => u.id === userId);
    if (!user) {
        showNotification('User not found', 'error');
        return;
    }

    user.password = newPass;
    saveData();

    // Close modal and reset form
    closeAllModals();
    document.getElementById('resetPasswordForm').reset();
    showNotification(`Password for ${user.name} has been reset.`, 'success');

    // If the reset was from a password request, mark it complete
    const request = state.passwordRequests.find(r => r.userId === userId && r.status === 'pending');
    if (request) {
        request.status = 'completed';
        saveData();
        loadPasswordRequests();
    }
}

// ===== CONTACT FORM =====
function handleContact(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const type = document.getElementById('contactType').value;
    const message = document.getElementById('contactMessage').value.trim();
    
    // Validation
    if (!name || !email || !type || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Send message to admin
    sendMessageToAdmin({
        fromId: state.currentUser ? state.currentUser.id : null,
        fromName: name,
        fromEmail: email,
        subject: `Contact: ${type}`,
        message: message,
        type: 'contact'
    });
    
    // Show success
    showNotification('Message sent successfully! We will respond within 24 hours.', 'success');
    
    // Reset form
    elements.forms.contact.reset();
}

// ===== IMAGE UPLOAD =====
function handleItemImageUpload() {
    const file = this.files[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image must be less than 5MB', 'error');
        return;
    }
    
    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
        elements.previewImage.src = e.target.result;
        elements.imagePreview.style.display = 'block';
        elements.uploadBox.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function removeItemImage() {
    elements.previewImage.src = '';
    elements.imagePreview.style.display = 'none';
    elements.uploadBox.style.display = 'flex';
    elements.itemImage.value = '';
}

// ===== MODAL MANAGEMENT =====
function showModal(modalId) {
    closeAllModals();
    elements.modals[modalId].classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    Object.values(elements.modals).forEach(modal => {
        if (modal) modal.classList.remove('show');
    });
    document.body.style.overflow = 'auto';
    
    // Also close any dynamically created modals
    const dynamicModals = document.querySelectorAll('#itemDetailModal');
    dynamicModals.forEach(modal => {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentElement) modal.parentElement.remove();
        }, 300);
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    const id = Date.now();
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.id = `notification-${id}`;
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <div class="notification-content">
            <div class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="removeNotification('notification-${id}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(`notification-${id}`);
    }, 5000);
}

function removeNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
    return formatDate(dateString);
}

function generateRandomPassword(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== GLOBAL FUNCTIONS =====
window.markItemAsFound = markItemAsFound;
window.deleteItem = deleteItem;
window.removeNotification = removeNotification;
window.addComment = addComment;
window.likeComment = likeComment;
window.replyToComment = replyToComment;
window.deleteComment = deleteComment;
window.deleteReply = deleteReply;
window.resetUserPassword = resetUserPassword;
window.markRequestComplete = markRequestComplete;
window.adminResetUserPassword = adminResetUserPassword;
window.adminSendMessage = adminSendMessage;
window.adminDeleteItem = adminDeleteItem;
window.sendReply = sendReply;
window.sendAdminReply = sendAdminReply;

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', init);