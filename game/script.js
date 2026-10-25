let audioCtx = null;
let bgmInterval = null;
let isBgmPlaying = false;
let tempBase64Image = ''; // Variabel penampung data gambar ter-upload

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playBeep(freq, type, duration) {
    try {
        initAudio();
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type || 'sine';
        osc.frequency.value = freq || 440;
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

function playClickSound() {
    playBeep(600, 'sine', 0.08);
}

function triggerTouchReaction(event, element) {
    event.stopPropagation();
    playBeep(800, 'sine', 0.15);

    const img = element.querySelector('img');
    if (img) {
        img.classList.remove('anim-react');
        void img.offsetWidth;
        img.classList.add('anim-react');
    }

    const emojis = ['❤️', '⭐', '😆', '🚀', '✨', '🎉'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    let container = element.querySelector('[id^="reaction-container"]');
    if (!container) {
        container = document.createElement('div');
        container.className = "absolute inset-0 flex items-center justify-center pointer-events-none z-20";
        element.appendChild(container);
    }

    const pop = document.createElement('div');
    pop.className = 'reaction-pop text-2xl';
    pop.innerText = randomEmoji;
    container.appendChild(pop);

    setTimeout(() => {
        pop.remove();
    }, 800);
}

function playSuccessSound() {
    try {
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
    } catch(e) {}
}

function toggleBGM(e) {
    if (e) e.stopPropagation();
    initAudio();
    const btn = document.getElementById('bgm-toggle-btn');
    if (isBgmPlaying) {
        clearInterval(bgmInterval);
        isBgmPlaying = false;
        if(btn) btn.innerHTML = '<i class="fa-solid fa-volume-xmark text-amber-400"></i> Musik: Off';
    } else {
        isBgmPlaying = true;
        if(btn) btn.innerHTML = '<i class="fa-solid fa-volume-high text-emerald-400"></i> Musik: On';
        const melody = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 293.66];
        let index = 0;
        bgmInterval = setInterval(() => {
            if (isBgmPlaying) {
                playBeep(melody[index], 'sine', 0.15);
                index = (index + 1) % melody.length;
            }
        }, 300);
    }
}

const CHARACTERS = [
   { id: 'madara', name: 'Madara', img: 'madara.png' },
   { id: 'sasuke', name: 'Sasuke', img: 'sasuke.png' },
   { id: 'gara', name: 'Gaara', img: 'gara.png' },
   { id: 'luffy', name: 'Luffy', img: 'luffy.png' },
   { id: 'ace', name: 'Ace', img: 'ace.png' },
   { id: 'inosuke', name: 'Inosuke', img: 'inosuke.png' },
   { id: 'akaza', name: 'Akaza', img: 'akaza.png' },
   { id: 'sukuna', name: 'Sukuna', img: 'sukuna.png' },
   { id: 'deadpool', name: 'Deadpool', img: 'deadpool.png' },
   { id: 'nagato', name: 'Nagato', img: 'nagato.png' },
];

let QUESTION_BANK = [
    { id: 1, subject: 'PJOK', class: '4', question: 'Sebelum melakukan kegiatan olahraga inti, kita wajib melakukan...', options: { A: 'Pendinginan', B: 'Pemanasan', C: 'Tidur siang', D: 'Makan besar' }, answer: 'B', discussion: 'Pemanasan bertujuan untuk meregangkan otot dan mencegah terjadinya cedera.', image: '' },
    { id: 2, subject: 'PJOK', class: '4', question: 'Gerakan berjalan dan berlari termasuk contoh dari gerakan...', options: { A: 'Lokomotor', B: 'Non-lokomotor', C: 'Manipulatif', D: 'Statis' }, answer: 'A', discussion: 'Gerak lokomotor adalah gerakan yang ditandai dengan adanya perpindahan tempat.', image: '' },
    { id: 3, subject: 'PJOK', class: '2', question: 'Permainan bola besar yang dimainkan dengan cara menendang bola ke gawang adalah...', options: { A: 'Voli', B: 'Basket', C: 'Sepak bola', D: 'Bulu tangkis' }, answer: 'C', discussion: 'Sepak bola dimainkan dengan menendang bola menggunakan kaki.', image: '' },
    { id: 4, subject: 'Seni Budaya', class: '4', question: 'Tari Saman berasal dari daerah...', options: { A: 'Bali', B: 'Aceh', C: 'Jawa Barat', D: 'Papua' }, answer: 'B', discussion: 'Tari Saman adalah tarian tradisional khas dari suku Gayo, Aceh.', image: '' },
    { id: 5, subject: 'Seni Budaya', class: '4', question: 'Warna primer yang tidak dapat dibuat dari campuran warna lain adalah...', options: { A: 'Hijau, Jingga, Ungu', B: 'Merah, Kuning, Biru', C: 'Hitam, Putih, Cokelat', D: 'Pink, Merah, Kuning' }, answer: 'B', discussion: 'Warna primer terdiri dari Merah, Kuning, dan Biru.', image: '' },
    { id: 6, subject: 'Matematika', class: '4', question: 'Berapakah hasil dari 15 × 4 + 20?', options: { A: '60', B: '70', C: '80', D: '90' }, answer: 'C', discussion: '15 × 4 = 60. Kemudian 60 + 20 = 80.', image: '' },
    { id: 7, subject: 'IPAS', class: '4', question: 'Bagian tumbuhan yang berfungsi menyerap air dari dalam tanah adalah...', options: { A: 'Daun', B: 'Batang', C: 'Akar', D: 'Bunga' }, answer: 'C', discussion: 'Akar bertugas menyerap air dan zat hara dari dalam tanah.', image: '' },
    { id: 8, subject: 'Bahasa Indonesia', class: '1', question: 'Hewan yang bersuara "Meong" adalah...', options: { A: 'Anjing', B: 'Kucing', C: 'Bebek', D: 'Sapi' }, answer: 'B', discussion: 'Kucing bersuara meong.', image: '' },
    { id: 9, subject: 'Pendidikan Pancasila', class: '2', question: 'Simbol sila ke-3 Pancasila adalah...', options: { A: 'Bintang', B: 'Rantai', C: 'Pohon Beringin', D: 'Padi dan Kapas' }, answer: 'C', discussion: 'Sila ke-3 berbunyi Persatuan Indonesia berlambang pohon beringin.', image: '' }
];

let gameState = {
    selectedCharacter: CHARACTERS[3],
    playerName: '',
    roomCode: '',
    isHost: false,
    selectedClass: '4',
    selectedSubject: 'Matematika',
    activeQuestions: [],
    currentQuestionIdx: 0,
    timer: 20,
    timerInterval: null,
    hasAnswered: false,
    selectedOption: null,
    correctCount: 0,
    wrongCount: 0,
    participants: []
};

function renderCharacterGrid() {
    const grid = document.getElementById('character-grid');
    if (!grid) return;
    grid.innerHTML = '';
    CHARACTERS.forEach(char => {
        const isSelected = gameState.selectedCharacter.id === char.id;
        const card = document.createElement('div');
        card.className = `glass-panel p-4 cursor-pointer rounded-2xl flex flex-col items-center relative border-2 transition hover:-translate-y-1 ${
            isSelected ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/10' : 'border-slate-800'
        }`;
        
        card.onclick = (e) => { 
            e.stopPropagation(); 
            selectCharacter(char); 
            triggerTouchReaction(e, card);
        };
        
        card.innerHTML = `
            <div class="relative w-16 h-16 mb-2">
                <img src="${char.img}" class="w-full h-full object-contain ${isSelected ? 'anim-victory' : 'anim-idle'}" alt="${char.name}">
                <div class="char-shadow"></div>
                <div id="reaction-container-${char.id}"></div>
            </div>
            <span class="font-fredoka text-[11px] text-white font-semibold">${char.name}</span>
        `;
        grid.appendChild(card);
    });
}

function selectCharacter(char) {
    gameState.selectedCharacter = char;
    renderCharacterGrid();
    updateSelectedCharacterUI();
}

function updateSelectedCharacterUI() {
    const previewImg = document.getElementById('selected-char-preview');
    const previewName = document.getElementById('selected-char-name');
    if (previewImg && gameState.selectedCharacter) {
        previewImg.src = gameState.selectedCharacter.img;
    }
    if (previewName && gameState.selectedCharacter) {
        previewName.innerText = gameState.selectedCharacter.name;
    }
}

function switchView(viewId) {
    const views = [
        'view-landing', 'view-character-select', 'view-join-room', 
        'view-student-lobby', 'view-teacher-lobby', 'view-student-controller', 
        'view-teacher-setup', 'view-tv-display', 'view-podium'
    ];
    views.forEach(v => {
        const el = document.getElementById(v);
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.remove('hidden');
        if (viewId === 'view-teacher-setup') {
            renderQuestionList();
        }
    }
}

function startStudentFlow() {
    renderCharacterGrid();
    switchView('view-character-select');
}

function proceedToRoomJoin() {
    updateSelectedCharacterUI();
    switchView('view-join-room');
}

function joinRoom() {
    const roomCode = document.getElementById('input-room-code').value.trim();
    const playerName = document.getElementById('input-player-name').value.trim();

    if (!roomCode || roomCode.length < 4) { alert('Kode Room tidak valid!'); return; }
    if (!playerName) { alert('Masukkan Nama Pemain!'); return; }

    gameState.roomCode = roomCode;
    gameState.playerName = playerName;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;

    document.getElementById('lobby-room-code').innerText = roomCode;
    document.getElementById('lobby-player-name').innerText = playerName;
    document.getElementById('ctrl-room-code').innerText = roomCode;
    document.getElementById('ctrl-player-name').innerText = playerName;
    document.getElementById('ctrl-char-img').src = gameState.selectedCharacter.img;

    document.getElementById('podium-img-1').src = gameState.selectedCharacter.img;
    document.getElementById('podium-name-1').innerText = playerName;

    gameState.participants.push({ name: playerName, char: gameState.selectedCharacter.img });
    switchView('view-student-lobby');
}

/* --- LOGIK UPLOAD GAMBAR DARI FOLDER --- */
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal 5MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        tempBase64Image = e.target.result;
        displayImagePreview(tempBase64Image, file.name);
    };
    reader.readAsDataURL(file);
}

function displayImagePreview(src, filename) {
    const previewBox = document.getElementById('q-preview-container');
    const previewImg = document.getElementById('q-preview-img');
    const label = document.getElementById('q-file-name-label');

    previewImg.src = src;
    previewBox.classList.remove('hidden');
    label.innerText = filename || 'Gambar terpilih';
    label.classList.remove('text-slate-400');
    label.classList.add('text-emerald-400', 'font-semibold');
}

function removeSelectedImage() {
    tempBase64Image = '';
    document.getElementById('q-input-file').value = '';
    document.getElementById('q-preview-container').classList.add('hidden');
    document.getElementById('q-preview-img').src = '';
    
    const label = document.getElementById('q-file-name-label');
    label.innerText = 'Belum ada gambar dipilih';
    label.classList.remove('text-emerald-400', 'font-semibold');
    label.classList.add('text-slate-400');
}

/* --- LOGIK KELOLA SOAL DINAMIS GURU --- */
function renderQuestionList() {
    const subj = document.getElementById('teacher-subject-select').value;
    const cls = document.getElementById('teacher-class-select').value;
    const container = document.getElementById('teacher-question-list');

    const filtered = QUESTION_BANK.filter(q => q.subject === subj && q.class === cls);
    document.getElementById('question-count-badge').innerText = filtered.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-xs text-slate-500 text-center py-6 italic">Belum ada soal untuk kategori ini...</div>`;
        return;
    }

    container.innerHTML = '';
    filtered.forEach((q, idx) => {
        const item = document.createElement('div');
        item.className = "bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center text-xs gap-3";
        item.innerHTML = `
            <div class="flex-1 pr-2">
                <div class="font-bold text-slate-200 mb-1 flex items-center gap-2">
                    <span>${idx + 1}. ${q.question}</span>
                    ${q.image ? '<span class="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">🖼️ Ada Gambar</span>' : ''}
                </div>
                <div class="text-[11px] text-slate-400">Kunci: <span class="text-emerald-400 font-bold">${q.answer}</span> | A: ${q.options.A} | B: ${q.options.B}</div>
            </div>
            <div class="flex items-center gap-1.5">
                <button onclick="editQuestion(${q.id})" class="p-2 bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 rounded-xl border border-amber-500/30" title="Edit Soal">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="deleteQuestion(${q.id})" class="p-2 bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 rounded-xl border border-rose-500/30" title="Hapus Soal">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

function openQuestionModal(editId = null) {
    document.getElementById('q-edit-id').value = editId || '';
    document.getElementById('modal-q-title').innerText = editId ? 'EDIT SOAL' : 'TAMBAH SOAL BARU';

    removeSelectedImage();

    if (editId) {
        const q = QUESTION_BANK.find(item => item.id === editId);
        if (q) {
            document.getElementById('q-input-question').value = q.question;
            document.getElementById('q-input-optA').value = q.options.A;
            document.getElementById('q-input-optB').value = q.options.B;
            document.getElementById('q-input-optC').value = q.options.C;
            document.getElementById('q-input-optD').value = q.options.D;
            document.getElementById('q-input-answer').value = q.answer;
            document.getElementById('q-input-discussion').value = q.discussion || '';
            
            if (q.image) {
                tempBase64Image = q.image;
                displayImagePreview(q.image, 'Gambar Lampiran Terpasang');
            }
        }
    } else {
        document.getElementById('q-input-question').value = '';
        document.getElementById('q-input-optA').value = '';
        document.getElementById('q-input-optB').value = '';
        document.getElementById('q-input-optC').value = '';
        document.getElementById('q-input-optD').value = '';
        document.getElementById('q-input-answer').value = 'A';
        document.getElementById('q-input-discussion').value = '';
    }

    openModal('modal-question');
}

function saveQuestion() {
    const editId = document.getElementById('q-edit-id').value;
    const question = document.getElementById('q-input-question').value.trim();
    const optA = document.getElementById('q-input-optA').value.trim();
    const optB = document.getElementById('q-input-optB').value.trim();
    const optC = document.getElementById('q-input-optC').value.trim();
    const optD = document.getElementById('q-input-optD').value.trim();
    const answer = document.getElementById('q-input-answer').value;
    const discussion = document.getElementById('q-input-discussion').value.trim();

    const subj = document.getElementById('teacher-subject-select').value;
    const cls = document.getElementById('teacher-class-select').value;

    if (!question || !optA || !optB || !optC || !optD) {
        alert('Mohon isi soal dan semua pilihan jawaban!');
        return;
    }

    if (editId) {
        const q = QUESTION_BANK.find(item => item.id == editId);
        if (q) {
            q.question = question;
            q.image = tempBase64Image;
            q.options = { A: optA, B: optB, C: optC, D: optD };
            q.answer = answer;
            q.discussion = discussion;
        }
    } else {
        const newId = Date.now();
        QUESTION_BANK.push({
            id: newId,
            subject: subj,
            class: cls,
            question: question,
            image: tempBase64Image,
            options: { A: optA, B: optB, C: optC, D: optD },
            answer: answer,
            discussion: discussion
        });
    }

    closeModal('modal-question');
    renderQuestionList();
}

function editQuestion(id) {
    playClickSound();
    openQuestionModal(id);
}

function deleteQuestion(id) {
    playClickSound();
    if (confirm('Yakin ingin menghapus soal ini?')) {
        QUESTION_BANK = QUESTION_BANK.filter(q => q.id !== id);
        renderQuestionList();
    }
}

function createRoom() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    gameState.roomCode = code;
    gameState.isHost = true;
    gameState.participants = [];
    gameState.correctCount = 0;
    gameState.wrongCount = 0;

    gameState.selectedClass = document.getElementById('teacher-class-select').value;
    gameState.selectedSubject = document.getElementById('teacher-subject-select').value;

    gameState.activeQuestions = QUESTION_BANK.filter(q => q.subject === gameState.selectedSubject && q.class === gameState.selectedClass);
    if (gameState.activeQuestions.length === 0) {
        alert('Belum ada soal untuk mata pelajaran dan kelas ini! Menampilkan semua soal default.');
        gameState.activeQuestions = QUESTION_BANK;
    }

    document.getElementById('teacher-room-code-display').innerText = code;
    document.getElementById('host-subj-label').innerText = gameState.selectedSubject;
    document.getElementById('host-class-label').innerText = gameState.selectedClass;

    renderTeacherParticipants();
    switchView('view-teacher-lobby');
}

function renderTeacherParticipants() {
    const listContainer = document.getElementById('teacher-participant-list');
    document.getElementById('participant-count').innerText = gameState.participants.length;

    if (gameState.participants.length === 0) {
        listContainer.innerHTML = `<div class="col-span-full text-xs text-slate-500 italic">Belum ada peserta bergabung...</div>`;
        return;
    }

    listContainer.innerHTML = '';
    gameState.participants.forEach(p => {
        const badge = document.createElement('div');
        badge.className = "flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 cursor-pointer";
        badge.onclick = (e) => triggerTouchReaction(e, badge);
        badge.innerHTML = `
            <div class="relative w-7 h-7 flex-shrink-0">
                <img src="${p.char}" class="w-full h-full object-contain anim-idle">
                <div id="reaction-container-badge"></div>
            </div>
            <span class="font-fredoka text-xs font-semibold text-slate-200 truncate">${p.name}</span>
        `;
        listContainer.appendChild(badge);
    });
}

function startQuizByTeacher() {
    document.getElementById('tv-room-code').innerText = gameState.roomCode;
    switchView('view-tv-display');
    updateTVScoreDisplay();
    loadQuestion(0);

    if (gameState.playerName) {
        setTimeout(() => { switchView('view-student-controller'); }, 500);
    }
}

function loadQuestion(idx) {
    gameState.currentQuestionIdx = idx;
    gameState.hasAnswered = false;
    gameState.selectedOption = null;
    const q = gameState.activeQuestions[idx % gameState.activeQuestions.length];

    document.getElementById('tv-question-idx').innerText = idx + 1;
    document.getElementById('tv-question-total').innerText = gameState.activeQuestions.length;
    document.getElementById('tv-subject-badge').innerText = `${q.subject} - Kelas ${q.class} SD`;
    document.getElementById('tv-question-text').innerText = q.question;
    document.getElementById('tv-text-A').innerText = q.options.A;
    document.getElementById('tv-text-B').innerText = q.options.B;
    document.getElementById('tv-text-C').innerText = q.options.C;
    document.getElementById('tv-text-D').innerText = q.options.D;
    document.getElementById('tv-discussion-text').innerText = q.discussion || 'Tidak ada pembahasan.';

    const imgBox = document.getElementById('tv-image-container');
    const imgEl = document.getElementById('tv-question-image');
    if (q.image && q.image.trim() !== '') {
        imgEl.src = q.image;
        imgBox.classList.remove('hidden');
    } else {
        imgBox.classList.add('hidden');
    }

    document.getElementById('tv-discussion-box').classList.add('hidden');
    document.getElementById('btn-next-question').classList.add('hidden');

    const btns = document.querySelectorAll('.ctrl-btn');
    btns.forEach(b => b.classList.remove('opacity-40', 'pointer-events-none'));
    document.getElementById('ctrl-feedback').innerHTML = `Pilih salah satu tombol di atas!`;

    startTimer();
}

function startTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timer = 20;
    updateTimerUI();

    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        updateTimerUI();

        if (gameState.timer <= 0) {
            clearInterval(gameState.timerInterval);
            playBeep(220, 'sine', 0.4);
            onTimeOut();
        }
    }, 1000);
}

function updateTimerUI() {
    const num = document.getElementById('tv-timer-num');
    if (num) num.innerText = gameState.timer;
}

function updateTVScoreDisplay() {
    const correctEl = document.getElementById('tv-score-correct');
    const wrongEl = document.getElementById('tv-score-wrong');
    if (correctEl) correctEl.innerText = gameState.correctCount;
    if (wrongEl) wrongEl.innerText = gameState.wrongCount;
}

function sendAnswer(option) {
    if (gameState.hasAnswered) return;
    gameState.hasAnswered = true;
    gameState.selectedOption = option;
    playSuccessSound();

    const btns = document.querySelectorAll('.ctrl-btn');
    btns.forEach(b => b.classList.add('opacity-40', 'pointer-events-none'));

    document.getElementById('ctrl-feedback').innerHTML = `
        <span class="text-emerald-400 font-fredoka font-bold">Jawaban (${option}) Terkirim!</span>
    `;
}

function onTimeOut() {
    document.getElementById('tv-discussion-box').classList.remove('hidden');
    document.getElementById('btn-next-question').classList.remove('hidden');

    const q = gameState.activeQuestions[gameState.currentQuestionIdx % gameState.activeQuestions.length];
    const optEl = document.getElementById(`tv-opt-${q.answer}`);
    if (optEl) optEl.classList.add('ring-2', 'ring-amber-400', 'bg-amber-400/30');

    if (gameState.selectedOption !== null) {
        if (gameState.selectedOption === q.answer) {
            gameState.correctCount++;
            document.getElementById('ctrl-feedback').innerHTML = `
                <span class="text-emerald-400 font-fredoka font-bold">Jawaban Terkirim!</span>
            `;
        } else {
            gameState.wrongCount++;
            document.getElementById('ctrl-feedback').innerHTML = `
                <span class="text-emerald-400 font-fredoka font-bold">Jawaban Terkirim!</span>
            `;
        }
    } else {
        gameState.wrongCount++;
        document.getElementById('ctrl-feedback').innerHTML = `
            <span class="text-amber-400 font-fredoka font-bold">⏰ Waktu Habis!</span>
        `;
    }
    updateTVScoreDisplay();
}

function nextQuestion() {
    ['A','B','C','D'].forEach(opt => {
        const el = document.getElementById(`tv-opt-${opt}`);
        if (el) el.classList.remove('ring-2', 'ring-amber-400', 'bg-amber-400/30');
    });

    if (gameState.currentQuestionIdx + 1 < gameState.activeQuestions.length) {
        loadQuestion(gameState.currentQuestionIdx + 1);
    } else {
        showPodium();
    }
}

function showPodium() {
    document.getElementById('summary-total').innerText = gameState.activeQuestions.length;
    document.getElementById('summary-correct').innerText = gameState.correctCount;
    document.getElementById('summary-wrong').innerText = gameState.wrongCount;

    switchView('view-podium');
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    playSuccessSound();
}

function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('hidden');
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('hidden');
}

window.onload = () => {
    renderCharacterGrid();
    updateSelectedCharacterUI();
};