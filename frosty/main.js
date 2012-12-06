(function() {

var canvas = document.getElementById('frosty');
var context = canvas.getContext('2d');
var erasing = false;
var timeoutId = false;
var lastPos = false;

var img = new Image();
img.onload = function() {
  context.drawImage(img, 0, 0);
};
img.src = '/frosty/frost.png';

function eraseBlock(x, y) {
  var imageData = context.getImageData(x - 25, y - 25, 50, 50);
  var data = imageData.data;
  var i = 0;
  var length = data.length;
  for (i = 0; i < length; i = i + 4) {
    data[i + 0] = data[i + 0]; // red
    data[i + 1] = data[i + 1]; // green
    data[i + 2] = data[i + 2]; // blue
    data[i + 3] = 120; // alpha
  }
  context.putImageData(imageData, x - 25, y - 25);
}

function eraseDot(x, y) {
  var gco = context.globalCompositeOperation;
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.arc(x, y, 5, 0, Math.PI * 2, false);
  context.fillStyle = 'rgba(0,0,0,0.9)';
  context.fill();
  context.closePath();
  context.globalCompositeOperation = gco;
}

function erasePath(x, y) {
  var gco = context.globalCompositeOperation;
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.lineStyle = 'rgba(0,0,0,0.9)';
  context.lineWidth = 10;
  context.lineCap = 'round';
  if (lastPos) {
    context.moveTo(lastPos.x, lastPos.y);
  }
  context.lineTo(x, y);
  context.stroke();
  context.closePath();
  context.globalCompositeOperation = gco;
}

function captureCanvas() {
  /*
  var opts = {
    url: '/frosty/save.php',
    method: 'POST',
    type: 'json',
    data: { uri: canvas.toDataURL('image/png') },
    success: function(resp) { console.log('saved', resp); },
    error: function(err) { console.log(err); }
  };
  reqwest(opts);
  */
  $.post('/frosty/save.php', { uri: canvas.toDataURL('image/png') }, function(resp) {
    console.log('saved', resp);
  }, 'json');
  resetCanvas();
}

function resetCanvas() {
  canvas.width = canvas.width;
  context.drawImage(img, 0, 0);
}

canvas.addEventListener('mousedown', function(e) {
  erasing = true;
  if (timeoutId) { clearTimeout(timeoutId); }
  eraseDot(e.x, e.y);
  lastPos = { x: e.x, y: e.y };
});

canvas.addEventListener('mouseup', function(e) {
  erasing = false;
  timeoutId = setTimeout(captureCanvas, 2000);
});

canvas.addEventListener('mousemove', function(e) {
  e.preventDefault();
  if (!erasing) { return; }
  eraseDot(e.x, e.y);
  erasePath(e.x, e.y);
  lastPos = { x: e.x, y: e.y };
});

})();
