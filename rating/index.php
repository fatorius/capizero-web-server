<?php

$rating = "";

$servername = "localhost";
$username = "hugoso82_hugo";
$password = "8WiWDf743WYM";
$database = "hugoso82_capizero";

$conn = new mysqli($servername, $username, $password, $database);

$prep1 = $conn->prepare("SELECT * FROM `ratings` ORDER BY `id` DESC LIMIT 1");

$prep1->execute();

$results = $prep1->get_result();

while ($row = $results->fetch_assoc()){
    $rating = $row["rating"];
}

echo $rating;
?>
