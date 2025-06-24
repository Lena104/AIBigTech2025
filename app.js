// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 요소들
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('.section');
    
    // 부드러운 스크롤을 위한 함수
    function smoothScrollTo(target) {
        const targetElement = document.querySelector(target);
        if (targetElement) {
            const headerOffset = 80; // 고정 네비게이션 높이 고려
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // 네비게이션 링크 클릭 이벤트
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 모든 링크에서 active 클래스 제거
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            // 클릭된 링크에 active 클래스 추가
            this.classList.add('active');
            
            // 해당 섹션으로 스크롤
            const targetSection = this.getAttribute('href');
            smoothScrollTo(targetSection);
        });
    });

    // 스크롤 이벤트로 현재 섹션 감지 및 네비게이션 업데이트
    function updateActiveNavigation() {
        const scrollPosition = window.scrollY + 100; // 오프셋 추가

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // 모든 네비게이션 링크에서 active 클래스 제거
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // 해당하는 네비게이션 링크에 active 클래스 추가
                const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // 스크롤 이벤트 리스너 (throttle 적용)
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavigation();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);

    // 페이지 로드 시 초기 네비게이션 상태 설정
    updateActiveNavigation();

    // 카드 호버 효과 개선
    const cards = document.querySelectorAll('.highlight-card, .product-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 숫자 애니메이션 효과
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const text = element.textContent;
                    
                    // 숫자가 포함된 경우에만 애니메이션 적용
                    if (text.includes('조') || text.includes('억') || text.includes('+')) {
                        element.style.opacity = '0';
                        element.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            element.style.transition = 'all 0.8s ease-out';
                            element.style.opacity = '1';
                            element.style.transform = 'translateY(0)';
                        }, 100);
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    // 섹션 페이드인 효과
    function initScrollAnimations() {
        const animationElements = document.querySelectorAll('.company-section, .overview');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        animationElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(element);
        });
    }

    // 키보드 네비게이션 지원
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // 화살표 키로 섹션 간 이동
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const activeLink = document.querySelector('.nav__link.active');
                if (activeLink) {
                    const currentIndex = Array.from(navLinks).indexOf(activeLink);
                    let nextIndex;
                    
                    if (e.key === 'ArrowDown') {
                        nextIndex = (currentIndex + 1) % navLinks.length;
                    } else {
                        nextIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
                    }
                    
                    // Ctrl/Cmd 키와 함께 눌렀을 때만 이동
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        navLinks[nextIndex].click();
                    }
                }
            }
        });
    }

    // 모바일 터치 제스처 지원
    function initTouchGestures() {
        let startY = 0;
        let startX = 0;
        
        document.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            const endY = e.changedTouches[0].clientY;
            const endX = e.changedTouches[0].clientX;
            const deltaY = startY - endY;
            const deltaX = Math.abs(startX - endX);
            
            // 세로 스와이프가 가로 스와이프보다 크고, 일정 거리 이상일 때
            if (Math.abs(deltaY) > deltaX && Math.abs(deltaY) > 50) {
                const activeLink = document.querySelector('.nav__link.active');
                if (activeLink) {
                    const currentIndex = Array.from(navLinks).indexOf(activeLink);
                    let nextIndex;
                    
                    if (deltaY > 0) { // 아래로 스와이프 (다음 섹션)
                        nextIndex = Math.min(currentIndex + 1, navLinks.length - 1);
                    } else { // 위로 스와이프 (이전 섹션)
                        nextIndex = Math.max(currentIndex - 1, 0);
                    }
                    
                    if (nextIndex !== currentIndex) {
                        navLinks[nextIndex].click();
                    }
                }
            }
        }, { passive: true });
    }

    // 네비게이션 바 스크롤 표시
    function updateNavScrollIndicator() {
        const nav = document.querySelector('.nav');
        const scrolled = window.pageYOffset;
        const rate = scrolled / (document.body.scrollHeight - window.innerHeight);
        
        // 네비게이션 바에 프로그레스 표시 추가
        if (!nav.querySelector('.nav-progress')) {
            const progress = document.createElement('div');
            progress.className = 'nav-progress';
            progress.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                height: 2px;
                background: var(--color-primary);
                transition: width 0.3s ease;
                width: 0%;
            `;
            nav.appendChild(progress);
        }
        
        const progressBar = nav.querySelector('.nav-progress');
        progressBar.style.width = `${rate * 100}%`;
    }

    // 성능 최적화를 위한 스크롤 이벤트에 프로그레스 바 업데이트 추가
    function onScrollWithProgress() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavigation();
                updateNavScrollIndicator();
                ticking = false;
            });
            ticking = true;
        }
    }

    // 기존 스크롤 이벤트 리스너 교체
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScrollWithProgress);

    // 초기화 함수들 실행
    animateNumbers();
    initScrollAnimations();
    initKeyboardNavigation();
    initTouchGestures();
    updateNavScrollIndicator();

    // 리사이즈 이벤트 처리
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateActiveNavigation();
            updateNavScrollIndicator();
        }, 250);
    });

    // 페이지 가시성 변경 시 애니메이션 일시정지
    document.addEventListener('visibilitychange', function() {
        const cards = document.querySelectorAll('.highlight-card, .product-card');
        cards.forEach(card => {
            if (document.hidden) {
                card.style.animationPlayState = 'paused';
            } else {
                card.style.animationPlayState = 'running';
            }
        });
    });

    // 에러 처리
    window.addEventListener('error', function(e) {
        console.error('JavaScript 오류 발생:', e.error);
    });

    console.log('2025년 빅테크 기업 AI 발전 동향 웹페이지가 성공적으로 로드되었습니다.');
});