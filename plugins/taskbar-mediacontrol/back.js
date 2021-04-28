const getSongControls = require('../../providers/song-controls');
const getSongInfo = require('../../providers/song-info');
const path = require('path');

let controls;
let currentSongInfo;

module.exports = win => {
	const registerCallback = getSongInfo(win);
	const { playPause, next, previous } = getSongControls(win);
	controls = { playPause, next, previous }

	registerCallback(songInfo => {
		//update currentsonginfo for win.on('show')
		currentSongInfo = songInfo;
		// update thumbar
		setThumbar(win, songInfo)
	});

	// need to set thumbar again after win.show 
	win.on("show", () => {
		if (currentSongInfo) {
			setThumbar(win, currentSongInfo)
		}
	})
};

function setThumbar(win, songInfo) {
	// Wait for song to start before setting thumbar
	if (!songInfo.title) {
		return;
	}

	// Win32 require full rewrite of components
	win.setThumbarButtons([
		{
			tooltip: 'Previous',
			icon: get('backward.png'),
			click() { controls.previous(win.webContents); }
		}, {
			tooltip: 'Play/Pause',
			// Update icon based on play state
			icon: songInfo.isPaused ? get('play.png') : get('pause.png'),
			click() { controls.playPause(win.webContents); }
		}, {
			tooltip: 'Next',
			icon: get('forward.png'),
			click() { controls.next(win.webContents); }
		}
	]);
}

// Util
function get(file) {
	return path.join(__dirname, "assets", file);
}
