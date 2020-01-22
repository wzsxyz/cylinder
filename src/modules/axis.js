/**
 * 提供一种默认的坐标轴配置
 */

function countRange(data, stack) {
  if (!Array.isArray(data)) {
    return null;
  }
  var sum = [];
  let max, min;
  data.forEach((s, i) => {
    if (!s) {
      return;
    }
    let theValue = Array.isArray(s.value) ? s.value : [s.value];
    let value = theValue.map((item) =>
      item && item.value ? item.value : item
    );
    let theMax = Math.max.apply(null, value);
    let theMin = Math.min.apply(null, value);
    if ((!max && max !== 0) || theMax > max) {
      max = theMax;
    }
    if ((!min && min !== 0) || theMin < min) {
      min = theMin;
    }
    value &&
      value.forEach(function(item, j) {
        sum[j] = sum[j] || 0;
        sum[j] += item;
      });
  });
  max = stack ? Math.max.apply(null, sum) : max;
  min = stack ? Math.min.apply(null, sum) : min;
  return { max, min };
}

function countAxisRange(valueRange, maxScale = 1.15) {

  let toEffective = (v) => {
    let r = v / Math.abs(v);
    v = Math.abs(v);
    let str = "" + v;
    let effectStr = str.replace(/^(0\.)?0*/, "").replace(/0+$/, "");
    let effectNum = Number(effectStr);
    let ratio = effectStr.replace(/\.\d+$/, "").length - 2;
    effectNum =
      Math.round(effectNum / Math.pow(10, ratio)) * Math.pow(10, ratio);
    return r * Number(str.replace(effectStr, "" + effectNum));
  };

  let axisMax = null,
    axisMin = null,
    maxHeight = valueRange.max || valueRange[1],
    minHeight = valueRange.min || valueRange[0];
  axisMax = maxHeight * maxScale;
  axisMin = minHeight * maxScale;
  if (axisMax > 10) {
    axisMax = Math.round(axisMax);
  } else if (axisMax > 0.1 && axisMax < 10) {
    axisMax = Math.round(axisMax * 100) / 100;
  }
  if (axisMin < -10) {
    axisMin = Math.round(axisMin);
  } else if (axisMin > -10 && axisMin < -0.1) {
    axisMin = Math.round(axisMin * 100) / 100;
  }

  if (axisMax && (Math.abs(axisMax) > 10 || Math.abs(axisMax) < 0.1)) {
    axisMax = toEffective(axisMax);
  }
  if (axisMin && (Math.abs(axisMin) > 10 || Math.abs(axisMax) < 0.1)) {
    axisMin = toEffective(axisMin);
  }
  return { axisMax, axisMin };
}

export default function(xAxisData, settings) {
  let {
    layout,
    dataSource,
    stack,
    valueAxisMax,
    valueAxisMin,
    axisNameBreakCharacters, // 名称折行字符数
  } = settings || {};

  if (axisNameBreakCharacters && xAxisData) {
    xAxisData = xAxisData.map((name) => {
      if (!name) {
        return name;
      }
      return ("" + name).replace(
        new RegExp(`.{${axisNameBreakCharacters}}`, "g"),
        (match) => {
          return match + "\n";
        }
      );
    });
  }

  let nameAxis = [
    {
      type: "category",
      color: "#8ca0b3m",
      data: xAxisData || [],
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#fff",
      },
    },
  ];
  let valueAxis = [
    {
      type: "value",
      color: "#8ca0b3m",
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#8ca0b3",
        textStyle: {},
      },
      splitLine: {
        lineStyle: {
          type: "dotted",
          color: "rgba(140,160,179, 0.2)",
        },
      },
      position: layout === "y" ? "right" : "left",
    },
  ];

  if (dataSource && dataSource.data) {
    let data = dataSource.data;
    if (Array.isArray(data)) {
      let valueRange = countRange(data, stack);
      let axisRange = countAxisRange(valueRange);
      let { axisMax, axisMin } = axisRange;
      if (valueAxisMax) {
        axisMax =
          typeof valueAxisMax == "function"
            ? valueAxisMax(valueRange.max)
            : valueAxisMax;
      }
      if (valueAxisMin) {
        axisMin =
          typeof valueAxisMin == "function"
            ? valueAxisMin(valueRange.min)
            : valueAxisMin;
      }

      if (axisMax && axisMax > 0) {
        valueAxis[0].max = axisMax;
      }

      if (axisMin && axisMin < 0) {
        valueAxis[0].min = axisMin;
      }
    }
  }

  let xAxis, yAxis;
  if (Array.isArray(layout)) {
    (xAxis = nameAxis),
      (yAxis = [
        Object.assign({}, nameAxis[0], {
          data: layout,
        }),
      ]);
  } else {
    xAxis = layout === "y" ? valueAxis : nameAxis;
    yAxis = layout === "y" ? nameAxis : valueAxis;
  }
  return { xAxis, yAxis };
}

export { countAxisRange, countRange as countDataRange };
