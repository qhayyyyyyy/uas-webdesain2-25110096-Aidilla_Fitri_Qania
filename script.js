// 1. FITUR UTAMA: JAVASCRIPT PINDAH HALAMAN (SINGLE PAGE APPLICATION)
function switchPage(pageId) {
    // Cari semua elemen yang memiliki class 'page-section'
    const sections = document.querySelectorAll('.page-section');
    
    // Sembunyikan seluruh section dengan menambahkan class 'd-none' bawaan Bootstrap
    sections.forEach(section => {
        section.classList.add('d-none');
    });

    // Tampilkan section tujuan dengan menghapus class 'd-none'
    const targetSection = document.getElementById(pageId + '-page');
    if (targetSection) {
        targetSection.classList.remove('d-none');
    }

    // Perbarui status 'active' pada link menu navigasi di atas
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    const activeNavLink = document.getElementById('nav-' + pageId);
    if (activeNavLink) {
        activeNavLink.classList.add('active');
    }

    // Otomatis menutup hamburger menu navbar setelah diklik (khusus tampilan mobile)
    $('.navbar-collapse').collapse('hide');

    // Mengembalikan posisi scroll layar ke bagian paling atas halaman baru
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. BOOTSTRAP INITIALIZATION
document.addEventListener("DOMContentLoaded", function () {
    // Mengaktifkan fitur Popover Bootstrap 4 agar muncul saat kursor diarahkan (hover)
    $('[data-toggle="popover"]').popover();

    // 3. FITUR JAVASCRIPT WAJIB: VALIDASI FORM & BUTTON LOADING STATE
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const successAlert = document.getElementById('successAlert');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Mencegah form melakukan reload halaman bawaan browser
            
            // Periksa jika ada field input yang melanggar rule 'required'
            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated'); // Trigger class feedback merah Bootstrap
            } else {
                // JIKA FORM VALID - JALANKAN LOADING STATE PADA TOMBOL
                submitBtn.disabled = true;
                btnText.textContent = "Sedang Memproses...";
                btnLoading.classList.remove('d-none'); // Munculkan spinner loading

                // Mensimulasikan delay proses pengiriman data selama 2 detik
                setTimeout(function () {
                    // Kembalikan ke state tombol semula setelah selesai kirim
                    submitBtn.disabled = false;
                    btnText.textContent = "Kirim Pesan via Form";
                    btnLoading.classList.add('d-none');

                    // Tampilkan pesan sukses warna hijau di bawah form
                    successAlert.classList.remove('d-none');
                    form.reset(); // Mengosongkan kembali seluruh isi form
                    form.classList.remove('was-validated');
                }, 2000);
            }
        }, false);
    }
});