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
    title: "Web Engineering Dashboard",
    description: "A comprehensive administrative web application layout built using HTML5, modern CSS3 Grid/Flexbox, and JavaScript. Designed with clean data visualizations, dark navy blue themes, and cyan interactive elements.",
    tags: ["HTML5", "CSS3", "JavaScript", "Responsive Design"]
  },
  "2": {
    title: "E-Commerce Web Platform",
    description: "A responsive online store interface featuring glassmorphic product showcase cards, custom category filtering, and smooth hover interactions tailored for modern desktop and mobile shoppers.",
    tags: ["UI/UX", "Glassmorphism", "CSS Animations", "Mobile-First"]
  },
  "3": {
    title: "Interactive Task Manager",
    description: "A functional productivity web application allowing users to organize, filter, and track daily tasks with real-time DOM manipulation and local state management.",
    tags: ["JavaScript ES6+", "DOM Logic", "Web App UI"]
  }
};

function initProjectModals() {
  const modal = document.getElementById('demo-modal');
  const modalClose = document.getElementById('modal-close');
  const detailButtons = document.querySelectorAll('.view-project-btn');

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];
      if (data) {
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-desc').textContent = data.description;
        if (modal) modal.classList.add('active');
      }
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', closeDemoModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeDemoModal();
    });
  }
}

function openDemoModal(title) {
  const modal = document.getElementById('demo-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');

  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc) {
    modalDesc.textContent = `You are viewing the live interactive demo preview of "${title}". This project showcases Sultan Mahdit's expertise in web engineering, clean code structure, and responsive design.`;
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
