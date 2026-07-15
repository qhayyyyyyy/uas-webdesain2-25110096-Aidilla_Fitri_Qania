// 1. FITUR UTAMA: JAVASCRIPT PINDAH HALAMAN (SINGLE PAGE APPLICATION)
function switchPage(pageId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.add('d-none');
    });

    const targetSection = document.getElementById(pageId + '-page');
    if (targetSection) {
        targetSection.classList.remove('d-none');
    }

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    const activeNavLink = document.getElementById('nav-' + pageId);
    if (activeNavLink) {
        activeNavLink.classList.add('active');
    }

    $('.navbar-collapse').collapse('hide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Global functions for live features
let closeLiveAlert;

document.addEventListener("DOMContentLoaded", function () {
    // Inisialisasi popover Bootstrap
    $('[data-toggle="popover"]').popover();

    // === FITUR BARU 1: AUDIO SOUND EFFECT SYSTEM WITHOUT ASSETS ===
    let isSoundEnabled = false;
    const soundToggleBtn = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');

    soundToggleBtn.addEventListener('click', function() {
        isSoundEnabled = !isSoundEnabled;
        if(isSoundEnabled) {
            soundIcon.textContent = '🔊';
            playClickSound(600, 0.08); // Bunyi bip notifikasi aktif
        } else {
            soundIcon.textContent = '🔇';
        }
    });

    function playClickSound(frequency = 440, duration = 0.05) {
        if (!isSoundEnabled) return;
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = frequency; 
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.log("Audio not supported yet.");
        }
    }

    // Suntikkan bunyi klik pada seluruh elemen kelas .btn-sound secara otomatis
    document.querySelectorAll('.btn-sound, .nav-link, .custom-control-input').forEach(element => {
        element.addEventListener('click', () => playClickSound(520, 0.04));
    });


    // === SAKELAR THEMA DARK NEON MODE ===
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    }

    themeToggleBtn.addEventListener('click', function() {
        playClickSound(480, 0.06);
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });


    // === FITUR BARU 2: LIVE AVAILABILITY SLOT NOTIFIER ===
    const liveAlertBox = document.getElementById('liveAlertBox');
    const liveSlotCount = document.getElementById('liveSlotCount');
    
    // Munculkan notifikasi mengambang secara otomatis setelah 3 detik halaman terbuka
    setTimeout(() => {
        if (liveAlertBox) {
            liveAlertBox.classList.remove('d-none');
            // Ganti angka secara dinamis acak demi simulasi real-time harian
            const randomSlots = Math.floor(Math.random() * 3) + 2; 
            liveSlotCount.textContent = randomSlots;
        }
    }, 3000);

    closeLiveAlert = function() {
        if (liveAlertBox) liveAlertBox.classList.add('d-none');
    };


    // === TIMER COUNTDOWN BANNER PROMO ===
    let countdownTime = 5 * 60 * 60; 
    const countdownElement = document.getElementById('countdown');

    function updateCountdown() {
        let hours = Math.floor(countdownTime / 3600);
        let minutes = Math.floor((countdownTime % 3600) / 60);
        let seconds = countdownTime % 60;

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        if (countdownElement) {
            countdownElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
        if (countdownTime > 0) countdownTime--;
    }
    setInterval(updateCountdown, 1000);


    // === FITUR BARU 3: LIVE INSTANT GRID FILTER WITHOUT TABS ===
    const filterButtons = document.querySelectorAll('#liveFilterContainer .btn-filter');
    const menuCards = document.querySelectorAll('#menuGridContainer .menu-item-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const selectedFilter = this.getAttribute('data-filter');

            menuCards.forEach(card => {
                const itemCategory = card.getAttribute('data-category');
                if (selectedFilter === 'all' || itemCategory === selectedFilter) {
                    card.style.display = 'block';
                    card.style.animation = 'smoothFadeIn 0.4s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    // === JAVASCRIPT CALCULATOR ESTIMASI HARGA INSTAN ===
    const checkboxes = document.querySelectorAll('.calc-check');
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');
    const selectedListDisplay = document.getElementById('selectedServicesList');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateTotal);
    });

    function calculateTotal() {
        let total = 0;
        let selectedNames = [];

        checkboxes.forEach(box => {
            if (box.checked) {
                total += parseInt(box.getAttribute('data-price'));
                selectedNames.push(box.getAttribute('data-name'));
            }
        });

        totalPriceDisplay.textContent = 'Rp ' + total.toLocaleString('id-ID');
        
        if (selectedNames.length > 0) {
            selectedListDisplay.textContent = "Layanan: " + selectedNames.join(', ');
            selectedListDisplay.classList.add('text-success');
        } else {
            selectedListDisplay.textContent = "Belum ada layanan dipilih.";
            selectedListDisplay.classList.remove('text-success');
        }
    }

    // Aksi booking paket dari kalkulator ke WA
    window.bookCalculatedServices = function() {
        let selectedNames = [];
        checkboxes.forEach(box => {
            if (box.checked) selectedNames.push(box.getAttribute('data-name'));
        });

        if (selectedNames.length === 0) {
            alert('Silakan pilih/centang minimal satu layanan terlebih dahulu ya cantik!');
            return;
        }

        let message = `Halo Re Beauty Studio, saya mau booking paket treatment ini:\n- ${selectedNames.join('\n- ')}\n\nTolong infokan slot jadwal yang kosong ya!`;
        let encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/6289649937487?text=${encodedMessage}`, '_blank');
    };


    // VALIDASI FORM HUBUNGI KAMI
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const successAlert = document.getElementById('successAlert');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
            } else {
                submitBtn.disabled = true;
                btnText.textContent = "Sedang Memproses...";
                btnLoading.classList.remove('d-none');

                setTimeout(function () {
                    submitBtn.disabled = false;
                    btnText.textContent = "Kirim Formulir Konsultasi";
                    btnLoading.classList.add('d-none');
                    successAlert.classList.remove('d-none');
                    form.reset();
                    form.classList.remove('was-validated');
                    calculateTotal(); // Reset kalkulator
                }, 2000);
            }
        }, false);
    }
});
