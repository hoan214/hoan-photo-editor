const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const mobileMenu = $('.mobile-menu');
const mainNav = $('.main-nav');
mobileMenu.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  mobileMenu.setAttribute('aria-expanded', String(open));
});
$$('.main-nav a').forEach(link => link.addEventListener('click', () => mainNav.classList.remove('open')));

const categoryPanel = $('.category-panel');
$('.category-title').addEventListener('click', () => categoryPanel.classList.toggle('open'));

const slides = $$('.slide');
const dotsWrap = $('.slider-dots');
let activeSlide = 0;
let sliderTimer;
slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
  dot.addEventListener('click', () => showSlide(index));
  dotsWrap.appendChild(dot);
});
const dots = $$('.slider-dots button');
function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === activeSlide));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === activeSlide));
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => showSlide(activeSlide + 1), 6500);
}
$('.next').addEventListener('click', () => showSlide(activeSlide + 1));
$('.prev').addEventListener('click', () => showSlide(activeSlide - 1));
showSlide(0);

$$('[data-compare]').forEach(compare => {
  const range = $('input[type="range"]', compare);
  const after = $('.after', compare);
  const line = $('.compare-line', compare);
  const update = () => {
    const value = `${range.value}%`;
    after.style.width = value;
    line.style.left = value;
  };
  range.addEventListener('input', update);
  update();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
$$('.reveal').forEach(el => observer.observe(el));

$('#year').textContent = new Date().getFullYear();

const langToggle = $('#langToggle');
let language = 'en';
langToggle.addEventListener('click', () => {
  language = language === 'en' ? 'vi' : 'en';
  langToggle.textContent = language === 'en' ? 'VI' : 'EN';
  $$('[data-en][data-vi]').forEach(el => {
    el.textContent = el.dataset[language];
  });
  document.documentElement.lang = language;
});

const form = $('#contactForm');
const status = $('#formStatus');
form.addEventListener('submit', event => {
  event.preventDefault();
  status.className = 'form-status';

  const data = Object.fromEntries(new FormData(form).entries());
  const message = [
    'Hello Hoan, I would like to request a photo editing quote.',
    '',
    `Name: ${data.name || ''}`,
    `Email: ${data.email || ''}`,
    `Service: ${data.service || ''}`,
    `Number of images: ${data.quantity || 'Not specified'}`,
    `File link: ${data.link || 'Not provided'}`,
    '',
    `Project details: ${data.message || ''}`
  ].join('\n');

  const whatsappUrl = `https://wa.me/84987501990?text=${encodeURIComponent(message)}`;
  status.textContent = 'Opening WhatsApp with your project details…';
  status.classList.add('success');
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});
