// ================= Service Detail Functionality =================
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

// "Read More" buttons
document.querySelectorAll('.read-more-btn').forEach(button => {
  button.addEventListener('click', function() {
    const service = this.getAttribute('data-service');
    showService(service);
  });
});

// ================= Mobile Menu =================
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Toggle menu on hamburger click
menuToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // don’t trigger outside click
  navLinks.classList.toggle('active');
});

// Close when clicking outside
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('active') &&
      !navLinks.contains(e.target) &&
      !menuToggle.contains(e.target)) {
    navLinks.classList.remove('active');
  }
});

// Close when clicking a nav link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navLinks.classList.remove('active');
    }
  });
});

// ================= Smooth Scroll for Nav Links =================
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      if (targetId.includes('-service')) {
        const service = targetId.replace('#', '').replace('-service', '');
        showService(service);
      } else {
        document.querySelectorAll('.service-detail').forEach(detail => {
          detail.classList.remove('active');
        });
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ================= Contact Form =================
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
        const resp = await fetch('/api/contact', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
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

// ================= Dropdown =================
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
        dropdownContent.classList.remove("show");
      }
    });
  }
});
