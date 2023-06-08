		//添加主map
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXRmaWVsZDIwMjIiLCJhIjoiY2xlZjFodW1lMDR3dTNvbXVvajMwNGxzZSJ9.1FnjGYOuY7l-Us1SFatgKg';
        var map1 = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/atfield2022/clilc6444007001r7dv0h44rg',
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

					
        });

		//获取数据
		var DatatupleList=GetFlowData();
		//加载流
		var drawnum=0;
		//颜色
		var colorList=['cold','warm','cold','warm','cold','warm','cold','warm','cold','warm','cold','warm']
		map1.on('click', (event) => {
			clearMap(map1);
			//函数包括：地图图层，OD流点集，流动强度列表，第几次绘制，绘制颜色色系
			odFlowSence(map1,DatatupleList[drawnum][0],DatatupleList[drawnum][1],drawnum,colorList[drawnum]);
			drawnum++;
		})

        


        


        


        
        
        
        
        
        
        
        
            
      

