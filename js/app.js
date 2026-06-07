/* -------------------------------------------------------------
   PREMIUM AGENCY WEBSITE INTERACTIVE SUITE
   Aesthetics: Apple-level smoothness, interactive luxury SaaS
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroOrb();
  initMarqueeCloner();
  initResultsDashboard();
  initProcessWorkflow();
  initTestimonialsCarousel();
  initBookingScheduler();
  initNewsletterForm();
});

/* --- NAVBAR LOGIC --- */
function initNavbar() {
  const header = document.querySelector('header');
  const burgerMenu = document.querySelector('.burger-menu');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const burgerBars = document.querySelectorAll('.burger-bar');

  // Sticky Scroll Class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  burgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    burgerMenu.setAttribute('aria-expanded', navMenu.classList.contains('open'));
    
    // Animate burger menu lines into an 'X'
    if (navMenu.classList.contains('open')) {
      burgerBars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
      burgerBars[1].style.opacity = '0';
      burgerBars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
    } else {
      burgerBars[0].style.transform = 'none';
      burgerBars[1].style.opacity = '1';
      burgerBars[2].style.transform = 'none';
    }
  });

  // Close Mobile Menu on Link Click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      burgerBars[0].style.transform = 'none';
      burgerBars[1].style.opacity = '1';
      burgerBars[2].style.transform = 'none';
    });
  });

  // Intersection Observer for Active Link Highlighting
  const sections = document.querySelectorAll('section');
  const options = {
    threshold: 0.3,
    rootMargin: "-80px 0px 0px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, options);

  sections.forEach(section => observer.observe(section));
}

/* --- HERO INTERACTIVE BACKGROUND ORB --- */
function initHeroOrb() {
  const canvas = document.getElementById('heroOrbCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  // Track Mouse Move
  let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2, active: false };

  window.addEventListener('resize', () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  });

  const parentWrapper = canvas.closest('.hero-visual-wrapper');
  if (parentWrapper) {
    parentWrapper.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    });

    parentWrapper.addEventListener('mouseleave', () => {
      mouse.targetX = width / 2;
      mouse.targetY = height / 2;
      mouse.active = false;
    });
  }

  // Particle System & Morphing Orbs
  const particleCount = 45;
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse magnetism
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) {
          this.x += dx * 0.005;
          this.y += dy * 0.005;
        }
      }

      // Border bounds
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, 1.2`;      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let floatAngle = 0;

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Smooth Mouse Coordinates
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    floatAngle += 0.005;
    const pulseOffset = Math.sin(floatAngle) * 15;

    // Draw Ambient Liquid Orb
    const gradX = mouse.x;
    const gradY = mouse.y;
    const radInner = 50;
    const radOuter = 160 + pulseOffset;

    const radGrad = ctx.createRadialGradient(gradX, gradY, radInner, gradX, gradY, radOuter);
    radGrad.addColorStop(0, 'rgba(139, 92, 246, 0.5)');
    radGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.3)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.beginPath();
    ctx.arc(gradX, gradY, radOuter, 0, Math.PI * 2);
    ctx.fillStyle = radGrad;
    ctx.fill();

    // Draw Particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connecting thin lines
    ctx.beginPath();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 80) {
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
        }
      }
    }
    ctx.strokeStyle = `rgba(6, 182, 212, 0.19)`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    requestAnimationFrame(animate);
  }

  animate();
}

/* --- CLIENT MARQUEE DUPLICATOR --- */
function initMarqueeCloner() {
  const marquees = document.querySelectorAll('.marquee-content');
  marquees.forEach(marquee => {
    const parent = marquee.parentElement;
    // Clone contents to ensure seamless visual scrolling loop
    const clone = marquee.cloneNode(true);
    clone.style.animationDelay = "-15s"; // Offset timing slightly
    parent.appendChild(clone);
  });
}

/* --- RESULTS DASHBOARD & DYNAMIC SVG CHARTING --- */
const caseStudiesData = {
  'meta-ads': {
    kpi: '8.4x',
    kpiLabel: 'Average ROAS Achieved',
    change: '+142%',
    beforeVal: '$45,000 / mo',
    afterVal: '$378,000 / mo',
    ctr: '3.42%',
    cpa: '$18.40',
    title: 'Meta Advertising Scale Up',
    // SVG points for chart: [x, y] coordinates mapped to 0-300 grid
    dataPointsBefore: [[0, 240], [50, 220], [100, 230], [150, 210], [200, 220], [250, 200], [300, 210]],
    dataPointsAfter: [[0, 240], [50, 180], [100, 140], [150, 90], [200, 70], [250, 40], [300, 20]]
  },
  'google-ads': {
    kpi: '$8.20',
    kpiLabel: 'Average Customer Acq. Cost',
    change: '-54%',
    beforeVal: '$17.80 CPA',
    afterVal: '$8.20 CPA',
    ctr: '6.85%',
    cpa: '$8.20',
    title: 'High-Intent Google Ads Capture',
    dataPointsBefore: [[0, 100], [50, 110], [100, 130], [150, 120], [200, 140], [250, 150], [300, 160]],
    dataPointsAfter: [[0, 100], [50, 85], [100, 60], [150, 50], [200, 35], [250, 25], [300, 18]]
  },
  'seo': {
    kpi: '340%',
    kpiLabel: 'Organic Traffic Increase',
    change: '+340%',
    beforeVal: '12K visits / mo',
    afterVal: '52K visits / mo',
    ctr: '4.15%',
    cpa: 'N/A',
    title: 'High-Authority SEO Domain Build',
    dataPointsBefore: [[0, 220], [50, 210], [100, 215], [150, 220], [200, 210], [250, 205], [300, 200]],
    dataPointsAfter: [[0, 220], [50, 170], [100, 140], [150, 110], [200, 85], [250, 55], [300, 35]]
  }
};

function initResultsDashboard() {
  const tabs = document.querySelectorAll('.results-tabs .tab-btn');
  const metricVal = document.querySelector('.metric-val');
  const metricLabel = document.querySelector('.metric-lbl');
  const metricChange = document.querySelector('.metric-change');
  const beforeValText = document.querySelector('.before-val');
  const afterValText = document.querySelector('.after-val');
  const ctrValText = document.querySelector('.ctr-val');
  const cpaValText = document.querySelector('.cpa-val');
  const chartTitle = document.querySelector('.chart-title-tag');

  const pathAfter = document.querySelector('.chart-path');
  const pathBefore = document.querySelector('.chart-path-before');
  const pointsContainer = document.getElementById('chartPoints');
  const tooltip = document.getElementById('chartTooltip');

  function renderPoints(points, isBefore) {
    if (isBefore) return; // Only show interactive points for main curve
    pointsContainer.innerHTML = '';
    
    points.forEach((pt, index) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', pt[0]);
      circle.setAttribute('cy', pt[1]);
      circle.setAttribute('r', '6');
      circle.setAttribute('class', 'chart-point');
      
      // Calculate screen coordinate position for tooltip
      circle.addEventListener('mousemove', (e) => {
        const svgRect = e.target.closest('svg').getBoundingClientRect();
        const tooltipX = pt[0] * (svgRect.width / 300);
        const tooltipY = pt[1] * (svgRect.height / 250);

        tooltip.style.left = `${tooltipX + 20}px`;
        tooltip.style.top = `${tooltipY - 40}px`;
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
        
        let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index];
        let displayVal = isBefore ? 'Baseline' : 'Scaled Growth';
        tooltip.innerHTML = `<strong>${month}</strong><br/>${displayVal}`;
      });

      circle.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(5px)';
      });

      pointsContainer.appendChild(circle);
    });
  }

  function makePathD(points) {
    return points.reduce((acc, curr, index) => {
      return index === 0 ? `M ${curr[0]} ${curr[1]}` : `${acc} L ${curr[0]} ${curr[1]}`;
    }, '');
  }

  function updateDashboard(tabId) {
    const data = caseStudiesData[tabId];
    if (!data) return;

    // Trigger metrics animations
    metricVal.classList.add('fading');
    setTimeout(() => {
      metricVal.textContent = data.kpi;
      metricLabel.textContent = data.kpiLabel;
      metricChange.textContent = data.change;
      beforeValText.textContent = data.beforeVal;
      afterValText.textContent = data.afterVal;
      ctrValText.textContent = data.ctr;
      cpaValText.textContent = data.cpa;
      chartTitle.textContent = data.title;
      
      // Update charts SVG
      const dBefore = makePathD(data.dataPointsBefore);
      const dAfter = makePathD(data.dataPointsAfter);
      
      pathBefore.setAttribute('d', dBefore);
      pathAfter.setAttribute('d', dAfter);

      // Animate growth path drawing in
      const length = pathAfter.getTotalLength();
      pathAfter.style.strokeDasharray = length;
      pathAfter.style.strokeDashoffset = length;
      // Force repaint
      pathAfter.getBoundingClientRect();
      pathAfter.style.strokeDashoffset = '0';

      renderPoints(data.dataPointsAfter, false);
      metricVal.classList.remove('fading');
    }, 150);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      updateDashboard(target);
    });
  });

  // Init default view
  updateDashboard('meta-ads');
}

/* --- STEP-BY-STEP PROCESS WORKFLOW --- */
const processData = {
  'discovery': {
    title: 'Deep Discovery & Auditing',
    description: 'We run deep-dive data audits across your past ad spend, web metrics, and competitive landscapes. We identify conversion blockades and high-impact revenue loops that generic audits miss completely.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`
  },
  'strategy': {
    title: 'Custom Architected Growth Map',
    description: 'No carbon-copy plans. We engineer a cohesive marketing strategy that aligns multi-channel ads (Meta, Google) with SEO authority building, visual brand positioning, and structured high-converting landing pages.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>`
  },
  'execution': {
    title: 'High-Velocity Launch & Optimizations',
    description: 'Our senior designers, creative strategists, and media buyers push clean, premium assets live. We run multivariate testing on copy, target demographics, and funnel steps, using robust statistical validation.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`
  },
  'scale': {
    title: 'Multi-Channel Compounding Scale',
    description: 'Once unit economics are profitable and traffic converts beautifully, we double down. We expand search dominance, launch scaling budget algorithms, and build compounding authority strategies that secure industry leadership.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>`
  }
};

function initProcessWorkflow() {
  const steps = document.querySelectorAll('.process-step-item');
  const visualCard = document.querySelector('.process-visual-card');
  const visualIcon = visualCard.querySelector('.process-visual-icon');
  const visualTitle = visualCard.querySelector('.process-visual-content h4');
  const visualDesc = visualCard.querySelector('.process-visual-content p');

  steps.forEach(step => {
    step.addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');

      const target = step.getAttribute('data-step');
      const data = processData[target];

      // Smooth switch visual card contents
      visualCard.style.opacity = '0.3';
      visualCard.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        visualIcon.innerHTML = data.icon;
        visualTitle.textContent = data.title;
        visualDesc.textContent = data.description;
        
        visualCard.style.opacity = '1';
        visualCard.style.transform = 'translateY(0)';
      }, 200);
    });
  });
}

/* --- TESTIMONIALS CAROUSEL (Touch & Click control) --- */
function initTestimonialsCarousel() {
  const track = document.querySelector('.testimonials-track');
  const prevBtn = document.querySelector('.control-btn.prev');
  const nextBtn = document.querySelector('.control-btn.next');
  if (!track) return;

  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;
  let slideWidth = 474; // Card width 450px + gap 24px

  // Button Click Scrolling
  prevBtn.addEventListener('click', () => {
    scrollCarousel('prev');
  });

  nextBtn.addEventListener('click', () => {
    scrollCarousel('next');
  });

  function scrollCarousel(dir) {
    const maxScroll = -(track.scrollWidth - track.offsetWidth);
    if (dir === 'next') {
      currentTranslate = Math.max(currentTranslate - slideWidth, maxScroll);
    } else {
      currentTranslate = Math.min(currentTranslate + slideWidth, 0);
    }
    applyTranslate();
    prevTranslate = currentTranslate;
  }

  function applyTranslate() {
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  // Mouse & Touch Drag Support
  track.addEventListener('mousedown', dragStart);
  track.addEventListener('touchstart', dragStart);
  track.addEventListener('mouseup', dragEnd);
  track.addEventListener('touchend', dragEnd);
  track.addEventListener('mouseleave', dragEnd);
  track.addEventListener('mousemove', dragMove);
  track.addEventListener('touchmove', dragMove);

  function dragStart(e) {
    isDragging = true;
    startX = getPositionX(e);
    track.style.transition = 'none'; // Instant response during drag
  }

  function dragMove(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    const diff = currentX - startX;
    
    // Bounds clamping
    const maxScroll = -(track.scrollWidth - track.offsetWidth);
    let targetTranslate = prevTranslate + diff;
    
    // Elastic pull edge resistance
    if (targetTranslate > 0) targetTranslate = diff * 0.2;
    if (targetTranslate < maxScroll) targetTranslate = maxScroll + diff * 0.2;

    currentTranslate = targetTranslate;
    applyTranslate();
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    
    // Snap scroll to closest card
    const maxScroll = -(track.scrollWidth - track.offsetWidth);
    let snappedIndex = Math.round(currentTranslate / slideWidth);
    currentTranslate = snappedIndex * slideWidth;
    
    // Clamp snap bounds
    if (currentTranslate > 0) currentTranslate = 0;
    if (currentTranslate < maxScroll) currentTranslate = maxScroll;

    applyTranslate();
    prevTranslate = currentTranslate;
  }

  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }
}

/* --- BOOKING SCHEDULER WIDGET --- */
function initBookingScheduler() {
  const form = document.getElementById('bookingForm');
  const widgetContent = document.querySelector('.scheduler-widget');
  const successOverlay = widgetContent?.querySelector('.success-overlay');
  
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Perform robust local inputs validations
    const name = document.getElementById('bookingName').value.trim();
    const email = document.getElementById('bookingEmail').value.trim();
    const industry = document.getElementById('bookingIndustry').value;

    if (!name || !email || !industry) {
      alert("Please fill out all fields.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please specify a valid business email address.");
      return;
    }

    // Capture submission and animate visual transition states
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Scheduling...';

    setTimeout(() => {
      // Hide booking form, show premium overlay
      form.style.display = 'none';
      const headerTitle = widgetContent.querySelector('.widget-title');
      if (headerTitle) headerTitle.style.display = 'none';
      
      successOverlay.style.display = 'flex';
      
      // Store locally (lead capture simulation)
      localStorage.setItem('agency_lead', JSON.stringify({ name, email, industry, date: new Date().toISOString() }));
    }, 1200);
  });
}

/* --- NEWSLETTER FORM --- */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const btn = form.querySelector('.newsletter-btn');
      const email = input.value.trim();

      if (!email || !validateEmail(email)) {
        input.style.borderColor = 'red';
        setTimeout(() => { input.style.borderColor = ''; }, 2000);
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Subscribed';
      input.disabled = true;

      // Mock subscription confirmation
      localStorage.setItem('subscribed_email', email);
    });
  });
}

// Helpers
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/* ===== SCROLL REVEAL SYSTEM ===== */

const revealElements = document.querySelectorAll('.reveal');
const staggerCards = document.querySelectorAll('.stagger-card');

function handleReveal() {
    const triggerPoint = window.innerHeight * 0.85;

    revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < triggerPoint) {
            element.classList.add('active');
        }
    });

    staggerCards.forEach((card) => {
        const cardTop = card.getBoundingClientRect().top;

        if (cardTop < triggerPoint) {
            card.classList.add('active');
        }
    });
}

window.addEventListener('scroll', handleReveal);

handleReveal();