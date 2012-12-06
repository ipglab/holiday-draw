<?php

$contents = $_POST['uri'];
$parts = explode(',', $contents);
$encoded = str_replace(' ', '+', $parts[count($parts) - 1]);
$decoded = base64_decode(chunk_split($encoded));
/*
$decoded = '';
for ($i = 0; $i < ceil(strlen($encoded)/256); $i++) {
  $decoded = $decoded . base64_decode(substr($encoded, $i * 256, 256));
}
*/

$fn = 'images/' . time() . '.png';
if (!file_exists($fn)) {
  $fh = fopen($fn, 'wb');
  fwrite($fh, $decoded);
  fclose($fh);
}

header('Content-Type: application/json');
echo json_encode(array('status' => 200, 'path' => $fn));
