// Exemplo de função para atualizar o preço
function updatePrice() {
    var newPrice = document.getElementById('newPrice').value;
    if(newPrice) {
      document.getElementById('currentPrice').innerText = newPrice;
    } else {
      alert('Por favor, insira o novo preço.');
    }
  }
  var urlParams = new URLSearchParams(window.location.search);
var postoId = urlParams.get('id');
  fetch('https://json-server.eduardonunesneu.repl.co/Postos/' + postoId)
.then(function (response) {return response.json()})
.then(function (posto){
    // Preenche a página com os detalhes do posto de gasolina
    document.querySelector('.mostrardetalhes h1').innerText = posto.nome;
    document.querySelector('.endereco1').innerText = 'Rua:' + posto.Rua;
    document.querySelector('.endereco2').innerText = 'Bairro:' + posto.Bairro;
    document.querySelector('.endereco3').innerText = 'Numero:' + posto.Numero;
    document.querySelector('.endereco4').innerText = 'CEP:' + posto.CEP;
    document.querySelector('#currentPrice').innerText = posto.Preço;
    var mapContainer = document.getElementById('mapContainer');
    var iframe = document.createElement('iframe');
    iframe.src = posto.Mapa;
    iframe.width = "600";
    iframe.height = "500";
    iframe.style.border = "0";
    mapContainer.appendChild(iframe);
  })
  .catch(function (error) {
    console.error('Erro ao buscar os detalhes do posto de gasolina:', error);
  });
function updatePrice() {
    var newPriceInput = document.getElementById('newPrice');
    var newPrice = newPriceInput.value;
    if(newPrice) {
      // Atualiza o preço no servidor JSON
      fetch('https://json-server.eduardonunesneu.repl.co/Postos/' + postoId, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Preço: newPrice
        })
      })
      .then(function(response) {
        if(response.ok) {
          // Atualiza o preço na página
          document.getElementById('currentPrice').innerText = newPrice;
          // Limpa o campo de entrada
          newPriceInput.value = '';
        } else {
          throw new Error('Erro ao atualizar o preço');
        }
      })
      .catch(function(error) {
        console.error(error);
      });
    } else {
      alert('Por favor, insira o novo preço.');
    }
  }
  
  

  // Exemplo de função para capturar a avaliação com estrelas
  var stars = document.querySelectorAll('.rating > span');
  for (var i = 0; i < stars.length; i++) {
    stars[i].addEventListener('click', function() {
      var rating = this.parentNode.children.length - Array.from(this.parentNode.children).indexOf(this);
      console.log('Avaliação: ' + rating);

      // Removendo a classe "clicked" de todos os elementos
      var allStars = document.querySelectorAll('.rating > span');
      allStars.forEach(function(star) {
        star.classList.remove('clicked');
      });

      // Adicionando a classe "clicked" ao elemento clicado
      this.classList.add('clicked');
    });

    // Adicionando tratamento para quando o mouse sai do conjunto de estrelas
    stars[i].addEventListener('mouseleave', function() {
      var allStars = document.querySelectorAll('.rating > span');
      allStars.forEach(function(star) {
        star.classList.remove('hovered');
      });
    });

    // Adicionando tratamento para quando o mouse está sobre uma estrela
    stars[i].addEventListener('mouseenter', function() {
      var index = Array.from(this.parentNode.children).indexOf(this);
      var starsToHighlight = Array.from(this.parentNode.children).slice(index);
      starsToHighlight.forEach(function(star) {
        star.classList.add('hovered');
      });
    });
  }
  function saveComment() {
    var commentInput = document.getElementById('comment');
    var comment = commentInput.value;
    if(comment) {
      // Cria um ID único para o comentário
      var commentId = 'comment_' + Date.now();
  
      // Busca os detalhes do posto de gasolina
      fetch('https://json-server.eduardonunesneu.repl.co/Postos/' + postoId)
      .then(function (response) {return response.json()})
      .then(function (posto){
        // Adiciona o novo comentário à lista existente de comentários
        var comentarios = posto.Comentarios || [];
        comentarios.push({id: commentId, texto: comment});
  
        // Salva a lista atualizada de comentários no servidor JSON
        return fetch('https://json-server.eduardonunesneu.repl.co/Postos/' + postoId, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Comentarios: comentarios
          })
        });
      })
      .then(function(response) {
        if(response.ok) {
          // Limpa o campo de entrada
          commentInput.value = '';
          alert('Comentário salvo com sucesso!');
        } else {
          throw new Error('Erro ao salvar o comentário');
        }
      })
      .catch(function(error) {
        console.error(error);
      });
    } else {
      alert('Por favor, insira um comentário.');
    }
  }
  
  function deleteComment(commentId) {
    // Busca os detalhes do posto de gasolina
    fetch('https://json-server.eduardonunesneu.repl.co/Postos/' + postoId)
    .then(function (response) {return response.json()})
    .then(function (posto){
      // Remove o comentário da lista existente de comentários
      var comentarios = posto.Comentarios || [];
      var index = comentarios.findIndex(function(comment) {
        return comment.id === commentId;
      });
      if (index !== -1) {
        comentarios.splice(index, 1);
      }
  
      // Salva a lista atualizada de comentários no servidor JSON
      return fetch('https://json-server.eduardonunesneu.repl.co/Postos/' + postoId, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Comentarios: comentarios
        })
      });
    })
    .then(function(response) {
      if(response.ok) {
        // Remove o comentário do contêiner de comentários
        var commentElement = document.getElementById(commentId);
        if (commentElement) {
          commentElement.parentNode.removeChild(commentElement);
        }
        alert('Comentário excluído com sucesso!');
      } else {
        throw new Error('Erro ao excluir o comentário');
      }
    })
    .catch(function(error) {
      console.error(error);
    });
  }
  
  function showComments() {
    // Busca os detalhes do posto de gasolina
    fetch('https://json-server.eduardonunesneu.repl.co/Postos/' + postoId)
    .then(function (response) {return response.json()})
    .then(function (posto){
      // Limpa o contêiner de comentários
      var commentsContainer = document.getElementById('commentsContainer');
      commentsContainer.innerHTML = '';
  
      // Adiciona cada comentário ao contêiner de comentários
      posto.Comentarios.forEach(function(comment) {
        var commentElement = document.createElement('p');
        commentElement.innerText = comment.texto;
        commentsContainer.appendChild(commentElement);
  
        // Adiciona um botão de exclusão ao comentário
        var deleteButton = document.createElement('button');
        deleteButton.innerText = 'Excluir';
        deleteButton.addEventListener('click', function() {
          deleteComment(comment.id);
        });
        commentsContainer.appendChild(deleteButton);
      });
    })
    .catch(function (error) {
      console.error('Erro ao buscar os detalhes do posto de gasolina:', error);
    });
  }