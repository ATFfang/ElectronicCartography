function GetFlowData()
{
    const lineList = [
        [[116.38,39.87], [121.46,31.25]], // 第一条线条的起始点和结束点坐标
        [[116.38,39.87], [104.07,30.57]],
        [[116.38,39.87], [126.54,45.80]],
        [[116.38,39.87], [103.83,36.06]],
        [[116.38,39.87], [119.78,49.17]],
        [[116.38,39.87], [117.20,39.09]],
        [[116.38,39.87], [120.21,30.25]],
        [[116.38,39.87], [100.27,25.61]],
        [[116.38,39.87], [112.94,28.23]],
        [[116.38,39.87], [114.30,30.59]],
        [[116.38,39.87], [91.12,29.65]],
        [[116.38,39.87], [113.26,23.13]],
        [[116.38,39.87], [109.95,40.62]],
    ];
    
    const flowValue=[7,4,3,2,3,2,4,2,3,5,2,4,2];
    
    const lineList2 = [
        [[121.46,31.25], [116.38,39.87]], // 第一条线条的起始点和结束点坐标
        [[121.46,31.25], [104.07,30.57]],
        [[121.46,31.25], [126.54,45.80]],
        [[121.46,31.25], [103.83,36.06]],
        [[121.46,31.25], [119.78,49.17]],
        [[121.46,31.25], [117.20,39.09]],
        [[121.46,31.25], [120.21,30.25]],
        [[121.46,31.25], [100.27,25.61]],
        [[121.46,31.25], [112.94,28.23]],
        [[121.46,31.25], [114.30,30.59]],
        [[121.46,31.25], [91.12,29.65]],
        [[121.46,31.25], [113.26,23.13]],
        [[121.46,31.25], [109.95,40.62]],
    ];
    
    const flowValue2=[7,2,3,2,3,2,4,2,3,5,2,4,2];
    
    const lineList3 = [
        [[100.27,25.61], [116.38,39.87]], // 第一条线条的起始点和结束点坐标
        [[100.27,25.61], [104.07,30.57]],
        [[100.27,25.61], [126.54,45.80]],
        [[100.27,25.61], [103.83,36.06]],
        [[100.27,25.61], [119.78,49.17]],
        [[100.27,25.61], [121.46,31.25]],
        [[100.27,25.61], [120.21,30.25]],
        [[100.27,25.61], [117.20,39.09]],
        [[100.27,25.61], [112.94,28.23]],
        [[100.27,25.61], [114.30,30.59]],
        [[100.27,25.61], [91.12,29.65]],
        [[100.27,25.61], [113.26,23.13]],
        [[100.27,25.61], [109.95,40.62]],
    ];
    
    const flowValue3=[4,2,3,2,3,2,4,2,6,5,2,4,2];
    
    
    var Datatuple=[lineList,flowValue];
    var Datatuple2=[lineList2,flowValue2];
    var Datatuple3=[lineList3,flowValue3];
    
    var DatatupleList=[Datatuple,Datatuple2,Datatuple3];

    return DatatupleList;
}