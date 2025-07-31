// 🎵 Playlist
const songs = [
  { title: "FearSong[TELUGU]", artist: "Anirudh Ravichander", file: "song1.mp3", cover: "song1.jpg", lyrics: "song1.txt" },
  { title: "Yahoon Yahoon", artist: "Milka Singh", file: "song2.mp3", cover: "song2.jpg", lyrics: "song2.txt" },
  { title: "Akasam Badalaina", artist: "Devi Sri Prasad", file: "song3.mp3", cover: "song3.jpg", lyrics: "song3.txt" },
  { title: "Sahiba", artist: "Aditya Rikhari", file: "song4.mp3", cover: "song4.jpg", lyrics: "song4.txt" },
  { title: "HanumanDa'Damdaar", artist: "Sneha Khanwalkar", file: "song5.mp3", cover: "song5.jpg", lyrics: "song5.txt" },
  { title: "Sita Kalyanam", artist: "Renuka Arun, Sooraj S.kurup", file: "song6.mp3", cover: "song6.jpg", lyrics: "song6.txt" },
  { title: "Yaen Ennai Pirindhaai", artist: "Sid Sriram", file: "song7.mp3", cover: "song7.jpg", lyrics: "song7.txt" },
  { title: "Ooh Aah(My Life Be Like)", artist: "Grits, Toby Mac", file: "song8.mp3", cover: "song8.jpg", lyrics: "song8.txt" },
  { title: "Summertime Sadness", artist: "Lana Del Rey", file: "song9.mp3", cover: "song9.jpg", lyrics: "song9.txt" },
  { title: "My Heart Goes(LaDiDa)", artist: "Becky Hill, Topic", file: "song10.mp3", cover: "song10.jpg", lyrics: "song10.txt" }
];

// 🔧 State
let currentIndex = 0;
let isPlaying = false;
let lyricsMap = [];
let userIsScrolling = false;
let scrollTimeout;
const scrollLockBtn = document.getElementById("scrollLockBtn");
let autoScrollEnabled = true;

// 📦 DOM Elements
const audio = new Audio();
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const lyricsBox = document.getElementById("lyrics");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const downloadBtn = document.getElementById("downloadBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const miniPlayerBtn = document.getElementById("miniPlayerBtn");
const playerContainer = document.getElementById("playerContainer");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

// 🖱 Scroll Detection
lyricsBox.addEventListener("scroll", () => {
  userIsScrolling = true;
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => (userIsScrolling = false), 3000);
});
scrollLockBtn.addEventListener("click", () => {
  autoScrollEnabled = !autoScrollEnabled;
  scrollLockBtn.innerHTML = autoScrollEnabled
    ? `<i class="fas fa-lock-open"></i>`
    : `<i class="fas fa-lock"></i>`;
});

// 🎧 Load Song
function loadSong(index) {
  const song = songs[index];
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = `images/${song.cover}`;
  audio.src = `songs/${song.file}`;
  downloadBtn.href = `songs/${song.file}`;
  progressBar.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  loadLyrics(song.lyrics);
}

// 📝 Load & Parse Lyrics
function loadLyrics(file) {
  fetch(`lyrics/${file}`)
    .then(res => res.text())
    .then(data => {
      lyricsBox.innerHTML = "";
      lyricsMap = [];
      const lines = data.split("\n");
      lines.forEach(line => {
        const match = line.match(/\[(\d{2}):(\d{2}\.\d{1,2})\](.*)/);
        if (match) {
          const time = parseInt(match[1]) * 60 + parseFloat(match[2]);
          const text = match[3].trim();
          const el = document.createElement("div");
          el.className = "lyrics-line";
          el.dataset.time = time;
          el.innerHTML = text
            .split(" ")
            .map((w, i) => `<span class="word" data-i="${i}">${w}</span>`)
            .join(" ");
          lyricsBox.appendChild(el);
          lyricsMap.push({ time, element: el });
        }
      });
    })
    .catch(() => {
      lyricsBox.innerHTML = "<div class='lyrics-line'>Lyrics not available</div>";
    });
}

// 🔁 Highlight + Progress Update
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progressPercent;
  progressBar.style.background = `linear-gradient(to right, #ff4081 ${progressPercent}%, #fff ${progressPercent}%)`;

  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);

  for (let i = 0; i < lyricsMap.length; i++) {
    const { time, element } = lyricsMap[i];
    const nextTime = lyricsMap[i + 1]?.time || Infinity;

    if (audio.currentTime >= time && audio.currentTime < nextTime) {
      document.querySelectorAll(".lyrics-line").forEach(el => el.classList.remove("active"));
      element.classList.add("active");

      if (!userIsScrolling && autoScrollEnabled && audio.currentTime > 0.5) {

        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      const words = element.querySelectorAll(".word");
      words.forEach(w => w.classList.remove("highlighted"));
      const wordDuration = (nextTime - time) / words.length;
      const wordIndex = Math.floor((audio.currentTime - time) / wordDuration);
      if (words[wordIndex]) words[wordIndex].classList.add("highlighted");
      break;
    }
  }
});

// 📌 Time Format
function formatTime(sec) {
  const min = Math.floor(sec / 60);
  const secStr = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${min}:${secStr}`;
}

// ▶️ Controls
function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = `<i class="fas fa-play"></i>`;
}

function togglePlay() {
  isPlaying ? pauseSong() : playSong();
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    playerContainer.requestFullscreen().catch(err => console.log(err));
  } else {
    document.exitFullscreen();
  }
}

function toggleMiniPlayer() {
  playerContainer.classList.toggle("mini");
}

// 🎛 Progress Bar Control
progressBar.addEventListener("input", () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// 🎯 Event Listeners
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
fullscreenBtn.addEventListener("click", toggleFullscreen);
miniPlayerBtn.addEventListener("click", toggleMiniPlayer);
audio.addEventListener("ended", nextSong);

// 🚀 Start
loadSong(currentIndex);
