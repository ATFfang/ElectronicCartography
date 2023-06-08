//获取贝塞尔曲线
function getCurvedLine(ps,pe)
{
    const computeControlPoint1 = (ps, pe, arc = 0.2) => {
        const deltaX = pe[0] - ps[0];
        const deltaY = pe[1] - ps[1];
        const theta = Math.atan(deltaY / deltaX);
        const len = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)) / 2 * arc;
        const newTheta = theta - Math.PI / 2;
        return [
          (ps[0] + pe[0]) / 2 - len * Math.cos(newTheta),
          (ps[1] + pe[1]) / 2 - len * Math.sin(newTheta),
        ];
    }

    const computeControlPoint2 = (ps, pe, arc = 0.3) => {
      const deltaX = pe[0] - ps[0];
      const deltaY = pe[1] - ps[1];
      const theta = Math.atan(deltaY / deltaX);
      const len = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)) / 2 * arc;
      const newTheta = theta - Math.PI / 2;
      return [
        (ps[0] + pe[0]) / 2 + 0.5*len * Math.cos(newTheta),
        (ps[1] + pe[1]) / 2 + 0.5*len * Math.sin(newTheta),
      ];
  }

    var controlpoint1=computeControlPoint1(ps,pe)
    //var controlpoint2=computeControlPoint2(controlpoint1,pe)

    var linePoints=[ps,controlpoint1,pe];
      

    var line = turf.lineString(linePoints);

    var curved = turf.bezierSpline(line);
    var curveCoordinates = curved.geometry.coordinates;

    // var selectedPoints = [];

    // // 首先将起始点添加到选定点数组
    // selectedPoints.push(curveCoordinates[0]);

    // // 计算每隔50个点选取一个点的步长
    // var step = Math.floor(curveCoordinates.length / 100);

    // // 从索引 step 开始，每隔 step 个索引选取一个点，直到倒数第二个点
    // for (var i = step; i < curveCoordinates.length - 1; i += step) {
      // 	selectedPoints.push(curveCoordinates[i]);
    // }

    // // 最后将结束点添加到选定点数组
    // selectedPoints.push(curveCoordinates[curveCoordinates.length - 1]);

    // 现在 selectedPoints 数组中包含了每隔50个点选取的点，且首尾点都被包含在内
    //console.log(selectedPoints);

    return curveCoordinates;
}

//从点击转为弧线
function getArcFeature(lineList, valueList)
{

  var curveCoordinatesList=[];
			lineList.forEach((line) => {
				// 在回调函数中使用 line 进行操作
				curveCoordinatesList.push(getCurvedLine(line[0],line[1]))
			}); 

  const featureCollection = {
    type: 'FeatureCollection',
    features: []
  };
    
  for (let i = 0; i < curveCoordinatesList.length; i++) {
      const curveCoordinates = curveCoordinatesList[i];
      const feature = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: curveCoordinates
        },
        properties: {
          'value':valueList[i]
        }
      };
    
    featureCollection.features.push(feature);
  }

  return featureCollection;
}

//-----------------------------------------------------------------------------------------
//绘制弧线图层
//以下所有绘制的流，都必须添加一个统一标识字段“_flow”
function addArctoMap(map1,featureCollection,lineList, valueList,drawnum)//输入：map，弧线集合，点集（为了取得终点），强度集
{
  //添加线图层
  map1.addSource('line_flow'+drawnum, {
    'type': 'geojson',
    lineMetrics: true,
    'data': featureCollection
  });


  map1.addLayer({
    'id': 'line_flow'+drawnum,
    'type': 'line',
    'source': 'line_flow'+drawnum,
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-width': [
        'interpolate',
        ['linear'],
        ['get', 'value'], // 使用 feature 的 value 字段作为插值属性
        1, // 最小值
        0.5, // 最小线宽
        7, // 最大值
        5 // 最大线宽
      ],
      'line-gradient': [
        'interpolate',
        ['linear'],
        ['line-progress'],
        0,
        'rgba(62, 16, 75, 0.4)',
        0.4,
        'rgba(62, 16, 75, 0.6)',
        1,
        '#4F709C'
      ]
      
    }
  });

  //添加终点点
  var i=0;
  var endPointList=[];
  for (const line of lineList) {
    const endPoint = line[1];
    const endPointGeoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [endPoint[0], endPoint[1]]
      },
      properties: {
        'value':valueList[i]
      }
    };
    endPointList.push(endPointGeoJSON);
    i++;
  }

  const pointCollection = {
    type: 'FeatureCollection',
    features: endPointList
  };

  map1.addSource('end-city-points_flow'+drawnum, {
    'type': 'geojson',
    'data': pointCollection
  });

  // 添加点图层
  map1.addLayer({
    'id': 'city-points-layer_flow'+drawnum,
    'type': 'circle',
    'source': 'end-city-points_flow'+drawnum,
    'paint': {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', 'value'], // 使用 feature 的 value 字段作为插值属性
        1, // 最小值
        2, // 最小线宽
        5, // 最大值
        6 // 最大线宽
      ],
      'circle-color': '#40128B'
    }
  });

  
  

}

//-----------------------------------------------------------------------------------------
//添加点图层(不是flow里面的)
function addPoints(map1){
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
        'circle-radius': 3,
        'circle-color': '#ff0000'
      }
  });
}

//-----------------------------------------------------------------------------------------
//流动动画
function flowanimation(map1,feature,i,start,value,drawnum)
{
  if(value>3)
  {
    value=3;
  }
  map1.addLayer({
    id: 'marker_flow'+i+drawnum,
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: start // 光点初始位置
          }
        }]
      }
    },
    
    paint: {
      'circle-radius': value, // 圆的半径
      'circle-color': 'rgba(91, 23, 109, 0.6)' // 圆的颜色
    }
  });
  

  // 设置动画参数和弧线坐标点
  const animationDuration = 5000; // 动画持续时间（毫秒）
  const curveCoordinates = feature.geometry.coordinates; // 弧线的坐标点
   
  // 开始动画
  function startAnimation() {
    let startTime = null;
  
    function animateMarker(timestamp) {
      if (!startTime) startTime = timestamp;
  
      const progress = timestamp - startTime; // 计算动画进度
  
      // 计算当前光点位置
      const currentCoordinates = turf.along(
        turf.lineString(curveCoordinates),
        (progress / animationDuration) * (turf.length(turf.lineString(curveCoordinates)))
      ).geometry.coordinates;
  
      // 更新图层的位置
      map1.getSource('marker_flow'+i+drawnum).setData({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: currentCoordinates
          }
        }]
      });
  
      // 检查动画是否结束
      if (progress < animationDuration) {
        // 递归调用进行下一帧动画
        requestAnimationFrame(animateMarker);
      } 
      else {
        // 动画完成后重新开始动画
        startTime = null;
        requestAnimationFrame(animateMarker);
      }
    }
  
    // 启动动画
    requestAnimationFrame(animateMarker);
  }
  
  // 启动循环动画
  startAnimation();
  
}

//-----------------------------------------------------------------------------------------
//起始点扩散动画
function changeStartPoint(map1,startpoint,drawnum){
  // 定义动画持续时间和帧率
  const animationDuration = 5000; // 动画持续时间，单位为毫秒
  const frameRate = 30; // 帧率，即每秒渲染的帧数

  // 定义点的初始大小和最终大小
  const initialSize = 5; // 初始大小
  const finalSize = 20; // 最终大小


  // 创建点的初始样式
  map1.addLayer({
      id: 'point_bigger_flow'+drawnum,
     type: 'circle',
      source: {
         type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                  type: 'Point',
                  coordinates: startpoint // 点的坐标
              },
            }],
        },
      },
      paint: {
      'circle-radius': initialSize, // 圆的半径
      'circle-color': 'rgba(91, 23, 109, 0.6)' // 圆的颜色
    }
  });

  function startAnimation() {
    let startTime = null;
  
    function animateMarker(timestamp) {
      if (!startTime) startTime = timestamp;
  
      const progress = timestamp - startTime; // 计算动画进度
  
       // 计算当前帧的大小
       const currentSize = initialSize + (finalSize - initialSize) * progress/animationDuration;
       // 更新点的大小
       if(map1.getLayer('point_bigger_flow'+drawnum))
       {
          map1.setPaintProperty('point_bigger_flow'+drawnum, 'circle-radius', currentSize);
          if(progress>animationDuration*0.9||progress<animationDuration*0.01)
          {
            map1.setPaintProperty('point_bigger_flow'+drawnum, 'circle-color', 'rgba(0, 0, 0, 0)');
          }
          else {
            var color0=0.6-progress/animationDuration*0.7
            if(color0<0)
            {
              color0;
            }
            map1.setPaintProperty('point_bigger_flow'+drawnum, 'circle-color', 'rgba(91, 23, 109, '+color0+')');
          }
          
       }
       
  
      // 检查动画是否结束
      if (progress < animationDuration) {
        // 递归调用进行下一帧动画
        requestAnimationFrame(animateMarker);
      } 
      else {
        // 动画完成后重新开始动画
        startTime = null;
        if(map1.getLayer('point_bigger_flow'+drawnum))
        {

            requestAnimationFrame(animateMarker);
        }

        else{
          return 0;
        }
        
      }
    }
  
    // 启动动画
    requestAnimationFrame(animateMarker);
  }
  
  // 启动循环动画
  startAnimation();
  
}

//-----------------------------------------------------------------------------------------
function clearMap(map) {

  // 清除非基础图层
  map.getStyle().layers.forEach(function(layer) {
    if (layer.id.includes("_flow")) {
      //console.log(layer.id);
      map.removeLayer(layer.id);
    }
  });

  // 清除所有源
  Object.keys(map.getStyle().sources).forEach(function(source) {
    if (source.id!=null) 
    {
      if(source.id.includes("_flow"))
      {
        //console.log(source.id);
        map.removeSource(source);
      }
      
    } 
  });
}

//-----------------------------------------------------------------------------------------
//将所有绘制逻辑全部封装进一个函数，输入：OD流坐标以及强度
function odFlowSence(map1,lineList,flowValue,drawnum){

  //获取弧线
  featureCollection=getArcFeature(lineList,flowValue);
			  
  //绘制弧线
  addArctoMap(map1,featureCollection,lineList,flowValue,drawnum);

  //绘制城市点
  //addPoints(map1);

  //绘制流动点
  for (var i = 0; i < featureCollection.features.length; i++)
  {
    flowanimation(map1,featureCollection.features[i],i,featureCollection.features[0],flowValue[i],drawnum);
  }

  //点动画变大
  changeStartPoint(map1,featureCollection.features[0].geometry.coordinates[0],drawnum);
}