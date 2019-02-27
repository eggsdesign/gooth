const takePhotoButton = document.querySelector('#btn-take-photo');
const makeGIFButton = document.querySelector('#btn-make-gif')
const discardButton = document.querySelector('#btn-discard-gif')
const uploadButton = document.getElementById('btn-upload')

const imageBuffer = document.querySelector('#image-buffer')
const imgGIF = document.querySelector('#image-gif')
const cameraCapture = document.querySelector('#camera-capture')
const resultOverlay = document.querySelector('#result-overlay')

const inputFrames = document.querySelector('#input-frames')
const inputInterval = document.querySelector('#input-interval')

const canvas = document.querySelector('#canvas-stream')
const context = canvas.getContext('2d')

let imageCapture
let gif
let gifSrc = ""

let settings = {
	frames: 10,
	interval: 500,
}

initialize = ()=>{
	gif = new GIF({
		workers: 2,
		quality: 10
	})

	imageBuffer.innerHTML = ""
	resultOverlay.classList.add('hidden')

	document.querySelectorAll('.flash').forEach((flash, key) => {
		flash.remove()
	})

	inputFrames.value = settings.frames
	inputInterval.value = settings.interval
}

// Check if image capture is allowed on this device
navigator.mediaDevices.getUserMedia({video: true})
  .then(mediaStream => {
		cameraCapture.srcObject = mediaStream;
		
    const track = mediaStream.getVideoTracks()[0];
		imageCapture = new ImageCapture(track);

		canvas.width = 640
		canvas.height = 480
		
		setInterval(() => {
			context.filter = 'grayscale(1) brightness(0.9) contrast(1.1)'
			context.drawImage(cameraCapture,0,0)
		}, 20);
	})
	
function takePhoto() {
	const flash = document.createElement('div')
	document.querySelector('#flash-container').append(flash)
	flash.classList.add('flash')

	const image = document.createElement('img')
	const thumbnail = document.createElement('img')

	image.height = canvas.height
	image.width = canvas.width

	var captureUrl = canvas.toDataURL()

	thumbnail.src = captureUrl
	image.src = captureUrl

	imageBuffer.append(image)
}

function takePhotos(counter, interval){
	var i = 0;
	let photoInterval = setInterval(() => {
		if (i >= counter) {
			clearInterval(photoInterval)
		} else {
			takePhoto()
			i++;
		}
	}, interval);
}

function makeGif() {
	for (var i=0; i<imageBuffer.childElementCount; i++) {
		gif.addFrame(imageBuffer.childNodes[i])
	}

	gif.on('finished', function(blob) {
		imgGIF.src = URL.createObjectURL(blob)
		gifSrc = imgGIF.src
		resultOverlay.classList.remove('hidden')
	});

	gif.render()
}

// Button events
takePhotoButton.onclick = ()=>{ 
	takePhotos(settings.frames, settings.interval) 
}

makeGIFButton.onclick = ()=>{ 
	takePhotos(settings.frames, settings.interval)

	setTimeout(() => {
		makeGif() 
	}, settings.frames * settings.interval);
}

discardButton.onclick = ()=>{ 
	initialize()
}

uploadButton.onclick = ()=>{
	if (gifSrc !== ""){
		upload(gifSrc)
	}
}

// To set settings in UI
inputFrames.onchange = (e)=>{
	settings.frames = inputFrames.value
}

inputInterval.onchange = (e)=>{
	settings.interval = inputInterval.value
}

// Upload GIF
const upload = (file) => {
  fetch('http://httpbin.org/get', { 
		method: 'GET', 
		body: file
	}).then(
		response => response
  ).then(
    success => console.log(success)
  ).catch(
    error => console.log(error)
  );
};

// Init app on load
initialize()