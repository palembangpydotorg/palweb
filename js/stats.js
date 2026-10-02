const API_URL = 'https://api.palembangpy.org/v1/stats';

async function loadStats() {
  const elMembers = document.getElementById('stat-members');
  const elEvents = document.getElementById('stat-events');
  const elSpeakers = document.getElementById('stat-speakers');
  const elProjects = document.getElementById('stat-projects');

  const fallback = { members: 100, events: 10, speakers: 5 };

  try {
    const res = await fetch(API_URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();

    animateNumber(elMembers, data.members);
    animateNumber(elEvents, data.events);
    animateNumber(elSpeakers, data.speakers);
    animateNumber(elProjects, data.projects);
  } catch (e) {
    console.warn('Gagal ambil stats, pakai fallback:', e.message);
    elMembers.textContent = fallback.members + '+';
    elEvents.textContent = fallback.events + '+';
    elSpeakers.textContent = fallback.speakers + '+';
  }
}

// Animasi angka naik (count-up)
function animateNumber(element, target) {
  const duration = 1500;
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = Math.floor(startVal + (target - startVal) * eased);
    element.textContent = current.toLocaleString('id-ID') + '+';
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

document.addEventListener('DOMContentLoaded', loadStats);
