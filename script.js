/*

const testRecording = document.querySelector('#test-recording');

const testRecordingContent = document.querySelector('#test-recording-content');

testRecording.addEventListener('click', e => {
	e.preventDefault();

	const testRecordingBox = new WinBox({
		title: 'TEST RECORDING',
		background: '#00aa00',
		width: '400px',
		height: '400px',
		top: '50',
		right: '50',
		bottom: '50',
		left: '50',
		mount: testRecordingContent,
	});
});
*/
// Dynamicaly download data needed

async function LoadRecordings() {
	const recordingsList = await fetch('./data/recordings.json');
	return await recordingsList.json();
}

const isMobile = window.matchMedia(
	'only screen and (max-width: 760px)',
).matches;
console.log(isMobile);

const main = document.getElementsByClassName('hidden')[0];
const recordingList = document.getElementById('recording-list');
const theme = document.getElementById('theme');
const root = document.querySelector(':root');
const settingsButton = document.getElementById('settingsButton');
const settings = document.getElementById('settings');
const linksButton = document.getElementById('linksButton');
const links = document.getElementById('links');
linksButton.addEventListener('click', e => {
	e.preventDefault();

	const creditsBox = new WinBox({
		title: 'LINKS',
		background: 'var(--text-color)',
		modal: true,
		mount: links,
	});
});
settingsButton.addEventListener('click', e => {
	e.preventDefault();

	const settingsBox = new WinBox({
		title: 'SETTINGS',
		background: 'var(--text-color)',
		modal: true,
		mount: settings,
	});
});
if (localStorage.getItem('theme')) {
	root.style.setProperty('--text-color', localStorage.getItem('theme'));
	theme.value = localStorage.getItem('theme');
}
theme.addEventListener('change', e => {
	e.preventDefault();
	localStorage.setItem('theme', e.target.value);
	root.style.setProperty('--text-color', e.target.value);
});

async function Script() {
	let recordings = await LoadRecordings();
	recordings.reverse();
	recordings.forEach(recording => {
		const recordingDom = document.createElement('div');
		recordingDom.classList = ['recording'];

		const title = document.createElement('span');
		title.textContent = recording.title;
		recordingDom.appendChild(title);

		if (recording.tags) {
			let tags = document.createElement('div');
			tags.classList = ['tags'];

			recording.tags.forEach(tagJson => {
				let tag = document.createElement('div');
				tag.classList = ['tag'];
				let tagContent = document.createElement('span');
				tagContent.classList = ['content'];
				let tagSymbol = document.createElement('img');
				tagSymbol.classList = ['symbol'];
				switch (tagJson.type) {
					case 'info':
						tagSymbol.src = './symbols/info.svg';
						tagSymbol.classList = ['info'];
						break;
					case 'warning':
						tagSymbol.src = './symbols/warning.svg';
						tagSymbol.classList = ['warning'];
						break;
					default:
						tagSymbol.src = './symbols/info.svg';
						tagSymbol.classList = ['info'];
						break;
				}
				tagContent.innerText = tagJson.content;
				tag.appendChild(tagSymbol);
				tag.appendChild(tagContent);
				tags.appendChild(tag);
			});
			recordingDom.appendChild(tags);
		}

		const downloadLink = document.createElement('a');
		downloadLink.href = `audio/${recording.audio.path}`;
		downloadLink.download = recording.title;
		downloadLink.innerText = 'Download';
		recordingDom.appendChild(downloadLink);

		const audioPlayer = document.createElement('audio');
		audioPlayer.controls = true;
		audioPlayer.src = `audio/${recording.audio.path}`;
		recordingDom.appendChild(audioPlayer);

		const timestamp = document.createElement('span');
		timestamp.classList = ['timestamp'];
		timestamp.textContent = recording.timestamp;
		recordingDom.appendChild(timestamp);

		if (recording.speakers) {
			const speakersTitle = document.createElement('span');
			speakersTitle.textContent = 'Speakers';
			recordingDom.appendChild(speakersTitle);

			const speakersList = document.createElement('dir');
			speakersList.classList = ['speakers'];

			recording.speakers.forEach(speaker => {
				const speakerDom = document.createElement('dir');
				speakerDom.classList = ['speaker'];
				const speakerAvatar = document.createElement('img');
				speakerAvatar.src = `avatars/${speaker.avatar}`;
				speakerAvatar.alt = `${speaker.name}'s Avatar`;
				speakerDom.appendChild(speakerAvatar);

				const speakerName = document.createElement('span');
				speakerName.innerText = speaker.name;

				speakerDom.appendChild(speakerName);

				speakersList.appendChild(speakerDom);
			});

			recordingDom.appendChild(speakersList);
		}

		main.appendChild(recordingDom);
		const recordingListItem = document.createElement('li');
		recordingListItem.innerText = recording.title;

		recordingListItem.addEventListener('click', e => {
			e.preventDefault();
			new WinBox({
				title: recording.title,
				background: 'var(--text-color)',
				width: '700px',
				height: '400px',
				top: '50',
				right: '50',
				bottom: '50',
				left: '50',
				mount: recordingDom.cloneNode(true),
				modal: isMobile,
			});
		});

		recordingList.appendChild(recordingListItem);
	});
}

Script();
