<?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "bancoproduto";

// Cria a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Consulta os produtos
$sql = "SELECT nome, imagem, avaliacao, preco FROM produtos";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Saída dos dados de cada linha
    while($row = $result->fetch_assoc()) {
        echo "Nome: " . $row["nome"]. " - Imagem: " . $row["imagem"]. " - Avaliação: " . $row["avaliacao"]. " - Preço: " . $row["preco"]. "<br>";
    }
} else {
    echo "0 resultados";
}
$conn->close();
?>