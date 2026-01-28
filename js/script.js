document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const heroContent = document.getElementById('hero-text');

  // --- INITIAL LOADING ANIMATION ---
  function revealSite() {
      if (!loadingScreen || loadingScreen.classList.contains('loaded')) return;
      loadingScreen.classList.add('loaded');
      
      loadingScreen.style.opacity = '0';
      loadingScreen.style.pointerEvents = 'none';

      setTimeout(() => { 
          loadingScreen.style.display = 'none'; 
          if(heroContent) {
              heroContent.classList.add('visible'); 
              heroContent.style.opacity = '1'; 
          }
          if(window.location.hash) {
              const linkedId = window.location.hash.substring(1);
              const card = document.getElementById(linkedId);
              if(card) card.click(); 
          }
      }, 500);
  }

// --- EXTERNAL PROJECT/EXPERIENCE LOADER (Modal) ---
const projectButtons = document.querySelectorAll('.read-more[data-project], .project-item a[data-project]');
  
  projectButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
          e.preventDefault();
          const iframe = document.getElementById('modal-iframe');
          const url = btn.getAttribute('data-project');

          // --- 1. DYNAMICALLY LOAD CSS (LAZY LOAD) ---
          // Check if we have already loaded this CSS to avoid duplicates
          if (!document.getElementById('experiences-css')) {
              const link = document.createElement('link');
              link.id   = 'experiences-css';
              link.rel  = 'stylesheet';
              link.type = 'text/css';
              // IMPORTANT: This path must be relative to index.html
              link.href = 'css/experiences.css'; 
              link.media = 'all';
              document.head.appendChild(link);
          }
          
          // --- 2. OPEN MODAL (Existing Logic) ---
          const modal = document.getElementById('project-modal');
          const modalDesc = document.getElementById('modal-description');
          const modalTitle = document.getElementById('modal-title');
          
          // ... (Rest of your existing reset logic) ...
          document.getElementById('modal-3d-container').style.display = 'none';
          document.getElementById('modal-chart-container').style.display = 'none';
          document.getElementById('modal-code-container').style.display = 'none';
          document.getElementById('modal-video-container').style.display = 'none';
          document.getElementById('modal-skills-container').innerHTML = '';
          document.getElementById('skills-header').style.display = 'none';
          document.getElementById('modal-actions').innerHTML = '';

          modalTitle.textContent = "Loading Mission Log...";
          modalDesc.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--accent);">Encrypting transmission...</div>';
          
          // Prevent body scrolling when modal is open - just use overflow, no position fixed
          document.body.style.overflow = 'hidden';
          document.body.classList.add('modal-open');
          document.documentElement.style.overflow = 'hidden';
          
          // Now open the modal
          modal.classList.add('open');
          modal.style.display = 'flex';

        // --- 3. LOAD CONTENT (INLINE vs DOCUMENT) ---
        // Get title from closest card or use default
        let cardTitle = "Project Details";
        if (btn.closest('.exp-card')) {
            cardTitle = btn.closest('.exp-card').querySelector('h3')?.textContent || cardTitle;
        }
        modalTitle.textContent = cardTitle;

        // 👉 FULL DOCUMENT (All experience and project pages)
        modalDesc.style.display = 'none';
        iframe.style.display = 'block';
        iframe.src = url;

      });
  });

  // Force reveal immediately
  revealSite();
  setTimeout(revealSite, 100);

  // --- UTC CLOCK ---
  function updateUTCClock() {
    const now = new Date();
    const timeString = now.toUTCString().split(' ')[4];
    const clockElement = document.getElementById('utc-clock');
    if (clockElement) clockElement.textContent = timeString;
  }
  setInterval(updateUTCClock, 1000);
  updateUTCClock();

  // --- BLUEPRINT MODE TOGGLE ---
  let isBlueprint = false;
  const blueprintBtn = document.getElementById('blueprint-toggle');
  const modeLabel = document.getElementById('mode-label'); 
  const body = document.body;

  blueprintBtn.addEventListener('click', () => {
    isBlueprint = !isBlueprint;
    body.classList.toggle('blueprint-mode');
    if (isBlueprint) modeLabel.textContent = "Return to Orbit";
    else modeLabel.textContent = "Blueprint Mode";
    stars.forEach(s => s.reset()); 
    // Re-render chart if open
    if(activeChart) {
       activeChart.options.scales.r.grid.color = isBlueprint ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)';
       activeChart.options.scales.r.pointLabels.color = isBlueprint ? '#000' : '#fff';
       activeChart.update();
    }
  });

  const menuToggle = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-menu');
  menuToggle.addEventListener('click', () => { 
      menuToggle.classList.toggle('is-active'); 
      navMenu.classList.toggle('active'); 
  });


  // --- SCROLL LOGIC ---
  const rocketBtn = document.getElementById('scroll-top');
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        let scrollPosition = window.pageYOffset;
        
        // 1. Existing Hero Fade Logic
        if (scrollPosition < 600 && heroContent) { 
            heroContent.style.opacity = Math.max(0, 1 - scrollPosition / 400); 
        }
        
        // 2. Existing Rocket Button Logic
        if (scrollPosition > 300) { rocketBtn.classList.add('show'); } 
        else { rocketBtn.classList.remove('show'); }
  
        // --- NEW: STOP ANIMATION & BLUR ---
        // 500px is roughly when the title is fully off-screen
        if (scrollPosition > 500) {
            if (!isPaused) {
                isPaused = true;
                cancelAnimationFrame(animationId); // Stop the CPU loop
                canvas.classList.add('canvas-paused'); // Add Blur
            }
        } else {
            if (isPaused) {
                isPaused = false;
                canvas.classList.remove('canvas-paused'); // Remove Blur
                animate(); // Restart the loop
            }
        }
  
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  const faders = document.querySelectorAll(".fade-in");
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => { 
      if(entry.isIntersecting){ 
        entry.target.classList.add("visible"); 
        observer.unobserve(entry.target); 
      } 
    });
  }, { threshold: 0.1, rootMargin: "200px" });
  faders.forEach(el => sectionObserver.observe(el));

  // --- MODAL LOGIC & FEATURES ---
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalSkillsContainer = document.getElementById('modal-skills-container');
  const skillsHeader = document.getElementById('skills-header');
  const modalActions = document.getElementById('modal-actions');
  const modal3dContainer = document.getElementById('modal-3d-container');
  const modalVideoContainer = document.getElementById('modal-video-container');
  const modalChartContainer = document.getElementById('modal-chart-container');
  const modalCodeContainer = document.getElementById('modal-code-container');
  const modalCodeContent = document.getElementById('modal-code-content');
  const closeModal = document.querySelector('.close-modal');
  
  let activeChart = null;

  // Helper function to close modal and restore scrolling
  function closeModalAndRestoreScrolling() {
    const modal = document.getElementById('project-modal');
    const iframe = document.getElementById('modal-iframe');
    const modalDescription = document.getElementById('modal-description');
    
    modal.style.display = 'none';
    modal.classList.remove('open');

    if (iframe) {
      iframe.src = '';
      iframe.style.display = 'none';
    }

    modalDescription.style.display = 'block';

    // Remove experiences.css from main page (it was only needed for iframe content)
    const experiencesCSS = document.getElementById('experiences-css');
    if (experiencesCSS) {
      experiencesCSS.remove();
    }
    
    // Restore scrolling - just remove overflow hidden, no position fixed means no jump
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow');

    history.pushState("", document.title, window.location.pathname + window.location.search);
  }

  function openModal(title, desc, imgString, skillsString, pdfLink, modelLink, videoLink, hasChart, codeSnippet, cardId) {
      modalTitle.textContent = title; 
      modalDescription.innerHTML = desc; 
      if(cardId) history.pushState(null, null, `#${cardId}`);

      modalActions.innerHTML = '';
      if (pdfLink && pdfLink.trim() !== "") { 
          const pdfs = pdfLink.split(',');
          pdfs.forEach((pdf, index) => {
              const btn = document.createElement('a');
              btn.href = pdf.trim();
              btn.target = "_blank";
              btn.className = "btn pdf-btn";
              btn.style.marginRight = "10px";
              btn.style.marginBottom = "10px";
              btn.textContent = pdfs.length > 1 ? `Download Report ${index + 1} (PDF)` : "Download Technical Report (PDF)";
              modalActions.appendChild(btn);
          });
      }

      modalSkillsContainer.innerHTML = ''; 
      if (skillsString && skillsString.trim() !== "") {
          skillsHeader.style.display = 'block'; 
          const skills = skillsString.split(',');
          skills.forEach(skill => {
            const span = document.createElement('span'); 
            span.textContent = skill.trim();
            span.style.padding = '0.4rem 0.8rem'; 
            span.style.border = '1px solid ' + (isBlueprint ? '#000' : '#38bdf8'); 
            span.style.borderRadius = '4px'; 
            span.style.fontSize = '0.85rem'; 
            span.style.color = isBlueprint ? '#000' : '#fff'; 
            span.style.background = isBlueprint ? 'rgba(0,0,0, 0.1)' : 'rgba(56, 189, 248, 0.1)'; 
            span.style.marginRight = '0.5rem'; 
            span.style.marginBottom = '0.5rem'; 
            span.style.display = 'inline-block';
            modalSkillsContainer.appendChild(span);
          });
      } else {
          skillsHeader.style.display = 'none'; 
      }

      if (modelLink && modelLink.trim() !== "") {
          modal3dContainer.style.display = 'block';
          // Add custom hotspots here if needed
          modal3dContainer.innerHTML = `
            <div id="loader-3d" class="loading-overlay">
                <div class="model-loader"></div>
                <div class="loading-text">INITIALIZING CAD MODULE...</div>
            </div>
            <model-viewer src="${modelLink}" alt="3D Model of ${title}" auto-rotate camera-controls shadow-intensity="0" render-scale="0.8" loading="lazy" camera-orbit="45deg 55deg 2.5m" field-of-view="30deg" style="width: 100%; height: 400px; background-color: ${isBlueprint ? '#f0f0f0' : 'rgba(0, 0, 0, 0.2)'}; border-radius: 8px;">
            </model-viewer>`;
          
          const viewer = modal3dContainer.querySelector('model-viewer');
          const loaderOverlay = modal3dContainer.querySelector('#loader-3d');
          viewer.addEventListener('load', () => { if(loaderOverlay) loaderOverlay.classList.add('hidden'); });
          setTimeout(() => { if(loaderOverlay) loaderOverlay.classList.add('hidden'); }, 5000);
      } else {
          modal3dContainer.style.display = 'none';
          modal3dContainer.innerHTML = '';
      }

      if (hasChart === "true") {
          modalChartContainer.style.display = 'block';
          const ctxChart = document.getElementById('radarChart').getContext('2d');
          if(activeChart) activeChart.destroy();
          activeChart = new Chart(ctxChart, {
              type: 'radar',
              data: {
                  labels: ['GNC/Controls', 'Modeling & Sim', 'Systems Eng', 'Propulsion', 'Software', 'Testing'],
                  datasets: [{
                      label: 'Proficiency Level',
                      data: [9.5, 9.5, 9.0, 8.0, 8.5, 9.0], 
                      backgroundColor: 'rgba(56, 189, 248, 0.2)',
                      borderColor: '#38bdf8',
                      pointBackgroundColor: '#38bdf8',
                      borderWidth: 2
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                      r: {
                          min: 0, max: 10,
                          angleLines: { color: isBlueprint ? 'rgba(0,0,0,0.1)' : 'rgba(255, 255, 255, 0.1)' },
                          grid: { color: isBlueprint ? 'rgba(0,0,0,0.1)' : 'rgba(255, 255, 255, 0.1)' },
                          pointLabels: { color: isBlueprint ? '#333' : '#fff', font: { family: 'Courier Prime', size: 11 } },
                          ticks: { display: false, stepSize: 1 } 
                      }
                  },
                  plugins: { 
                      legend: { labels: { color: isBlueprint ? '#000' : '#fff', font: { family: 'Outfit', size: 12 } } },
                      tooltip: { enabled: true } 
                  }
              }
          });
      } else {
          modalChartContainer.style.display = 'none';
      }

      if (codeSnippet && codeSnippet.trim() !== "") {
          modalCodeContainer.style.display = 'block';
          modalCodeContent.textContent = codeSnippet;
      } else {
          modalCodeContainer.style.display = 'none';
      }

      if (videoLink && videoLink.trim() !== "") {
          modalVideoContainer.style.display = 'block';
          modalVideoContainer.innerHTML = `<h4 class="video-label" style="margin-top: 2rem;">Simulation Output</h4><video controls width="100%" style="border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 0;"><source src="${videoLink}" type="video/mp4">Your browser does not support the video tag.</video>`;
      } else {
          modalVideoContainer.style.display = 'none';
      }

      // Prevent body scrolling when modal is open - just use overflow, no position fixed
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      document.documentElement.style.overflow = 'hidden';
      
      // Now open the modal
      modal.classList.add('open'); 
      modal.style.display = 'flex';
  }

  document.querySelectorAll('.project-card, .clickable-timeline, .lab-item').forEach(item => {
    item.addEventListener('click', () => {
      openModal(
          item.dataset.title, 
          item.dataset.description || item.dataset.desc, 
          item.dataset.images || item.dataset.img, 
          item.dataset.skills || null, 
          item.dataset.pdf || null,
          item.dataset.model || null,
          item.dataset.video || null,
          item.dataset.chart || null,
          item.dataset.code || null,
          item.id || null
      );
    });
  });
  
    closeModal.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        closeModalAndRestoreScrolling();
    });

  window.addEventListener('click', (e) => { 
      if(e.target === modal) { 
          closeModalAndRestoreScrolling();
      } 
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
      const modal = document.getElementById('project-modal');
      if (modal && modal.classList.contains('open')) {
        closeModalAndRestoreScrolling();
      }
    }
  });

  // Ensure email link opens email client
  const emailLink = document.getElementById('email-link');
  if (emailLink) {
    emailLink.addEventListener('click', (e) => {
      // Open email client - ensure it works even if default is prevented
      window.location.href = 'mailto:a2burns@ucsd.edu?subject=Portfolio%20Inquiry';
    });
  }

  const contactForm = document.getElementById('contact-form');
  if(contactForm) {
      contactForm.addEventListener('submit', async function(e) {
          e.preventDefault(); 
          const btn = contactForm.querySelector('button');
          const data = new FormData(contactForm);
          btn.style.color = 'transparent';
          
          const rocket = document.createElement('div');
          rocket.textContent = '🚀'; 
          rocket.classList.add('rocket-emoji');
          document.body.appendChild(rocket);

          const rect = btn.getBoundingClientRect();
          let posX = rect.left + rect.width / 2 - 20; 
          let posY = rect.top + window.scrollY;        
          rocket.style.left = posX + 'px';
          rocket.style.top = posY + 'px';

          let velX = 0; let velY = 0; let accX = 0.1; let accY = 0.1; 

          function createExhaust(x, y) {
              const div = document.createElement('div');
              div.classList.add('exhaust-particle');
              div.style.left = x + 5 + 'px'; 
              div.style.top = y + 45 + 'px';
              const size = Math.random() * 8 + 4;
              div.style.width = size + 'px';
              div.style.height = size + 'px';
              const isFire = Math.random() > 0.6;
              div.style.background = isFire ? `rgba(255, ${Math.random()*150+50}, 0, 0.8)` : `rgba(100, 100, 100, 0.5)`;
              document.body.appendChild(div);
              let pLife = 1.0;
              let px = (Math.random() - 0.5) * 1.5;
              let py = 1 + Math.random() * 1.5; 
              const pInterval = setInterval(() => {
                  pLife -= 0.03;
                  if(pLife <= 0) { clearInterval(pInterval); div.remove(); } 
                  else {
                      div.style.opacity = pLife;
                      div.style.top = (parseFloat(div.style.top) + py) + 'px';
                      div.style.left = (parseFloat(div.style.left) + px) + 'px';
                      div.style.transform = `scale(${2.5 - pLife})`; 
                  }
              }, 20);
          }

          const animationLoop = setInterval(() => {
              velX += accX; velY += accY; 
              posX += velX; posY -= velY; 
              rocket.style.left = posX + 'px'; rocket.style.top = posY + 'px';
              createExhaust(posX, posY); createExhaust(posX, posY);

              if (posX > window.innerWidth) {
                  clearInterval(animationLoop);
                  rocket.remove();
                  fetch(contactForm.action, {
                      method: 'POST', body: data, headers: { 'Accept': 'application/json' }
                  }).then(response => {
                      if(response.ok) {
                          btn.style.color = '#fff'; btn.textContent = "Message Sent";
                          btn.style.background = '#22c55e'; btn.style.borderColor = '#22c55e';
                          contactForm.reset();
                      } else {
                          btn.style.color = '#fff'; btn.textContent = "Error. Try again.";
                      }
                  }).catch(error => {
                      btn.style.color = '#fff'; btn.textContent = "Error. Try again.";
                  });
              }
          }, 16);
      });
  }

  const canvas = document.getElementById('space-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [], nebulas = [], galaxies = [], asteroids = [], comets = [], satellite; 
  let darts = []; 
  let explosions = [];
  let lastDartTime = Date.now(); 
  const DART_INTERVAL = 120000; 
  const config = { starCount: 150, nebulaCount: 2, galaxyCount: 2, asteroidCount: 5, cometCount: 4, connectionDistance: 110, maxConnections: 2 };
  
  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  
  function resize() { 
      width = window.innerWidth; height = window.innerHeight; 
      canvas.width = width; canvas.height = height; 
      ctx.scale(1, 1); config.connectionDistance = (width + height) / 25; 
      initSpace(); 
  }

  class Star {
    constructor() { this.reset(); this.connections = 0; }
    reset() {
      this.x = Math.random() * width; this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.05; this.vy = (Math.random() - 0.5) * 0.05;
      this.isSupernova = false;
      if (isBlueprint) { this.color = '#000000'; this.size = 2; this.brightness = 1; } 
      else {
          const rand = Math.random();
          if (rand > 0.9) { this.color = '#bfdbfe'; this.size = Math.random() * 2.5 + 2; this.brightness = 0.9; }
          else if (rand > 0.7) { this.color = '#fde68a'; this.size = Math.random() * 1.5 + 1.5; this.brightness = 0.8; }
          else if (rand > 0.5) { this.color = '#fecaca'; this.size = Math.random() * 1.5 + 1; this.brightness = 0.7; }
          else { this.color = '#ffffff'; this.size = Math.random() * 1.5 + 0.5; this.brightness = Math.random() * 0.4 + 0.4; }
      }
    }
    update() {
      this.connections = 0; this.x += this.vx; this.y += this.vy;
      if (this.x < 0) this.x = width; if (this.x > width) this.x = 0; if (this.y < 0) this.y = height; if (this.y > height) this.y = 0;
    }
    draw() {
      ctx.beginPath(); ctx.globalAlpha = isBlueprint ? 0.3 : this.brightness; ctx.fillStyle = this.isSupernova ? '#ffffff' : this.color;
      if (isBlueprint) { ctx.fillRect(this.x - 1.5, this.y - 1.5, 3, 3); } 
      else { ctx.shadowBlur = this.size * 3; ctx.shadowColor = this.color; ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; }
      ctx.globalAlpha = 1.0; 
    }
  }

  class Galaxy {
      constructor() {
          this.x = Math.random() * width; this.y = Math.random() * height; this.angle = Math.random() * Math.PI * 2; this.stars = [];
          const count = Math.random() * 40 + 20; 
          for(let i=0; i<count; i++) {
              const dist = Math.random() * 100; const angle = Math.random() * Math.PI * 2;
              this.stars.push({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist * 0.6, size: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.1 + 0.05 });
          }
      }
      update() {}
      draw() {
          if(isBlueprint) return; 
          ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
          const grad = ctx.createRadialGradient(0,0,0, 0,0,120); grad.addColorStop(0, 'rgba(255, 255, 255, 0.03)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0,0,120,0,Math.PI*2); ctx.fill();
          this.stars.forEach(s => { ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI*2); ctx.fill(); });
          ctx.restore();
      }
  }

  class Asteroid {
    constructor() { this.reset(); }
    reset() { 
      const side = Math.floor(Math.random() * 4); 
      if(side === 0) { this.x = -50; this.y = Math.random() * height; } else if(side === 1) { this.x = width+50; this.y = Math.random() * height; } else if(side === 2) { this.x = Math.random() * width; this.y = -50; } else { this.x = Math.random() * width; this.y = height+50; } 
      const typeRand = Math.random();
      if (typeRand > 0.7) { this.type = 'Metallic'; this.color = '#cbd5e1'; } else if (typeRand > 0.3) { this.type = 'Silicate'; this.color = '#64748b'; } else { this.type = 'Carbon'; this.color = '#334155'; }
      this.radius = Math.random() * 12 + 6; this.vx = (Math.random() - 0.5) * 1.5; this.vy = (Math.random() - 0.5) * 1.5; this.rotation = 0; this.rotationSpeed = (Math.random() - 0.5) * 0.05; 
      this.vertices = []; const numPoints = 6 + Math.floor(Math.random() * 6); 
      for (let i = 0; i < numPoints; i++) { const angle = (i / numPoints) * Math.PI * 2; const dist = this.radius * (0.7 + Math.random() * 0.3); this.vertices.push({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }); } 
    }
    update() { this.x += this.vx; this.y += this.vy; this.rotation += this.rotationSpeed; if(this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) { this.reset(); } }
    draw() { 
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rotation); ctx.globalAlpha = isBlueprint ? 0.5 : 1.0; 
        if (isBlueprint) { ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(this.vertices[0].x, this.vertices[0].y); for(let i=1; i<this.vertices.length; i++) ctx.lineTo(this.vertices[i].x, this.vertices[i].y); ctx.closePath(); ctx.stroke(); } 
        else { ctx.fillStyle = this.color; ctx.beginPath(); ctx.moveTo(this.vertices[0].x, this.vertices[0].y); for(let i=1; i<this.vertices.length; i++) ctx.lineTo(this.vertices[i].x, this.vertices[i].y); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fill(); } 
        ctx.restore(); 
    }
  }

  class Comet {
    constructor() { this.reset(); }
    reset() { 
      const side = Math.floor(Math.random() * 4); const buffer = 100; 
      if(side === 0) { this.x = -buffer; this.y = Math.random() * height; } else if(side === 1) { this.x = width+buffer; this.y = Math.random() * height; } else if(side === 2) { this.x = Math.random() * width; this.y = -buffer; } else { this.x = Math.random() * width; this.y = height+buffer; } 
      const typeRand = Math.random();
      if (typeRand > 0.4) { this.tint = '186, 230, 253'; this.coreColor = '#bae6fd'; } 
      else if (typeRand > 0.1) { this.tint = '226, 232, 240'; this.coreColor = '#e2e8f0'; } 
      else { this.tint = '134, 239, 172'; this.coreColor = '#86efac'; } 
      this.radius = Math.random() * 3 + 4; 
      this.vx = (Math.random() - 0.5) * 8; 
      this.vy = (Math.random() - 0.5) * 8; 
      if(Math.abs(this.vx) < 3) this.vx += (this.vx > 0 ? 3 : -3);
      if(Math.abs(this.vy) < 3) this.vy += (this.vy > 0 ? 3 : -3);
      this.history = []; 
    }
    update() { 
        this.history.push({x: this.x, y: this.y}); 
        if(this.history.length > 25) { this.history.shift(); } 
        this.x += this.vx; this.y += this.vy; 
        const buffer = 1000; 
        if(this.x < -buffer || this.x > width + buffer || this.y < -buffer || this.y > height + buffer) { this.reset(); } 
    }
    draw() { 
        ctx.globalAlpha = isBlueprint ? 0.3 : 1.0; 
        if (!isBlueprint && this.history.length > 1) { 
             for(let i = 0; i < this.history.length; i++) {
                 const point = this.history[i];
                 const size = (i / this.history.length) * this.radius; 
                 const alpha = (i / this.history.length) * 0.6;
                 ctx.beginPath();
                 ctx.fillStyle = `rgba(${this.tint}, ${alpha})`;
                 ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                 ctx.fill();
             }
        } 
        ctx.beginPath(); 
        if (isBlueprint) { 
            ctx.strokeStyle = '#000'; ctx.lineWidth = 1; 
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.stroke(); 
            ctx.beginPath(); ctx.setLineDash([5, 5]); 
            if(this.history.length > 0) { ctx.moveTo(this.history[0].x, this.history[0].y); ctx.lineTo(this.x, this.y); ctx.stroke(); } 
            ctx.setLineDash([]); 
        } else { 
            ctx.fillStyle = this.coreColor; 
            ctx.shadowBlur = 15; ctx.shadowColor = this.coreColor; 
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); 
            ctx.shadowBlur = 0; 
        } 
        ctx.globalAlpha = 1.0; 
    }
  }

  class DartSatellite {
      constructor(targetAsteroid) {
          const edge = Math.floor(Math.random() * 4);
          if (edge === 0) { this.x = Math.random() * width; this.y = -50; } else if (edge === 1) { this.x = width + 50; this.y = Math.random() * height; } else if (edge === 2) { this.x = Math.random() * width; this.y = height + 50; } else { this.x = -50; this.y = Math.random() * height; }
          this.target = targetAsteroid; 
          this.speed = 9; 
          this.dead = false; this.angle = 0;
          let dx = this.target.x - this.x; 
          let dy = this.target.y - this.y; 
          this.angle = Math.atan2(dy, dx); 
          this.vx = Math.cos(this.angle) * this.speed;
          this.vy = Math.sin(this.angle) * this.speed;
      }
      update() {
          this.x += this.vx; 
          this.y += this.vy;
          if(this.target.x > 0 && this.target.x < width && this.target.y > 0 && this.target.y < height) {
             let dx = this.target.x - this.x; 
             let dy = this.target.y - this.y; 
             let dist = Math.sqrt(dx*dx + dy*dy); 
             if (dist < (this.target.radius + 15)) { 
                 this.dead = true; 
                 this.target.reset(); 
                 explosions.push(new Explosion(this.x, this.y, '#ef4444')); 
                 if (!isBlueprint) drawHUD(this.x, this.y, "DART IMPACT", "TARGET NEUTRALIZED"); 
             }
          }
          if(this.x < -100 || this.x > width+100 || this.y < -100 || this.y > height+100) {
              this.dead = true;
          }
      }
      draw() { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle + Math.PI/2); ctx.fillStyle = isBlueprint ? '#000' : '#fff'; ctx.fillRect(-3, -10, 6, 20); ctx.fillStyle = isBlueprint ? '#000' : '#38bdf8'; ctx.fillRect(-15, -5, 10, 15); ctx.fillRect(5, -5, 10, 15); ctx.restore(); }
  }

  class Explosion {
      constructor(x, y, color) { this.x = x; this.y = y; this.particles = []; this.life = 50; this.color = color || '#fbbf24'; for(let i=0; i<15; i++) { this.particles.push({ vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, life: Math.random()*1, size: Math.random()*3+1 }); } }
      update() { this.life--; }
      draw() { ctx.save(); ctx.translate(this.x, this.y); this.particles.forEach(p => { p.life *= 0.9; ctx.fillStyle = isBlueprint ? `rgba(0,0,0,${p.life})` : this.color; ctx.globalAlpha = p.life; ctx.beginPath(); ctx.arc(p.vx * (50-this.life), p.vy * (50-this.life), p.size, 0, Math.PI*2); ctx.fill(); }); ctx.restore(); ctx.globalAlpha = 1.0; }
  }

  class Nebula {
    constructor() {
      this.particles = []; let safe = false; let attempts = 0; let centerX, centerY;
      while (!safe && attempts < 100) { centerX = Math.random() * width; centerY = Math.random() * height; safe = true; for (let other of nebulas) { let dx = centerX - other.x; let dy = centerY - other.y; if (Math.sqrt(dx*dx + dy*dy) < 500) { safe = false; break; } } attempts++; }
      this.x = centerX; this.y = centerY;
      const colors = ['rgba(0, 243, 255, 0.1)', 'rgba(120, 40, 255, 0.15)', 'rgba(255, 0, 150, 0.1)', 'rgba(0, 100, 255, 0.15)'];
      const mainColor = colors[Math.floor(Math.random() * colors.length)];
      const particleCount = 10 + Math.random() * 5; for(let i=0; i<particleCount; i++) this.particles.push(new CloudParticle(centerX, centerY, mainColor));
    }
    update() { if(!isBlueprint) this.particles.forEach(p => p.update()); }
    draw() { if(!isBlueprint) this.particles.forEach(p => p.draw()); }
  }
  class CloudParticle {
    constructor(centerX, centerY, color) { this.x = centerX + (Math.random() - 0.5) * 600; this.y = centerY + (Math.random() - 0.5) * 600; this.radiusX = Math.random() * 150 + 80; this.radiusY = Math.random() * 150 + 80; this.rotation = Math.random() * Math.PI * 2; this.color = color; this.vx = (Math.random() - 0.5) * 0.05; this.vy = (Math.random() - 0.5) * 0.05; }
    update() { this.x += this.vx; this.y += this.vy; const buffer = 500; if(this.x < -buffer) this.x = width + buffer; if(this.x > width + buffer) this.x = -buffer; if(this.y < -buffer) this.y = height + buffer; if(this.y > height + buffer) this.y = -buffer; }
    draw() { const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, Math.max(this.radiusX, this.radiusY)); gradient.addColorStop(0, this.color); gradient.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gradient; ctx.beginPath(); ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, this.rotation, 0, Math.PI * 2); ctx.fill(); }
  }
  class Satellite {
    constructor() { this.types = ['shuttle', 'iss', 'hubble', 'jwst', 'voyager', 'sputnik', 'soyuz', 'apollo']; this.reset(); }
    reset() {
        this.type = this.types[Math.floor(Math.random() * this.types.length)];
        const wall = Math.floor(Math.random() * 4);
        let startX, startY, targetX, targetY; const buffer = 150;
        if (wall === 0) { startX = Math.random()*width; startY = -buffer; targetX = Math.random()*width; targetY = height+buffer; }
        else if (wall === 1) { startX = width+buffer; startY = Math.random()*height; targetX = -buffer; targetY = Math.random()*height; }
        else if (wall === 2) { startX = Math.random()*width; startY = height+buffer; targetX = Math.random()*width; targetY = -buffer; }
        else { startX = -buffer; startY = Math.random()*height; targetX = width+buffer; targetY = Math.random()*height; }
        this.x = startX; this.y = startY;
        const dx = targetX - startX; const dy = targetY - startY; const dist = Math.sqrt(dx*dx + dy*dy); const speed = 0.4 + Math.random()*0.3;
        this.vx = (dx/dist)*speed; this.vy = (dy/dist)*speed; this.angle = Math.atan2(this.vy, this.vx); this.scale = 0.8;
        this.name = this.type.toUpperCase(); this.velocity = Math.floor(Math.random()*15000+15000) + ' MPH';
    }
    update() { this.x += this.vx; this.y += this.vy; if (this.x < -200 || this.x > width + 200 || this.y < -200 || this.y > height + 200) { this.reset(); } }
    draw() {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle); ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = isBlueprint ? 0.3 : 1.0;
        if (isBlueprint) { ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 2; ctx.fillStyle = 'transparent'; } else { ctx.strokeStyle = '#ccc'; ctx.fillStyle = '#222'; ctx.lineWidth = 1; }

        if (this.type === 'shuttle') {
             ctx.rotate(Math.PI/2);
             ctx.beginPath(); ctx.moveTo(0, -40); ctx.quadraticCurveTo(10, -30, 10, 20); ctx.lineTo(-10, 20); ctx.quadraticCurveTo(-10, -30, 0, -40); 
             if(!isBlueprint) { let g=ctx.createLinearGradient(-10,0,10,0); g.addColorStop(0,'#ddd'); g.addColorStop(0.5,'#fff'); g.addColorStop(1,'#ddd'); ctx.fillStyle=g; } ctx.fill(); ctx.stroke();
             ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(35, 20); ctx.lineTo(10, 20); if(!isBlueprint) ctx.fillStyle='#eee'; ctx.fill(); ctx.stroke();
             ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-35, 20); ctx.lineTo(-10, 20); ctx.fill(); ctx.stroke();
             ctx.beginPath(); ctx.arc(0, -40, 3, 0, Math.PI*2); ctx.fillStyle='black'; ctx.fill();
             ctx.beginPath(); ctx.moveTo(12,-10); ctx.lineTo(45,30); ctx.lineTo(43,30); ctx.lineTo(12,-5); ctx.fillStyle='black'; ctx.fill();
             ctx.beginPath(); ctx.moveTo(-12,-10); ctx.lineTo(-45,30); ctx.lineTo(-43,30); ctx.lineTo(-12,-5); ctx.fill();
             ctx.beginPath(); ctx.moveTo(0, 5); ctx.lineTo(0, 35); ctx.lineWidth=3; ctx.stroke(); ctx.lineWidth=1;
             ctx.beginPath(); ctx.arc(8, 28, 4, 0, Math.PI*2); ctx.fillStyle='white'; ctx.fill(); ctx.stroke();
             ctx.beginPath(); ctx.arc(-8, 28, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        } 
        else if (this.type === 'iss') {
             ctx.beginPath(); ctx.moveTo(-60,0); ctx.lineTo(60,0); ctx.lineWidth=4; ctx.stroke();
             if(!isBlueprint) ctx.fillStyle='#e3f2fd'; ctx.lineWidth=1;
             ctx.fillRect(-50,-20,15,40); ctx.strokeRect(-50,-20,15,40); ctx.fillRect(35,-20,15,40); ctx.strokeRect(35,-20,15,40);
             ctx.fillRect(-10,-5,20,10); ctx.strokeRect(-10,-5,20,10); 
        }
        else if (this.type === 'jwst') {
             ctx.rotate(Math.PI/2); 
             if(!isBlueprint) ctx.fillStyle = '#e0b0ff';
             ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(40, 40); ctx.lineTo(0, 50); ctx.lineTo(-40, 40); ctx.fill(); ctx.stroke();
             ctx.beginPath(); ctx.moveTo(0, 35); ctx.lineTo(35, 42); ctx.lineTo(0, 48); ctx.lineTo(-35, 42); ctx.stroke();
             if(!isBlueprint) ctx.fillStyle = '#ffd700';
             drawHexagon(ctx, 0, 0, 5);
             for(let i=0; i<6; i++) { let a = i * Math.PI/3; drawHexagon(ctx, Math.cos(a)*10, Math.sin(a)*10, 5); }
        }
        else if (this.type === 'hubble') {
             if(!isBlueprint) ctx.fillStyle='silver'; ctx.fillRect(-15, -25, 30, 50); ctx.strokeRect(-15, -25, 30, 50);
             if(!isBlueprint) ctx.fillStyle='#1a237e'; ctx.fillRect(-45, -15, 30, 30); ctx.strokeRect(-45, -15, 30, 30); ctx.fillRect(15, -15, 30, 30); ctx.strokeRect(15, -15, 30, 30);
             ctx.fillStyle='black'; ctx.beginPath(); ctx.arc(0, -25, 12, 0, Math.PI, true); ctx.fill();
        }
        else if (this.type === 'soyuz') {
             ctx.rotate(Math.PI/2);
             if(!isBlueprint) ctx.fillStyle='#ddd'; ctx.beginPath(); ctx.arc(0, -20, 9, 0, Math.PI*2); ctx.fill(); ctx.stroke();
             ctx.beginPath(); ctx.moveTo(-10, -12); ctx.lineTo(10, -12); ctx.lineTo(12, 5); ctx.lineTo(-12, 5); ctx.fill(); ctx.stroke();
             if(!isBlueprint) ctx.fillStyle='#444'; ctx.fillRect(-10, 5, 20, 15); ctx.strokeRect(-10, 5, 20, 15);
             if(!isBlueprint) ctx.fillStyle='#1a237e'; ctx.fillRect(-35, 10, 25, 5); ctx.fillRect(10, 10, 25, 5);
        }
        else if (this.type === 'voyager') {
             ctx.rotate(Math.PI/4);
             if(!isBlueprint) ctx.fillStyle='#eee'; ctx.beginPath(); ctx.ellipse(0, 0, 20, 5, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
             if(!isBlueprint) ctx.fillStyle='#333'; ctx.fillRect(-10, 0, 20, 20); ctx.strokeRect(-10, 0, 20, 20);
             ctx.beginPath(); ctx.moveTo(0, 20); ctx.lineTo(0, 50); ctx.stroke();
             ctx.beginPath(); ctx.moveTo(10, 10); ctx.lineTo(40, 10); ctx.stroke();
        }
        else if (this.type === 'sputnik') {
             if(!isBlueprint) { let g=ctx.createRadialGradient(-5,-5,0,0,0,15); g.addColorStop(0,'white'); g.addColorStop(1,'silver'); ctx.fillStyle=g; }
             ctx.beginPath(); ctx.arc(0,0,12,0,Math.PI*2); ctx.fill(); ctx.stroke();
             // Antennas
             ctx.beginPath(); ctx.moveTo(-8,-8); ctx.lineTo(-40,-40); ctx.stroke();
             ctx.beginPath(); ctx.moveTo(8,-8); ctx.lineTo(40,-40); ctx.stroke();
             ctx.beginPath(); ctx.moveTo(-8,8); ctx.lineTo(-40,40); ctx.stroke();
             ctx.beginPath(); ctx.moveTo(8,8); ctx.lineTo(40,40); ctx.stroke();
        }
        else if (this.type === 'apollo') {
             ctx.rotate(Math.PI/2);
             if(!isBlueprint) ctx.fillStyle='silver'; ctx.beginPath(); ctx.moveTo(0,-20); ctx.lineTo(12,0); ctx.lineTo(-12,0); ctx.fill(); ctx.stroke();
             if(!isBlueprint) ctx.fillStyle='#ccc'; ctx.fillRect(-12, 0, 24, 25); ctx.strokeRect(-12, 0, 24, 25);
             if(!isBlueprint) ctx.fillStyle='#222'; ctx.beginPath(); ctx.moveTo(-8, 25); ctx.lineTo(8, 25); ctx.lineTo(12, 35); ctx.lineTo(-12, 35); ctx.fill(); ctx.stroke();
        }

        ctx.restore();
        ctx.globalAlpha = 1.0;
    }
  }
  
  function drawHexagon(ctx, x, y, r) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
          ctx.lineTo(x + r * Math.cos(i * Math.PI / 3), y + r * Math.sin(i * Math.PI / 3));
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
  }

  function drawHUD(x, y, text1, text2) {
      if(isBlueprint) return; 
      ctx.save(); ctx.translate(x + 20, y - 20);
      ctx.fillStyle = 'rgba(5, 5, 10, 0.8)'; ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(120, 0); ctx.lineTo(120, 35); ctx.lineTo(10, 35); ctx.lineTo(0, 25); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#3b82f6'; ctx.font = '10px "Courier New", monospace'; ctx.fillText(text1, 10, 15);
      ctx.fillStyle = '#cbd5e1'; ctx.fillText(text2, 10, 28);
      ctx.beginPath(); ctx.moveTo(-5, 5); ctx.lineTo(0, 0); ctx.stroke(); ctx.restore();
  }

  function initSpace() {
    stars = []; nebulas = []; galaxies = []; asteroids = []; comets = []; satellite = null;
    for (let i = 0; i < config.starCount; i++) stars.push(new Star());
    for (let i = 0; i < config.nebulaCount; i++) nebulas.push(new Nebula());
    for (let i = 0; i < config.galaxyCount; i++) galaxies.push(new Galaxy()); // Init Galaxies
    for (let i = 0; i < config.asteroidCount; i++) asteroids.push(new Asteroid());
    for (let i = 0; i < config.cometCount; i++) comets.push(new Comet());
    satellite = new Satellite(); 
  }

  function connectStars() {
    ctx.lineWidth = 1;
    for (let a = 0; a < stars.length; a++) {
      if (stars[a].connections >= config.maxConnections || stars[a].isSupernova) continue;
      for (let b = a + 1; b < stars.length; b++) {
        if (stars[b].connections >= config.maxConnections || stars[b].isSupernova) continue;
        let dx = stars[a].x - stars[b].x; let dy = stars[a].y - stars[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < config.connectionDistance) {
          let opacity = 1 - (distance / config.connectionDistance);
          if (isBlueprint) { 
              ctx.strokeStyle = `rgba(30, 58, 138, ${opacity * 0.2})`; 
              if (distance < config.connectionDistance * 0.7) {
                  const midX = (stars[a].x + stars[b].x) / 2;
                  const midY = (stars[a].y + stars[b].y) / 2;
                  ctx.fillStyle = 'rgba(30, 58, 138, 0.7)';
                  ctx.font = '10px "Courier Prime", monospace';
                  ctx.fillText((distance * 0.1).toFixed(1) + 'mm', midX, midY);
              }
          } 
          else { ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.5})`; }
          ctx.beginPath(); ctx.moveTo(stars[a].x, stars[a].y); ctx.lineTo(stars[b].x, stars[b].y); ctx.stroke();
          stars[a].connections++; stars[b].connections++;
        }
      }
    }
  }

  // --- UNIVERSAL COLLISION HANDLER ---
  function checkCollisions() {
      // 1. Asteroid vs Asteroid
      for(let i=0; i<asteroids.length; i++) {
          for(let j=i+1; j<asteroids.length; j++) {
              let a1 = asteroids[i];
              let a2 = asteroids[j];
              let dx = a1.x - a2.x;
              let dy = a1.y - a2.y;
              let dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < (a1.radius + a2.radius)) {
                  // Collision!
                  let midX = (a1.x + a2.x)/2;
                  let midY = (a1.y + a2.y)/2;
                  explosions.push(new Explosion(midX, midY, a1.color)); // Boom
                  a1.reset();
                  a2.reset();
              }
          }
      }
      // 2. Comet vs Asteroid
      for(let i=0; i<comets.length; i++) {
          for(let j=0; j<asteroids.length; j++) {
              let c = comets[i];
              let a = asteroids[j];
              let dx = c.x - a.x;
              let dy = c.y - a.y;
              let dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < (c.radius + a.radius)) {
                  let midX = (c.x + a.x)/2;
                  let midY = (c.y + a.y)/2;
                  explosions.push(new Explosion(midX, midY, c.coreColor));
                  c.reset();
                  a.reset();
              }
          }
      }
      // 3. Comet vs Comet
      for(let i=0; i<comets.length; i++) {
          for(let j=i+1; j<comets.length; j++) {
              let c1 = comets[i];
              let c2 = comets[j];
              let dx = c1.x - c2.x;
              let dy = c1.y - c2.y;
              let dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < (c1.radius + c2.radius)) {
                  let midX = (c1.x + c2.x)/2;
                  let midY = (c1.y + c2.y)/2;
                  explosions.push(new Explosion(midX, midY, '#fff'));
                  c1.reset();
                  c2.reset();
              }
          }
      }
  }

  let animationId; // Global variable to track the frame
let isPaused = false; // Track state

  function animate() {
    if (isPaused) return;
    ctx.clearRect(0, 0, width, height);
    // Reset globalAlpha to ensure clean drawing every frame
    ctx.globalAlpha = 1.0; 

    // Draw Background Elements (Galaxies first)
    galaxies.forEach(g => { g.update(); g.draw(); });
    nebulas.forEach(neb => { neb.update(); neb.draw(); });
    stars.forEach(star => {
        star.update();
        if (star.isSupernova) {
            let dx = mouse.x - star.x; let dy = mouse.y - star.y;
            if (Math.sqrt(dx*dx + dy*dy) < 30) drawHUD(star.x, star.y, "EVENT: SUPERNOVA", "STATUS: CRITICAL");
        }
    });
    connectStars(); 
    stars.forEach(star => star.draw());
    
    // Draw Objects
    asteroids.forEach(ast => { ast.update(); ast.draw(); });
    comets.forEach(c => { c.update(); c.draw(); });
    satellite.update(); satellite.draw();
    let dx = mouse.x - satellite.x; let dy = mouse.y - satellite.y;
    if (Math.sqrt(dx*dx + dy*dy) < 40) drawHUD(satellite.x, satellite.y, `UNIT: ${satellite.name}`, `VEL: ${satellite.velocity}`);

    // DART Logic (Targeting Large Asteroids)
    if (Date.now() - lastDartTime > DART_INTERVAL) {
        // FILTER: Only target asteroids with radius > 13 (Large)
        const largeAsteroids = asteroids.filter(ast => ast.radius > 13);
        
        if (largeAsteroids.length > 0) {
            let target = largeAsteroids[Math.floor(Math.random() * largeAsteroids.length)];
            darts.push(new DartSatellite(target));
            lastDartTime = Date.now();
        }
    }

    darts.forEach((d, i) => { d.update(); d.draw(); if(d.dead) darts.splice(i,1); });
    explosions.forEach((e, i) => { e.update(); e.draw(); if(e.life <= 0) explosions.splice(i,1); });

    // Handle Collisions
    checkCollisions();


    animationId = requestAnimationFrame(animate);
  }

  // --- RESIZE HANDLER (MOBILE OPTIMIZED) ---
  let lastWidth = window.innerWidth;

  window.addEventListener('resize', () => {
      // Only reset the universe if the WIDTH changes (e.g. rotation)
      // This prevents the background from flashing when the address bar hides/shows vertically
      if (window.innerWidth !== lastWidth) {
          lastWidth = window.innerWidth;
          resize();
          initSpace();
      }
  });

  // Initial Launch
  resize(); 
  initSpace(); 
  animate();
});