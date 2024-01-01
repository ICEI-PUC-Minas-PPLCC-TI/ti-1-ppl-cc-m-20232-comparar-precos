function leiaMais(){
    var pontos= document.getElementById("pontos")
    var maisTexto= document.getElementById("mais")
    var btnLeiaMais= document.getElementById("btnLeiaMais")
        if(pontos.style.display == "none"){
            pontos.style.display="inline";
            maisTexto.style.display="none"
            btnLeiaMais.innerHTML="Leia Mais";
        } else{
            pontos.style.display="none";
            maisTexto.style.display="inline"
            btnLeiaMais.innerHTML="Leia Menos";  

        }
}
window.onload = function() {
    
    var user = JSON.parse(localStorage.getItem('user'));
  
    
    if (user) {
      
      document.querySelector('li a[href="cadastro.html"]').textContent = user.usuario;
      document.querySelector('li a[href="cadastro.html"]').href = 'perfil.html';
    } else {
      
      document.querySelector('li a[href="cadastro.html"]').textContent = 'Login';
      document.querySelector('li a[href="cadastro.html"]').href = 'login.html';
    }
  };