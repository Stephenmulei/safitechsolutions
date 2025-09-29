// Function to show a specific service detail
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

// Add event listeners to all "Read More" buttons
document.querySelectorAll('.read-more-btn').forEach(button => {
    button.addEventListener('click', function() {
        const service = this.getAttribute('data-service');
        showService(service);
    });
});

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('nav ul');

mobileMenuBtn.addEventListener('click', function() {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

// Mobile menu functionality with overlay
const menuToggle = document.querySelector('.mobile-menu-btn'); // hamburger button
const navLinks = document.querySelector('.nav-links');         // sidebar menu
const overlay = document.querySelector('.overlay');            // dark background

if (menuToggle && navLinks && overlay) {
  // Toggle menu open/close
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
  });

  // Close when clicking overlay
  overlay.addEventListener('click', () => {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
  });

  // Close when clicking a nav link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      overlay.classList.remove('active');
    });
  });
}



// Contact form submission
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (formStatus) formStatus.textContent = 'Sending...';
      const data = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        subject: contactForm.subject ? contactForm.subject.value : '',
        message: contactForm.message.value
      };
      try {
        const resp = await fetch('/api/contact', {   // ✅ Fixed endpoint
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(data)
        });
        const result = await resp.json();
        if (resp.ok) {
          if (formStatus) formStatus.textContent = 'Message sent! Thank you.';
          contactForm.reset();
        } else {
          if (formStatus) formStatus.textContent = 'Error: ' + (result.error || 'Unable to send message');
        }
      } catch (err) {
        if (formStatus) formStatus.textContent = 'Network error. Try again later.';
      }
    });
  }
});

// Dropdown toggle on click
document.addEventListener("DOMContentLoaded", () => {
  const dropBtn = document.querySelector(".dropbtn");
  const dropdownContent = document.querySelector(".dropdown-content");

  if (dropBtn && dropdownContent) {
    dropBtn.addEventListener("click", (e) => {
      e.preventDefault();
      dropdownContent.classList.toggle("show");
    });

    window.addEventListener("click", (e) => {
      if (!e.target.matches(".dropbtn")) {
        if (dropdownContent.classList.contains("show")) {
          dropdownContent.classList.remove("show");
        }
      }
    });
  }
});

