const nav = document.getElementById('mainNav');
const menuToggle = document.getElementById('menuToggle');
const toast = document.getElementById('toast');

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? '✕' : '☰';
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  });
});

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove('show'), 3600);
}

document.getElementById('year').textContent = new Date().getFullYear();

const today = new Date();
const localDate = date => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};
const checkin = document.getElementById('checkin');
const checkout = document.getElementById('checkout');
checkin.min = localDate(today);
checkout.min = localDate(new Date(today.getTime() + 86400000));

checkin.addEventListener('change', () => {
  if (checkin.value) {
    const next = new Date(checkin.value + 'T12:00:00');
    next.setDate(next.getDate() + 1);
    checkout.min = localDate(next);
    if (checkout.value && checkout.value <= checkin.value) checkout.value = '';
  }
});

function prepareEnquiry(room = 'Any available room') {
  const inDate = checkin.value;
  const outDate = checkout.value;
  if (inDate && outDate && outDate <= inDate) {
    notify('Check-out must be after check-in.');
    return;
  }
  const guestCount = document.getElementById('guests').value;
  const message = `Hello Regard Confidential Hotel and Suites, I would like to enquire about ${room}. Check-in: ${inDate || 'Not selected'}. Check-out: ${outDate || 'Not selected'}. Guests: ${guestCount}. Please confirm availability, room details, and current rates.`;
  // Replace the placeholder below with the hotel's verified WhatsApp number.
  const hotelWhatsAppNumber = '';
  if (!hotelWhatsAppNumber) {
    notify('Enquiry prepared! Add the hotel’s verified WhatsApp number in script.js to enable direct WhatsApp booking.');
    window.alert(message);
    return;
  }
  window.open(`https://wa.me/${hotelWhatsAppNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
}

document.getElementById('bookingForm').addEventListener('submit', event => {
  event.preventDefault();
  prepareEnquiry();
});

document.querySelectorAll('.room-enquire').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById('booking').scrollIntoView({behavior: 'smooth'});
    notify(`Selected: ${button.dataset.room}. Choose dates to prepare your enquiry.`);
    setTimeout(() => prepareEnquiry(button.dataset.room), 500);
  });
});
