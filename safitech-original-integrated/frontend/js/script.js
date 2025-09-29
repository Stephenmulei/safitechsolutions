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

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const overlay = document.querySelector('.overlay');

// Toggle menu
menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  navLinks.classList.toggle('active');
  overlay.classList.toggle('active'); // show/hide overlay
});

// Close when clicking overlay
overlay.addEventListener('click', () => {
  navLinks.classList.remove('active');
  overlay.classList.remove('active');
});

// Close when clicking outside (extra safety)
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('active') &&
      !navLinks.contains(e.target) &&
      !menuToggle.contains(e.target)) {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
  }
});

// Close when clicking a nav link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navLinks.classList.remove('active');
      overlay.classList.remove('active');
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

