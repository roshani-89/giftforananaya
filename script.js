/* ==========================================================================
   HAPPY BIRTHDAY — SUPER COLORFUL VIRAL EDITION - JAVASCRIPT
   ========================================================================== */

// ========================= STATE =========================
const state = {
  currentStep: 0,
  totalSteps: 8,
  candlesLit: 5,
  slideIndex: 0,
  totalSlides: 4,
  slideTimer: null,
  musicWasPausedByVideo: false,
  config: {
    name: 'Bestie',
    sender: 'Your Forever Friend ❤️',
    letter: null
  }
};

// ========================= INIT =========================
document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initEmojiRibbon();
  initStepNavigation();
  initGiftBox();
  initSlideshow();
  initCakeInteractions();
  initVideoSection();
  initEnvelope();
  initFinale();
  initCustomizer();
  initMusicPlayer();
  loadSavedConfig();
  updateProgressBar();
});

// ========================= AMBIENT CANVAS =========================
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const SYMBOLS = ['✦', '✧', '♡', '★', '✿', '⋆', '꩜', '◇', '✵'];
  const COLORS = ['#ff4d8d','#ffbe3d','#9d4edd','#38bdf8','#00f5a0','#ff6b35','#ff85b3','#c77dff'];

  class P {
    constructor() { this.reset(true); }
    reset(init=false) {
      this.x = Math.random() * canvas.width;
      this.y = init ? Math.random() * canvas.height : canvas.height + 20;
      this.size = Math.random() * 16 + 7;
      this.speed = Math.random() * 0.55 + 0.15;
      this.opacity = Math.random() * 0.5 + 0.08;
      this.sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.drift = (Math.random() - 0.5) * 0.5;
    }
    tick() {
      this.y -= this.speed; this.x += this.drift;
      this.opacity -= 0.0006;
      if (this.y < -30 || this.opacity <= 0) this.reset();
    }
    draw() {
      ctx.save(); ctx.globalAlpha = this.opacity;
      ctx.font = `${this.size}px sans-serif`;
      ctx.fillStyle = this.color;
      ctx.fillText(this.sym, this.x, this.y);
      ctx.restore();
    }
  }

  for (let i = 0; i < 70; i++) particles.push(new P());
  (function loop() { ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.tick();p.draw();}); requestAnimationFrame(loop); })();
}

// ========================= FLOATING EMOJI RIBBON =========================
function initEmojiRibbon() {
  const emojis = ['🎂','🎉','🎊','🥳','🎈','🌟','💖','✨','🎁','🏆','🌸','💫'];
  const ribbon = document.getElementById('emojiRibbon');
  
  function spawnEmoji() {
    const el = document.createElement('div');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `
      position:absolute;
      left:${Math.random() * 100}vw;
      bottom:-60px;
      font-size:${1.2 + Math.random() * 1.2}rem;
      opacity:${0.12 + Math.random() * 0.22};
      animation: floatUp ${8 + Math.random() * 8}s linear forwards;
      pointer-events:none;
    `;
    ribbon.appendChild(el);
    setTimeout(() => el.remove(), 18000);
  }

  // Add the keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatUp {
      0% { transform:translateY(0) rotate(0deg); opacity:0.2; }
      50% { opacity:0.25; }
      100% { transform:translateY(-110vh) rotate(${Math.random() > 0.5 ? '' : '-'}360deg); opacity:0; }
    }
  `;
  document.head.appendChild(style);

  setInterval(spawnEmoji, 1200);
  for (let i = 0; i < 8; i++) setTimeout(spawnEmoji, i * 400);
}

// ========================= STEP NAVIGATION =========================
function initStepNavigation() {
  document.querySelectorAll('.steps-nav-dots .dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const t = parseInt(dot.getAttribute('data-step'));
      goToStep(t);
    });
  });
}

window.goToStep = function(n) {
  if (n < 0 || n >= state.totalSteps) return;
  const prev = document.getElementById(`step-${state.currentStep}`);
  const next = document.getElementById(`step-${n}`);
  if (!next || n === state.currentStep) return;

  if (prev) {
    prev.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    prev.style.opacity = '0';
    prev.style.transform = 'scale(0.96)';
    setTimeout(() => {
      prev.classList.remove('active');
      prev.style.opacity = prev.style.transform = prev.style.transition = '';
    }, 360);
  }

  setTimeout(() => {
    next.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    state.currentStep = n;
    updateProgressBar();
    updateDots();
    onStepEnter(n);
  }, prev ? 370 : 0);
};

function updateProgressBar() {
  document.getElementById('progressBar').style.width = (state.currentStep / (state.totalSteps - 1) * 100) + '%';
}

function updateDots() {
  document.querySelectorAll('.steps-nav-dots .dot').forEach((d, i) => {
    d.classList.toggle('active', i === state.currentStep);
  });
}

function onStepEnter(step) {
  if (step === 1) startSlideshow();
  else stopSlideshow();

  if (step === 2) resetCandles();

  // If leaving video step, pause video
  const vid = document.getElementById('birthdayVideo');
  if (vid && step !== 4 && !vid.paused) {
    vid.pause();
  }

  // Step 6: Wax Seal Letter
  if (step === 6) {
    const now = new Date();
    const dateEl = document.getElementById('letterDateDisplay');
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) + ' 🎉';
    }
  }

  // Step 7: Grand Finale
  if (step === 7) {
    setTimeout(() => fireConfetti('mega'), 500);
    animateAgeNumber();
  }
}

// ========================= STEP 4: VIDEO SECTION =========================
function initVideoSection() {
  const vidInput = document.getElementById('videoFileInput');
  const vid = document.getElementById('birthdayVideo');
  if (!vid) return;

  if (vidInput) {
    vidInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      vid.src = url;
      vid.load();
      vid.play().catch(() => {});
      showToast('🎬 Your video is loaded & ready! Enjoy!');
      fireConfetti('gentle');
    });
  }

  // Drag & drop video onto cinema box
  const cinemaBox = document.querySelector('.cinema-theater-box');
  if (cinemaBox) {
    cinemaBox.addEventListener('dragover', e => { e.preventDefault(); cinemaBox.style.borderColor = '#ff4d8d'; });
    cinemaBox.addEventListener('dragleave', () => { cinemaBox.style.borderColor = ''; });
    cinemaBox.addEventListener('drop', e => {
      e.preventDefault();
      cinemaBox.style.borderColor = '';
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        vid.src = url;
        vid.load();
        vid.play().catch(() => {});
        showToast('🎬 Video loaded via drag & drop! ✨');
        fireConfetti('gentle');
      }
    });
  }

  // Auto-pause background music when video plays
  vid.addEventListener('play', () => {
    if (bgMusic && !bgMusic.paused) {
      bgMusic.pause();
      state.musicWasPausedByVideo = true;
      const statusText = document.getElementById('musicStatusText');
      const discBtn = document.getElementById('musicToggleBtn');
      if (statusText) statusText.textContent = 'Paused 🎬';
      if (discBtn) discBtn.classList.remove('playing');
    }
  });

  // Resume background music when video pauses/ends
  const resumeMusic = () => {
    if (state.musicWasPausedByVideo && bgMusic) {
      bgMusic.play().then(() => {
        state.musicWasPausedByVideo = false;
        const statusText = document.getElementById('musicStatusText');
        const discBtn = document.getElementById('musicToggleBtn');
        if (statusText) statusText.textContent = 'Playing 🎶';
        if (discBtn) discBtn.classList.add('playing');
      }).catch(() => {});
    }
  };

  vid.addEventListener('pause', resumeMusic);
  vid.addEventListener('ended', resumeMusic);
}

// ========================= STEP 0: GIFT BOX =========================
function initGiftBox() {
  document.getElementById('giftBoxTrigger').addEventListener('click', function() {
    if (this.classList.contains('opened')) return;
    this.classList.add('opened');
    fireConfetti('burst');
    setTimeout(() => goToStep(1), 1200);
  });
}

// ========================= STEP 1: SLIDESHOW =========================
function initSlideshow() {
  const slides = document.querySelectorAll('.slide');
  state.totalSlides = slides.length;
  state.slideIndex = 0;

  // Build mini dots
  const dotsEl = document.getElementById('slideMiniDots');
  if (dotsEl) {
    dotsEl.innerHTML = '';
    for (let i = 0; i < state.totalSlides; i++) {
      const d = document.createElement('div');
      d.className = 'mini-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goSlide(i));
      dotsEl.appendChild(d);
    }
  }

  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  if (prevBtn) prevBtn.onclick = () => goSlide(state.slideIndex - 1);
  if (nextBtn) nextBtn.onclick = () => goSlide(state.slideIndex + 1);
}

function goSlide(n) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.mini-dot');
  if (!slides.length) return;
  state.totalSlides = slides.length;

  slides.forEach(s => s.classList.remove('active-slide'));
  dots.forEach(d => d.classList.remove('active'));

  state.slideIndex = (n + state.totalSlides) % state.totalSlides;
  if (slides[state.slideIndex]) slides[state.slideIndex].classList.add('active-slide');
  if (dots[state.slideIndex]) dots[state.slideIndex].classList.add('active');
}

function startSlideshow() {
  stopSlideshow();
  state.slideTimer = setInterval(() => goSlide(state.slideIndex + 1), 3200);
}

function stopSlideshow() {
  if (state.slideTimer) { clearInterval(state.slideTimer); state.slideTimer = null; }
}

// ========================= STEP 2: CAKE & CANDLES =========================
function initCakeInteractions() {
  document.getElementById('candlesRack').addEventListener('click', e => {
    const candle = e.target.closest('.candle');
    if (!candle || candle.dataset.lit !== 'true') return;
    blowCandle(candle);
  });

  document.getElementById('blowCandlesBtn').addEventListener('click', () => {
    document.querySelectorAll('.candle[data-lit="true"]').forEach((c, i) => {
      setTimeout(() => blowCandle(c), i * 200);
    });
  });

  document.getElementById('cutCakeBtn').addEventListener('click', function() {
    if (this.disabled) return;
    this.disabled = true;
    this.textContent = '✅ Cake Cut! 🎊';
    document.getElementById('wishStatusText').textContent = '🎊 YAYYY! Happy Birthday!! All your wishes will come true! 🌟✨';
    fireConfetti('burst');
    setTimeout(() => fireConfetti('stars'), 500);
    document.getElementById('step2NextBtn').classList.remove('hidden');
  });
}

function blowCandle(candle) {
  if (candle.dataset.lit !== 'true') return;
  candle.dataset.lit = 'false';
  candle.classList.add('extinguished');
  state.candlesLit--;

  const s = document.getElementById('wishStatusText');
  const msgs = ['', '💨 4 to go!', '💨 3 more! Keep going!', '🔥 Getting there! 2 left!', '⚡ One last candle!', ''];
  if (state.candlesLit > 0) s.textContent = msgs[5 - state.candlesLit] || '💨 Blow more!';
  if (state.candlesLit === 0) {
    s.textContent = '🌟 All blown! Your wish is sent to the universe! Now CUT THE CAKE! 🎂';
    document.getElementById('cutCakeBtn').disabled = false;
    fireConfetti('stars');
  }
}

function resetCandles() {
  state.candlesLit = 5;
  document.querySelectorAll('.candle').forEach(c => {
    c.dataset.lit = 'true';
    c.classList.remove('extinguished');
  });
  document.getElementById('cutCakeBtn').disabled = true;
  document.getElementById('cutCakeBtn').textContent = '🎂 Cut The Cake!';
  document.getElementById('wishStatusText').textContent = '💡 Tap each candle to blow it out!';
  document.getElementById('step2NextBtn').classList.add('hidden');
}

// ========================= REVEAL MYSTERY CARDS =========================
window.revealCard = function(card) {
  if (card.classList.contains('revealed')) return;
  card.classList.add('revealed');
  const rect = card.getBoundingClientRect();
  confetti({
    particleCount: 55,
    spread: 65,
    origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
    colors: ['#ff4d8d','#ffbe3d','#9d4edd','#00f5a0','#38bdf8'],
    scalar: 0.9
  });
};

// ========================= STEP 5: ENVELOPE =========================
function initEnvelope() {}

window.openEnvelope = function() {
  const env = document.getElementById('envelopeWrapper');
  if (env.classList.contains('open')) return;
  env.classList.add('open');
  document.getElementById('envelopeHint').textContent = '✨ Read your special message below! 💌';
  fireConfetti('petals');
};

// ========================= STEP 6: FINALE =========================
function initFinale() {
  document.getElementById('megaConfettiBtn').addEventListener('click', () => fireConfetti('mega'));

  document.getElementById('launchLanternBtn').addEventListener('click', () => {
    const inp = document.getElementById('lanternWishInput');
    const wish = inp.value.trim() || 'Happy Birthday! 🎉✨';
    launchLantern(wish);
    inp.value = '';
    inp.placeholder = 'Wish is flying! Write another one! 🏮';
  });

  document.getElementById('copyLinkBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => showToast('🔗 Link copied! Share the magic! ✨'))
      .catch(() => prompt('Copy this link:', window.location.href));
  });

  document.getElementById('whatsappShareBtn').addEventListener('click', () => {
    const name = state.config.name;
    const msg = encodeURIComponent(`🎂✨ Happy Birthday ${name}! I made you a magical birthday surprise website! Open it here: ${window.location.href} 🎉🎊💖`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  });
}

function animateAgeNumber() {
  const el = document.getElementById('ageNumber');
  const emojis = ['🎊','🎉','🎂','🌟','💖','👑','✨','🥳'];
  let i = 0;
  const timer = setInterval(() => {
    el.textContent = emojis[i % emojis.length];
    i++;
    if (i > 30) {
      clearInterval(timer);
      el.textContent = 'another AMAZING year 🌟';
      el.style.fontSize = '1rem';
    }
  }, 120);
}

window.restartExperience = function() {
  state.currentStep = 0;
  const vid = document.getElementById('birthdayVideo');
  if (vid) { vid.pause(); vid.currentTime = 0; }
  document.getElementById('envelopeWrapper').classList.remove('open');
  document.getElementById('envelopeHint').textContent = '✉️ Click the envelope to open!';
  document.getElementById('giftBoxTrigger').classList.remove('opened');
  resetCandles();
  document.querySelectorAll('.polaroid-card').forEach(c => c.classList.remove('flipped'));
  document.querySelectorAll('.mystery-card').forEach(c => c.classList.remove('revealed'));
  document.getElementById('lanternSky').innerHTML = '';
  goSlide(0);
  goToStep(0);
};

// ========================= SKY LANTERN =========================
function launchLantern(wish) {
  const sky = document.getElementById('lanternSky');
  const el = document.createElement('div');
  el.className = 'flying-lantern';
  el.style.left = (10 + Math.random() * 80) + '%';
  el.innerHTML = `
    <div class="lantern-bulb"><div class="lantern-flame-core"></div></div>
    <div class="lantern-wish-tag">${wish}</div>
  `;
  sky.appendChild(el);
  setTimeout(() => el.remove(), 15000);
}

// ========================= CONFETTI VARIANTS =========================
function fireConfetti(type = 'burst') {
  const colors = ['#ff4d8d','#ffbe3d','#9d4edd','#38bdf8','#00f5a0','#ff6b35'];
  switch (type) {
    case 'burst':
      confetti({ particleCount: 150, spread: 100, startVelocity: 50, origin: { y: 0.5 }, colors });
      break;
    case 'gentle':
      confetti({ particleCount: 70, spread: 75, gravity: 0.7, origin: { y: 0.4 }, colors });
      break;
    case 'stars':
      confetti({ particleCount: 100, spread: 110, shapes: ['star'], colors: ['#ffbe3d','#fffae0','#ffd700','#ff4d8d'], scalar: 1.3, origin: { y: 0.45 } });
      break;
    case 'petals':
      confetti({ particleCount: 90, spread: 90, shapes: ['circle'], colors: ['#ff4d8d','#ffb3c8','#ff85b3','#c2185b','#ff69b4'], gravity: 0.55, origin: { y: 0.4 } });
      break;
    case 'mega': {
      const end = Date.now() + 5000;
      const colorSet = ['#ff4d8d','#ffbe3d','#9d4edd','#38bdf8','#00f5a0','#ff6b35'];
      function frame() {
        confetti({ particleCount: 7, angle: 60, spread: 60, origin: { x: 0 }, colors: colorSet });
        confetti({ particleCount: 7, angle: 120, spread: 60, origin: { x: 1 }, colors: colorSet });
        confetti({ particleCount: 5, spread: 90, origin: { x: 0.5, y: 0.4 }, colors: colorSet, shapes: ['star'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      }
      frame();
      break;
    }
  }
}

// ========================= MUSIC PLAYER =========================
let bgMusic = null, isMusicPlaying = false;

function initMusicPlayer() {
  document.getElementById('musicToggleBtn').addEventListener('click', toggleMusic);
}

function toggleMusic() {
  const btn = document.getElementById('musicToggleBtn');
  const statusText = document.getElementById('musicStatusText');

  if (!bgMusic) {
    bgMusic = new Audio();
    bgMusic.loop = true;
    bgMusic.volume = 0.45;
    // Try local file first, fallback guidance
    if (fileExists('music.mp3')) {
      bgMusic.src = 'music.mp3';
    } else {
      bgMusic.src = 'https://www.bensound.com/bensound-music/bensound-happyrock.mp3';
    }
    bgMusic.onerror = () => {
      showToast('🎵 Add a "music.mp3" file to the gift folder to play music!');
      isMusicPlaying = false;
      btn.classList.remove('playing');
      statusText.textContent = 'Music';
    };
  }

  if (!isMusicPlaying) {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      btn.classList.add('playing');
      statusText.textContent = 'Playing 🎶';
    }).catch(() => {
      showToast('🎵 Add a "music.mp3" file to the gift folder!');
    });
  } else {
    bgMusic.pause();
    isMusicPlaying = false;
    btn.classList.remove('playing');
    statusText.textContent = 'Music';
  }
}

function fileExists(url) {
  // Just try it — if it fails, error handler catches
  return true;
}

// ========================= CUSTOMIZER =========================
function initCustomizer() {
  document.getElementById('openSettingsBtn').addEventListener('click', () => {
    document.getElementById('customModal').classList.add('open');
    document.getElementById('cfgName').value = state.config.name === 'Bestie' ? '' : state.config.name;
    document.getElementById('cfgSender').value = state.config.sender.includes('Forever') ? '' : state.config.sender;
    document.getElementById('cfgLetter').value = state.config.letter || '';
  });
  document.getElementById('closeSettingsBtn').addEventListener('click', () => document.getElementById('customModal').classList.remove('open'));
  document.getElementById('customModal').addEventListener('click', e => { if (e.target.id === 'customModal') e.target.classList.remove('open'); });
  document.getElementById('saveSettingsBtn').addEventListener('click', applyConfig);
  document.getElementById('resetDefaultsBtn').addEventListener('click', resetConfig);
}

function applyConfig() {
  const name = document.getElementById('cfgName').value.trim() || 'Bestie';
  const sender = document.getElementById('cfgSender').value.trim() || 'Your Forever Friend ❤️';
  const letter = document.getElementById('cfgLetter').value.trim();

  state.config = { name, sender, letter: letter || null };

  document.getElementById('introPersonName').textContent = name;
  document.getElementById('finalePersonName').textContent = name.toUpperCase();
  document.getElementById('letterRecipient').textContent = `Dear ${name},`;
  if (letter) document.getElementById('letterBodyText').innerHTML = letter.replace(/\n/g, '<br>');
  document.getElementById('letterSign').innerHTML = `With all the love in the universe,<br><strong>${sender}</strong>`;

  try { localStorage.setItem('bdayConfig_v2', JSON.stringify(state.config)); } catch(e) {}
  document.getElementById('customModal').classList.remove('open');
  showToast('✅ Saved & applied! Looking amazing! ✨');
  fireConfetti('gentle');
}

function resetConfig() {
  state.config = { name: 'Bestie', sender: 'Your Forever Friend ❤️', letter: null };
  try { localStorage.removeItem('bdayConfig_v2'); } catch(e) {}
  document.getElementById('cfgName').value = '';
  document.getElementById('cfgSender').value = '';
  document.getElementById('cfgLetter').value = '';
  showToast('🔄 Reset to defaults!');
}

function loadSavedConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem('bdayConfig_v2') || 'null');
    if (!saved) return;
    Object.assign(state.config, saved);
    if (saved.name) {
      document.getElementById('introPersonName').textContent = saved.name;
      document.getElementById('finalePersonName').textContent = saved.name.toUpperCase();
      document.getElementById('letterRecipient').textContent = `Dear ${saved.name},`;
    }
    if (saved.letter) document.getElementById('letterBodyText').innerHTML = saved.letter.replace(/\n/g, '<br>');
    if (saved.sender) document.getElementById('letterSign').innerHTML = `With all the love in the universe,<br><strong>${saved.sender}</strong>`;
  } catch(e) {}
}

// ========================= TOAST =========================
function showToast(msg) {
  let t = document.getElementById('liveToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'liveToast';
    t.style.cssText = `
      position:fixed; bottom:80px; left:50%;
      transform:translateX(-50%) translateY(20px);
      background:rgba(20,8,40,0.96);
      backdrop-filter:blur(20px);
      border:1.5px solid rgba(255,77,141,0.55);
      color:#fff; padding:12px 26px; border-radius:999px;
      font-weight:700; font-size:0.92rem; z-index:500;
      box-shadow:0 8px 30px rgba(0,0,0,0.5), 0 0 20px rgba(255,77,141,0.35);
      opacity:0; transition:all 0.35s cubic-bezier(0.16,1,0.3,1);
      max-width:90vw; text-align:center; white-space:nowrap;
      font-family:'Outfit',sans-serif;
    `;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3500);
}

// ========================= 3D TILT EFFECT =========================
document.addEventListener('mousemove', e => {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width/2)) / (r.width/2);
    const dy = (e.clientY - (r.top + r.height/2)) / (r.height/2);
    if (Math.abs(dx) < 1.8 && Math.abs(dy) < 1.8) {
      card.style.transform = `perspective(800px) rotateX(${dy*-9}deg) rotateY(${dx*9}deg) scale(1.04)`;
      card.style.transition = 'transform 0.1s ease';
    }
  });
});

document.addEventListener('mouseleave', () => {
  document.querySelectorAll('[data-tilt]').forEach(c => {
    c.style.transform = '';
    c.style.transition = 'transform 0.4s ease';
  });
});

// ========================= KEYBOARD + SWIPE =========================
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') goToStep(state.currentStep + 1);
  if (e.key === 'ArrowLeft') goToStep(state.currentStep - 1);
});

let txStart = 0;
document.addEventListener('touchstart', e => { txStart = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  const diff = txStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 65) {
    if (diff > 0) goToStep(state.currentStep + 1);
    else goToStep(state.currentStep - 1);
  }
});
