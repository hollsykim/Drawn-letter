const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');

let drawing = false;
let lastX = 0;
let lastY = 0;

function drawLine(x, y) {
  canvasCtx.lineWidth = 4;
  canvasCtx.strokeStyle = '#ff6347';
  canvasCtx.lineTo(x, y);
  canvasCtx.stroke();
}

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});
hands.setOptions({
  maxNumHands: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5,
});

hands.onResults((results) => {
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  if (results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const indexFingerTip = landmarks[8]; // index finger tip

    const x = indexFingerTip.x * canvasElement.width;
    const y = indexFingerTip.y * canvasElement.height;

    if (!drawing) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(x, y);
      drawing = true;
    } else {
      drawLine(x, y);
    }
  } else {
    drawing = false;
  }
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480,
});
camera.start();
