

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
$(document).ready(function(){
    function resize(){   
        var calculatePadding = parseInt($('header').css("height"));
        
            $(".body-content").css({
                "padding-top": calculatePadding + "px"
            });
        
    }

    resize(); 
    $(window).resize(function(){ 
        resize();
    });
});
  $(".baner-owl").owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        rtl: true,
        nav: false,
        dots: false
    });


  $(".brand-owl").owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        rtl: true,
        nav: false,
        dots: false
    });



    class CounterAnimation {
    constructor() {
        this.percentSection = document.querySelector('.percent-sec');
        this.hasAnimated = false;
        this.counterItems = this.percentSection ? this.percentSection.querySelectorAll('.percent-item span') : [];
        this.init();
    }
    
    init() {
        if (!this.percentSection || this.counterItems.length === 0) return;
        
        this.setupObserver();
        window.addEventListener('scroll', () => this.checkScroll());
    }
    
    setupObserver() {
        if (window.IntersectionObserver) {
            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -20% 0px',
                threshold: 0.3
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.startAnimation();
                        this.hasAnimated = true;
                    }
                });
            }, observerOptions);
            
            observer.observe(this.percentSection);
        }
    }
    
    checkScroll() {
        if (this.hasAnimated || !this.percentSection) return;
        
        const rect = this.percentSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top <= windowHeight * 0.8 && rect.bottom >= windowHeight * 0.2) {
            this.startAnimation();
            this.hasAnimated = true;
        }
    }
    

      //count one by one
    startAnimation() {
        Array.from(this.counterItems).forEach((item, index) => {
            setTimeout(() => {
                this.animateCounter(item);
            }, index * 200);
        });
    }

    //count all in once
//       startAnimation() {
//        Array.from(this.counterItems).forEach((item) => {
//     this.animateCounter(item);
// });
//     }
    
    animateCounter(element) {
        const fullText = element.textContent;
        const matches = fullText.match(/(\d+)([^0-9]*)/);
        
        if (!matches) return;
        
        const target = parseInt(matches[1]); 
        const suffix = matches[2] || '';
        
        const duration = 1500;
        const frameRate = 16;
        const totalFrames = duration / frameRate;
        
        let currentFrame = 0;
        let currentValue = 1; 
        
        const timer = setInterval(() => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            const easedProgress = this.easeOutExpo(progress);
            currentValue = Math.round(1 + (easedProgress * (target - 1)));
            
            if (currentFrame >= totalFrames) {
                currentValue = target;
            }
            
            element.textContent = currentValue + suffix;
            
            if (currentFrame >= totalFrames) {
                clearInterval(timer);
                element.style.transition = 'transform 0.3s ease';
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 300);
            }
        }, frameRate);
    }
    
    easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new CounterAnimation();
});

  function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

$(document).ready(function() {
    const initializeOwlCarousel = () => {
        const advantagesContainer=$('.brands-items')
        if (window.innerWidth > 768) {
            if (typeof advantagesContainer.data('owl.carousel') != 'undefined') {
                advantagesContainer.data('owl.carousel').destroy();
              }
              advantagesContainer.removeClass('owl-carousel');
            
        } else if(window.innerWidth <= 768) {
            if (!$('.brands-items').hasClass('owl-carousel')) {
                $('.brands-items').addClass('owl-carousel').owlCarousel({
                    rtl: true,
                    items: 1,
                    dots: true,
                    loop: true,
                    // autoplay: true,
                    // autoplayTimeout: 3000,
                    // autoplayHoverPause: true,
                    responsive: {
                        0: {
                            items: 3
                        },
                        576: {
                            items: 4
                        },
                        768: {
                            items: 5
                        },
                        1200: {
                            items: 6
                        },
                        
                    }
                });
            }
        }
    };

    initializeOwlCarousel();
    $(window).resize(initializeOwlCarousel);

  
});

//off-canvas:

$('.bar-menu i').on('click', function(){
    $('.off-canvas').addClass('active');
    $('.overlay').addClass('active');
    $('body').css('overflow','hidden');
    
  })
  $('.close-btn').on('click',function(){
    $('.off-canvas').removeClass('active');
    $('.overlay').removeClass('active');
    $('body').css('overflow','auto');
  
  })
  $(document).ready(function() {
  
    $('.category-btn').on('click', function(e) {
        e.preventDefault();
        $('.submenu.level-1').addClass('active');
    });
  
  
    $('.subcategory-btn').on('click', function(e) {
        e.preventDefault();
        $(this).closest('.submenu-item').find('.submenu.level-2').addClass('active');
    });
  
  
    $('.back-btn').on('click', function() {
        $(this).closest('.submenu').removeClass('active');
    });
  
  
    $('.close-btn').on('click', function() {
        $('.submenu').removeClass('active');
    });
  });
  $('body').on('click',function(e){
    if(!e.target.closest('.off-canvas')&&!e.target.closest('.bar-menu i')&&!e.target.closest('.fixed-phone')&&!e.target.closest('.pro-equip')&& !e.target.closest('.equip')){
        $('.off-canvas').removeClass('active');
        $('.overlay').removeClass('active');
        $('body').css('overflow','auto');
      
  
    }})

document.querySelector('.fix-call').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('consultationModal').classList.add('active');
});

// Close Modal
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('consultationModal').classList.remove('active');
});

// Close on outside click
document.getElementById('consultationModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.querySelector('.search');
    const searchBox = document.querySelector('.search-box-wrapper');
    const closeSearchBtn = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    
    // Open Search Box
    if (searchIcon) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            searchBox.classList.add('active');
            
            // Focus on input after animation
            setTimeout(() => {
                searchInput.focus();
            }, 400);
        });
    }
    
    // Close Search Box
    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', function() {
            searchBox.classList.remove('active');
        });
    }
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchBox.classList.contains('active')) {
            searchBox.classList.remove('active');
        }
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchBox.contains(e.target) && !searchIcon.contains(e.target)) {
            searchBox.classList.remove('active');
        }
    });
    
    // Prevent closing when clicking inside search box
    searchBox.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    });