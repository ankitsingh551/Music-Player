// music-player.js
// Music data
const songs = [
    {
        title: "Blinding Lights",
        artist: "The Weeknd",
        src: "https://cdn.pixabay.com/download/audio/2022/01/20/audio_d16713f383.mp3?filename=the-weeknd-blinding-lights.mp3",
        cover: "https://placehold.co/300x300/4a6cf7/white?text=Blinding+Lights"
    },
    {
        title: "Save Your Tears",
        artist: "The Weeknd",
        src: "https://cdn.pixabay.com/download/audio/2022/03/19/audio_5b5d3e5c2c.mp3?filename=the-weeknd-save-your-tears.mp3",
        cover: "https://placehold.co/300x300/6f42c1/white?text=Save+Your+Tears"
    },
    {
        title: "Stay",
        artist: "The Kid LAROI, Justin Bieber",
        src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_345c531f9c.mp3?filename=stay-157100.mp3",
        cover: "https://placehold.co/300x300/1d2144/white?text=Stay"
    },
    {
        title: "Heat Waves",
        artist: "Glass Animals",
        src: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_7b607246f3.mp3?filename=heat-waves-15085.mp3",
        cover: "https://placehold.co/300x300/667eea/white?text=Heat+Waves"
    },
    {
        title: "Shape of You",
        artist: "Ed Sheeran",
        src: "https://cdn.pixabay.com/download/audio/2021/10/25/audio_7b607246f3.mp3?filename=shape-of-you-15085.mp3",
        cover: "https://placehold.co/300x300/764ba2/white?text=Shape+of+You"
    }
];

// DOM Elements
const audioPlayer = document.getElementById('audio-player');
const albumArt = document.getElementById('album-art');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const progress = document.getElementById('progress');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const volumeSlider = document.getElementById('volume');
const playlistItems = document.getElementById('playlist-items');
const albumArtContainer = document.querySelector('.album-art');

// Player state
let currentSongIndex = 0;
let isPlaying = false;

// Initialize player
function initPlayer() {
    loadSong(currentSongIndex);
    renderPlaylist();
    
    // Set volume
    audioPlayer.volume = volumeSlider.value;
    
    // Event listeners
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    volumeSlider.addEventListener('input', setVolume);
    progressBar.addEventListener('click', setProgress);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
    audioPlayer.addEventListener('loadedmetadata', updateTotalTime);
}

// Load song
function loadSong(index) {
    const song = songs[index];
    audioPlayer.src = song.src;
    albumArt.src = song.cover;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    
    // Update active song in playlist
    const playlistItems = document.querySelectorAll('#playlist-items li');
    playlistItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    });
}

// Toggle play/pause
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Play song
function playSong() {
    isPlaying = true;
    audioPlayer.play();
    playBtn.classList.add('playing');
    albumArtContainer.classList.add('playing');
}

// Pause song
function pauseSong() {
    isPlaying = false;
    audioPlayer.pause();
    playBtn.classList.remove('playing');
    albumArtContainer.classList.remove('playing');
}

// Previous song
function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Next song
function nextSong() {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Set volume
function setVolume() {
    audioPlayer.volume = volumeSlider.value;
}

// Set progress
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

// Update progress
function updateProgress() {
    const { currentTime, duration } = audioPlayer;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // Update current time
    currentTimeEl.textContent = formatTime(currentTime);
}

// Update total time
function updateTotalTime() {
    totalTimeEl.textContent = formatTime(audioPlayer.duration);
}

// Format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Render playlist
function renderPlaylist() {
    playlistItems.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="song-number">${index + 1}</span>
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="artist-name">${song.artist}</div>
            </div>
        `;
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
        playlistItems.appendChild(li);
    });
    
    // Set first song as active
    if (playlistItems.firstChild) {
        playlistItems.firstChild.classList.add('playing');
    }
}

// Initialize player when page loads
window.addEventListener('load', initPlayer);