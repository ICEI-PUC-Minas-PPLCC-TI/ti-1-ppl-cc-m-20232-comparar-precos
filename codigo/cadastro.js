window.onload = function() {
  document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    var nomeCadastro = document.getElementById('nome').value;
    var usuarioCadastro = document.getElementById('username').value;
    var senhaCadastro = document.getElementById('password').value;
    var dataCadastro = new Date().toISOString(); // Registra a data e hora atual
  
    fetch('https://login.eduardonunesneu.repl.co/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: nomeCadastro,
        usuario: usuarioCadastro,
        senha: senhaCadastro,
        dataCadastro: dataCadastro, // Envia a data de cadastro
      }),
    })
    .then(function(response) { return response.json() })
    .then(function(data) {
      // Lidar com a resposta do servidor
      window.location.href = 'login.html'; // Redireciona para a tela de login
      alert('Cadastro realizado com sucesso!');
    });
  });
};
