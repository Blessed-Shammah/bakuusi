class SettingsManager {
    constructor() {
        this.currentSection = 'general';
        this.settings = {};
        this.initializeElements();
        this.initializeEventListeners();
        this.loadSettings();
    }

    initializeElements() {
        // Navigation buttons
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.sections = document.querySelectorAll('.settings-section');
        
        // Save button
        this.saveButton = document.getElementById('saveSettingsBtn');
        
        // Form elements
        this.siteNameInput = document.getElementById('siteName');
        this.siteDescriptionInput = document.getElementById('siteDescription');
        this.siteUrlInput = document.getElementById('siteUrl');
        this.languageSelect = document.getElementById('language');
        this.timezoneSelect = document.getElementById('timezone');
        this.themeSelect = document.getElementById('theme');
        this.primaryColorInput = document.getElementById('primaryColor');
        
        // Security elements
        this.twoFactorToggle = document.getElementById('twoFactorAuth');
        this.loginHistory = document.querySelector('.login-history');
        
        // Email elements
        this.smtpForm = {
            host: document.getElementById('smtpHost'),
            port: document.getElementById('smtpPort'),
            user: document.getElementById('smtpUser'),
            password: document.getElementById('smtpPassword')
        };
        
        // Template elements
        this.templateList = document.querySelector('.template-list');
    }

    initializeEventListeners() {
        // Navigation
        this.navButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.switchSection(button.dataset.section);
            });
        });

        // Save settings
        this.saveButton.addEventListener('click', () => this.saveSettings());

        // Theme changes
        this.themeSelect.addEventListener('change', () => this.handleThemeChange());
        this.primaryColorInput.addEventListener('change', () => this.updateThemeColor());

        // Two-factor authentication toggle
        this.twoFactorToggle.addEventListener('change', () => this.toggleTwoFactor());

        // Form inputs auto-save
        document.querySelectorAll('input, select, textarea').forEach(element => {
            element.addEventListener('change', () => {
                this.markUnsavedChanges();
            });
        });

        // Window close warning
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    async loadSettings() {
        try {
            // Simulate API call - replace with actual API endpoint
            const storedSettings = localStorage.getItem('siteSettings');
            this.settings = storedSettings ? JSON.parse(storedSettings) : this.getDefaultSettings();
            this.populateSettings();
            this.loadLoginHistory();
            this.loadEmailTemplates();
            this.loadSystemLogs();
        } catch (error) {
            this.showNotification('Error loading settings', 'error');
        }
    }

    getDefaultSettings() {
        return {
            general: {
                siteName: 'Bakuusi Clan',
                siteDescription: '',
                siteUrl: '',
                language: 'en',
                timezone: 'UTC',
                theme: 'light',
                primaryColor: '#00D094'
            },
            user: {
                defaultView: 'grid',
                itemsPerPage: 20,
                emailNotifications: true,
                pushNotifications: true
            },
            security: {
                twoFactorAuth: false,
                lastPasswordChange: null,
                loginAttempts: 0
            },
            email: {
                smtp: {
                    host: '',
                    port: '',
                    user: '',
                    password: ''
                },
                templates: {}
            }
        };
    }

    populateSettings() {
        // Populate general settings
        this.siteNameInput.value = this.settings.general.siteName;
        this.siteDescriptionInput.value = this.settings.general.siteDescription;
        this.siteUrlInput.value = this.settings.general.siteUrl;
        this.languageSelect.value = this.settings.general.language;
        this.timezoneSelect.value = this.settings.general.timezone;
        this.themeSelect.value = this.settings.general.theme;
        this.primaryColorInput.value = this.settings.general.primaryColor;

        // Populate user preferences
        document.getElementById('defaultView').value = this.settings.user.defaultView;
        document.getElementById('itemsPerPage').value = this.settings.user.itemsPerPage;
        document.getElementById('emailNotif').checked = this.settings.user.emailNotifications;
        document.getElementById('pushNotif').checked = this.settings.user.pushNotifications;

        // Populate security settings
        this.twoFactorToggle.checked = this.settings.security.twoFactorAuth;

        // Populate SMTP settings
        this.smtpForm.host.value = this.settings.email.smtp.host;
        this.smtpForm.port.value = this.settings.email.smtp.port;
        this.smtpForm.user.value = this.settings.email.smtp.user;
        this.smtpForm.password.value = this.settings.email.smtp.password;
    }

    switchSection(sectionId) {
        this.currentSection = sectionId;
        
        // Update navigation buttons
        this.navButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.section === sectionId);
        });

        // Update sections
        this.sections.forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });
    }

    async saveSettings() {
        try {
            const newSettings = {
                general: {
                    siteName: this.siteNameInput.value,
                    siteDescription: this.siteDescriptionInput.value,
                    siteUrl: this.siteUrlInput.value,
                    language: this.languageSelect.value,
                    timezone: this.timezoneSelect.value,
                    theme: this.themeSelect.value,
                    primaryColor: this.primaryColorInput.value
                },
                user: {
                    defaultView: document.getElementById('defaultView').value,
                    itemsPerPage: document.getElementById('itemsPerPage').value,
                    emailNotifications: document.getElementById('emailNotif').checked,
                    pushNotifications: document.getElementById('pushNotif').checked
                },
                security: {
                    ...this.settings.security,
                    twoFactorAuth: this.twoFactorToggle.checked
                },
                email: {
                    smtp: {
                        host: this.smtpForm.host.value,
                        port: this.smtpForm.port.value,
                        user: this.smtpForm.user.value,
                        password: this.smtpForm.password.value
                    },
                    templates: this.settings.email.templates
                }
            };

            // Simulate API call - replace with actual API endpoint
            localStorage.setItem('siteSettings', JSON.stringify(newSettings));
            this.settings = newSettings;
            this.hasUnsavedChanges = false;
            this.showNotification('Settings saved successfully', 'success');
            
            // Apply theme changes
            this.applyTheme();
        } catch (error) {
            this.showNotification('Error saving settings', 'error');
        }
    }

    markUnsavedChanges() {
        this.hasUnsavedChanges = true;
        this.saveButton.classList.add('unsaved');
    }

    handleThemeChange() {
        const theme = this.themeSelect.value;
        document.body.className = `theme-${theme}`;
        this.markUnsavedChanges();
    }

    updateThemeColor() {
        document.documentElement.style.setProperty('--primary-color', this.primaryColorInput.value);
        this.markUnsavedChanges();
    }

    async changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Please fill in all password fields', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match', 'error');
            return;
        }

        try {
            // Simulate API call - replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showNotification('Password changed successfully', 'success');
            
            // Clear password fields
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        } catch (error) {
            this.showNotification('Error changing password', 'error');
        }
    }

    async toggleTwoFactor() {
        const isEnabled = this.twoFactorToggle.checked;
        try {
            // Simulate API call - replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showNotification(
                `Two-factor authentication ${isEnabled ? 'enabled' : 'disabled'}`,
                'success'
            );
        } catch (error) {
            this.twoFactorToggle.checked = !isEnabled;
            this.showNotification('Error updating two-factor authentication', 'error');
        }
    }

    async testEmailConnection() {
        try {
            // Simulate API call - replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showNotification('Email connection successful', 'success');
        } catch (error) {
            this.showNotification('Email connection failed', 'error');
        }
    }

    async createBackup() {
        try {
            // Simulate API call - replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showNotification('Backup created successfully', 'success');
            this.loadBackupHistory();
        } catch (error) {
            this.showNotification('Error creating backup', 'error');
        }
    }

    async restoreBackup() {
        try {
            // Simulate API call - replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showNotification('Backup restored successfully', 'success');
        } catch (error) {
            this.showNotification('Error restoring backup', 'error');
        }
    }

    async clearCache() {
        try {
            // Simulate API call - replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showNotification('Cache cleared successfully', 'success');
        } catch (error) {
            this.showNotification('Error clearing cache', 'error');
        }
    }

    async optimizeDatabase() {
        try {
            // Simulate API call - replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showNotification('Database optimized successfully', 'success');
        } catch (error) {
            this.showNotification('Error optimizing database', 'error');
        }
    }

    loadLoginHistory() {
        // Simulate login history data
        const history = [
            { date: '2023-09-15 10:30:00', ip: '192.168.1.1', status: 'success' },
            { date: '2023-09-14 15:45:00', ip: '192.168.1.2', status: 'failed' },
            // Add more history items
        ];

        this.loginHistory.innerHTML = history.map(item => `
            <div class="history-item ${item.status}">
                <span>${item.date}</span>
                <span>${item.ip}</span>
                <span>${item.status}</span>
            </div>
        `).join('');
    }

    loadEmailTemplates() {
        // Simulate email templates data
        const templates = [
            { name: 'Welcome Email', subject: 'Welcome to Bakuusi Clan' },
            { name: 'Password Reset', subject: 'Reset Your Password' },
            // Add more templates
        ];

        this.templateList.innerHTML = templates.map(template => `
            <div class="template-item">
                <div class="template-info">
                    <h4>${template.name}</h4>
                    <p>${template.subject}</p>
                </div>
                <div class="template-actions">
                    <button class="btn-secondary" onclick="settingsManager.editTemplate('${template.name}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadSystemLogs() {
        const logViewer = document.querySelector('.log-viewer');
        // Simulate system logs data
        const logs = [
            { timestamp: '2023-09-15 10:30:00', level: 'info', message: 'System startup' },
            { timestamp: '2023-09-15 10:31:00', level: 'warning', message: 'High memory usage' },
            // Add more logs
        ];

        logViewer.innerHTML = logs.map(log => `
            <div class="log-entry ${log.level}">
                <span class="log-timestamp">${log.timestamp}</span>
                <span class="log-level">${log.level}</span>
                <span class="log-message">${log.message}</span>
            </div>
        `).join('');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the Settings Manager
const settingsManager = new SettingsManager();