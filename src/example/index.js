import echarts from "echarts";
require("./style.less");
import cylinder from "../index";

function getRn() {
  return Math.round(Math.random()*100)*1000;
}

let data = {
    name: [2016,2017,2018],
    data: [
        {
            name: '资产',
            value: [1,2,3].map(()=>getRn())
        },
        {
            name: '负债',
            value: [1,2,3].map(()=>getRn())
        },
        {
            name: '收入',
            value: [1,2,3].map(()=>getRn())
        }
    ]
};

let chart1 = echarts.init(document.getElementById('chart1'));
cylinder(chart1, {
    dataSource: data,
    tooltip: {show: true, trigger: 'axis'}
});

let chart2 = echarts.init(document.getElementById('chart2'));
cylinder(chart2, {
    dataSource: data,
    stack:true,
    tooltip: {show: true, trigger: 'axis'}
});

let chart3 = echarts.init(document.getElementById('chart3'));
cylinder(chart3, {
    dataSource: data,
    layout: 'y',
    label:{
        formatter: '{c}元'
    },
    theme: ['blue_level','silver_level','yellow_level'],
    tooltip: {show: true, trigger: 'axis'}
});

let chart4 = echarts.init(document.getElementById('chart4'));
cylinder(chart4, {
    dataSource: data,
    layout: 'y',
    stack: true,
    theme: ['blue_level','silver_level','yellow_level'],
    tooltip: {show: true, trigger: 'axis'}
});

let chart5 = echarts.init(document.getElementById('chart5'));
cylinder(chart5, {
    dataSource: data,
    tooltip: {show: true, trigger: 'axis'},
    label: {
        color:'#bcd',
        offsetX: 20
    },
    theme: [
        {
            color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: ['#876','#fcb','#987','#fcb','#876'].map((item, i) => {
                    return {
                        offset: i * 0.25,
                        color: item,
                    };
                }),
            },
            arcColor: '#fcb',
            arcBorder: '#fcb',
            arcBorderWidth: 1
        },
        {
            color: '#eaa',
            arcColor: '#fcb',
            arcBorder: '#fcb',
            arcBorderWidth: 1
        },
        'silver',
        'blue'
    ]
});
