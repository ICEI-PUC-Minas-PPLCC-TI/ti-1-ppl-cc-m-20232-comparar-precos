document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");

    let registeredUsers = [];

    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const registerUsername = document.getElementById("register-username").value;
            const registerPassword = document.getElementById("register-password").value;

            // Armazena o usuário registrado em um formato JSON
            const newUser = {
                username: registerUsername,
                password: registerPassword
            };

            registeredUsers.push(newUser);

            // Atualiza a lista de usuários registrados em formato JSON
            localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

            alert("Usuário registrado com sucesso. Você será redirecionado para a tela de login.");
            window.location.href = "login.html";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const loginUsername = document.getElementById("login-username").value;
            const loginPassword = document.getElementById("login-password").value;

            const storedUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

            const user = storedUsers.find(user => user.username === loginUsername && user.password === loginPassword);

            if (user) {
                alert("Login bem-sucedido. Redirecionando para a tela de GPS.");
                window.location.href = "gps.html";
            } else {
                alert("Credenciais inválidas. Tente novamente.");
            }
        });
    }

    if (window.location.pathname.endsWith("gps.html")) {
        mapboxgl.accessToken = 'pk.eyJ1Ijoicm9tbWVsY2FybmVpcm8tcHVjIiwiYSI6ImNsb3ZuMTBoejBsd2gyamwzeDZzcWl5b3oifQ.VPWc3qoyon8Z_-URfKpvKg';
        var map = new mapboxgl.Map({
            container: 'mapa',
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 3
        });

        let markers = [];

        // Função para adicionar um marcador na localização atual
        function addCurrentLocationMarker(lngLat) {
            new mapboxgl.Marker()
                .setLngLat(lngLat)
                .addTo(map);
        }

        function updateMarkers() {
            // Faz a chamada fetch para obter os dados dos postos
            fetch('https://json-server.eduardonunesneu.repl.co/Postos')
            .then(function (response) {return response.json()})
            .then(function (dados){
                // Remove todos os marcadores existentes
                markers.forEach(marker => marker.remove());

                // Limpa o array de marcadores
                markers = [];

                // Adiciona os marcadores para cada posto armazenado
                dados.forEach(posto => {
                    const marker = new mapboxgl.Marker()
                        .setLngLat([posto.lng, posto.lat])
                        .addTo(map);
                        
                    const popup = new mapboxgl.Popup({ offset: 25 })
                    .setHTML(
                        `<h3>${posto.nome}</h3>` +
                        `<p>Rua: ${posto.Rua}<br>` +
                        `Bairro: ${posto.Bairro}<br>` +
                        `CEP: ${posto.CEP}<br>` +
                        `Número: ${posto.Numero}<br>` +
                        `Preço: ${posto.Preço}</p>` +
                        `<button id="detalhes${posto.id}" onclick="window.location.href='detalhes.html?id=${posto.id}'">Detalhes</button>`
                    );

                    marker.setPopup(popup);

                    // Adiciona o marcador ao array de marcadores
                    markers.push(marker);
                });
            });
        }

        // Chame essa função sempre que os dados forem alterados
        updateMarkers();
        function addCurrentLocationMarker(lngLat) {
            new mapboxgl.Marker()
                .setLngLat(lngLat)
                .addTo(map);

            map.flyTo({center: lngLat, zoom: 14});
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lngLat = [position.coords.longitude, position.coords.latitude];
                addCurrentLocationMarker(lngLat);
            }, () => {
                alert("Não foi possível obter sua localização.");
            });
        } else {
            alert("Geolocalização não é suportada por este navegador.");
        }
    }
});
