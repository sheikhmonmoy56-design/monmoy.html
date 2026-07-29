/**
 * Sultan Mahdit - Personal Portfolio Interactive Logic
 * Handles dynamic typewriter, navigation drawer, scroll progress, form validation, and modal handlers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dynamic feature modules
  initNavbar();
  initTypewriter();
  initScrollEffects();
  initContactForm();
  initProjectModals();
  initScrollAnimations();
});

/* ==========================================================================
   Navigation Bar & Mobile Drawer Toggle
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Add glassmorphic background shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile navigation drawer toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close mobile nav drawer when clicking any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // Active section highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   Typewriter Effect for Subtitle Roles
   ========================================================================== */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter');
  if (!typewriterElement) return;

  const roles = [
    "ওয়েব ডেভেলপমেন্ট ইঞ্জিনিয়ার",
    "বিএসসি ওয়েব ইঞ্জিনিয়ারিং শিক্ষার্থী",
    "ফ্রন্টএন্ড ও রেসপনসিভ ওয়েব অনুরাগী",
    "ক্রিয়েটিভ প্রবলেম সলভার"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 45;
  const delayBetweenRoles = 2000;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      currentSpeed = delayBetweenRoles;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      currentSpeed = 400;
    }

    setTimeout(type, currentSpeed);
  }

  type();
}

/* ==========================================================================
   Scroll Effects & Back to Top Button
   ========================================================================== */
function initScrollEffects() {
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================================================
   Project Details & Modal Manager
   ========================================================================== */
const projectData = {
  "1": {
    title: "ইংলিশ লার্নিং ওয়েব অ্যাপ",
    description: "ইংরেজি কোর্সের বিষয়বস্তু শেখা, রেসপনসিভ স্টাডি মডিউল এবং আকর্ষণীয় ফ্রন্টএন্ড ইউআই সহ একটি ইন্টারেক্টিভ ওয়েব প্ল্যাটফর্ম।",
    tags: ["HTML5", "CSS3", "JavaScript", "ওয়েব অ্যাপ"],
    githubUrl: "https://github.com/sheikhmonmoy56-design/english-"
  },
  "2": {
    title: "এআই টুলস এবং রিসোর্স ওয়েব",
    description: "বাছাইকৃত এআই টুলস, ক্যাটাগরি ফিল্টার, রেসপনসিভ কার্ড এবং আধুনিক ডার্ক মোড স্টাইল সম্বলিত একটি পূর্ণাঙ্গ ওয়েব পোর্টাল।",
    tags: ["UI/UX", "AI Tools", "রেসপনসিভ ডিজাইন", "CSS3"],
    githubUrl: "https://github.com/sheikhmonmoy56-design/ai_tools_website"
  },
  "3": {
    title: "ইন্টারেক্টিভ ওয়েব প্ল্যাটফর্ম",
    description: "স্ট্যাটাস ফিল্টার, ইন্টারেক্টিভ অ্যানিমেশন এবং রেসপনসিভ কার্ড ভিউ সহ একটি প্রোডাক্টভিটি ও ওয়েব ইঞ্জিনিয়ারিং অ্যাপ্লিকেশন।",
    tags: ["JavaScript ES6+", "DOM Logic", "ওয়েব ইঞ্জিনিয়ারিং"],
    githubUrl: "https://github.com/sheikhmonmoy56-design/"
  }
};

function initProjectModals() {
  const modal = document.getElementById('demo-modal');
  const modalClose = document.getElementById('modal-close');
  const detailButtons = document.querySelectorAll('.view-project-btn');

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectId = btn.getAttribute('data-project');
      openDemoModal(projectId);
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', closeDemoModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeDemoModal();
    });
  }
}

function openDemoModal(projectId) {
  const modal = document.getElementById('demo-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');

  const data = projectData[projectId] || {
    title: "প্রজেক্ট ডেমো",
    description: `আপনি সুলতান মাহদিত-এর প্রজেক্ট বিবরণ দেখছেন।`,
    tags: ["HTML5", "CSS3", "JavaScript"],
    githubUrl: "https://github.com/sheikhmonmoy56-design"
  };

  if (modalTitle) modalTitle.textContent = data.title;
  if (modalDesc) {
    modalDesc.innerHTML = `
      <p style="margin-bottom: 1rem; color: #cbd5e1;">${data.description}</p>
      <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem; flex-wrap: wrap;">
        ${(data.tags || []).map(t => `<span style="background: rgba(0,242,254,0.15); color: #00f2fe; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${t}</span>`).join('')}
      </div>
      <a href="${data.githubUrl}" target="_blank" rel="noopener" class="btn btn-primary" style="display: inline-flex; width: 100%; text-decoration: none; margin-top: 0.5rem; justify-content: center; gap: 0.5rem;">
        <i class="fa-brands fa-github"></i> গিটহাবে রিপোজিটরি দেখুন
      </a>
    `;
  }
  if (modal) modal.classList.add('active');
}

function closeDemoModal() {
  const modal = document.getElementById('demo-modal');
  if (modal) modal.classList.remove('active');
}

/* ==========================================================================
   Contact Form Validation & Submission Handler
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        alert('অনুগ্রহ করে সমস্ত প্রয়োজনীয় ঘরগুলো পূরণ করুন।');
        return;
      }

      const submitBtn = contactForm.querySelector('.submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>সংরক্ষণ করা হচ্ছে...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
      }

      const newMsg = {
        id: Date.now(),
        name,
        email,
        subject,
        message,
        created_at: new Date().toISOString()
      };

      // 1. ALWAYS Save to Global Cloud Database (Works live on Cloudflare Workers / Static hosts)
      try {
        await fetch('https://api.restful-api.dev/objects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: "SULTAN_MAHDIT_PORTFOLIO_MSG",
            data: newMsg
          })
        });
      } catch (cloudErr) {
        console.warn('Cloud DB POST failed:', cloudErr);
      }

      // 2. ALWAYS Save to LocalStorage backup
      try {
        const stored = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
        stored.unshift(newMsg);
        localStorage.setItem('portfolio_messages', JSON.stringify(stored));
      } catch (e) {}

      // 3. Attempt local API save (if local server is running)
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message })
        });
      } catch (e) {}

      // 4. Show success popup
      const modalTitle = document.getElementById('modal-title');
      const modalDesc = document.getElementById('modal-desc');
      if (modalTitle) modalTitle.textContent = "বার্তা সফলভাবে গৃহীত হয়েছে!";
      if (modalDesc) {
        modalDesc.innerHTML = `ধন্যবাদ, <strong>${name}</strong>! "<em>${subject}</em>" বিষয়ে আপনার বার্তাটি সংরক্ষণ করা হয়েছে। সুলতান মাহদিত শীঘ্রই <strong>${email}</strong> ঠিকানায় আপনার সাথে যোগাযোগ করবেন।`;
      }
      const modal = document.getElementById('demo-modal');
      if (modal) modal.classList.add('active');
      contactForm.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>বার্তা পাঠান</span> <i class="fa-solid fa-paper-plane"></i>';
      }
    });
  }
}

/* ==========================================================================
   IntersectionObserver Reveal Animations
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.skill-card, .project-card, .stat-card, .timeline-card');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
  });
}

/* ==========================================================================
   Clipboard Copy Helper for Phone & Email
   ========================================================================== */
function copyContactInfo(text, type) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showCopyModal(text, type);
    }).catch(() => {
      fallbackCopyText(text, type);
    });
  } else {
    fallbackCopyText(text, type);
  }
}

function fallbackCopyText(text, type) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showCopyModal(text, type);
  } catch (err) {
    alert(`${type}: ${text}`);
  }
  document.body.removeChild(textArea);
}

function showCopyModal(text, type) {
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');

  if (modalTitle) modalTitle.textContent = `${type} কপি হয়েছে!`;
  if (modalDesc) {
    modalDesc.innerHTML = `<strong>${text}</strong> আপনার ক্লিপবোর্ডে সফলভাবে কপি হয়েছে। আপনি এটি এখন যেকোনো জায়গায় পেস্ট করতে পারবেন!`;
  }

  const modal = document.getElementById('demo-modal');
  if (modal) modal.classList.add('active');
}
