# cylinder
echarts圆柱图，完美质感，支持label，支持堆叠

export default function(target, settings)

基本使用

  let chart = echarts.init(document.getElementById('chart'));
  cylinder(chart, {
      dataSource: {
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
      }
  });

 settings配置：
 
 * theme: array<string/object>, 柱子主题配色，可以是内置主题名，也可以是主题对象。应配置为数组，按系列依次对应
 * barWidth：number，柱状图宽度，0~1
 * barGap：number，柱状图系列间隔 0~1
 * stack：bool，开启堆叠模式
 * countStart: function(params, api, wSize, value), 自定义柱子定位点计算函数
 * label：object , 柱子顶部label
 * layout：string, 设置为y时柱子会横向放置，y轴会成为名称轴，x轴为数值轴
 * barMinHeight：number/function(height, seriesIndex, dataIndex)，柱子最小高度，为function时返回值将作为柱子最终高度
 * barMaxWidth: number, 柱子最大宽度
 * beforeRender: function(option), echarts渲染前触发，可调整生成的option
