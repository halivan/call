const peer = new Peer();
const yourIdSpan = document.getElementById('your-id');
const copyLink = document.getElementById('copy-link');
const copyId = document.getElementById('copy-id');
const peerIdInput = document.getElementById('peer-id');
const callBtn = document.getElementById('call-btn');
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const toggleAudioBtn = document.getElementById('toggle-audio-btn');
const toggleVideoBtn = document.getElementById('toggle-video-btn');
const toggleRemoteAudioBtn = document.getElementById('toggle-remote-audio-btn');
const toggleRemoteVideoBtn = document.getElementById('toggle-remote-video-btn');
const endCallBtn = document.getElementById('end-call-btn');

let localStream = null;
let currentCall = null;
let dataConnection = null;
let isRemoteAudioMuted = false;
let isRemoteVideoHidden = false;

// Показать ID пользователя
peer.on('open', (id) => {
  yourIdSpan.textContent = id;
  copyLink.setAttribute('href', window.location.origin + window.location.pathname + '#' + id);
  copyId.setAttribute('href', id);
});

// Обработка входящих соединений для передачи данных
peer.on('connection', (conn) => {
  setupDataConnection(conn);
});

// Получение доступа к камере и микрофону
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then((stream) => {
    localStream = stream;
    localVideo.srcObject = stream;

    // Обработка входящих вызовов
    peer.on('call', (call) => {
      peerIdInput.value = call.peer;
      
      callBtn.classList.add("d-none");
      endCallBtn.classList.remove("d-none");

      currentCall = call;
      call.answer(localStream);

      call.on('stream', (remoteStream) => {
        // peerIdInput.value = remoteStream.id;
        remoteVideo.srcObject = remoteStream;
      });

      call.on('close', () => {
        // alert('Дзвінок завершено.');
        resetRemoteVideo();
      });
	  
      // Устанавливаем соединение передачи данных после приема звонка
      const conn = peer.connect(call.peer);
      setupDataConnection(conn);
    });
  })
  .catch((err) => console.error('Error accessing media devices:', err));

callBtn.addEventListener('click', () => {
  const peerId = peerIdInput.value;
  if (!peerId) {
    alert('Введіть ID контакта.');
    return;
  }
  
  conn = peer.connect(peerId);
  setupDataConnection(conn);

  const call = peer.call(peerId, localStream);
  currentCall = call;
  
  callBtn.classList.add("d-none");
  endCallBtn.classList.remove("d-none");

  call.on('stream', (remoteStream) => {
    remoteVideo.srcObject = remoteStream;
  });

  call.on('close', () => {
    // alert('Дзвінок завершено.');
    resetRemoteVideo();
  });
});

endCallBtn.addEventListener('click', () => {
  if (currentCall) {
    currentCall.close();
    resetRemoteVideo();

	// Отправляем сообщение о завершении вызова второй стороне
    if (dataConnection) {
      dataConnection.send('end-call');
    }
  } else {
    alert('Немає активного виклику для завершення.');
  }
});

toggleVideoBtn.addEventListener('click', () => {
  const videoTrack = localStream.getVideoTracks()[0];
  videoTrack.enabled = !videoTrack.enabled;

  const images = toggleVideoBtn.querySelectorAll("img");
  images.forEach(img => img.classList.toggle("d-none"));
});

toggleAudioBtn.addEventListener('click', () => {
  const audioTrack = localStream.getAudioTracks()[0];
  audioTrack.enabled = !audioTrack.enabled;

  const images = toggleAudioBtn.querySelectorAll("img");
  images.forEach(img => img.classList.toggle("d-none"));
});

toggleRemoteVideoBtn.addEventListener('click', () => {
  isRemoteVideoHidden = !isRemoteVideoHidden;
  remoteVideo.style.visibility = isRemoteVideoHidden ? 'hidden' : 'visible';

  const images = toggleRemoteVideoBtn.querySelectorAll("img");
  images.forEach(img => img.classList.toggle("d-none"));
});

toggleRemoteAudioBtn.addEventListener('click', () => {
  isRemoteAudioMuted = !isRemoteAudioMuted;
  remoteVideo.muted = isRemoteAudioMuted;

  const images = toggleRemoteAudioBtn.querySelectorAll("img");
  images.forEach(img => img.classList.toggle("d-none"));
});

copyLink.addEventListener('click', (e) => {
    e.preventDefault();
    copyToClipboard(copyLink.getAttribute('href'), 'Посилання скопійовано. Передайте його співрозмовнику для переходу і виконання виклику.');
})

copyId.addEventListener('click', (e) => {
    e.preventDefault();
    copyToClipboard(copyId.getAttribute('href'), 'Скопійовано.');
})

// Функция для установки соединения передачи данных
function setupDataConnection(conn) {
  dataConnection = conn;
  conn.on('data', (data) => {
    if (data === 'end-call' && currentCall) {
      currentCall.close();
      resetRemoteVideo();
    }
  });
}

function resetRemoteVideo() {
  remoteVideo.srcObject = null;
  callBtn.classList.remove("d-none");
  endCallBtn.classList.add("d-none");
}

function copyToClipboard(text, title) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select(); // Выделяем текст
  textarea.setSelectionRange(0, text.length); // Для мобильных устройств
  
  try {
    document.execCommand("copy");
    alert(title);
  } catch (err) {
    console.error("Failed to copy link:", err);
  }
  
  document.body.removeChild(textarea);
}

if(window.location.hash.length > 1) {
    const id = window.location.hash.substr(1);
    peerIdInput.value = id;
}