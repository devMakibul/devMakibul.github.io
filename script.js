document.addEventListener('DOMContentLoaded', () => {
    
    /* -----------------------------------------------------------
       THEME TOGGLE
       ----------------------------------------------------------- */
    const html = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');
    const storageKey = 'theme';
    
    // Check local storage or system preference
    const storedTheme = localStorage.getItem(storageKey);
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    const currentTheme = storedTheme || systemPreference;
    html.setAttribute('data-theme', currentTheme);

    function toggleTheme() {
        const current = html.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        localStorage.setItem(storageKey, next);
        
        // Announce to screen readers
        const msg = `Theme switched to ${next} mode`;
        const ariaAlert = document.createElement('div');
        ariaAlert.setAttribute('role', 'alert');
        ariaAlert.style.position = 'absolute';
        ariaAlert.style.width = '1px';
        ariaAlert.style.height = '1px';
        ariaAlert.style.overflow = 'hidden';
        ariaAlert.textContent = msg;
        document.body.appendChild(ariaAlert);
        setTimeout(() => ariaAlert.remove(), 1000);
    }

    toggleBtn.addEventListener('click', toggleTheme);

    // Keyboard shortcut 'T'
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 't' && document.activeElement.tagName !== 'INPUT') {
            toggleTheme();
        }
    });


    /* -----------------------------------------------------------
       HERO TYPEWRITER
       ----------------------------------------------------------- */
    const textToType = "web_dev";
    const typeWriterElement = document.getElementById('typewriter');
    let typeIndex = 0;

    function typeWriter() {
        if (typeIndex < textToType.length) {
            typeWriterElement.textContent += textToType.charAt(typeIndex);
            typeIndex++;
            setTimeout(typeWriter, 50); // Typing speed
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeWriter, 500);


    /* -----------------------------------------------------------
       SCROLL REVEAL (IntersectionObserver)
       ----------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* -----------------------------------------------------------
       PROJECT FILTER
       ----------------------------------------------------------- */
    
    const projectCards = document.querySelectorAll('.project-card');

    /* -----------------------------------------------------------
       MODAL LOGIC
       ----------------------------------------------------------- */
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    // Elements to populate
    const mImg = document.getElementById('modal-img');
    const mTitle = document.getElementById('modal-title');
    const mTags = document.getElementById('modal-tags');
    const mDesc = document.getElementById('modal-desc');
    const mLink = document.getElementById('modal-link');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            // Extract data from the card
            const img = card.querySelector('.project-thumb img').src;
            const title = card.querySelector('h3').textContent;
            const tags = card.querySelector('.meta-line').textContent;
            // Get the full hidden description, fallback to short if missing
            const descFull = card.querySelector('.desc-full');
            const desc = descFull ? descFull.innerHTML : card.querySelector('.desc-short').textContent;
            const link = card.querySelector('a').href;

            // Populate Modal
            mImg.src = img;
            mTitle.textContent = title;
            mTags.textContent = tags;
            mDesc.innerHTML = desc;
            mLink.href = link;

            // Show
            modal.showModal();
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });
    });

    // Close logic
    const closeModal = () => {
        modal.close();
        document.body.style.overflow = '';
    };

    closeModalBtn.addEventListener('click', closeModal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        const rect = modal.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || 
            e.clientY < rect.top || e.clientY > rect.bottom) {
            closeModal();
        }
    });


    /* -----------------------------------------------------------
       COPY TO CLIPBOARD
       ----------------------------------------------------------- */
    const copyBtn = document.getElementById('copy-handle');
    const tooltip = copyBtn.querySelector('.tooltip');
    
    copyBtn.addEventListener('click', () => {
        const email = copyBtn.getAttribute('data-handle');
        
        navigator.clipboard.writeText(email).then(() => {
            tooltip.classList.add('show');
            setTimeout(() => {
                tooltip.classList.remove('show');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });


    /* -----------------------------------------------------------
       TERMINAL LOG 
       ----------------------------------------------------------- */
    const logElement = document.getElementById('log-msg');
    const logs = [
        "System idle...",
        "Scanning for vulnerabilities...",
        "Compiling assets...",
        "Garbage collection in progress...",
        "Ping: 12ms",
        "Fetching data from /api/life...",
        "Watching for file changes..."
    ];

    function updateLog() {
        const randomLog = logs[Math.floor(Math.random() * logs.length)];
        // Simple type effect for log
        logElement.textContent = "";
        let i = 0;
        const speed = 30;
        
        function typeLog() {
            if (i < randomLog.length) {
                logElement.textContent += randomLog.charAt(i);
                i++;
                setTimeout(typeLog, speed);
            }
        }
        typeLog();
    }

    // Update log every 5 seconds
    setInterval(updateLog, 5000);
});