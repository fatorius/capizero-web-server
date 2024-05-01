<?php

$latest_version = "capizero_";

$servername = "localhost";
$username = "hugoso82_hugo";
$password = "8WiWDf743WYM";
$database = "hugoso82_capizero";

$conn = new mysqli($servername, $username, $password, $database);

$prep1 = $conn->prepare("SELECT * FROM `versions` ORDER BY `version_id` DESC LIMIT 1");

$prep1->execute();

$results = $prep1->get_result();

while ($row = $results->fetch_assoc()){
    $latest_version .= $row["version_name"] . "_linux_x86";
}

header("Content-type:application/octet-stream");
// It will be called downloaded.pdf
header("Content-Disposition:attachment;filename=capizero_latest_version");
// The PDF source is in original.pdf
readfile($latest_version);
?>
