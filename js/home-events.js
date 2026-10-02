const API_URL_HOME_EVENTS = 'https://api.palembangpy.org/v1/events';

const homeGradients = [
  'from-orange-400 via-red-500 to-rose-600',
  'from-blue-500 via-indigo-500 to-purple-600',
  'from-emerald-500 via-teal-500 to-cyan-600'
];

const homeIcons = {
  'meetup': 'fa-code',
  'workshop': 'fa-laptop',
  'konferensi': 'fa-certificate'
};

function formatHomeDate(iso) {
  if (!iso) return 'TBA';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderHomeCard(event, index) {
  const grad = homeGradients[index % homeGradients.length];
  const typeStr = (event.type || 'meetup').toLowerCase();
  const icon = homeIcons[typeStr] || 'fa-calendar';
  
  return `
    <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}">
      <div class="relative aspect-[4/3] bg-gradient-to-br ${grad} overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center">
          <i class="fa ${icon} text-white text-5xl opacity-30 group-hover:scale-110 transition-transform duration-500"></i>
        </div>
        <div class="absolute top-3 left-3 px-2.5 py-1 bg-white/25 backdrop-blur-md text-white text-[10px] font-semibold rounded-full capitalize">${typeStr}</div>
        <div class="absolute bottom-3 left-3 right-3 text-white">
          <p class="text-[10px] opacity-80"><i class="fa fa-calendar-o mr-1"></i>${formatHomeDate(event.start_time)}</p>
          <h3 class="font-bold text-sm md:text-base mt-1 truncate">${event.title}</h3>
        </div>
      </div>
      <div class="p-4">
        <p class="text-xs text-slate-500 line-clamp-2 mb-3">${event.description || 'Mari bergabung di event komunitas kita.'}</p>
        <div class="flex items-center justify-between">
          <span class="text-[10px] text-slate-400 truncate w-32"><i class="fa fa-map-marker mr-1"></i>${event.location || 'TBA'}</span>
          <a href="event-detail.html?id=${event.id}" class="text-xs font-semibold text-orange-600 hover:text-orange-700">Detail →</a>
        </div>
      </div>
    </div>
  `;
}

async function loadHomeEvents() {
  const grid = document.getElementById('home-event-grid');
  const loading = document.getElementById('home-loading');
  if (!grid) return;

  try {
    const res = await fetch(API_URL_HOME_EVENTS, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('API error');
    
    let events = await res.json();
    if (loading) loading.remove();
    
    if (!events || events.length === 0) {
       grid.innerHTML = `<p class="text-slate-500 col-span-full text-center">Belum ada event terjadwal.</p>`;
       return;
    }
    
    // Ambil maksimal 3 event untuk Beranda
    events = events.slice(0, 3);
    grid.innerHTML = events.map((e, i) => renderHomeCard(e, i)).join('');
    
  } catch (e) {
    console.warn('Gagal ambil events home:', e.message);
    if (loading) loading.textContent = 'Gagal memuat event. Coba muat ulang halaman.';
  }
}

document.addEventListener('DOMContentLoaded', loadHomeEvents);
