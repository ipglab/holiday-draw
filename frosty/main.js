(function() {

  var canvas = document.getElementById('frosty');
  var context = canvas.getContext('2d');
  var erasing = false;
  var timeoutId = false;
  var lastPos = false;

  var img = new Image();
  img.onload = function() { setTimeout(function() { context.drawImage(img, 0, 0); }, 100); };
  img.src = '/frosty/frost.png';

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
  }

  canvas.addEventListener('mousedown', function(e) {
    erasing = true;
    if (timeoutId) { clearTimeout(timeoutId); }
    eraseDot(e.x, e.y);
    lastPos = { x: e.x, y: e.y };
  });

  canvas.addEventListener('mouseup', function(e) {
    erasing = false;
    timeoutId = setTimeout(canvasTimeout, 2000);
  });

  canvas.addEventListener('mousemove', function(e) {
    e.preventDefault();
    if (!erasing) { return; }
    erasePath(e.x, e.y);
    lastPos = { x: e.x, y: e.y };
  });

})();
