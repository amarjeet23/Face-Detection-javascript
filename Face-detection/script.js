
const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )

}


var id=0;
var second=0;
minute=0;
hour=0;
function printTime(){
  document.getElementById('demo').style.display="block";
  document.getElementById('demo').innerHTML=hour+"h"+" "+ minute + "m"+" "+second+"s";
  second++;
  if(second>=59){
    minute++;
    second=0;
  }
  else if(minute>=60){
    hour++;
    minute=0;
    second=0;
  }
}
function start(){
  id=window.setTimeout(printTime,1000);
}
function stop(){
   minute=0;
  second=0;
  clearTimeout(id);
  document.getElementById('demo').style.display="none";
}

video.addEventListener('playing', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
   console.log(detections);
   if(detections.length==0){
      start();
    // alert("No user");
   }
   else{
     stop();
   }


    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 1000)
})