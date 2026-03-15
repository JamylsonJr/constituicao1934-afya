/* ═══════════════════════════════════════════════════════════
   CONSTITUIÇÃO DE 1934 — script.js FINAL
   Splash screen · Autoplay com som · Carrossel corrigido · Touch
   ═══════════════════════════════════════════════════════════ */

/* ── CONFIG: cole o ID do YouTube para fixar permanentemente ── */
const FIXED_YT_ID = 'nNu_jv1cf60'; // substitua pelo ID correto após gravar

/* ═══════════════════════════════════════════════════════════
   EFEITOS VISUAIS (emojis por seção)
   ═══════════════════════════════════════════════════════════ */
const SECTION_FX = {
  'fx-contexto':       { emojis: ['🇧🇷','🌾','📉','☭','🔫','✝️','⚡'] },
  'fx-historia':       { emojis: ['🔥','⚔️','💀','🚨','🏛️','⭐','🔥'] },
  'fx-personalidades': { emojis: ['✊','🗳️','⚖️','✊','📜','✊','🗳️'] },
  'fx-avancos':        { emojis: ['⚖️','🗳️','⏰','📚','🌿','⚖️','🛡️'] },
  'fx-legado':         { emojis: ['⭐','🏛️','📜','⭐','✨','🏅','⭐'] },
};

function spawnFx(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const config = SECTION_FX[containerId];
  if (!config) return;
  container.innerHTML = '';
  const count = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'fx-emoji';
    el.textContent = config.emojis[Math.floor(Math.random() * config.emojis.length)];
    el.style.cssText = `
      left: ${5 + Math.random() * 90}%;
      top:  ${5 + Math.random() * 80}%;
      font-size: ${(1.5 + Math.random() * 2.5).toFixed(1)}rem;
      animation-delay: ${(Math.random() * 1.2).toFixed(2)}s;
      animation-duration: ${(2.5 + Math.random() * 2).toFixed(1)}s;
    `;
    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

/* ═══════════════════════════════════════════════════════════
   YOUTUBE HELPERS
   ═══════════════════════════════════════════════════════════ */
function extractYtId(url) {
  url = (url || '').trim();
  const pats = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /embed\/([A-Za-z0-9_-]{11})/,
  ];
  for (const p of pats) { const m = url.match(p); if (m) return m[1]; }
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
  return null;
}

function loadYouTube(id, withSound) {
  const iframe = document.getElementById('ytIframe');
  const embed  = document.getElementById('ytEmbed');
  const ph     = document.getElementById('ytPlaceholder');
  if (!iframe || !id) return;
  const mute = withSound ? '0' : '1';
  iframe.src = `https://www.youtube.com/embed/${id}?rel=0&autoplay=1&mute=${mute}&playsinline=1`;
  if (embed) { embed.style.display = 'block'; embed.style.width = '100%'; embed.style.height = '100%'; }
  if (ph)    ph.style.display = 'none';
}

/* ═══════════════════════════════════════════════════════════
   DOMCONTENTLOADED
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── SPLASH SCREEN ────────────────────────────────────── */
  const splash     = document.getElementById('splash');
  const btnSound   = document.getElementById('splashSound');
  const btnMute    = document.getElementById('splashMute');

  function closeSplash(withSound) {
    // Carrega o vídeo com a preferência de som escolhida
    if (FIXED_YT_ID) loadYouTube(FIXED_YT_ID, withSound);

    // Fecha a splash com animação
    splash.classList.add('hidden');

    // Remove do DOM após a transição para não interferir
    splash.addEventListener('transitionend', () => {
      splash.remove();
    }, { once: true });
  }

  if (btnSound) btnSound.addEventListener('click', () => closeSplash(true));
  if (btnMute)  btnMute.addEventListener('click',  () => closeSplash(false));

  // Fechar ao pressionar ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && splash && !splash.classList.contains('hidden')) {
      closeSplash(false);
    }
  });

  /* ── PROGRESS BAR ─────────────────────────────────────── */
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const st = window.scrollY;
    const dh = document.body.scrollHeight - window.innerHeight;
    if (dh > 0) progressBar.style.width = Math.min((st / dh) * 100, 100) + '%';
  }, { passive: true });

  /* ── NAVBAR SCROLL ────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ── MOBILE NAV ───────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );
  // Fechar menu ao clicar fora
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) navLinks.classList.remove('open');
  });

  /* ── REVEAL OBSERVER ──────────────────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  /* ── FX OBSERVER ──────────────────────────────────────── */
  const fxObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setTimeout(() => spawnFx(e.target.id), 200); });
  }, { threshold: 0.25 });
  Object.keys(SECTION_FX).forEach(id => {
    const el = document.getElementById(id);
    if (el) fxObs.observe(el);
  });

  /* ── ACTIVE NAV HIGHLIGHT ─────────────────────────────── */
  const navAs = document.querySelectorAll('.nav-links a[href^="#"]');
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAs.forEach(a => a.classList.remove('active-link'));
        const m = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (m) m.classList.add('active-link');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(s => sectionObs.observe(s));

  /* ── SMOOTH SCROLL ────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  /* ── TABS ─────────────────────────────────────────────── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + btn.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── YOUTUBE — INPUT MANUAL ───────────────────────────── */
  const ytBtn = document.getElementById('ytLoad');
  if (ytBtn) {
    ytBtn.addEventListener('click', () => {
      const id = extractYtId(document.getElementById('ytUrl').value);
      if (id) loadYouTube(id, true);
      else alert('URL do YouTube não reconhecida.\nUse: https://www.youtube.com/watch?v=XXXXXXXXXXX');
    });
    const ytInput = document.getElementById('ytUrl');
    if (ytInput) {
      ytInput.addEventListener('keydown', e => { if (e.key === 'Enter') ytBtn.click(); });
      ytInput.addEventListener('paste', () => {
        setTimeout(() => {
          const id = extractYtId(ytInput.value);
          if (id) loadYouTube(id, true);
        }, 120);
      });
    }
  }

  /* ══════════════════════════════════════════════════════════
     CARROSSEL DE LIVROS — viewport + largura dinâmica + swipe
     ══════════════════════════════════════════════════════════ */
  const viewport = document.getElementById('booksViewport');
  const track    = document.getElementById('booksTrack');
  const prevBtn  = document.getElementById('prevBook');
  const nextBtn  = document.getElementById('nextBook');
  const dotsWrap = document.getElementById('bookDots');

  if (viewport && track && prevBtn && nextBtn && dotsWrap) {
    const cards   = track.querySelectorAll('.book-card');
    const total   = cards.length;
    let cur       = 0;
    let paused    = false;
    let autoTimer = null;
    const AUTO_MS = 6000; // 6 segundos por card

    // ── Calcula deslocamento baseado no viewport real ──────
    function getOffset(index) {
      // Cada card tem min-width: 100% do viewport
      return index * viewport.offsetWidth;
    }

    // ── Botão pausa ────────────────────────────────────────
    const pauseBtn = document.createElement('button');
    pauseBtn.className = 'carousel-pause-btn';
    pauseBtn.setAttribute('aria-label', 'Pausar/retomar carrossel');
    pauseBtn.innerHTML = '⏸';
    pauseBtn.title = 'Pausar rolagem automática';

    const speedLabel = document.createElement('span');
    speedLabel.className = 'carousel-speed-label';
    speedLabel.textContent = 'AUTO';

    // Montar nav
    const nav = document.querySelector('.carousel-nav');
    if (nav) {
      nav.innerHTML = '';
      nav.appendChild(prevBtn);
      nav.appendChild(dotsWrap);
      nav.appendChild(pauseBtn);
      nav.appendChild(speedLabel);
      nav.appendChild(nextBtn);
    }

    // ── Dots ──────────────────────────────────────────────
    dotsWrap.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Livro ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    });

    function updateDots() {
      dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) =>
        d.classList.toggle('active', i === cur)
      );
    }

    function goTo(idx) {
      cur = ((idx % total) + total) % total;
      track.style.transform = `translateX(-${getOffset(cur)}px)`;
      updateDots();
    }

    function startAuto() {
      clearInterval(autoTimer);
      if (!paused) autoTimer = setInterval(() => goTo(cur + 1), AUTO_MS);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      if (!paused) startAuto();
    }

    prevBtn.addEventListener('click', () => { goTo(cur - 1); resetAuto(); });
    nextBtn.addEventListener('click', () => { goTo(cur + 1); resetAuto(); });

    pauseBtn.addEventListener('click', () => {
      paused = !paused;
      if (paused) {
        clearInterval(autoTimer);
        pauseBtn.innerHTML = '▶';
        pauseBtn.classList.add('paused');
        speedLabel.textContent = 'PAUSADO';
      } else {
        pauseBtn.innerHTML = '⏸';
        pauseBtn.classList.remove('paused');
        speedLabel.textContent = 'AUTO';
        startAuto();
      }
    });

    // Pausa ao passar o mouse (desktop)
    viewport.addEventListener('mouseenter', () => clearInterval(autoTimer));
    viewport.addEventListener('mouseleave', () => { if (!paused) startAuto(); });

    // ── SWIPE COM DEDOS (touch) ────────────────────────────
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping   = false;

    viewport.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping   = false;
      clearInterval(autoTimer);
    }, { passive: true });

    viewport.addEventListener('touchmove', e => {
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      // Só considera swipe horizontal (não interfere com scroll vertical)
      if (dx > dy && dx > 8) isSwiping = true;
    }, { passive: true });

    viewport.addEventListener('touchend', e => {
      if (isSwiping) {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          goTo(diff > 0 ? cur + 1 : cur - 1);
        }
      }
      if (!paused) startAuto();
    }, { passive: true });

    // Recalcular se a janela for redimensionada
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => goTo(cur), 150);
    });

    // Iniciar após renderização completa
    setTimeout(() => { goTo(0); startAuto(); }, 500);
  }

  /* ── HERO PARTICLES ───────────────────────────────────── */
  const heroParticles = document.getElementById('heroParticles');
  if (heroParticles) {
    if (!document.getElementById('particleStyle')) {
      const s = document.createElement('style');
      s.id = 'particleStyle';
      s.textContent = `
        @keyframes particleFloat {
          0%,100% { transform:translateY(0) translateX(0); opacity:0.3; }
          30%      { transform:translateY(-16px) translateX(7px); opacity:0.8; }
          60%      { transform:translateY(-7px) translateX(-5px); opacity:0.5; }
          80%      { transform:translateY(-24px) translateX(4px); opacity:0.6; }
        }
      `;
      document.head.appendChild(s);
    }
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      const size = (Math.random() * 2.5 + 1).toFixed(1);
      p.style.cssText = `
        position:absolute; border-radius:50%;
        width:${size}px; height:${size}px;
        background:rgba(201,168,76,${(Math.random()*0.3+0.07).toFixed(2)});
        left:${(Math.random()*100).toFixed(1)}%;
        top:${(Math.random()*100).toFixed(1)}%;
        pointer-events:none;
        animation:particleFloat ${(Math.random()*8+6).toFixed(1)}s ease-in-out ${(Math.random()*6).toFixed(1)}s infinite;
      `;
      heroParticles.appendChild(p);
    }
  }

  /* ── TOOLTIPS DA TIMELINE HORIZONTAL (position: fixed) ──── */
  document.querySelectorAll('.htl-item').forEach(item => {
    const tooltip = item.querySelector('.htl-tooltip');
    if (!tooltip) return;

    function showTooltip(e) {
      const TW = 260; // largura do tooltip
      const TH = 180; // altura estimada
      const margin = 12;

      let x = e.clientX - TW / 2;
      let y = e.clientY - TH - margin;

      // Evitar sair pela direita/esquerda
      if (x + TW > window.innerWidth - margin) x = window.innerWidth - TW - margin;
      if (x < margin) x = margin;

      // Se não couber acima, mostrar abaixo
      if (y < margin) y = e.clientY + margin;

      tooltip.style.left = x + 'px';
      tooltip.style.top  = y + 'px';
      tooltip.style.opacity = '1';
      tooltip.style.pointerEvents = 'auto';
    }

    function hideTooltip() {
      tooltip.style.opacity = '0';
      tooltip.style.pointerEvents = 'none';
    }

    item.addEventListener('mouseenter', showTooltip);
    item.addEventListener('mousemove',  showTooltip);
    item.addEventListener('mouseleave', hideTooltip);

    // Touch: toque abre/fecha
    item.addEventListener('touchstart', e => {
      e.preventDefault();
      const visible = tooltip.style.opacity === '1';
      // Fechar todos os outros
      document.querySelectorAll('.htl-tooltip').forEach(t => {
        t.style.opacity = '0'; t.style.pointerEvents = 'none';
      });
      if (!visible) {
        const r = item.getBoundingClientRect();
        const TW = 260;
        let x = r.left + r.width / 2 - TW / 2;
        let y = r.top - 180 - 12;
        if (x + TW > window.innerWidth - 12) x = window.innerWidth - TW - 12;
        if (x < 12) x = 12;
        if (y < 12) y = r.bottom + 12;
        tooltip.style.left = x + 'px';
        tooltip.style.top  = y + 'px';
        tooltip.style.opacity = '1';
        tooltip.style.pointerEvents = 'auto';
      }
    }, { passive: false });
  });

  // Fechar tooltip ao tocar fora da timeline
  document.addEventListener('touchstart', e => {
    if (!e.target.closest('.htl-item')) {
      document.querySelectorAll('.htl-tooltip').forEach(t => {
        t.style.opacity = '0'; t.style.pointerEvents = 'none';
      });
    }
  }, { passive: true });

  console.log('%cConstituição de 1934 — Afya Uninovafapi', 'color:#c9a84c;font-family:serif;font-size:13px;font-weight:bold');
  console.log('%cV Mostra das Constituições · Abril 2026 · Teresina – PI', 'color:#8a7a5a;font-size:10px');
});
