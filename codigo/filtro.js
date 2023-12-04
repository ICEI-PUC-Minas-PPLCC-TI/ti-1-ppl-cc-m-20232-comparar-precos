let Postos = []
fetch('https://json-server.eduardonunesneu.repl.co/Postos')
    .then(function (response) { return response.json() })
    .then(function (dados) {
        Postos = dados;
        ListaPostos()
    })
function ListaPostos() {
    let fb = document.getElementById('filtro_bairro').value;
    let fc = document.getElementById('filtro_CEP').value;
    let fr = document.getElementById('filtro_Rua').value;
    let fn = document.getElementById('filtro_Nome').value;

    let container = document.getElementById("container-postos");
    container.innerHTML = "";
    Postos.sort(function(a, b) {
        return a.Preço - b.Preço;
    });

    for (let i = 0; i < Postos.length; i++) {
        const posto = Postos[i];
        if (((String(posto.Bairro).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().startsWith(fb.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())) || (fb == '')) &&
            ((String(posto.CEP).startsWith(fc)) || (fc == '')) &&
            ((String(posto.Rua).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().startsWith(fr.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())) || (fr == '')) &&
            ((String(posto.nome).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().startsWith(fn.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())) || (fn == ''))){
                
                let postoDiv = document.createElement('div');
                postoDiv.innerHTML = `<h2>${posto.nome}</h2>
                    <div id="listagem">
                        <p>Bairro: ${posto.Bairro}</p>
                        <p>Rua: ${posto.Rua}</p>
                        <p>CEP: ${posto.CEP}</p>
                        <p>Número: ${posto.Numero}</p>
                        <p>Preço Gasolina: ${posto.Preço}</p>
                    </div>
                    <button id="btn-detalhes-${posto.id}" style="padding: 10px 20px; font-size: 16px;">Detalhes</button>`;
                container.appendChild(postoDiv);
        
                // Adicionando evento de clique ao botão
                document.getElementById(`btn-detalhes-${posto.id}`).addEventListener('click', function() {
                    window.location.href = `detalhes.html?id=${posto.id}`; // Substitua 'detalhes.html' pela sua página de detalhes
                });
            }
        }
}
