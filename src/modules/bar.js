/**
 * 一些柱状图公共逻辑
 */

function countDH(context, api, params) {
  let { seriesIndex } = params;
  let contextOption = context.getOption();
  let { yAxis, xAxis, series } = contextOption;
  if (!yAxis || !xAxis) {
    return 0;
  }
  let xAxisIndex = series[seriesIndex].xAxisIndex || 0;
  let yAxisIndex = series[seriesIndex].yAxisIndex || 0;
  let theXAxis = xAxis[xAxisIndex];
  let theYAxis = yAxis[yAxisIndex];
  let valueAxis, isLand;
  if (theYAxis && theYAxis.type !== "category") {
    valueAxis = theYAxis;
  } else if (theXAxis && theXAxis.type === "value") {
    valueAxis = theXAxis;
    isLand = true;
  }
  let min = valueAxis.min || 0,
    max = valueAxis.max;
  let result = 0;
  if (min > 0) {
    result = api.size(isLand ? [min, 1] : [1, min])[isLand ? 0 : 1];
  }
  if (max < 0) {
    result = api.size(isLand ? [-1 * max, 1] : [1, -1 * max])[isLand ? 0 : 1];
  }
  return result;
}

export { countDH };
