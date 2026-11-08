const menuButton = document.getElementById('menuButton');
const mobileNav = document.getElementById('mobileNav');

if (menuButton && mobileNav) {
  const setMenuState = (isOpen) => {
    mobileNav.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = !mobileNav.classList.contains('open');
    setMenuState(isOpen);
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });
}

const tiltCards = document.querySelectorAll('.card, .stat, .contact-box');

for (const card of tiltCards) {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `perspective(1000px) rotateX(${(-offsetY * 12).toFixed(2)}deg) rotateY(${(offsetX * 14).toFixed(2)}deg) translateY(-8px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
}

const aiToggle = document.getElementById('aiToggle');
const aiPanel = document.getElementById('aiPanel');
const aiClose = document.getElementById('aiClose');
const aiForm = document.getElementById('aiForm');
const aiInput = document.getElementById('aiInput');
const aiMessages = document.getElementById('aiMessages');

const getAiAnswer = (question) => {
  const q = question.toLowerCase();

  if (q.includes('full name') || q.includes('your name') || q.includes('name is') || q.includes('who are you')) {
    return 'My full name is Ndukwe Isdone Chukwuenye.';
  }

  if (q.includes('student') || q.includes('school') || q.includes('ebsu') || q.includes('ebonyi') || q.includes('where do you study')) {
    return 'I am a student at EBSU in Ebonyi State, and I am building my skills in AI, design, and digital product development while still studying.';
  }

  if (q.includes('about you') || q.includes('details') || q.includes('profile') || q.includes('who is this')) {
    return 'I am Ndukwe Isdone Chukwuenye, a student at EBSU in Ebonyi State. I specialize in AI, web design, branding, and digital experiences.';
  }

  if (q.includes('field') || q.includes('what do you do') || q.includes('study') || q.includes('course')) {
    return 'I am focused on AI, digital design, web development, and creative technology. I am still schooling at EBSU while building those skills.';
  }

  if (q.includes('from') || q.includes('state') || q.includes('location')) {
    return 'I am from Ebonyi State, and I am currently studying at EBSU.';
  }

  if (q.includes('price') || q.includes('cost') || q.includes('budget')) {
    return 'Prices depend on scope, design depth, and complexity. A simple landing page usually starts lower, while a full business or portfolio site is more investment-heavy. I can recommend the right package after a short brief but for 100k orr 180k.';
  }

  if (q.includes('website') || q.includes('site') || q.includes('build')) {
    return 'I design and build modern websites for personal brands, businesses, agencies, and digital products. The process includes strategy, design, development, and launch support.';
  }

  if (q.includes('ai') || q.includes('automation') || q.includes('chatbot')) {
    return 'AI can improve lead capture, instant support, and user engagement. I can build AI-style experiences, chat prompts, smart flows, and messaging systems that feel modern and useful.';
  }

  if (q.includes('time') || q.includes('timeline') || q.includes('how long')) {
    return 'Most projects take 1 to 4 weeks depending on complexity, revisions, and the amount of content to prepare. Fast-turnaround options are available for simpler builds.';
  }

  if (q.includes('brand') || q.includes('logo') || q.includes('design')) {
    return 'Brand design includes visual direction, consistency, messaging, and overall digital presence. I focus on premium, trustworthy branding that feels intentional and professional.';
  }

  if (q.includes('contact') || q.includes('hire') || q.includes('work with you')) {
    return 'You can send your project details through the contact form or email. I will review the goal, timeline, and scope before recommending the best approach.';
  }

  if (q.includes('portfolio') || q.includes('work')) {
    return 'My portfolio focuses on polished digital experiences, premium branding, and conversion-friendly website design for modern businesses and personal brands.';
  }

  return 'I am Ndukwe Isdone Chukwuenye, a student at EBSU in Ebonyi State. I work in AI, design, and digital product development.';
};

const addMessage = (text, kind) => {
  const msg = document.createElement('div');
  msg.className = `message ${kind}`;
  msg.textContent = text;
  aiMessages.appendChild(msg);
  aiMessages.scrollTop = aiMessages.scrollHeight;
};

if (aiToggle && aiPanel) {
  aiToggle.addEventListener('click', () => {
    aiPanel.classList.toggle('open');
    aiToggle.setAttribute('aria-expanded', String(aiPanel.classList.contains('open')));

    if (aiPanel.classList.contains('open')) {
      aiInput.focus();
    }
  });

  aiClose?.addEventListener('click', () => {
    aiPanel.classList.remove('open');
    aiToggle.setAttribute('aria-expanded', 'false');
  });

  aiForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = aiInput.value.trim();

    if (!question) return;

    addMessage(question, 'user');
    aiInput.value = '';

    setTimeout(() => {
      addMessage(getAiAnswer(question), 'bot');
    }, 350);
  });
}
