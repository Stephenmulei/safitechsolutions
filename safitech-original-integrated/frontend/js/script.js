// ============================================
// SERVICE DETAILS MANAGEMENT
// ============================================
function showService(service) {
  document.querySelectorAll('.service-detail').forEach(detail => {
    detail.classList.remove('active');
  });
  
  const serviceDetail = document.getElementById(service + '-service');
  if (serviceDetail) {
    serviceDetail.classList.add('active');
    serviceDetail.scrollIntoView({ behavior: 'smooth' });
  }
}

// ============================================
// MOBILE NAVIGATION
// ============================================
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuToggle || !navLinks) return;
  
  // Toggle menu when hamburger is clicked
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove('active');
    }
  });
  
  // Close menu when a link is clicked (mobile only)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('active');
      }
    });
  });
}

// ============================================
// NAVIGATION & SMOOTH SCROLLING
// ============================================
function initNavigation() {
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = anchor.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (!targetElement) return;
      
      // Check if it's a service detail link
      if (targetId.includes('-service')) {
        const service = targetId.replace('#', '').replace('-service', '');
        showService(service);
      } else {
        // Hide all service details and scroll to section
        document.querySelectorAll('.service-detail').forEach(detail => {
          detail.classList.remove('active');
        });
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ============================================
// READ MORE BUTTONS
// ============================================
function initReadMoreButtons() {
  document.querySelectorAll('.read-more-btn').forEach(button => {
    button.addEventListener('click', function() {
      const service = this.getAttribute('data-service');
      if (service) {
        showService(service);
      }
    });
  });
}

// ============================================
// DROPDOWN MENU
// ============================================
function initDropdown() {
  const dropBtn = document.querySelector('.dropbtn');
  const dropdownContent = document.querySelector('.dropdown-content');
  
  if (!dropBtn || !dropdownContent) return;
  
  dropBtn.addEventListener('click', (e) => {
    e.preventDefault();
    dropdownContent.classList.toggle('show');
  });
  
  // Close dropdown when clicking outside
  window.addEventListener('click', (e) => {
    if (!e.target.matches('.dropbtn')) {
      dropdownContent.classList.remove('show');
    }
  });
}

// ============================================
// CONTACT FORM SUBMISSION
// ============================================
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get submit button to disable during submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    // Update status and disable button
    if (formStatus) formStatus.textContent = 'Sending...';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
    }
    
    // Prepare form data
    const data = {
      name: contactForm.name.value.trim(),
      email: contactForm.email.value.trim(),
      subject: contactForm.subject ? contactForm.subject.value.trim() : '',
      message: contactForm.message.value.trim()
    };
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
      if (formStatus) formStatus.textContent = 'Please fill in all required fields.';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
      return;
    }
    
    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await resp.json();
      
      if (resp.ok) {
        if (formStatus) {
          formStatus.textContent = 'Message sent successfully! Thank you.';
          formStatus.style.color = '#28a745';
        }
        contactForm.reset();
      } else {
        if (formStatus) {
          formStatus.textContent = 'Error: ' + (result.error || 'Unable to send message');
          formStatus.style.color = '#dc3545';
        }
      }
    } catch (err) {
      if (formStatus) {
        formStatus.textContent = 'Network error. Please try again later.';
        formStatus.style.color = '#dc3545';
      }
      console.error('Contact form error:', err);
    } finally {
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    }
  });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initNavigation();
  initReadMoreButtons();
  initDropdown();
  initContactForm();
  
  console.log('Website initialized successfully');
});
