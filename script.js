document.addEventListener('DOMContentLoaded', () => {
    const megaMenuTriggers = document.querySelectorAll('.has-megamenu');
    const allMegaMenus = document.querySelectorAll('.mega-menu');
    let hoverTimeout = null;
    let activeMenu = null;
    let activeTriggerLi = null;
    let menuHistory = []; // تاریخچه منوها برای navigation

    const closeAllMegaMenus = (immediately = false) => {
        allMegaMenus.forEach(menu => {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
            const allProMenus = menu.querySelectorAll('.pro-menu');
            allProMenus.forEach(pm => {
                pm.classList.remove('active', 'slide-out');
            });
        });
        if (activeTriggerLi) {
            activeTriggerLi.classList.remove('active-trigger');
        }
        activeMenu = null;
        activeTriggerLi = null;
        menuHistory = []; // ریست کردن تاریخچه
        if (hoverTimeout && !immediately) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
        }
    };

    const activateFirstTab = (menu) => {
        if (!menu) return;
        
        const mainProMenu = menu.querySelector('.pro-menu:not([id])');
        if (!mainProMenu) return;

        const tabs = mainProMenu.querySelectorAll('.pro-tabs > .p-tab');
        const contents = mainProMenu.querySelectorAll('.pro-contents > .p-content');

        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));

        if (tabs.length > 0) {
            const firstTab = tabs[0];
            const firstContentId = firstTab.getAttribute('data-tab');
            const firstContent = mainProMenu.querySelector(`.pro-contents > #${firstContentId}`);

            firstTab.classList.add('active');
            if (firstContent) {
                firstContent.classList.add('active');
            }
        }

        mainProMenu.classList.add('active');
        menuHistory = [mainProMenu]; // شروع تاریخچه با منوی اصلی
    };

    const showSubProMenu = (subMenuId, parentMegaMenu) => {
        const currentProMenu = parentMegaMenu.querySelector('.pro-menu.active');
        const subProMenu = parentMegaMenu.querySelector(subMenuId);

        if (!subProMenu || !currentProMenu) return;

        // اضافه کردن منوی فعلی به تاریخچه قبل از رفتن به زیرمنو
        if (!menuHistory.includes(currentProMenu)) {
            menuHistory.push(currentProMenu);
        }

        currentProMenu.classList.add('slide-out');

        setTimeout(() => {
            currentProMenu.classList.remove('active');
            
            subProMenu.classList.add('active');
            
            const subTabs = subProMenu.querySelectorAll('.pro-tabs > .p-tab');
            const subContents = subProMenu.querySelectorAll('.pro-contents > .p-content');
            
            subTabs.forEach(tab => tab.classList.remove('active'));
            subContents.forEach(content => content.classList.remove('active'));
            
            if (subTabs.length > 0) {
                const firstTab = subTabs[0];
                const firstContentId = firstTab.getAttribute('data-tab');
                const firstContent = subProMenu.querySelector(`.pro-contents > #${firstContentId}`);
                
                firstTab.classList.add('active');
                if (firstContent) {
                    firstContent.classList.add('active');
                }
            }

            setTimeout(() => {
                currentProMenu.classList.remove('slide-out');
            }, 50);
        }, 300);
    };

    const goBackToPreviousMenu = (parentMegaMenu) => {
        const currentProMenu = parentMegaMenu.querySelector('.pro-menu.active');
        
        // اگر تاریخچه خالی است یا فقط یک منو دارد، به منوی اصلی برگرد
        if (menuHistory.length <= 1) {
            const mainProMenu = parentMegaMenu.querySelector('.pro-menu:not([id])');
            if (!currentProMenu || !mainProMenu || currentProMenu === mainProMenu) return;

            currentProMenu.classList.add('slide-out-reverse');

            setTimeout(() => {
                currentProMenu.classList.remove('active');
                mainProMenu.classList.add('active');

                setTimeout(() => {
                    currentProMenu.classList.remove('slide-out-reverse');
                }, 50);
            }, 300);
            return;
        }

        // برگشت به منوی قبلی در تاریخچه
        const previousMenu = menuHistory[menuHistory.length - 1];
        
        if (!currentProMenu || !previousMenu || currentProMenu === previousMenu) return;

        currentProMenu.classList.add('slide-out-reverse');

        setTimeout(() => {
            currentProMenu.classList.remove('active');
            previousMenu.classList.add('active');
            
            // حذف آخرین منو از تاریخچه
            menuHistory.pop();

            setTimeout(() => {
                currentProMenu.classList.remove('slide-out-reverse');
            }, 50);
        }, 300);
    };

    megaMenuTriggers.forEach(triggerLi => {
        const targetMenuId = triggerLi.getAttribute('data-megamenu-target');
        const targetSelector = targetMenuId.startsWith('#') ? targetMenuId : `#${targetMenuId}`;
        const targetMenu = triggerLi.closest('.nav-sec').querySelector(targetSelector);

        if (!targetMenu) {
            console.warn('Mega menu not found for target:', targetSelector);
            return;
        }

        triggerLi.addEventListener('mouseenter', function() {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                hoverTimeout = null;
            }

            if (activeMenu && activeMenu !== targetMenu) {
                closeAllMegaMenus(true);
            }

            if (!targetMenu.classList.contains('active')) {
                closeAllMegaMenus(true);
                activeMenu = targetMenu;
                activeTriggerLi = this;
                activateFirstTab(activeMenu);
                activeMenu.classList.add('active');
                activeTriggerLi.classList.add('active-trigger');
            }
        });

        triggerLi.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(() => {
                if (activeMenu && !activeMenu.matches(':hover')) {
                    closeAllMegaMenus(true);
                }
                hoverTimeout = null;
            }, 250);
        });
    });

    allMegaMenus.forEach(menu => {
        menu.addEventListener('mouseenter', () => {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                hoverTimeout = null;
            }
        });

        menu.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                if (activeTriggerLi && !activeTriggerLi.matches(':hover')) {
                    closeAllMegaMenus(true);
                }
                hoverTimeout = null;
            }, 250);
        });

        const backButtons = menu.querySelectorAll('.submenu-back-btn');
        backButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                goBackToPreviousMenu(menu);
            });
        });

        // تب‌های منوی اصلی
        const mainProMenu = menu.querySelector('.pro-menu:not([id])');
        if (mainProMenu) {
            const megaMenuTabs = mainProMenu.querySelectorAll('.pro-tabs > .p-tab');
            
            megaMenuTabs.forEach(tab => {
                if (tab.hasAttribute('data-submenu')) {
                    tab.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const subMenuId = this.getAttribute('data-submenu');
                        showSubProMenu(subMenuId, menu);
                    });
                }
                
                tab.addEventListener('mouseenter', function() {
                    if (!menu.classList.contains('active')) return;

                    const tabTargetId = this.getAttribute('data-tab');
                    const tabTargetContent = mainProMenu.querySelector(`.pro-contents > #${tabTargetId}`);

                    if (tabTargetContent && !this.classList.contains('active')) {
                        const currentMenuTabs = mainProMenu.querySelectorAll('.pro-tabs > .p-tab');
                        const currentMenuContents = mainProMenu.querySelectorAll('.pro-contents > .p-content');

                        currentMenuTabs.forEach(t => t.classList.remove('active'));
                        currentMenuContents.forEach(content => content.classList.remove('active'));

                        tabTargetContent.classList.add('active');
                        this.classList.add('active');
                    }
                });
            });
        }

        // تب‌های منوهای فرعی
        const subProMenus = menu.querySelectorAll('.pro-menu[id]');
        subProMenus.forEach(subMenu => {
            const subTabs = subMenu.querySelectorAll('.pro-tabs > .p-tab');
            
            subTabs.forEach(tab => {
                if (tab.hasAttribute('data-submenu')) {
                    tab.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const subMenuId = this.getAttribute('data-submenu');
                        showSubProMenu(subMenuId, menu);
                    });
                }
                
                tab.addEventListener('mouseenter', function() {
                    if (!subMenu.classList.contains('active')) return;

                    const tabTargetId = this.getAttribute('data-tab');
                    const tabTargetContent = subMenu.querySelector(`.pro-contents > #${tabTargetId}`);

                    if (tabTargetContent && !this.classList.contains('active')) {
                        const currentTabs = subMenu.querySelectorAll('.pro-tabs > .p-tab');
                        const currentContents = subMenu.querySelectorAll('.pro-contents > .p-content');

                        currentTabs.forEach(t => t.classList.remove('active'));
                        currentContents.forEach(content => content.classList.remove('active'));

                        tabTargetContent.classList.add('active');
                        this.classList.add('active');
                    }
                });
            });
        });
    });

    document.addEventListener('click', function(event) {
        if (activeMenu && !activeMenu.contains(event.target) && 
            activeTriggerLi && !activeTriggerLi.contains(event.target)) {
            closeAllMegaMenus(true);
        }
    });
});