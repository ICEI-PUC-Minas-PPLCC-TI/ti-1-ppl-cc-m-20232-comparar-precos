let Usuario =[];

function fetchAlbums() {
    fetch('https://login.eduardonunesneu.repl.co/usuarios')
      .then(function(response) { return response.json() })
      .then(function(data) {
        Usuario = data;
      });
}

window.onload = function() {
  // Chame a função fetchAlbums para carregar os usuários
  fetchAlbums();

  document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    var usuarioLogin = document.getElementById('usernamel').value;
    var senhaLogin = document.getElementById('passwordl').value;
  
    // Verifique se o usuário existe e a senha está correta
    var user = Usuario.find(function(user) {
      return user.usuario === usuarioLogin && user.senha === senhaLogin;
    });
  
    if (user) {
      // O login foi bem-sucedido
      window.location.href = 'index.html'; // Redireciona para a página do perfil
      // Armazene as informações do usuário para uso posterior
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      // O login falhou
      alert('Nome de usuário ou senha incorretos');
    }
  });
};
