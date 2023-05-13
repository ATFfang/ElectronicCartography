		//添加主map
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXRmaWVsZDIwMjIiLCJhIjoiY2xlZjFodW1lMDR3dTNvbXVvajMwNGxzZSJ9.1FnjGYOuY7l-Us1SFatgKg';
        var map1 = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            center: [112,36],
            zoom: 3
        });
        //添加副map
        var map2 = new mapboxgl.Map({
            container: 'map2',
            style: '',
            center: [112,36],
            zoom: 6
        });

        //加载时，顺便加载矢量底图
        map1.on('load', function () {
            map1.addSource('city', {
                'type': 'geojson',
                'data': 'https://raw.githubusercontent.com/ATFfang/ElectronicCartography/main/data/polygon/中国市域WGS84.geojson'
            });
        
            // 添加面图层
            map1.addLayer({
                'id': 'city-layer',
                'type': 'fill',
                'source': 'city',
                'paint': {
                    'fill-color': '#400861'
               },
            });

            map1.addSource('city-points', {
                'type': 'geojson',
                'data': 'https://raw.githubusercontent.com/ATFfang/ElectronicCartography/main/data/point/CityPointWGS84.geojson'
            });
        
            // 添加点图层
            map1.addLayer({
                'id': 'city-points-layer',
                'type': 'circle',
                'source': 'city-points',
                'paint': {
                    'circle-radius': 2,
                    'circle-color': '#ff0000'
                }
            });
        });

        //点击map的点，加载在map2中
        map1.on('click', (event) => {
			const states = map1.queryRenderedFeatures(event.point, {
    			layers: ['city-points-layer']
  			});

  			console.log('Clicked at:', states[0].properties.NAME);			
		});


        
        
        
        
        
        
        
        
            
      

