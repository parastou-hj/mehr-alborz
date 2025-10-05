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


  document.addEventListener('DOMContentLoaded', () => {
        const megaMenuTriggers = document.querySelectorAll('.has-megamenu');
        const allMegaMenus = document.querySelectorAll('.mega-menu');
        let hoverTimeout = null;
        let activeMenu = null;
        let activeTriggerLi = null;

        const closeAllMegaMenus = (immediately = false) => {
            allMegaMenus.forEach(menu => {
                if (menu.classList.contains('active')) {
                    menu.classList.remove('active');
                }
            });
             if (activeTriggerLi) {
                 activeTriggerLi.classList.remove('active-trigger');
             }
            activeMenu = null;
            activeTriggerLi = null;
            if (hoverTimeout && !immediately) {
                 clearTimeout(hoverTimeout);
                 hoverTimeout = null;
            }
        };

        const activateFirstTab = (menu) => {
            if (!menu) return;
            const tabs = menu.querySelectorAll('.pro-tabs > .p-tab');
            const contents = menu.querySelectorAll('.pro-contents > .p-content');

            tabs.forEach(tab => tab.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));

            if (tabs.length > 0) {
                const firstTab = tabs[0];
                const firstContentId = firstTab.getAttribute('data-tab');
                const firstContent = menu.querySelector(`.pro-contents > #${firstContentId}`);

                firstTab.classList.add('active');
                if (firstContent) {
                    firstContent.classList.add('active');
                }
            }
        };

        megaMenuTriggers.forEach(triggerLi => {
            const targetMenuId = triggerLi.getAttribute('data-megamenu-target');
            const targetSelector = targetMenuId.startsWith('#') ? targetMenuId : `#${targetMenuId}`;
            // Important: Search for the menu within the nav context if placed inside
            const targetMenu = triggerLi.closest('.nav').querySelector(targetSelector);
             // If menus are outside nav, use: document.querySelector(targetSelector);

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
                    closeAllMegaMenus(true); // Ensure others are closed

                    activeMenu = targetMenu;
                    activeTriggerLi = this; // Keep track of the trigger
                    activateFirstTab(activeMenu);
                    activeMenu.classList.add('active');
                    activeTriggerLi.classList.add('active-trigger'); // Add style to trigger
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

            const megaMenuTabs = menu.querySelectorAll('.pro-tabs > .p-tab');
            megaMenuTabs.forEach(tab => {
                tab.addEventListener('mouseenter', function() {
                    if (!menu.classList.contains('active')) return;

                    const tabTargetId = this.getAttribute('data-tab');
                    const tabTargetContent = menu.querySelector(`.pro-contents > #${tabTargetId}`);

                    if (tabTargetContent && !this.classList.contains('active')) {
                        const currentMenuTabs = menu.querySelectorAll('.pro-tabs > .p-tab');
                        const currentMenuContents = menu.querySelectorAll('.pro-contents > .p-content');

                        currentMenuTabs.forEach(t => t.classList.remove('active'));
                        currentMenuContents.forEach(content => content.classList.remove('active'));

                        tabTargetContent.classList.add('active');
                        this.classList.add('active');
                    }
                });
            });
        });

        document.addEventListener('click', function(event) {
            if (activeMenu && !activeMenu.contains(event.target) && activeTriggerLi && !activeTriggerLi.contains(event.target)) {
                closeAllMegaMenus(true);
            }
        });
    });
