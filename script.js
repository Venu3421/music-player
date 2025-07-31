// Sample playlist (replace with your real song names)
const songs = [
  {
    title: "FearSong[TELUGU]",
    artist: "Anirudh Ravichander",
    file: "song1.mp3",
    cover: "song1.jpg",
    lyrics: "song1.txt",
  },
  {
    title: "Yahoon Yahoon",
    artist: "Milka Singh",
    file: "song2.mp3",
    cover: "song2.jpg",
    lyrics: "song2.txt",
  },
  {
    title: "Akasam Badalaina",
    artist: "Devi Sri Prasad",
    file: "song3.mp3",
    cover: "song3.jpg",
    lyrics: "song3.txt",
  },
  {
    title: "Sahiba",
    artist: "Aditya Rikhari",
    file: "song4.mp3",
    cover: "song4.jpg",
    lyrics: "song4.txt",
  },
  {
    title: "HanumanDa'Damdaar",
    artist: "Sneha Khanwalkar",
    file: "song5.mp3",
    cover: "song5.jpg",
    lyrics: "song5.txt",
  },
  {
    title: "Sita Kalyanam",
    artist: "Renuka Arun,Sooraj S.kurup",
    file: "song6.mp3",
    cover: "song6.jpg",
    lyrics: "song6.txt",
  },
  {
    title: "Yaen Ennai Pirindhaai",
    artist: "Sid Sriram",
    file: "song7.mp3",
    cover: "song7.jpg",
    lyrics: "song7.txt",
  },
  {
    title: "Ooh Aah(My Life Be Like)",
    artist: "Grits,Toby Mac",
    file: "song8.mp3",
    cover: "song8.jpg",
    lyrics: "song8.txt",
  },
  {
    title: "Summertime Sadness",
    artist: "Lana Del Rey",
    file: "song9.mp3",
    cover: "song9.jpg",
    lyrics: "song9.txt",
  },
  {
    title: "My Heart Goes(LaDiDa)",
    artist: "Becky Hill,Topic",
    file: "song10.mp3",
    cover: "song10.jpg",
    lyrics: "song10.txt",
  }
];

let currentIndex = 0;
let isPlaying = false;
let lyricsScrollInterval;

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

//audio.addEventListener("timeupdate", () => {
  //if (!audio.duration) return;
  //progressBar.value = (audio.currentTime / audio.duration) * 100;

  // Update times
  //currentTimeEl.textContent = formatTime(audio.currentTime);
  //durationEl.textContent = formatTime(audio.duration);
//});

progressBar.addEventListener("input", () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}


function loadSong(index) {
  const song = songs[index];
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = `images/${song.cover}`;
  audio.src = `songs/${song.file}`;
  downloadBtn.href = `songs/${song.file}`;
  loadLyrics(song.lyrics);
  progressBar.value = 0;
currentTimeEl.textContent = "0:00";
durationEl.textContent = "0:00";


}

function loadLyrics(file) {
  fetch(`lyrics/${file}`)
    .then((res) => res.text())
    .then((data) => {
      lyricsBox.textContent = data;
    })
    .catch(() => {
      lyricsBox.textContent = "Lyrics not available.";
    });
}




function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.innerHTML = `<i class="fas fa-pause"></i>`;

  clearInterval(lyricsScrollInterval); // clear old interval if any

  // Scroll lyrics every 100ms by 1px
  lyricsScrollInterval = setInterval(() => {
    if (lyricsBox.scrollTop < lyricsBox.scrollHeight - lyricsBox.clientHeight) {
      lyricsBox.scrollTop += 1;
    }
  }, 100);
}



function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = `<i class="fas fa-play"></i>`;
  clearInterval(lyricsScrollInterval);
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
    playerContainer.requestFullscreen().catch((err) => console.log(err));
  } else {
    document.exitFullscreen();
  }
}

function toggleMiniPlayer() {
  playerContainer.classList.toggle("mini");
}

// Event Listeners
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
fullscreenBtn.addEventListener("click", toggleFullscreen);
miniPlayerBtn.addEventListener("click", toggleMiniPlayer);

// Auto next on end
audio.addEventListener("ended", nextSong);

// Initialize first song
loadSong(currentIndex);
