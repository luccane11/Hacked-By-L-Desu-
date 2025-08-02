document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    const mainContent = document.getElementById('main-content');
    const loadingTextContainer = document.getElementById('loading-text-container');
    const progressBarInner = document.querySelector('.progress-bar-inner');
    const typewriterElement = document.getElementById('typewriter-text');
    
    const loadingSteps = [
        { text: "> Initiating boot sequence...", duration: 300 },
        { text: "> Mounting file systems... [OK]", duration: 400 },
        { text: "> Loading kernel modules... [OK]", duration: 300 },
        { text: "> Starting network services...", duration: 250 },
        { text: "> Connection established to 127.0.0.1", duration: 350 },
        { text: "> Authenticating user 'LippWangsaff'... [ACCESS GRANTED]", duration: 600 },
        { text: "> Rendering UI...", duration: 400 }
    ];

    function startBootAnimation() {
        let cumulativeTime = 0;
        const totalDuration = loadingSteps.reduce((sum, step) => sum + step.duration, 0);
        
        loadingSteps.forEach((step, index) => {
            setTimeout(() => {
                const line = document.createElement('span');
                line.textContent = step.text;
                loadingTextContainer.appendChild(line);

                const progress = (loadingSteps.slice(0, index + 1).reduce((sum, s) => sum + s.duration, 0) / totalDuration) * 100;
                progressBarInner.style.transition = `width ${step.duration}ms linear`;
                progressBarInner.style.width = `${progress}%`;

                if (index === loadingSteps.length - 1) {
                    setTimeout(showMainContent, 500);
                }
            }, cumulativeTime);
            cumulativeTime += step.duration;
        });
    }

    function showMainContent() {
        loadingOverlay.style.opacity = '0';
        mainContent.classList.add('loaded');
        loadingOverlay.addEventListener('transitionend', () => loadingOverlay.remove(), { once: true });
        
        startTypewriter();
        setupScrollObservers();
    }
    
    startBootAnimation();

    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const letters = 'アァカサタナハマヤラワガザダバパイキシチニヒミリヰギジヂビピウクABCDEFG1234567890';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
        ctx.font = fontSize + 'px monospace';
        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 40);

    const textToType = "> I'm L-Desu. A Cybersecurity Enthusiast & Digital Anomaly.";
    let typeIndex = 0;
    
    function startTypewriter() {
        typewriterElement.innerHTML = '<span class="cursor"></span>';
        function type() {
            if (typeIndex < textToType.length) {
                typewriterElement.innerHTML = textToType.substring(0, typeIndex + 1) + '<span class="cursor"></span>';
                typeIndex++;
                setTimeout(type, 40);
            }
        }
        setTimeout(type, 500);
    }

    function setupScrollObservers() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            if (section.id !== 'welcome') {
                section.classList.add('hidden');
                sectionObserver.observe(section);
            } else {
                section.classList.add('visible');
            }
        });

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { rootMargin: '-40% 0px -60% 0px' });
        
        document.querySelectorAll('.anchor').forEach(anchor => {
            navObserver.observe(anchor);
        });
    }

    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalLoader = document.getElementById('modal-loader');
    const modalData = document.getElementById('modal-data');
    const modalTitleTarget = document.getElementById('modal-title-target');
    const modalProgressInner = document.getElementById('modal-progress-inner');
    const decryptionStatus = document.getElementById('decryption-status');
    const modalTitleFinal = document.getElementById('modal-title-final');
    const modalDescription = document.getElementById('modal-description');
    const closeButtons = document.querySelectorAll('.modal-close, #modal-data .btn');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            
            modalData.style.display = 'none';
            modalLoader.style.display = 'block';
            modal.style.display = 'flex';
            
            modalTitleTarget.textContent = `[ ${title} ]`;
            modalTitleFinal.textContent = `[ DECRYPTION COMPLETE: ${title} ]`;
            modalDescription.textContent = `> ${desc}`;
            
            let progress = 0;
            modalProgressInner.style.width = '0%';
            decryptionStatus.textContent = 'DECRYPTING... 0%';

            const interval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress > 100) progress = 100;
                
                modalProgressInner.style.width = `${progress}%`;
                decryptionStatus.textContent = `DECRYPTING... ${Math.floor(progress)}%`;

                if (progress === 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        modalLoader.style.display = 'none';
                        modalData.style.display = 'block';
                    }, 500);
                }
            }, 150);
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'none';
        });
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});