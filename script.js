// 1. KONTROL GULIR LAYAR
const rootElement = document.querySelector(":root");
const audioIconWrapper = document.querySelector(".audio-icon-wrapper");
const song = document.querySelector("#song");
let isPlaying = false;

function disableScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  window.onscroll = function () {
    window.scrollTo(scrollLeft, scrollTop);
  };
  rootElement.style.scrollBehavior = "auto";
}

function enableScroll() {
  window.onscroll = function () {};
  rootElement.style.scrollBehavior = "smooth";

  const heroSection = document.querySelector("#hero");
  if (heroSection) {
    heroSection.style.transform = "translateY(-100%)";
    heroSection.style.opacity = "0";
    setTimeout(() => {
      heroSection.classList.add("d-none");
    }, 800);
  }

  playAudio();
}

// 2. KONTROL AUDIO LATAR
function playAudio() {
  if (song) {
    song.volume = 0.5;
    if (audioIconWrapper) audioIconWrapper.style.display = "flex";

    const playPromise = song.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => console.log("Autoplay ditahan browser:", err));
    }
  }
}

function toggleAudio() {
  if (!song) return;

  if (isPlaying) {
    song.pause();
    if (audioIconWrapper) audioIconWrapper.style.animationPlayState = "paused";
  } else {
    song.play();
    if (audioIconWrapper) audioIconWrapper.style.animationPlayState = "running";
  }
  isPlaying = !isPlaying;
}

// 3. FUNGSI HITUNG MUNDUR NATIVE (TANPA DEPENDENSI CDN)
function startNativeCountdown() {
  const targetDate = new Date("October 31, 2026 08:00:00").getTime();
  const countdownElement = document.querySelector(".simply-countdown");

  if (!countdownElement) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      countdownElement.innerHTML = `<div class="text-white fw-bold fs-4">Acara Telah Berlangsung</div>`;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `
      <div class="simply-section">
        <span class="simply-amount">${days}</span>
        <span class="simply-word">Hari</span>
      </div>
      <div class="simply-section">
        <span class="simply-amount">${hours < 10 ? '0' + hours : hours}</span>
        <span class="simply-word">Jam</span>
      </div>
      <div class="simply-section">
        <span class="simply-amount">${minutes < 10 ? '0' + minutes : minutes}</span>
        <span class="simply-word">Menit</span>
      </div>
      <div class="simply-section">
        <span class="simply-amount">${seconds < 10 ? '0' + seconds : seconds}</span>
        <span class="simply-word">Detik</span>
      </div>
    `;
  }

  update();
  setInterval(update, 1000);
}

// 4. JALANKAN SAAT HALAMAN SIAP
document.addEventListener("DOMContentLoaded", function () {
  disableScroll();
  startNativeCountdown();

  // Parameter URL Nama Tamu (?to=Nama)
  const urlParams = new URLSearchParams(window.location.search);
  const nama = urlParams.get("to") || urlParams.get("n") || "";
  const namaTamuElement = document.querySelector("#nama-tamu");

  if (namaTamuElement) {
    namaTamuElement.innerText = nama ? nama : "Tamu Undangan";
  }

  // Salin Rekening
  window.copyToClipboard = function (text) {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Nomor rekening berhasil disalin: " + text))
      .catch((err) => console.error("Gagal menyalin: ", err));
  };

  // Form RSVP
  const form = document.getElementById("my-form");
  const btnSubmit = document.getElementById("btn-submit");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      btnSubmit.disabled = true;
      btnSubmit.innerText = "Mengirim...";

      const scriptURL = "https://script.google.com/macros/s/AKfycbx_EXAMPLE_SCRIPT_URL/exec";

      fetch(scriptURL, { method: "POST", body: new FormData(form) })
        .then(() => {
          alert("Konfirmasi kehadiran Anda berhasil terkirim!");
          btnSubmit.disabled = false;
          btnSubmit.innerText = "Kirim Konfirmasi";
          form.reset();
        })
        .catch((error) => {
          console.error("Error!", error.message);
          alert("Gagal mengirim konfirmasi. Silakan coba lagi.");
          btnSubmit.disabled = false;
          btnSubmit.innerText = "Kirim Konfirmasi";
        });
    });
  }
});