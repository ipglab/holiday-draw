(function() {

  var canvas = document.getElementById('frosty');
  var context = canvas.getContext('2d');
  var erasing = false;
  var timeoutId = false;
  var lastPos = false;

  var img = new Image();
  img.onload = function() { setTimeout(function() { context.drawImage(img, 0, 0); }, 100); };
  img.src = '/frosty/frost2.png';

  function eraseDot(x, y) {
    var gco = context.globalCompositeOperation;
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(x, y, 8, 0, Math.PI * 2, false);
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
    context.lineWidth = 16;
    context.lineCap = 'round';
    if (lastPos) {
      context.moveTo(lastPos.x, lastPos.y);
    }
    context.lineTo(x, y);
    context.stroke();
    context.closePath();
    context.globalCompositeOperation = gco;
  }

  function canvasTimeout() {
    captureCanvas();
    resetCanvas();
  }

  function captureCanvas() {
    reqwest({
      url: '/frosty/save.php',
      method: 'POST',
      type: 'json',
      data: { uri: canvas.toDataURL('image/png') },
      success: function(resp) { console.log('saved', resp); },
      error: function(err) { console.log(err); }
    });
  }

  function resetCanvas() {
    canvas.width = canvas.width;
    context.drawImage(img, 0, 0);
    if (timeoutId) { clearTimeout(timeoutId); }
  }

  function getCoords(e) {
    var x = e.x;
    var y = e.y;
    if (e.touches) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
    return { x: x, y: y };
  }

  function startCapture(e) {
    erasing = true;
    document.body.className = 'erasing';
    if (timeoutId) { clearTimeout(timeoutId); }
    var coords = getCoords(e);
    eraseDot(coords.x, coords.y);
    lastPos = { x: coords.x, y: coords.y };
  }

  function stopCapture(e) {
    erasing = false;
    document.body.className = '';
    //timeoutId = setTimeout(canvasTimeout, 5000);
  }

  function moving(e) {
    e.preventDefault();
    if (!erasing) { return; }
    var coords = getCoords(e);
    erasePath(coords.x, coords.y);
    lastPos = { x: coords.x, y: coords.y };
  }

  canvas.addEventListener('mousedown', startCapture);
  canvas.addEventListener('touchstart', startCapture);
  canvas.addEventListener('mouseup', stopCapture);
  canvas.addEventListener('touchend', stopCapture);
  canvas.addEventListener('mousemove', moving);
  canvas.addEventListener('touchmove', moving);

  var captureIcon = document.getElementById('capture');
  captureIcon.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    captureCanvas();
  });
  captureIcon.addEventListener('mousedown', function(e) {
    e.stopPropagation();
  });

  var resetIcon = document.getElementById('reset');
  resetIcon.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    resetCanvas();
  });
  resetIcon.addEventListener('mousedown', function(e) {
    e.stopPropagation();
  });

})();
