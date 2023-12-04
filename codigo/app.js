let btnCarregar = document.getElementById('btnCarregarDados')
btnCarregar.addEventListener('click', carregarDados)
letbtnEditar = document.getElementById('editar')
let postIdInput = document.getElementById('postIdInput');
let btnApagar = document.getElementById('btnApagar');
const urlpostos ='https://json-server.eduardonunesneu.repl.co/Postos'
let Postos =[]
fetch('https://json-server.eduardonunesneu.repl.co/Postos')
.then(function (response) {return response.json()})
.then(function (dados){
    Postos= dados;
    carregarDados();
})
btnApagar.addEventListener('click', function () {

    let postId = postIdInput.value.trim();


    if (/^\d+$/.test(postId)) {

        postId = parseInt(postId);


        apagarPosto(postId);
    } else {
        console.log('Por favor, insira um ID válido.');
    }


    postIdInput.value = '';
});




function cadastro(name, rua, bairro, CEP, Numero, Valor, Mapa, Lat,Long) {
    if (name === '' || rua === '' || bairro === '' || CEP === '' || Numero === '' || Valor === '') {
        alert('Por favor, preencha todos os campos antes de salvar o posto.');
        return; 
    }

    let novoposto = {
        nome: name,
        Rua: rua,
        Bairro: bairro,
        CEP: CEP,
        Numero: Numero,
        Preço: Valor,
        Mapa: Mapa,
        lat: Lat,
        lng: Long
    }
    fetch('https://json-server.eduardonunesneu.repl.co/Postos' ,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoposto)

    })
    .then(response =>response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
    document.getElementById('inputNome').value = '';
    document.getElementById('inputRua').value = '';
    document.getElementById('inputBairro').value = '';
    document.getElementById('inputCEP').value = '';
    document.getElementById('inputNumero').value = '';
    document.getElementById('inputValor').value = '';
    document.getElementById('inputMapa').value = '';
    document.getElementById('inputLat').value = '';
    document.getElementById('inputLong').value = '';
}
function carregarDados() {
    console.table(Postos);
    let textoHTML = '';
    for (i = 0; i < Postos.length; i++) {
        
        textoHTML += `<li>${Postos[i].nome} | ${Postos[i].Rua} | ${Postos[i].Bairro} | ${Postos[i].CEP} | ${Postos[i].Numero} | ${Postos[i].Preço} | ${Postos[i].id}
        <div class="botoesEditar">
        <button onclick="editarPosto(${Postos[i].id})">Editar</button>
    </div>
            <div id="edicaoForm-${Postos[i].id}" style="display: none;">
                Nome: <input type="text" id="nomeEdit-${Postos[i].id}"><br>
                Rua: <input type="text" id="ruaEdit-${Postos[i].id}"><br>
                Bairro: <input type="text" id="bairroEdit-${Postos[i].id}"><br>
                CEP: <input type="text" id="cepEdit-${Postos[i].id}"><br>
                Número: <input type="text" id="numeroEdit-${Postos[i].id}"><br>
                Preço: <input type="text" id="precoEdit-${Postos[i].id}"><br>
                <button onclick="salvarEdicao(${Postos[i].id})">Salvar</button>
            </div>
        </li>`;
    }
    document.getElementById("carregar").innerHTML = textoHTML;
}
document.addEventListener('DOMContentLoaded', function () {
    carregarDados();
});


function apagarPosto(id) {
    fetch(`${urlpostos}/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log(`Posto com ID ${id} apagado com sucesso.`);
            carregarDados();
        } else {
            console.error(`Erro ao apagar posto com ID ${id}.`);
        }
    })
    .catch(error => {
        console.error('Erro ao apagar posto:', error);
    });
}


function editarPosto(id) {

    const formDiv = document.getElementById(`edicaoForm-${id}`);
    formDiv.style.display = 'block';
}


function salvarEdicao(id) {
    
    const novoNome = document.getElementById(`nomeEdit-${id}`).value;
    const novaRua = document.getElementById(`ruaEdit-${id}`).value;
    const novoBairro = document.getElementById(`bairroEdit-${id}`).value;
    const novoCEP = document.getElementById(`cepEdit-${id}`).value;
    const novoNumero = document.getElementById(`numeroEdit-${id}`).value;
    const novoPreco = document.getElementById(`precoEdit-${id}`).value;


    fetch(`${urlpostos}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: novoNome,
            Rua: novaRua,
            Bairro: novoBairro,
            CEP: novoCEP,
            Numero: novoNumero,
            Preço: novoPreco,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Posto editado com sucesso:', data);
        carregarDados();
        const formDiv = document.getElementById(`edicaoForm-${id}`);
        formDiv.style.display = 'none';
    })
    .catch(error => {
        console.error('Erro ao editar posto:', error);
    });
}