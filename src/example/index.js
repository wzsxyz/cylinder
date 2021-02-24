import echarts from "echarts";
require("./style.less");
import cylinder from "../index";

function getRn() {
  return Math.round(Math.random()*100)*1000+5000;
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
    title: {
        text: '基本形态',
        textStyle: {color: '#fff'}
    },
    dataSource: data,
    tooltip: {show: true, trigger: 'axis'}
});

let chart2 = echarts.init(document.getElementById('chart2'));
cylinder(chart2, {
    title: {
        text: '堆叠',
        textStyle: {color: '#fff'}
    },
    dataSource: data,
    stack:true,
    tooltip: {show: true, trigger: 'axis'}
});

let chart3 = echarts.init(document.getElementById('chart3'));
cylinder(chart3, {
    title: {
        text: '横向放置',
        textStyle: {color: '#fff'}
    },
    dataSource: data,
    layout: 'y',
    label:{
        formatter: '{c}元'
    },
    theme: ['blue_level','green_level','yellow_level'],
    tooltip: {show: true, trigger: 'axis'}
});

let chart4 = echarts.init(document.getElementById('chart4'));
cylinder(chart4, {
    title: {
        text: '横向堆叠',
        textStyle: {color: '#fff'}
    },
    dataSource: data,
    layout: 'y',
    stack: true,
    theme: ['blue_level','green_level','yellow_level'],
    tooltip: {show: true, trigger: 'axis'}
});

let chart5 = echarts.init(document.getElementById('chart5'));
cylinder(chart5, {
    title: {
        text: '主题、自定义主题、其他配置',
        textStyle: {color: '#fff'}
    },
    dataSource: {
        name: [''],
        data: ['自定义','自定义','blue','green','yellow','silver','black'].map(name=>({
            name: name,
            value: [getRn()]
        }))
    },
    tooltip: {show: true, trigger: 'axis'},
    barGap: 0.3,
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
                colorStops: ['#833','#fab','#966','#fab','#833'].map((item, i) => {
                    return {
                        offset: i * 0.25,
                        color: item,
                    };
                }),
            },
            arcColor: '#fab',
            arcBorder: '#fab',
            arcBorderWidth: 1
        },
        {
            color: '#eaa',
            arcColor: '#fcb',
            arcBorder: '#fcb',
            arcBorderWidth: 1
        },
        'blue',
        'green',
        'yellow',
        'silver',
        'black'
    ]
});
