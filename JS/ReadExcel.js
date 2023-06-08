//从excel读取流数据
async function getStreamData(path) {
    // 从 xlsx 文件中读取数据
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
  
    // 将数据转换为流数据的格式
    const points = data.map((row) => ({
      ox: row.O_X,
      oy: row.O_Y,
      dx: row.D_X,
      dy: row.D_Y,
      magnitude: row.REAL_Idx,
    }));
  
    return {
      type: 'FeatureCollection',
      features: points.map((point) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.ox, point.oy],
        },
        properties: {
          dx: point.dx,
          dy: point.dy,
          magnitude: point.magnitude,
        },
      })),
    };
  }
  
