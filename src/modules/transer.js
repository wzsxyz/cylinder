/** 立体柱状图
 * 支持的配置：
 * barWidth：number，柱状图宽度，0~1
 * barGap：number，柱状图系列间隔 0~1
 * stack：bool，开启堆叠模式
  * countStart: function(params, api, wSize, value), 自定义柱子定位点计算函数
 * label：object , 柱子顶部label
 * layout：string, 设置为y时柱子会横向放置，y轴会成为名称轴，x轴为数值轴
 * barMinHeight：number/function(height, seriesIndex, dataIndex)，柱子最小高度，为function时返回值将作为柱子最终高度
 * barMaxWidth: number, 柱子最大宽度
 * beforeRender: function(option), echarts渲染前触发，可调整生成的option
 */

import renderBarItem from "./renderitem";
import getAxis from "./axis";
import { customBarLabel } from "./label";
import themeDict from "./theme";
import utils from "./util";

function countRange(data, stack) {
  var sum = [];
  let max, min;
  data.forEach((s, i) => {
    let theMax = Math.max.apply(null, s.value);
    let theMin = Math.min.apply(null, s.value);
    if ((!max && max !== 0) || theMax > max) {
      max = theMax;
    }
    if ((!min && min !== 0) || theMin < min) {
      min = theMin;
    }
    s.value.forEach(function(item, j) {
      sum[j] = sum[j] || 0;
      sum[j] += item;
    });
  });
  max = stack ? Math.max.apply(null, sum) : max;
  min = stack ? Math.min.apply(null, sum) : min;
  return { max, min };
}

function transer(settings, context) {
  let {
    dataSource: data,
    theme,
    barWidth,
    barMaxWidth,
    barGap,
    stack,
    countStart,
    layout,
    maxScale,
    valueAxisMax,
    valueAxisMin,
    barMinHeight,
    baseShapeControl,
    stand = false,
    halo = false,
    eccentricity = 0.36,
    attachItems,
  } = settings;

  let stackData = {};

  let makeHaloItems = (x, y, r, themeItem, myEccentricity) => {
    return {
      type: "circle",
      shape: {
        cx: x,
        cy: y,
        r: r,
      },
      origin: [x, y],
      scale:
        layout !== "y"
          ? [1, myEccentricity || eccentricity]
          : [myEccentricity || eccentricity, 1],
      style: {
        stroke: themeItem.arcBorder,
        lineWidth: themeItem.arcBorderWidth,
        fill: "transparent",
      },
      z2: 10,
    };
  };

  let labelItems = function(option) {
    let { value } = option;

    let items = [];

    var labelItem = customBarLabel(value, settings, option);

    if (labelItem && labelItem.children) {
      labelItem.children.forEach((item) => (item.z2 = 10));
      items.push(labelItem);
    }

    return items;
  };

  let barLayoutCount = stack || !data.data.length ? 1 : data.data.length;
  barGap = barGap || 0.4 / barLayoutCount;
  barWidth = barWidth || 0.6 / (barLayoutCount + 0.5);
  let series = data.data.map(function(item, i) {
    return {
      name: item.name,
      type: "custom",
      itemStyle: {
        normal: {
          color: theme[i].color,
        },
      },
      renderItem: renderBarItem({
        countStart: function(_ref) {
          var params = _ref.params,
            api = _ref.api,
            wSize = _ref.width,
            dh = _ref.height;

          if (countStart) return countStart.apply(this, arguments);
          var seriesIndex = params.seriesIndex,
            dataIndex = params.dataIndex;

          if (dataIndex === 0 && seriesIndex === 0) {
            stackData = {};
          }
          var stackValue = (stackData[dataIndex] = stackData[dataIndex] || {});
          var countSum = function countSum() {
            var sum = 0;
            Object.keys(stackValue).forEach(function(key) {
              if (key >= seriesIndex) return;
              var item = stackValue[key] || 0;
              sum += item;
            });
            return sum;
          };
          var num = data.data.length;
          var pIndex = seriesIndex;
          var height = countSum() || 0;
          if (layout !== "y") {
            var o = api.coord([dataIndex, 0]);
            if (stack) {
              o[1] -= height;
            } else {
              o[0] +=
                pIndex * wSize * (1 + barGap) -
                ((num - 1) / 2) * wSize * (1 + barGap);
            }
          } else {
            o = api.coord([0, dataIndex]);
            if (stack) {
              o[0] += height;
            } else {
              o[1] -=
                pIndex * wSize * (1 + barGap) -
                ((num - 1) / 2) * wSize * (1 + barGap);
            }
          }
          stackValue[seriesIndex] = dh;
          return o;
        },

        barWidth: barWidth || 0.25,
        barMaxWidth,
        layout: layout,
        barMinHeight: barMinHeight,
        baseShapeControl: baseShapeControl,
        eccentricity,
        context,
        style: (params, witch) => {
          let themeItem;
          if (typeof theme == "function") {
            themeItem = theme(params, witch);
          } else {
            themeItem = theme[params.seriesIndex];
          }
          if (!themeItem) {
            return null;
          }
          if (witch == "arc") {
            return {
              fill: themeItem.arcColor,
              stroke: themeItem.arcBorder,
              lineWidth: themeItem.arcBorderWidth,
            };
          } else {
            return {
              fill: themeItem.color,
              stroke: "transparent",
              lineWidth: 0,
            };
          }
        },
        attach({ params, o, width, height }) {
          let { seriesIndex } = params;
          let items = [];
          let isStand = () => {
            if (stack) return seriesIndex === 0;
            return true;
          };
          let themeItem = theme[seriesIndex];
          if (stand && isStand()) {
            let item = makeHaloItems(
              o[0],
              o[1],
              width * 0.65,
              themeItem,
              eccentricity * 1.35
            );
            item.z2 = -1;
            Object.assign(item.style, {
              lineWidth: themeItem.arcBorderWidth * 1.5,
            });
            items.push(item);
            let standFillItem = {
              type: "arc",
              shape: {
                cx: o[0],
                cy: o[1],
                r: width * 0.7,
                r0: width / 2,
              },
              origin: o,
              scale:
                layout !== "y"
                  ? [1, eccentricity * 1.35]
                  : [eccentricity * 1.35, 1],
              style: {
                stroke: "transparent",
                fill: themeItem.standFill,
              },
              z2: -1,
            };
            items.push(standFillItem);
            let standShadowItem = {
              type: "arc",
              shape: {
                cx: o[0],
                cy: o[1],
                r: width * 1.2,
                r0: width * 0.7,
              },
              origin: o,
              scale:
                layout !== "y"
                  ? [1, eccentricity * 1.35]
                  : [eccentricity * 1.35, 1],
              style: {
                stroke: "transparent",
                fill: themeItem.standShadowFill,
              },
              z2: -1,
            };
            items.push(standShadowItem);
          }
          if (halo && isStand()) {
            let dh = halo.threshold || 30;
            o = o.concat([]);
            if (height > dh) {
              let ox = o[0],
                oy = o[1];
              if (layout == "y") {
                ox += dh;
              } else {
                oy -= dh;
              }
              items.push(makeHaloItems(ox, oy, width / 2, themeItem));
              items.push(makeHaloItems(ox, oy, (width * 3) / 10, themeItem));
              if (layout == "y") {
                ox -= width / 20;
              } else {
                oy += width / 20;
              }
              items.push(
                makeHaloItems(ox, oy, (width * 2) / 10, theme[seriesIndex])
              );
            }
          }
          let labels = labelItems(arguments[0]);
          items = items.concat(labels || []);
          if (typeof attachItems == "function") {
            items = items.concat(attachItems.apply(this, arguments));
          }
          return items;
        },
      }),
      dimensions: ["from", "to", "profit"],
      data: item.value,
    };
  });
  var option = {
    grid: {
      containLabel: true
    },
    series: series,
  };
  let axisOption = getAxis(data.name, settings);

  let valueRange = countRange(data.data, stack);

  let axisMax = null,
    axisMin = null,
    maxHeight = valueRange.max,
    minHeight = valueRange.min < 0 ? valueRange.min : 0;
  if (stack) {
    axisMax = maxHeight * (maxScale || 1.1);
    axisMin = minHeight * (maxScale || 1.1);
    if (axisMax > 10) {
      axisMax = Math.round(axisMax);
    } else if (axisMax > 1 && axisMax < 10) {
      axisMax = Math.round(axisMax * 100) / 100;
    }
    if (axisMin < -10) {
      axisMin = Math.round(axisMin);
    } else if (axisMax > -10 && axisMax < 1) {
      axisMin = Math.round(axisMin * 100) / 100;
    }
  }
  if (valueAxisMax) {
    axisMax =
      typeof valueAxisMax == "function"
        ? valueAxisMax(maxHeight)
        : valueAxisMax;
  }
  if (valueAxisMin) {
    axisMin =
      typeof valueAxisMin == "function"
        ? valueAxisMin(minHeight)
        : valueAxisMin;
  }
  if (axisMax && axisMax > 0) {
    axisOption[layout == "y" ? "xAxis" : "yAxis"][0].max = axisMax;
  }

  if (axisMin && axisMin < 0) {
    axisOption[layout == "y" ? "xAxis" : "yAxis"][0].min = axisMin;
  }

  option = Object.assign({}, axisOption, option);

  return option;
}

export { renderBarItem };

export default function(target, settings) {
    let { option={}, tooltip, theme, beforeRender, ...chartSettings} = settings;
    option.tooltip = Object.assign(option.tooltip||{}, tooltip||{});
    let themes = theme?theme.map(item=>themeDict[item]||item):[];
    if(!themes.length){
        themes = Object.keys(themeDict).map(item=>themeDict[item]);
    }
    chartSettings.theme = themes;
    let chart = target;
    let chartOption = transer(chartSettings, chart);
    if(!chart) {
      return chartOption;
    }
    let optionResult = utils.extend(chartOption, option);
    beforeRender && beforeRender(chartOption, optionResult);
    chart.setOption(optionResult);
    return chart;
}
