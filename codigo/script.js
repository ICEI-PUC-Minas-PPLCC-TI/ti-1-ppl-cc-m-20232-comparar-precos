

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

            map.flyTo({ center: lngLat, zoom: 16 });
        }


        function updateMarkers() {
            // Faz a chamada fetch para obter os dados dos postos
            fetch('https://json-server.eduardonunesneu.repl.co/Postos')
                .then(function (response) { return response.json() })
                .then(function (dados) {
                    // Remove todos os marcadores existentes
                    markers.forEach(marker => marker.remove());

                    // Limpa o array de marcadores
                    markers = [];


                    dados.forEach(posto => {
                        // Cria um novo elemento HTML
                        var el = document.createElement('div');
                        el.className = 'marker';
                        var img = new Image();
                        img.src = 'images/marcadorvermelho.png'; // Substitua pela URL da sua imagem
                        img.width = 30;  // Ajuste a largura da imagem
                        img.height = 40; // Ajuste a altura da imagem

                        // Adiciona a imagem ao elemento
                        el.appendChild(img);

                        // Usa o elemento HTML como marcador
                        const marker = new mapboxgl.Marker(el)
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
                        var destino;
                        popup.on('open', () => {
                            const rotaButton = document.getElementById(`rota${posto.id}`);
                            rotaButton.addEventListener('click', () => {
                                destino = [posto.lng, posto.lat];
                                getRoute(destino);
                        
                                // Fecha o popup
                                popup.remove();
                            });
                        });

                        // Adiciona o marcador ao array de marcadores
                        markers.push(marker);
                    });


                });
        }

        // Chame essa função sempre que os dados forem alterados
        updateMarkers();
        var currentPosition;
        var start;
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(async position => {
                const lngLat = [position.coords.longitude, position.coords.latitude];
                addCurrentLocationMarker(lngLat);
                currentPosition = lngLat;
        
                // Atualiza a rota sempre que a posição do usuário muda
                await getRoute(currentPosition);
            }, () => {
                alert("Não foi possível obter sua localização.");
            });
        } else {
            alert("Geolocalização não é suportada por este navegador.");
        }
    }
    async function getRoute(destino) {
        // make a directions request using cycling profile
        // an arbitrary start will always be the same
        // only the end or destination will change
        const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${currentPosition[0]},${currentPosition[1]};${destino[0]},${destino[1]}?geometries=geojson&access_token=pk.eyJ1IjoiZWR1bnVuZXNuIiwiYSI6ImNscGxma2RrcDAzdWEyanBlYWJ4Y25yZ2MifQ.URgDFdzGbdaqGcaYhfE5MQ`,
            { method: 'GET' }
        );
        const json = await query.json();
        const data = json.routes[0];
        const route = data.geometry.coordinates;
        const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: route
            }
        };
        // if the route already exists on the map, we'll reset it using setData
        if (map.getSource('route')) {
            map.getSource('route').setData(geojson);
        }
        // otherwise, we'll make a new request
        else {
            map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: geojson
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                }
            });
        }
        // add turn instructions here at the end
    }

    map.on('load', () => {
        // make an initial directions request that
        // starts and ends at the same location
        getRoute(start);

        // Add starting point to the map
        map.addLayer({
            id: 'point',
            type: 'circle',
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'Point',
                                coordinates: start
                            }
                        }
                    ]
                }
            },
            paint: {
                'circle-radius': 10,
                'circle-color': '#3887be'
            }
        });
        // this is where the code from the next step will go
    });
});
