const API_URL_PROJECT = 'https://api.palembangpy.org/v1/projects'; 

function generateTags(tagsString) {
    if (!tagsString) return '';
    const tags = tagsString.split(',').map(t => t.trim());
    return tags.map(tag => 
      `<span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg border border-slate-200">${tag}</span>`
    ).join('');
}

async function loadProjectDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        alert('Project tidak valid.');
        window.location.href = 'projects.html';
        return;
    }

    try {
        const res = await fetch(`${API_URL_PROJECT}/${projectId}`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error('Project tidak ditemukan');
        const project = await res.json();

        // 1. Teks Dasar
        document.getElementById('bc-title').textContent = project.title;
        document.getElementById('proj-title').textContent = project.title;
        document.getElementById('proj-desc').textContent = project.description || 'Tidak ada deskripsi detail untuk project ini.';
        document.getElementById('proj-tags').innerHTML = generateTags(project.tags);
        
        // Featured Status
        if (project.is_featured) {
            document.getElementById('featured-badge').classList.remove('hidden');
        }

        // 2. Gambar
        const imgEl = document.getElementById('proj-image');
        const fallbackEl = document.getElementById('proj-image-fallback');
        if (project.image_url) {
            imgEl.src = project.image_url;
            imgEl.classList.remove('hidden');
            fallbackEl.classList.add('hidden');
        }

        // 3. Tombol Links
        let hasLinks = false;
        if (project.demo_url) {
            const btnDemo = document.getElementById('btn-demo');
            btnDemo.href = project.demo_url;
            btnDemo.classList.remove('hidden');
            hasLinks = true;
        }
        if (project.github_url) {
            const btnGithub = document.getElementById('btn-github');
            btnGithub.href = project.github_url;
            btnGithub.classList.remove('hidden');
            hasLinks = true;
        }
        
        if (!hasLinks) {
            document.getElementById('no-links-msg').classList.remove('hidden');
        }

        // 4. Metadata
        const d = new Date(project.created_at);
        document.getElementById('proj-date').textContent = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        document.getElementById('proj-author').textContent = project.user_id; // Karena belum join table User, kita tampilkan UUID-nya dulu.

        // Matikan loading
        document.getElementById('loadingOverlay').style.display = 'none';

    } catch (e) {
        console.error(e);
        alert('Terjadi kesalahan atau project tidak ditemukan.');
        window.location.href = 'projects.html';
    }
}

document.addEventListener('DOMContentLoaded', loadProjectDetail);
