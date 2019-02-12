const takePhotoButton = document.querySelector('#btn-take-photo');
const makeGIFButton = document.querySelector('#btn-make-gif')
const discardButton = document.querySelector('#btn-discard-gif')
const imageBuffer = document.querySelector('#image-buffer')
const imageRoll = document.querySelector('#image-roll')
const imgGIF = document.querySelector('#image-gif')
const cameraCapture = document.querySelector('#camera-capture')
const resultOverlay = document.querySelector('#result-overlay')
const canvas = document.querySelector('#canvas-stream')
const context = canvas.getContext('2d')
let imageCapture
var gif = new GIF({
	workers: 2,
	quality: 10
});

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
	document.querySelector('.app-frame').append(flash)
	flash.classList.add('flash')

	const image = document.createElement('img')
	const thumbnail = document.createElement('img')

	image.height = canvas.height
	image.width = canvas.width

	var captureUrl = canvas.toDataURL()

	thumbnail.src = captureUrl
	image.src = captureUrl

	imageBuffer.append(image)
	imageRoll.prepend(thumbnail)
	imageRoll.classList.remove('hidden')
}

function makeGif() {
	for (var i=0; i<imageBuffer.childElementCount; i++) {
		gif.addFrame(imageBuffer.childNodes[i])
	}

	gif.on('finished', function(blob) {
		imgGIF.src = URL.createObjectURL(blob)
		resultOverlay.classList.remove('hidden')
	});

	gif.render()
}

takePhotoButton.onclick = takePhoto
makeGIFButton.onclick = makeGif
discardButton.onclick = ()=>{ location.reload() }