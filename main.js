const takePhotoButton = document.querySelector('#btn-take-photo')
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

const TOKEN = 'skAoaUQ8j2BnjwBiVxIyLO3PskWXSkw4zCwGWoYoNb2qkcnjhwL1bcRaqspBU5lBtjDg0nuKDLQhx9avboSaHfHhvmXLAlXPxARc0PmKHhMOsCGQQ4lY5oCdob1fnq4lta4wLDMEyV8BTpy79O5ZfI06fh3zo6Ik5tC0xJh6wIFQysL3Onp8'
const EXHIBITION = 'd517bee5-d003-4577-99ed-4bf32f7a04e6'
const BASEURL = 'https://mx0t3s2w.api.sanity.io/v1'
const MUTATE = '/data/mutate/production'
const ASSETS = '/assets/images/production'

let imageCapture
let gif
let gifSrc = ''
let imageBlob = null

let settings = {
  frames: 10,
  interval: 500
}

initialize = () => {
  gif = new GIF({
    workers: 2,
    quality: 10
  })

  imageBuffer.innerHTML = ''
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
    cameraCapture.srcObject = mediaStream

    const track = mediaStream.getVideoTracks()[0]
    imageCapture = new ImageCapture(track)

    canvas.width = 640
    canvas.height = 480

    setInterval(() => {
      context.filter = 'grayscale(1) brightness(0.9) contrast(1.1)'
      context.drawImage(cameraCapture, 0, 0)
    }, 20)
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

function takePhotos(counter, interval) {
  var i = 0
  let photoInterval = setInterval(() => {
    if (i >= counter) {
      clearInterval(photoInterval)
    } else {
      takePhoto()
      i++
    }
  }, interval)
}

function makeGif() {
  const d = Math.floor(Math.random() * 300) + 100

  for (var i = 0; i < imageBuffer.childElementCount; i++) {
    gif.addFrame(imageBuffer.childNodes[i], {delay: d})
  }

  gif.on('finished', function (blob) {
    imgGIF.src = URL.createObjectURL(blob)
    gifSrc = imgGIF.src
    imageBlob = blob
    resultOverlay.classList.remove('hidden')
  })

  gif.render()
}

// Button events
takePhotoButton.onclick = () => {
  takePhotos(settings.frames, settings.interval)
}

makeGIFButton.onclick = () => {
  takePhotos(settings.frames, settings.interval)

  setTimeout(() => {
    makeGif()
  }, settings.frames * settings.interval)
}

discardButton.onclick = () => {
  initialize()
}

uploadButton.onclick = () => {
  if (gifSrc !== '') {
    uploadImage(imageBlob)
  }
}

// To set settings in UI
inputFrames.onchange = (e) => {
  settings.frames = inputFrames.value
}

inputInterval.onchange = (e) => {
  settings.interval = inputInterval.value
}

function uploadImage(src) {
  fetch(BASEURL + ASSETS, {
      method: 'post',
      body: src,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'image/gif'
      }
    }
  )
    .then(response => response.json())
    .then(result => {
      addImageToExhibition(result.document._id, result.document.assetId)
    })
    .catch(error => console.error(error))
}

function addImageToExhibition(id, assetId) {

  const mutation = {
    mutations: [
      {
        patch: {
          id: EXHIBITION,
          insert: {
            after: 'images[-1]',
            items: [
              {
                _key: assetId,
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: id
                }
              }
            ]
          }
        }
      }
    ]
  }

  fetch(BASEURL + MUTATE, {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-type': 'application/json'
    },
    body: JSON.stringify(mutation)
  })
    .then(() => initialize())
    .catch(error => console.error(error))

}

// Init app on load
initialize()
