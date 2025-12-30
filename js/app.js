
document.addEventListener('DOMContentLoaded', () => {

    // --- DATA ASSETS ---
    // Using a curated selection from the provided list
    const memories = [
        { type: 'image', src: 'image/IMG-20220518-WA0007.jpg', caption: 'Capturing moments...' },
        { type: 'video', src: 'videos/VID-20220821-WA0005.mp4', caption: 'Motion and emotion.' },
        { type: 'image', src: 'image/IMG-20220518-WA0010.jpg', caption: 'Sexiest Mama.' },
        { type: 'image', src: 'image/IMG-20220518-WA0016.jpg', locked: true, caption: 'Do you remember this?' },
        { type: 'video', src: 'videos/VID-20220821-WA0009.mp4', caption: 'Just being silly.' },
        { type: 'image', src: 'image/f739b8e1a7d146ecb1c3faa4e736957a.jpg', caption: 'You looked amazing here.' },
        { type: 'video', src: 'videos/VID-20220821-WA0015.mp4', locked: true, caption: 'One of my favorites.' },
        { type: 'image', src: 'image/new.jpg', caption: 'best times.' },
    ];

    const compliments = [
        "You make silence comfortable.",
        "Your laugh is dangerous.",
        "You made ordinary days lighter.",
        "I admire your strength.",
        "You have the kindest eyes."
    ];

    // --- SCENE 1: TYPEWRITER & OPENING ---
    const textElement = document.getElementById('typewriter-text');
    const textToType = "Some stories don’t start with words…";
    const btnGroup = document.querySelector('.button-group');
    let charIndex = 0;

    function typeWriter() {
        if (charIndex < textToType.length) {
            textElement.innerHTML += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        } else {
            // Show buttons after typing
            setTimeout(() => {
                btnGroup.classList.remove('hidden');
            }, 500);
        }
    }

    // Start typing after a short delay
    setTimeout(typeWriter, 1000);

    // Button interactions
    document.getElementById('btn-play').addEventListener('click', () => {
        transitionToMain();
    });

    document.getElementById('btn-curious').addEventListener('click', () => {
        transitionToMain();
        // Could add a slight variation here, but keeping simple flow for now
    });

    function transitionToMain() {
        // Fade out opening
        document.getElementById('opening-gate').style.display = 'none';

        // Show main content
        const main = document.getElementById('main-content');
        main.classList.remove('hidden');

        // Init observers
        initObservers();
    }

    // --- SCENE 3: MEMORY FLOW GENERATOR ---
    const memoryContainer = document.getElementById('memory-container');

    memories.forEach((mem, index) => {
        const item = document.createElement('div');
        item.classList.add('memory-item');
        if (mem.locked) item.classList.add('locked');

        // Content
        let media;
        if (mem.type === 'image') {
            media = document.createElement('img');
            media.src = mem.src;
        } else {
            media = document.createElement('video');
            media.src = mem.src;
            media.muted = true;
            // hover to play preview? for now static or autoplay muted
            media.addEventListener('mouseenter', () => media.play());
            media.addEventListener('mouseleave', () => {
                media.pause();
                media.currentTime = 0;
            });
        }
        item.appendChild(media);

        // Lock Overlay
        if (mem.locked) {
            const overlay = document.createElement('div');
            overlay.className = 'lock-overlay';
            overlay.innerHTML = '<div class="lock-icon">🔒</div><div>Tap to Unlock</div>';
            item.appendChild(overlay);

            // Unlock interaction
            item.addEventListener('click', (e) => {
                if (item.classList.contains('locked')) {
                    e.stopPropagation(); // prevent modal opening immediately
                    unlockMemory(item, overlay);
                } else {
                    openModal(mem);
                }
            });
        } else {
            item.addEventListener('click', () => openModal(mem));
        }

        memoryContainer.appendChild(item);
    });

    function unlockMemory(item, overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            item.classList.remove('locked');
            item.classList.add('unlocked');
        }, 300);
    }

    // --- MODAL LOGIC ---
    const modal = document.getElementById('media-modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    const modalCaption = document.getElementById('modal-caption');
    const closeBtn = document.querySelector('.close-modal');

    function openModal(mem) {
        modal.classList.remove('hidden');
        modal.classList.add('active');
        modalCaption.textContent = mem.caption;

        if (mem.type === 'image') {
            modalImg.src = mem.src;
            modalImg.classList.remove('hidden');
            modalVideo.classList.add('hidden');
        } else {
            modalVideo.querySelector('source').src = mem.src;
            modalVideo.load();
            modalVideo.classList.remove('hidden');
            modalImg.classList.add('hidden');
            modalVideo.play();
        }
    }

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.classList.add('hidden');
            modalVideo.pause();
            modalVideo.querySelector('source').src = "";
        }, 300);
    });

    // --- MOOD SELECTOR ---
    const buttons = document.querySelectorAll('.mood-btn');
    const body = document.body;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            buttons.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            // Set body attribute
            body.setAttribute('data-mood', btn.getAttribute('data-mood'));
        });
    });

    // --- SCENE 6: CINEMATIC VIDEO ROOM ---
    const featureVideoSrc = "videos/VID-20220821-WA0018.mp4"; // Selecting a specific video
    const featureVideo = document.getElementById('feature-video');
    featureVideo.querySelector('source').src = featureVideoSrc;
    featureVideo.load();

    // --- SCENE 7: COMPLIMENT ORBS ---
    const orbsContainer = document.getElementById('orbs-container');
    const orbMessage = document.getElementById('orb-message');

    // Create 10 orbs
    for (let i = 0; i < 10; i++) {
        createOrb();
    }

    function createOrb() {
        const orb = document.createElement('div');
        orb.classList.add('orb');

        // Random size
        const size = Math.random() * 40 + 20; // 20-60px
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;

        // Random position
        orb.style.left = `${Math.random() * 90}%`;
        orb.style.top = `${Math.random() * 90}%`;

        // Random float duration
        orb.style.animationDuration = `${Math.random() * 5 + 5}s`;

        // Interaction
        orb.addEventListener('click', () => {
            const text = compliments[Math.floor(Math.random() * compliments.length)];
            showOrbMessage(text);

            // Pop effect
            orb.style.transform = "scale(2)";
            orb.style.opacity = "0";
            setTimeout(() => {
                orb.remove();
                // Respawn one to keep the fun going?
                setTimeout(createOrb, 2000);
            }, 300);
        });

        orbsContainer.appendChild(orb);
    }

    function showOrbMessage(msg) {
        orbMessage.textContent = msg;
        orbMessage.classList.remove('hidden');
        orbMessage.classList.add('show');

        setTimeout(() => {
            orbMessage.classList.remove('show');
            setTimeout(() => {
                orbMessage.classList.add('hidden');
            }, 500);
        }, 3000);
    }

    // --- INTERSECTION OBSERVERS ---
    function initObservers() {
        const observerOptions = {
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.id === 'final-confession') {
                        playFinalScene();
                    }
                }
            });
        }, observerOptions);

        observer.observe(document.getElementById('final-confession'));
    }

    // --- SCENE 8: FINAL SCENE ---
    function playFinalScene() {
        const text1 = document.querySelector('.final-text.alpha');
        const text2 = document.querySelector('.final-text.beta');
        const reveal = document.querySelector('.final-reveal');

        setTimeout(() => {
            text1.classList.remove('hidden');
            text1.classList.add('fade-in');
        }, 500);

        setTimeout(() => {
            text1.classList.remove('fade-in');
            text1.classList.add('fade-out');
        }, 3500);

        setTimeout(() => {
            text2.classList.remove('hidden');
            text2.classList.add('fade-in');
        }, 4500);

        setTimeout(() => {
            text2.classList.remove('fade-in');
            text2.classList.add('fade-out');
        }, 7500);

        setTimeout(() => {
            reveal.classList.remove('hidden');
            reveal.classList.add('fade-in');
        }, 9000);
    }

    // --- NAVIGATION PREVENT DEFAULT ---
    // Just to keep it app-like
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- GRAND ENHANCEMENTS ---

    // 1. REASONS GRID
    const reasons = [
        "Your empathy", "Your style", "The way you listen",
        "Your ambition", "Your body", "How you smile",
        "Your taste in music", "Everything"
    ];
    const reasonsContainer = document.getElementById('reasons-container');

    reasons.forEach((text, index) => {
        const card = document.createElement('div');
        card.classList.add('flip-card');

        card.innerHTML = `
            <div class="flip-card-inner">
                <div class="flip-card-front">?</div>
                <div class="flip-card-back">${text}</div>
            </div>
        `;

        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            // Trigger mini rain on reveal
            if (card.classList.contains('flipped')) createRain(10);
        });

        reasonsContainer.appendChild(card);
    });

    // Staggered Observer for Grid
    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.flip-card');
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 150); // Stagger delay
                });

                // Also animate title
                const title = entry.target.parentElement.querySelector('.section-title');
                if (title) title.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    if (reasonsContainer) gridObserver.observe(reasonsContainer);


    // 2. LOVE RAIN
    const rainContainer = document.getElementById('love-rain-container');
    const heartBtn = document.getElementById('heartbeat-btn');

    function createRain(amount = 30) {
        for (let i = 0; i < amount; i++) {
            const heart = document.createElement('div');
            heart.classList.add('rain-heart');
            heart.innerHTML = ['❤️', '💖', '✨', '🌸'][Math.floor(Math.random() * 4)];

            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 2 + 2 + 's';
            heart.style.fontSize = Math.random() * 20 + 10 + 'px';

            rainContainer.appendChild(heart);

            // Cleanup
            setTimeout(() => {
                heart.remove();
            }, 5000);
        }
    }

    heartBtn.addEventListener('click', () => {
        createRain(20);
        // Haptic feedback if supported
        if (navigator.vibrate) navigator.vibrate(50);
    });


    // 3. PARALLAX EFFECT
    // Subtle movement of background/particles
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX * -0.015);
        const moveY = (e.clientY * -0.015);

        // Move particles container if it exists
        const particles = document.getElementById('particles-js');
        if (particles) {
            particles.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }

        // Move orbs slightly interactively
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach(orb => {
            const speed = 0.03;
            const x = (window.innerWidth - e.pageX * speed) / 100;
            const y = (window.innerHeight - e.pageY * speed) / 100;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // 5. MOOD AUDIO INTEGRATION
    const audioTracks = {
        playful: "audio/Marshmello x Lil Peep - Spotlight (Official Music Video).mp3",
        romantic: "audio/we fell in love in october - girl in red.mp3",
        soft: "audio/i wanna be your girlfriend   girl in red.mp3"
    };

    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    let isPlaying = false;

    // Set initial track (but don't play until user interaction)
    bgMusic.src = audioTracks['playful'];
    bgMusic.volume = 0.5;

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
            musicBtn.innerHTML = "🎵"; // Note icon
            isPlaying = false;
        } else {
            bgMusic.play().then(() => {
                musicBtn.classList.add('playing');
                musicBtn.classList.remove('disconnected');
                musicBtn.innerHTML = "⏸"; // Pause icon (or keep note spinning)
                isPlaying = true;
            }).catch(e => console.log("Audio play failed:", e));
        }
    });

    // Hook into existing mood buttons to switch tracks
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mood = btn.getAttribute('data-mood');
            const newTrack = audioTracks[mood];

            if (bgMusic.getAttribute('src') !== newTrack) {
                // Smooth transition could be here, but simple switch for now
                const wasPlaying = isPlaying;
                bgMusic.src = newTrack;
                if (wasPlaying) {
                    bgMusic.play();
                }
            }
        });
    });

});
