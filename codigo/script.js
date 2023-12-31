
document.addEventListener("DOMContentLoaded", function () {
   

    if (window.location.pathname.endsWith("gps.html")) {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZWR1bnVuZXNuIiwiYSI6ImNscGxma2RrcDAzdWEyanBlYWJ4Y25yZ2MifQ.URgDFdzGbdaqGcaYhfE5MQ';
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

            map.flyTo({center: lngLat, zoom: 14});
        }
        function addRoute(lngLatStart, lngLatEnd) {
            // Solicitação à API de Direções do Mapbox
            fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${lngLatStart[0]},${lngLatStart[1]};${lngLatEnd[0]},${lngLatEnd[1]}?geometries=geojson&access_token=SEU_TOKEN_MAPBOX`)
                .then(response => response.json())
                .then(data => {
                    const route = data.routes[0].geometry;
                    console.log(data)

                    // Adiciona a rota no mapa
                    map.addSource('route', {
                        'type': 'geojson',
                        'data': route
                    });

                    map.addLayer({
                        'id': 'route',
                        'type': 'line',
                        'source': 'route',
                        'layout': {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        'paint': {
                            'line-color': '#888',
                            'line-width': 8
                        }
                    });
                });
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
            `<button id="detalhes${posto.id}" onclick="window.location.href='detalhes.html?id=${posto.id}'">Detalhes</button>` +
            `<button id="rota${posto.id}">Gerar Rota</button>`
        );

    marker.setPopup(popup);

    // Adiciona o manipulador de eventos ao botão depois que o popup for carregado
    popup.on('open', () => {
        const rotaButton = document.getElementById(`rota${posto.id}`);
        rotaButton.addEventListener('click', () => {
            addRoute(currentPosition, [posto.lng, posto.lat]);
        });
    });

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
            navigator.geolocation.watchPosition(position => {
                const lngLat = [position.coords.longitude, position.coords.latitude];
                addCurrentLocationMarker(lngLat);
                currentPosition = lngLat; 
            }, () => {
                alert("Não foi possível obter sua localização.");
            });
        } else {
            alert("Geolocalização não é suportada por este navegador.");
        }
    }
});
