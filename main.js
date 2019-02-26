const takePhotoButton = document.querySelector('#btn-take-photo');
const makeGIFButton = document.querySelector('#btn-make-gif')
const discardButton = document.querySelector('#btn-discard-gif')
const uploadButton = document.getElementById('btn-upload')

const imageBuffer = document.querySelector('#image-buffer')
const imageRoll = document.querySelector('#image-roll')
const imgGIF = document.querySelector('#image-gif')
const cameraCapture = document.querySelector('#camera-capture')
const resultOverlay = document.querySelector('#result-overlay')


const canvas = document.querySelector('#canvas-stream')
const context = canvas.getContext('2d')

let imageCapture
let gif
let gifSrc = ""

initialize = ()=>{
	gif = new GIF({
		workers: 2,
		quality: 10
	})

	imageBuffer.innerHTML = ""
	imageRoll.innerHTML = ""
	imageRoll.classList.add('hidden')
	resultOverlay.classList.add('hidden')

	document.querySelectorAll('.flash').forEach((flash, key) => {
		flash.remove()
	})
}

initialize()

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
	// imageRoll.prepend(thumbnail)
	// imageRoll.classList.remove('hidden')
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

takePhotoButton.onclick = ()=>{ 
	takePhotos(10, 500) 
}

makeGIFButton.onclick = ()=>{ 
	takePhotos(10, 500)

	setTimeout(() => {
		makeGif() 
	}, 10 * 500);
}

discardButton.onclick = ()=>{ 
	initialize()
}

uploadButton.onclick = ()=>{
	if (gifSrc !== ""){
		upload(gifSrc)
	}
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