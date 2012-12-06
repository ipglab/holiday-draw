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

$fn = $_SERVER['DOCUMENT_ROOT'] . '/frosty/images/' . time() . '.png';
if (!file_exists($fn)) {
  $fh = fopen($fn, 'wb');
  fwrite($fh, $decoded);
  fclose($fh);
}

$status = 200;
if (!file_exists($fn)) {
  $status = 500;
}

header('Content-Type: application/json');
echo json_encode(array('status' => $status, 'path' => $fn));
