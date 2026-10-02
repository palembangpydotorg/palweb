// Endpoint API
const API_EVENTS = 'https://api.palembangpy.org/v1/events'; 
const API_STATS = 'https://api.palembangpy.org/v1/stats';

const gradients = [
  'from-orange-400 via-red-500 to-rose-600',
  'from-blue-500 via-indigo-500 to-purple-600',
  'from-emerald-500 via-teal-500 to-cyan-600',
  'from-purple-500 via-violet-500 to-fuchsia-600',
  'from-amber-400 via-orange-500 to-red-500'
];

const icons = {
  'meetup': 'fa-code',
  'workshop': 'fa-laptop',
  'konferensi': 'fa-certificate'
};

function formatDate(isoString) {
  if (!isoString) return 'TBA';
  const d = new Date(isoString);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + 
         ' · ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
}

// Fungsi animasi angka berputar
function animateNumber(element, target, appendPlus = false) {
  if (!element || target === undefined) return;
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // Efek easeOutCubic
    const current = Math.floor(target * eased);
    element.textContent = current.toLocaleString('id-ID') + (appendPlus && target > 0 ? '+' : '');
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString('id-ID') + (appendPlus && target > 0 ? '+' : '');
    }
  }
  requestAnimationFrame(update);
}

// Menarik dan merender data Statistik
async function loadStatsData(eventsData) {
  try {
    const res = await fetch(API_STATS, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('API error');
    const stats = await res.json();

    // Hitung Event Mendatang (berdasarkan start_time event yang di atas tanggal saat ini)
    const now = new Date();
    const activeEventsCount = eventsData.filter(e => new Date(e.start_time) >= now).length;

    // Jalankan animasi ke elemen masing-masing
    animateNumber(document.getElementById('stat-active'), activeEventsCount);
    animateNumber(document.getElementById('stat-total'), stats.events);
    animateNumber(document.getElementById('stat-members'), stats.members, true); 
    
  } catch (e) {
    console.warn('Gagal ambil data stats untuk event:', e.message);
    document.getElementById('stat-active').textContent = '-';
    document.getElementById('stat-total').textContent = '-';
    document.getElementById('stat-members').textContent = '-';
  }
}

function renderEventCard(event, index) {
  const grad = gradients[index % gradients.length];
  const eventType = (event.type || 'meetup').toLowerCase();
  const icon = icons[eventType] || 'fa-calendar';
  const paymentCat = event.is_paid && event.price > 0 ? 'berbayar' : 'gratis';
  const filterCategory = `${eventType} ${paymentCat}`;
  
  const badgeLabel = event.is_paid && event.price > 0 
    ? `Rp ${Number(event.price).toLocaleString('id-ID')}` 
    : 'GRATIS';
  const badgeColor = event.is_paid && event.price > 0 ? 'bg-amber-500/90' : 'bg-emerald-500/90';

  return `
    <article class="event-card bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100" data-category="${filterCategory}">
      <div class="relative aspect-[16/10] bg-gradient-to-br ${grad} overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center">
          <i class="fa ${icon} text-white text-6xl opacity-25"></i>
        </div>
        <span class="absolute top-3 left-3 px-2.5 py-1 bg-white/25 backdrop-blur-md text-white text-[10px] font-semibold rounded-full capitalize">${eventType}</span>
        <span class="absolute top-3 right-3 px-2.5 py-1 ${badgeColor} text-white text-[10px] font-bold rounded-full">${badgeLabel}</span>
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
          <p class="text-[10px] opacity-80"><i class="fa fa-calendar-o mr-1"></i>${formatDate(event.start_time)}</p>
          <h3 class="font-bold text-base md:text-lg mt-1">${event.title}</h3>
        </div>
      </div>
      <div class="p-4 md:p-5">
        <p class="text-xs text-slate-500 line-clamp-2 mb-3">${event.description || 'Mari bergabung dan belajar bersama di event PalembangPy.'}</p>
        <div class="flex items-center justify-between text-[11px] text-slate-400 mb-3">
          <span><i class="fa fa-map-marker mr-1"></i>${event.location || 'Segera diumumkan'}</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex -space-x-2">
            <div class="w-6 h-6 rounded-full bg-orange-400 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">P</div>
            <div class="w-6 h-6 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">Y</div>
            <span class="text-[10px] text-slate-400 ml-2 self-center">+ Peserta</span>
          </div>
          <a href="event-detail.html?id=${event.id}" class="text-xs font-semibold text-orange-600 hover:text-orange-700">Detail →</a>
        </div>
      </div>
    </article>
  `;
}

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.event-card');
  const emptyState = document.getElementById('emptyState');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      let visibleCount = 0;

      cards.forEach(card => {
        const cats = card.getAttribute('data-category') || '';
        if (filter === 'all' || cats.includes(filter)) {
          card.classList.remove('hidden-card');
          visibleCount++;
        } else {
          card.classList.add('hidden-card');
        }
      });

      if (visibleCount === 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
      }
    });
  });
}

async function loadEvents() {
  const container = document.getElementById('eventGrid');
  const loading = document.getElementById('loadingState');
  if (!container) return;

  try {
    const res = await fetch(API_EVENTS, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('API error');
    
    const events = await res.json();
    if (loading) loading.remove();
    
    // Panggil fungsi render statistik dan lemparkan raw data event
    loadStatsData(events);
    
    if (!events || events.length === 0) {
       document.getElementById('emptyState').classList.remove('hidden');
       return;
    }
    
    container.innerHTML = events.map((e, i) => renderEventCard(e, i)).join('');
    initFilters();
    
  } catch (e) {
    console.warn('Gagal ambil events:', e.message);
    if (loading) loading.innerHTML = '<span class="text-red-500"><i class="fa fa-exclamation-triangle"></i> Gagal memuat event. Silakan refresh halaman.</span>';
  }
}

document.addEventListener('DOMContentLoaded', loadEvents);
