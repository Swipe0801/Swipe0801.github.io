document.addEventListener('DOMContentLoaded', () => {
    // Custom Circular Cursor
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Update cursor position on mouse move
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        const speed = 0.2;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Add hover effect for interactive elements
    const hoverElements = document.querySelectorAll('a, button, .btn, .player-btn, .login-btn, .arrow-box, .album-item, .feature-box, .c3-item, input, textarea, [role="button"]');

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Check for logged in user
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            // Create the user menu structure
            const userMenuContainer = document.createElement('div');
            userMenuContainer.className = 'user-menu-container';

            userMenuContainer.innerHTML = `
                <div class="user-menu-trigger">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    ${currentUser}님
                </div>
                <div class="user-dropdown">
                    <div class="dropdown-id">${currentUser}님</div>
                    <a href="userinfo.html"class="dropdown-item">회원 정보</a>
                    <a href="https://music.apple.com/kr/new" class="dropdown-item play-music-btn">음악 재생하기</a>
                    <div class="dropdown-item logout-btn">로그아웃</div>
                </div>
            `;

            // Replace the login button with the new container
            loginBtn.parentNode.replaceChild(userMenuContainer, loginBtn);

            // Logout functionality
            const logoutBtn = userMenuContainer.querySelector('.logout-btn');
            logoutBtn.addEventListener('click', () => {
                if (confirm('로그아웃 하시겠습니까?')) {
                    localStorage.removeItem('currentUser');
                    window.location.reload();
                }
            });

            // Play Music functionality (Optional: Scroll to player or trigger play)
            const playMusicBtn = userMenuContainer.querySelector('.play-music-btn');
            playMusicBtn.addEventListener('click', () => {
                window.open('https://music.apple.com/kr/new', '_blank');
            });
        }
    }

    // Track playlist
    const tracks = [
        {
            src: 'sources/brb.mp3',
            title: 'be right back (brb)',
            artist: 'synthion',
            cover: 'sources/cover1.jpg'
        },
        {
            src: 'sources/blue.mp3',
            title: 'Into the Light Blue',
            artist: 'Go^Ma',
            cover: 'sources/cover2.jpg'
        }
    ];

    let currentTrackIndex = 0;
    const audio = new Audio(tracks[currentTrackIndex].src);
    const playPauseBtn = document.getElementById('playPauseBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const trackTitleEl = document.querySelector('.track-title');
    const trackArtistEl = document.querySelector('.track-artist');
    const albumCoverEl = document.querySelector('.player-icon img');

    // Only run audio player code if elements exist
    if (playPauseBtn && nextBtn && volumeSlider && progressBar && currentTimeEl && durationEl) {
        // Icons
        const playIcon = `
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>`;
        const pauseIcon = `
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>`;

        // Initialize volume
        audio.volume = volumeSlider.value;

        // Helper: Format time (seconds -> mm:ss)
        function formatTime(seconds) {
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60);
            return `${min}:${sec < 10 ? '0' : ''}${sec}`;
        }

        // Function to load track
        function loadTrack(index) {
            const wasPlaying = !audio.paused;
            audio.src = tracks[index].src;

            // Update UI
            if (trackTitleEl) trackTitleEl.textContent = tracks[index].title;
            if (trackArtistEl) trackArtistEl.textContent = tracks[index].artist;
            if (albumCoverEl) albumCoverEl.src = tracks[index].cover;

            // Reset progress
            progressBar.value = 0;
            currentTimeEl.textContent = '0:00';

            // Auto-play if was playing before
            if (wasPlaying) {
                audio.play().catch(error => {
                    console.error("Playback failed:", error);
                });
            }
        }

        // Toggle Play/Pause
        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().catch(error => {
                    console.error("Playback failed:", error);
                });
            } else {
                audio.pause();
            }
        });

        // Update UI on Play
        audio.addEventListener('play', () => {
            playPauseBtn.innerHTML = pauseIcon;
        });

        // Update UI on Pause
        audio.addEventListener('pause', () => {
            playPauseBtn.innerHTML = playIcon;
        });

        // Update UI on End
        audio.addEventListener('ended', () => {
            playPauseBtn.innerHTML = playIcon;
        });

        // Next Button - Switch to next track
        nextBtn.addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
            loadTrack(currentTrackIndex);
        });

        // Prev Button - Switch to previous track
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
                loadTrack(currentTrackIndex);
            });
        }

        // Volume Control
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = e.target.value;
        });

        // Progress Bar & Time Update
        audio.addEventListener('loadedmetadata', () => {
            progressBar.max = Math.floor(audio.duration);
            durationEl.textContent = formatTime(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            progressBar.value = Math.floor(audio.currentTime);
            currentTimeEl.textContent = formatTime(audio.currentTime);

            // Update duration if it wasn't available at loadedmetadata
            if (durationEl.textContent === "0:00" && !isNaN(audio.duration)) {
                durationEl.textContent = formatTime(audio.duration);
                progressBar.max = Math.floor(audio.duration);
            }
        });

        // Seek functionality
        progressBar.addEventListener('input', (e) => {
            audio.currentTime = e.target.value;
        });
    }

    // Random Album Covers for Two Rows
    const row1Items = document.querySelectorAll('.album-grid-row1 .album-item');
    const row2Items = document.querySelectorAll('.album-grid-row2 .album-item');
    const coverImages = [
        'Frame 9.png', 'Frame 10.png', 'Frame 11.png', 'Frame 12.png',
        'Frame 13.png', 'Frame 14.png', 'Frame 15.png', 'Frame 16.png',
        'Frame 17.png', 'Frame 18.png', 'Frame 21.png', 'Frame 22.png',
        'Frame 23.png', 'Frame 24.png'
    ];

    // Shuffle array helper function
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Shuffle for row 1
    const shuffledRow1 = shuffleArray(coverImages);
    row1Items.forEach((item, index) => {
        const imageIndex = index % shuffledRow1.length;
        item.style.backgroundImage = `url('img/content2/covers/${shuffledRow1[imageIndex]}')`;
    });

    // Shuffle for row 2 (different from row 1)
    const shuffledRow2 = shuffleArray(coverImages);
    row2Items.forEach((item, index) => {
        const imageIndex = index % shuffledRow2.length;
        item.style.backgroundImage = `url('img/content2/covers/${shuffledRow2[imageIndex]}')`;
    });

    // Scroll Reveal Animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach((el) => {
        observer.observe(el);
    });

    // User Info Page Logic
    const userinfoGrid = document.querySelector('.userinfo-grid');

    if (userinfoGrid) {
        let displayUser = currentUser || '게스트';
        let displayPassword = '';
        let displayEmail = '-';
        let displayBirth = '-';
        let displayAge = '-';
        let displayInterest = '-';

        if (currentUser) {
            // Find user details from localStorage
            const numUsers = localStorage.getItem('numUsers');

            if (numUsers) {
                for (let i = 0; i < parseInt(numUsers); i++) {
                    const storedUser = localStorage.getItem('user' + i);

                    if (storedUser === currentUser) {
                        const rawPass = localStorage.getItem('pass' + i) || '';
                        displayPassword = '*'.repeat(rawPass.length || 8);
                        displayEmail = localStorage.getItem('email' + i) || '이메일 없음';
                        displayBirth = localStorage.getItem('birth' + i) || '정보 없음';
                        displayAge = localStorage.getItem('age' + i) || '정보 없음';
                        displayInterest = localStorage.getItem('interest' + i) || '정보 없음';
                        break;
                    }
                }
            }
        }

        // Dynamic HTML injection
        userinfoGrid.innerHTML = `
            <div class="info-card">
                <span class="info-label">아이디</span>
                <span class="info-value">${displayUser}님</span>
            </div>
            <div class="info-card">
                <span class="info-label">비밀번호</span>
                <span class="info-value">${displayPassword || '-'}</span>
            </div>
            <div class="info-card">
                <span class="info-label">메일 주소</span>
                <span class="info-value">${displayEmail}</span>
            </div>
            <div class="info-card">
                <span class="info-label">생년월일</span>
                <span class="info-value">${displayBirth}</span>
            </div>
            <div class="info-card">
                <span class="info-label">연령대</span>
                <span class="info-value">${displayAge}</span>
            </div>
            <div class="info-card">
                <span class="info-label">관심 장르</span>
                <span class="info-value">${displayInterest}</span>
            </div>
        `;

        // Target the logout button specifically in the userinfo container
        const pageLogoutBtn = document.querySelector('.userinfo-container .logout-btn');
        if (pageLogoutBtn) {
            pageLogoutBtn.addEventListener('click', () => {
                if (confirm('로그아웃 하시겠습니까?')) {
                    localStorage.removeItem('currentUser');
                    window.location.href = 'index.html';
                }
            });
        }
    }

    // Modal functionality
    const compatibilityBox = document.getElementById('compatibility-box');
    const modal = document.getElementById('compatibility-modal');
    const modalClose = document.querySelector('.modal-close');

    if (compatibilityBox && modal) {
        // Open modal
        compatibilityBox.addEventListener('click', () => {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });

        // Close modal when clicking X
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            });
        }

        // Close modal when clicking outside content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });

        // Close modal with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }

    // Lyrics Modal functionality
    const lyricsBox = document.getElementById('lyrics-box');
    const lyricsModal = document.getElementById('lyrics-modal');
    const lyricsModalClose = document.querySelector('[data-modal="lyrics"]');

    if (lyricsBox && lyricsModal) {
        // Open lyrics modal
        lyricsBox.addEventListener('click', () => {
            lyricsModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        // Close lyrics modal when clicking X
        if (lyricsModalClose) {
            lyricsModalClose.addEventListener('click', () => {
                lyricsModal.classList.remove('show');
                document.body.style.overflow = '';
            });
        }

        // Close lyrics modal when clicking outside content
        lyricsModal.addEventListener('click', (e) => {
            if (e.target === lyricsModal) {
                lyricsModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });

        // ESC key already handled globally for all modals
    }

    // Function to setup modal functionality (reusable)
    function setupModal(boxId, modalId, closeSelector) {
        const box = document.getElementById(boxId);
        const modal = document.getElementById(modalId);
        const modalClose = document.querySelector(closeSelector);

        if (box && modal) {
            // Open modal
            box.addEventListener('click', () => {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            });

            // Close modal when clicking X
            if (modalClose) {
                modalClose.addEventListener('click', () => {
                    modal.classList.remove('show');
                    document.body.style.overflow = '';
                });
            }

            // Close modal when clicking outside content
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // Setup all remaining modals
    setupModal('classical-box', 'classical-modal', '[data-modal="classical"]');
    setupModal('playlist-box', 'playlist-modal', '[data-modal="playlist"]');
    setupModal('translation-box', 'translation-modal', '[data-modal="translation"]');
    setupModal('automix-box', 'automix-modal', '[data-modal="automix"]');

    // Video Modal
    const videoTrigger = document.getElementById('video-trigger');
    const videoModal = document.getElementById('video-modal');
    const videoModalClose = document.querySelector('[data-modal="video"]');
    const youtubeIframe = document.getElementById('youtube-iframe');
    const youtubeVideoId = 'jGztGfRujSE';

    if (videoTrigger && videoModal) {
        // Open video modal
        videoTrigger.addEventListener('click', () => {
            youtubeIframe.src = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`;
            videoModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        // Close video modal
        if (videoModalClose) {
            videoModalClose.addEventListener('click', () => {
                youtubeIframe.src = '';
                videoModal.classList.remove('show');
                document.body.style.overflow = '';
            });
        }

        // Close when clicking outside
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                youtubeIframe.src = '';
                videoModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
});
