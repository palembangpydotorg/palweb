const footerMount = document.querySelector('[data-site-footer]') || document.createElement('div');
const existingFooter = document.querySelector('body > footer');
footerMount.classList.add('site-footer-mount');

if (existingFooter) existingFooter.replaceWith(footerMount);
else if (!footerMount.isConnected) document.body.append(footerMount);

const year = new Date().getFullYear();
const displayedYear = year > 2025 ? `2025 - ${year}` : '2025';

footerMount.innerHTML = `
  <footer class="bg-slate-900 text-white pt-12 pb-6 w-full">
    <div class="max-w-6xl mx-auto px-4 md:px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div class="md:col-span-2">
          <a href="index.html" class="inline-flex items-center gap-2 mb-4 text-white no-underline">
            <img src="/img/palembangpy.png" alt="PalembangPy Logo" class="w-10 h-10 rounded-md object-cover" />
            <span class="font-bold text-lg">PalembangPy</span>
          </a>
          <p class="text-slate-400 text-sm max-w-xs mb-4">Komunitas pengembang Python di Palembang. Belajar, berbagi, dan tumbuh bersama anak-anak Sumatera Selatan.</p>
          <div class="flex gap-3">
            <a href="https://t.me/PalembangPyBot" aria-label="Telegram PalembangPy" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><i class="fa fa-telegram" aria-hidden="true"></i></a>
            <a href="https://github.com/palembangpy" aria-label="GitHub PalembangPy" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><i class="fa fa-github" aria-hidden="true"></i></a>
            <a href="https://instagram.com/palembangpy" aria-label="Instagram PalembangPy" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><i class="fa fa-instagram" aria-hidden="true"></i></a>
          </div>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Tautan Cepat</h4>
          <ul class="space-y-2 text-sm text-slate-400">
          <li><a href="events.html" class="hover:text-orange-400 transition-colors">Event</a></li>
          <li><a href="projects.html" class="hover:text-orange-400 transition-colors">Lokakarya</a></li>
          <li><a href="partner.html" class="hover:text-orange-400 transition-colors">Partner</a></li>
          <li><a href="https://t.me/PalembangPyBot" class="hover:text-orange-400 transition-colors">Gabung Member</a></li>
          </ul>
          </div>
          <div>
          <h4 class="font-semibold mb-4">Lainnya</h4>
          <ul class="space-y-2 text-sm text-slate-400">
          <li><a href="legal.html" class="hover:text-orange-400 transition-colors">Pedoman Kami</a></li>
            <li><a href="about.html" class="hover:text-orange-400 transition-colors">Tentang Kami</a></li>
            <li><a href="kontak.html" class="hover:text-orange-400 transition-colors">Hubungi Kami</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
        <p id="credit">&copy; ${displayedYear} PalembangPy &mdash; Komunitas Python Palembang. Seluruh hak dilindungi.</p>
      </div>
    </div>
  </footer>`;
