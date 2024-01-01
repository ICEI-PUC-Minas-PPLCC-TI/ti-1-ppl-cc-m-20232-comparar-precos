window.onload = function() {
    document.getElementById('logoutButton').addEventListener('click', function() {
      // Limpe as informações do usuário do localStorage
      localStorage.removeItem('user');
  
      // Redirecione para a página de login
      window.location.href = 'login.html';
    });
  };
  