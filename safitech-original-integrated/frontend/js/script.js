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
  const menuToggle = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuToggle || !navLinks) {
    console.warn('Mobile menu elements not found. Check your HTML for .mobile-menu-btn and .nav-links classes.');
    return;
  }
  
  console.log('Mobile menu initialized successfully');
  
  // Toggle menu when hamburger is clicked
  menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Simply toggle the 'active' class - CSS handles display
    navLinks.classList.toggle('active');
    
    console.log('Menu toggled. Active:', navLinks.classList.contains('active'));
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    // Check if click is outside both menu and toggle button
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove('active');
    }
  });
  
  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
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
// NEWSLETTER SUBSCRIPTION
// ============================================
function initNewsletterSubscription() {
  // Find the newsletter form in the footer
  const footerForms = document.querySelectorAll('footer form');
  let subscribeForm = null;
  
  // Find the form that contains an email input (newsletter form)
  footerForms.forEach(form => {
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && !form.id) { // Newsletter form doesn't have an ID
      subscribeForm = form;
    }
  });
  
  if (!subscribeForm) {
    console.log('Newsletter subscription form not found');
    return;
  }
  
  console.log('Newsletter form initialized');
  
  // Create status message element if it doesn't exist
  let statusElement = subscribeForm.querySelector('.subscribe-status');
  if (!statusElement) {
    statusElement = document.createElement('p');
    statusElement.className = 'subscribe-status';
    statusElement.style.marginTop = '10px';
    statusElement.style.fontSize = '0.9rem';
    subscribeForm.appendChild(statusElement);
  }
  
  subscribeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = subscribeForm.querySelector('input[type="email"]');
    const submitBtn = subscribeForm.querySelector('button[type="submit"]');
    
    if (!emailInput) {
      console.error('Email input not found');
      return;
    }
    
    const email = emailInput.value.trim();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      statusElement.textContent = 'Please enter a valid email address.';
      statusElement.style.color = '#dc3545';
      return;
    }
    
    // Disable button and show loading state
    const originalBtnText = submitBtn.textContent;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing...';
      submitBtn.style.opacity = '0.6';
    }
    
    statusElement.textContent = 'Processing...';
    statusElement.style.color = '#ffc107';
    
      const GOOGLE_SCRIPT_URL = https://script.google.com/macros/s/AKfycbw4kig_ny9XiLHtcduxy96f-hP5gAUIIpOH2gK4geD-6qZPtQ7eGbVYU8PSFSTTRutt/exec; 
      
      // Send to Google Sheets via Apps Script
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      // Note: no-cors mode doesn't allow reading the response
      // We'll assume success if no error is thrown
      statusElement.textContent = '✓ Successfully subscribed! Thank you.';
      statusElement.style.color = '#28a745';
      subscribeForm.reset();
      
      console.log('Newsletter subscription sent:', email);
      
    } catch (err) {
      statusElement.textContent = '✗ Network error. Please try again later.';
      statusElement.style.color = '#dc3545';
      console.error('Newsletter subscription error:', err);
    } finally {
      // Re-enable button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
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
  initNewsletterSubscription();
  
  console.log('Website initialized successfully');
});
