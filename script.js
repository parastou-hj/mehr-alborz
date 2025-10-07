
document.addEventListener('DOMContentLoaded', function() {
    const megaMenuTriggers = document.querySelectorAll('.has-megamenu');
    const allMegaMenus = document.querySelectorAll('.mega-menu');
    let activeMenu = null;
    let activeTrigger = null;
    let hoverTimeout = null;
    let menuHistory = [];

    const closeAll = function() {
        allMegaMenus.forEach(function(menu) {
            menu.classList.remove('active');
        });
        document.querySelectorAll('.mega-menu-container').forEach(function(c) {
            c.classList.remove('active');
        });
        document.querySelectorAll('.menu-tab.active').forEach(function(t) {
            t.classList.remove('active');
        });
        document.querySelectorAll('.content-item.active').forEach(function(c) {
            c.classList.remove('active');
        });
        if (activeTrigger) activeTrigger.classList.remove('active-trigger');
        activeMenu = null;
        activeTrigger = null;
        menuHistory = [];
    };

    const showMenu = function(menuId, isBack) {
        isBack = isBack || false;
        const container = document.querySelector('[data-menu="' + menuId + '"]');
        if (!container) return;

        document.querySelectorAll('.mega-menu-container.active').forEach(function(c) {
            if (!c.classList.contains('slide-out-left')) {
                c.classList.remove('active');
            }
        });

        container.classList.add('active');
        
        if (isBack) {
            container.classList.add('slide-in-left');
            setTimeout(function() {
                container.classList.remove('slide-in-left');
            }, 300);
        } else if (menuId !== 'main') {
            container.classList.add('slide-in-right');
            setTimeout(function() {
                container.classList.remove('slide-in-right');
            }, 300);
        }
        
        const firstTab = container.querySelector('.menu-tab');
        const firstContent = container.querySelector('.content-item');
        if (firstTab) firstTab.classList.add('active');
        if (firstContent) firstContent.classList.add('active');
    };

    megaMenuTriggers.forEach(function(trigger) {
        const targetId = trigger.getAttribute('data-megamenu-target').replace('#', '');
        const menu = document.getElementById(targetId);
        if (!menu) return;

        trigger.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            closeAll();
            activeMenu = menu;
            activeTrigger = trigger;
            menu.classList.add('active');
            trigger.classList.add('active-trigger');
            menuHistory = ['main'];
            showMenu('main');
        });

        trigger.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(function() {
                if (!menu.matches(':hover')) closeAll();
            }, 250);
        });
    });

    allMegaMenus.forEach(function(menu) {
        menu.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
        });
        
        menu.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(function() {
                if (activeTrigger && !activeTrigger.matches(':hover')) closeAll();
            }, 250);
        });
    });

    document.addEventListener('click', function(e) {
        if (!e.target || typeof e.target.closest !== 'function') return;
        
        const tab = e.target.closest('.menu-tab');
        if (!tab) return;

        const container = tab.closest('.mega-menu-container');
        const target = tab.getAttribute('data-target');
        const hasSub = tab.hasAttribute('data-has-sub');

        if (hasSub) {
            e.stopPropagation();
            const currentMenuId = container.getAttribute('data-menu');
            menuHistory.push(currentMenuId);
            
            container.classList.add('slide-out-left');
            
            setTimeout(function() {
                container.classList.remove('active', 'slide-out-left');
                showMenu(target, false);
            }, 300);
        } else {
            container.querySelectorAll('.menu-tab').forEach(function(t) {
                t.classList.remove('active');
            });
            container.querySelectorAll('.content-item').forEach(function(c) {
                c.classList.remove('active');
            });

            tab.classList.add('active');
            const content = container.querySelector('[data-content="' + target + '"]');
            if (content) content.classList.add('active');
        }
    });

    document.addEventListener('mouseenter', function(e) {
        if (!e.target || typeof e.target.closest !== 'function') return;
        
        const tab = e.target.closest('.menu-tab');
        if (!tab) return;

        const container = tab.closest('.mega-menu-container');
        if (!container || !container.classList.contains('active')) return;

        const target = tab.getAttribute('data-target');
        
        container.querySelectorAll('.menu-tab').forEach(function(t) {
            t.classList.remove('active');
        });
        container.querySelectorAll('.content-item').forEach(function(c) {
            c.classList.remove('active');
        });

        tab.classList.add('active');
        const content = container.querySelector('[data-content="' + target + '"]');
        if (content) content.classList.add('active');
    }, true);

    document.addEventListener('click', function(e) {
        if (!e.target || typeof e.target.closest !== 'function') return;
        
        const backBtn = e.target.closest('.menu-back-btn');
        if (!backBtn) return;

        if (menuHistory.length > 0) {
            const currentContainer = document.querySelector('.mega-menu-container.active');
            const previousMenu = menuHistory.pop();
            
            if (currentContainer) {
                currentContainer.classList.add('slide-out-left');
                
                setTimeout(function() {
                    currentContainer.classList.remove('active', 'slide-out-left');
                    showMenu(previousMenu, true);
                }, 300);
            } else {
                showMenu(previousMenu, true);
            }
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target) return;
        
        if (activeMenu && !activeMenu.contains(e.target) && 
            activeTrigger && !activeTrigger.contains(e.target)) {
            closeAll();
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

// کاروسل برند با dots فعال
$(".brand-owl").owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    rtl: true,
    nav: false,
    dots: true,  // فعال کردن نقاط
    dotsClass: 'owl-dots',
    dotClass: 'owl-dot',
    animateOut: 'fadeOut',
    animateIn: 'fadeIn'
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