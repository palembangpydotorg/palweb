const chatWidget = document.createElement('section');
chatWidget.className = 'chat-widget';
chatWidget.setAttribute('aria-label', 'Chat simulasi PalembangPy');
chatWidget.innerHTML = `
  <div class="chat-widget__panel" id="chatWidgetPanel" aria-hidden="true">
    <div class="chat-widget__header">
      <div class="chat-widget__identity">
        <strong>PalembangPy</strong>
        <span>Simulasi chat · bukan operator langsung</span>
      </div>
      <button class="chat-widget__close" type="button" aria-label="Tutup chat"><i class="fa fa-times" aria-hidden="true"></i></button>
    </div>
    <div class="chat-widget__messages" id="chatWidgetMessages" role="log" aria-live="polite" aria-relevant="additions"></div>
    <form class="chat-widget__composer" id="chatWidgetForm">
      <textarea class="chat-widget__input" id="chatWidgetInput" rows="1" maxlength="500" aria-label="Pesan chat" placeholder="Tulis pesan..."></textarea>
      <button class="chat-widget__send" type="submit" aria-label="Kirim pesan"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
    </form>
  </div>
  <button class="chat-widget__toggle" type="button" aria-label="Buka chat simulasi" aria-expanded="false" aria-controls="chatWidgetPanel"><i class="fa fa-comments" aria-hidden="true"></i></button>`;

document.body.append(chatWidget);

const chatToggle = chatWidget.querySelector('.chat-widget__toggle');
const chatClose = chatWidget.querySelector('.chat-widget__close');
const chatPanel = chatWidget.querySelector('.chat-widget__panel');
const chatMessages = chatWidget.querySelector('.chat-widget__messages');
const chatForm = chatWidget.querySelector('.chat-widget__composer');
const chatInput = chatWidget.querySelector('.chat-widget__input');
const chatSend = chatWidget.querySelector('.chat-widget__send');

function addChatMessage(text, sender) {
  const message = document.createElement('div');
  message.className = `chat-widget__message chat-widget__message--${sender}`;
  message.textContent = text;
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getSimulatedReply(text) {
  const normalized = text.toLowerCase();

  if (/event|acara|workshop|meetup/.test(normalized)) {
    return 'Untuk simulasi ini, jadwal kegiatan bisa dilihat di halaman Event. Balasan ini otomatis dan tidak dikirim oleh pengurus.';
  }
  if (/project|proyek|github/.test(normalized)) {
    return 'Kamu bisa melihat karya komunitas di halaman Project. Ini balasan otomatis dalam mode simulasi.';
  }
  if (/kontak|email|kerja sama|kerjasama/.test(normalized)) {
    return 'Silakan gunakan formulir pada halaman Kontak untuk mengirim pesan ke pengurus. Chat ini hanya simulasi.';
  }
  if (/halo|hai|hello|hi\b/.test(normalized)) {
    return 'Halo! Ada yang ingin kamu ketahui tentang PalembangPy? Ini chat simulasi, bukan operator langsung.';
  }
  return 'Pesan diterima dalam simulasi. Widget ini belum tersambung ke layanan chat real-time atau pengurus.';
}

function setChatOpen(open) {
  chatWidget.classList.toggle('is-open', open);
  chatToggle.setAttribute('aria-expanded', String(open));
  chatToggle.setAttribute('aria-label', open ? 'Tutup chat simulasi' : 'Buka chat simulasi');
  chatPanel.setAttribute('aria-hidden', String(!open));
  if (open) chatInput.focus();
  else chatToggle.focus();
}

addChatMessage('Halo! Selamat datang di PalembangPy. Silakan tulis pesan untuk mencoba simulasi chat.', 'bot');
chatToggle.addEventListener('click', () => setChatOpen(!chatWidget.classList.contains('is-open')));
chatClose.addEventListener('click', () => setChatOpen(false));
chatWidget.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && chatWidget.classList.contains('is-open')) setChatOpen(false);
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  addChatMessage(text, 'user');
  chatInput.value = '';
  chatSend.disabled = true;
  chatInput.disabled = true;

  window.setTimeout(() => {
    addChatMessage(getSimulatedReply(text), 'bot');
    chatSend.disabled = false;
    chatInput.disabled = false;
    chatInput.focus();
  }, 700);
});

chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});
