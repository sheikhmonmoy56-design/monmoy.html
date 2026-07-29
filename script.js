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
    "Aspiring Web Development Engineer",
    "BSc Web Engineering Student",
    "Frontend & Responsive Web Enthusiast",
    "Creative Problem Solver"
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
    title: "English Learning Web App",
    description: "An interactive web platform designed for learning English course materials, responsive study modules, and clean frontend UI.",
    tags: ["HTML5", "CSS3", "JavaScript", "Web App"],
    githubUrl: "https://github.com/sheikhmonmoy56-design/english-"
  },
  "2": {
    title: "AI Tools & Resources Web",
    description: "A comprehensive web portal showcasing curated AI tools, category filters, responsive cards, and modern dark mode styling.",
    tags: ["UI/UX", "AI Tools", "Responsive Design", "CSS3"],
    githubUrl: "https://github.com/sheikhmonmoy56-design/ai_tools_website"
  },
  "3": {
    title: "Interactive Web Platform",
    description: "A clean productivity and web engineering application with status filters, interactive animations, and responsive card views.",
    tags: ["JavaScript ES6+", "DOM Logic", "Web Engineering"],
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
    title: "Project Showcase",
    description: `You are viewing project details by Sultan Mahdit.`,
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
        <i class="fa-brands fa-github"></i> Open Repository on GitHub
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
        alert('Please complete all required fields.');
        return;
      }

      const submitBtn = contactForm.querySelector('.submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Saving...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message })
        });

        const data = await response.json();

        if (data.success) {
          const modalTitle = document.getElementById('modal-title');
          const modalDesc = document.getElementById('modal-desc');

          if (modalTitle) modalTitle.textContent = "Message Saved to Database!";
          if (modalDesc) {
            modalDesc.innerHTML = `Thank you, <strong>${name}</strong>! Your message has been stored in Sultan Mahdit's database (ID: #${data.id}). He will get back to you at <strong>${email}</strong> soon.`;
          }

          const modal = document.getElementById('demo-modal');
          if (modal) modal.classList.add('active');

          contactForm.reset();
        } else {
          alert('Failed to save message: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error submitting form:', err);
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        if (modalTitle) modalTitle.textContent = "Message Sent!";
        if (modalDesc) {
          modalDesc.innerHTML = `Thank you, <strong>${name}</strong>! Your message regarding "<em>${subject}</em>" has been submitted.`;
        }
        const modal = document.getElementById('demo-modal');
        if (modal) modal.classList.add('active');
        contactForm.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
        }
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

  if (modalTitle) modalTitle.textContent = `${type} Copied!`;
  if (modalDesc) {
    modalDesc.innerHTML = `<strong>${text}</strong> has been copied to your clipboard successfully. You can now paste it anywhere!`;
  }

  const modal = document.getElementById('demo-modal');
  if (modal) modal.classList.add('active');
}
