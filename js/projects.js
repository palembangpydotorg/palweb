const API_URL_PROJECTS = 'https://api.palembangpy.org/v1/projects';

function generateTagsHTML(tagsString) {
  if (!tagsString) return '';
  const tags = tagsString.split(',').map(t => t.trim()).slice(0, 3); // Maksimal 3 tag di card
  return tags.map(tag => 
    `<span class="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-semibold rounded-md">${tag}</span>`
  ).join(' ');
}

function renderProjectCard(project) {
  // Jika image_url tidak ada, pakai placeholder gradient
  const imageDiv = project.image_url 
    ? `<img src="${project.image_url}" alt="${project.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">`
    : `<div class="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
         <i class="fa fa-code text-white text-5xl opacity-20"></i>
       </div>`;

  const featuredBadge = project.is_featured 
    ? `<span class="absolute top-3 right-3 px-2 py-1 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-md shadow-sm"><i class="fa fa-star"></i> Featured</span>` 
    : '';

  return `
    <article class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      <div class="relative aspect-video bg-slate-100 overflow-hidden">
        ${imageDiv}
        ${featuredBadge}
      </div>
      <div class="p-5 flex flex-col flex-1">
        <h3 class="font-bold text-lg text-slate-800 mb-1 line-clamp-1">${project.title}</h3>
        <p class="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">${project.description || 'Tidak ada deskripsi.'}</p>
        
        <div class="flex flex-wrap gap-1.5 mb-4">
          ${generateTagsHTML(project.tags)}
        </div>
        
        <div class="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
          <div class="flex gap-2">
            ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-colors" title="GitHub"><i class="fa fa-github"></i></a>` : ''}
            ${project.demo_url ? `<a href="${project.demo_url}" target="_blank" class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 hover:bg-orange-500 hover:text-white transition-colors" title="Live Demo"><i class="fa fa-external-link"></i></a>` : ''}
          </div>
          <a href="project-detail.html?id=${project.id}" class="text-xs font-semibold text-slate-800 hover:text-orange-600">Detail <i class="fa fa-arrow-right text-[10px] ml-1"></i></a>
        </div>
      </div>
    </article>
  `;
}

async function loadProjects() {
  const container = document.getElementById('projectGrid');
  const loading = document.getElementById('loadingState');
  const emptyState = document.getElementById('emptyState');
  
  if (!container) return;

  try {
    if (loading) loading.style.display = 'block';
    
    const res = await fetch(API_URL_PROJECTS, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('API error');
    
    const projects = await res.json();
    if (loading) loading.remove();
    
    if (!projects || projects.length === 0) {
       emptyState.classList.remove('hidden');
       return;
    }
    
    emptyState.classList.add('hidden');
    container.innerHTML = projects.map(p => renderProjectCard(p)).join('');
    
  } catch (e) {
    console.warn('Gagal ambil data projects:', e.message);
    if (loading) loading.innerHTML = '<span class="text-red-500"><i class="fa fa-exclamation-triangle"></i> Gagal memuat project. Coba lagi.</span>';
  }
}

document.addEventListener('DOMContentLoaded', loadProjects);
