<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$server = 'localhost';
$username = $_ENV['username'];
$password = $_ENV['password'];
$db = 'movie';

$conn = mysqli_connect($server, $username, $password, $db);

if (!$conn) {
    die('Connection not found.');
} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT * from movie";
    
    $result = mysqli_query($conn, $sql);
    if (!$result) {
        die('Error reading from sql.');
    }

    $response = [];
    while ($row = $result->fetch_assoc()) {
        array_push($response, [
            'id' => $row['id'],
            'title' => $row['title'],
            'movie_description' => $row['movie_description'],
            'genre' => $row['genre'],
            'director' => $row['director'],
            'release_date' => $row['release_date']
        ]);
    }

    echo json_encode($response);
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $_POST['title'] ?? '';
    $movie_description = $_POST['movie_description'] ?? '';
    $genre = $_POST['genre'] ?? '';
    $director = $_POST['director'] ?? '';
    $release_date = $_POST['release_date'] ?? '';

    $sql = "INSERT INTO movie(title, movie_description, genre, director, 
        release_date) VALUES('{$title}', '{$movie_description}', '{$genre}', 
        '{$director}', '{$release_date}')";

    if (!mysqli_query($conn, $sql)) {
        die(mysqli_error($conn));
    }

    echo 'Inserted successfully.';
} else if ($_SERVER['REQUEST_METHOD'] == 'PATCH') {
    parse_str(file_get_contents('php://input'), $_PATCH);

    $id = $_PATCH['id'] ?? '';
    $title = $_PATCH['title'] ?? '';
    $movie_description = $_PATCH['movie_description'] ?? '';
    $genre = $_PATCH['genre'] ?? '';
    $director = $_PATCH['director'] ?? '';
    $release_date = $_PATCH['release_date'] ?? '';

    $sql = "UPDATE movie SET title='{$title}', movie_description=
        '{$movie_description}', genre='{$genre}', director='{$director}', 
        release_date='{$release_date}' WHERE id='{$id}'";

    if (!mysqli_query($conn, $sql)) {
        die(mysqli_error($conn));
    }

    echo 'Updated successfully.';
} else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    parse_str(file_get_contents('php://input'), $_DELETE);

    $id = $_DELETE['id'] ?? '';

    $sql = "DELETE FROM movie WHERE id='{$id}'";

    if (!mysqli_query($conn, $sql)) {
        die(mysqli_error($conn));
    }

    echo 'Deleted successfully.';
}

mysqli_close($conn);
?>