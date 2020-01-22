import { countDH } from "./bar";

function renderBarItem(settings) {
  let {
    countStart, // 起始位置
    countValue, // 重置value
    barWidth = 0.5, // 柱宽（0-1）
    barMaxWidth,
    style, // 柱样式
    attach, // 附加图件
    layout='x', // 柱子默认垂直放置，y表示横向放置
    barMinHeight, // 柱子最小高度
    baseShapeControl, // 柱子形状调整回调
    eccentricity = 0.36, // 柱子椭圆偏心率
  } = settings;

  function getArcItem(shape, style, layout) {
    return {
      type: "arc",
      scale: layout == "y" ? [eccentricity, 1] : [1, eccentricity],
      origin: [shape.cx, shape.cy],
      shape,
      style: style,
    };
  }
  function getRectItem(shape, style) {
    return {
      type: "rect",
      shape,
      style: style,
    };
  }

  return function(params, api) {
    var seriesIndex = params.seriesIndex;
    var i = params.dataIndex;
    var x = i,
      y = countValue ? countValue(params, api) : api.value(1);
    var height = api.size([x, y])[1] * (y >= 0 ? 1 : -1);
    var size = api.size([1, y]);
    let width =
      typeof barWidth == "function"
        ? barWidth(size[0], { value: y, height, seriesIndex, dataIndex: i })
        : size[0] * barWidth;
    if (barMaxWidth && width > barMaxWidth) {
      width = barMaxWidth;
    }
    if (barMinHeight) {
      if (typeof barMinHeight === "number" && height < barMinHeight)
        height = barMinHeight;
      if (typeof barMinHeight === "function")
        height = barMinHeight(height, seriesIndex, i);
    }
    let hafeWidth = width / 2;
    let o, shape1, shape2, shape1_hafe, shape2_hafe;
    let rectShape;
    if (layout === "y") {
      (y = i), (x = api.value(0));
      height = api.size([x, y])[0] * (x >= 0 ? 1 : -1);
      size = api.size([x, 1]);
      width =
        typeof barWidth == "function"
          ? barWidth(size[1], { value: x, height, seriesIndex, dataIndex: i })
          : size[1] * barWidth;
      if (barMaxWidth && width > barMaxWidth) {
        width = barMaxWidth;
      }
      hafeWidth = width / 2;
      o = countStart
        ? countStart({
            params: params,
            api: api,
            width: width,
            value: x,
            height: height,
          })
        : api.coord([0, y]);
    } else {
      o = countStart
        ? countStart({
            params: params,
            api: api,
            width: width,
            value: y,
            height: height,
          })
        : api.coord([x, 0]);
    }

    if (settings.context) {
      // 支持非0的坐标轴起始值
      let dh = countDH(settings.context, api, params);
      let _heightIndex = layout === "y" ? 0 : 1;
      let zeroPoint = api.coord([0, 0]);
      let isStandZero = o[_heightIndex] == zeroPoint[_heightIndex];
      if (dh && isStandZero) {
        if (layout === "y") {
          o[0] += dh;
          height -= dh;
        } else {
          o[1] -= dh;
          height -= dh;
        }
      }
    }

    let eccentricityOffset = (width * eccentricity) / 2;

    if (layout === "y") {
      o[0] += eccentricityOffset;
      shape1 = {
        cx: o[0],
        cy: o[1],
        r: hafeWidth,
      };
      shape1_hafe = Object.assign({}, shape1, {
        startAngle: Math.PI / 2,
        endAngle: (Math.PI * 3) / 2,
      });
      rectShape = {
        x: o[0],
        y: o[1] - hafeWidth,
        width: height,
        height: width,
      };
    } else {
      o[1] -= eccentricityOffset;
      shape1 = {
        cx: o[0],
        cy: o[1],
        r: hafeWidth,
      };
      shape1_hafe = Object.assign({}, shape1, {
        startAngle: 0,
        endAngle: Math.PI,
      });
      rectShape = {
        x: o[0] - hafeWidth,
        y: o[1] - height,
        width,
        height,
      };
    }

    baseShapeControl && baseShapeControl(shape1);

    shape2 = Object.assign({}, shape1);
    shape2_hafe = Object.assign({}, shape1_hafe);
    shape2_hafe.startAngle += Math.PI;
    shape2_hafe.endAngle += Math.PI;
    delete shape2.startAngle;
    delete shape2.endAngle;
    if (layout === "y") {
      shape2.cx += height;
      shape2_hafe.cx += height;
    } else {
      shape2.cy -= height;
      shape2_hafe.cy -= height;
    }

    let arcStyle = style || api.style(),
      rectStyle = style || api.style();
    if (typeof style == "function") {
      arcStyle = style(params, "arc");
      rectStyle = style(params, "rect");
    }
    var groupItems = [
      /*getArcItem(shape1, rectStyle, layout),
        getArcItem(shape1_hafe, {stroke: arcStyle.stroke, fill: 'transparent', lineWidth: arcStyle.lineWidth}, layout),*/
      getArcItem(shape1, rectStyle, layout),
      getArcItem(shape1_hafe, rectStyle, layout),
      getRectItem(rectShape, rectStyle),
      getArcItem(shape2_hafe, rectStyle, layout),
      getArcItem(shape2, arcStyle, layout),
    ];
    if (attach) {
      var attachItems = attach;
      if (typeof attach == "function") {
        var lx = o[0],
          ly = shape2.cy - eccentricityOffset;
        if (layout === "y") {
          (lx = shape2.cx + eccentricityOffset), (ly = o[1]);
        }
        var theValue = layout !== "y" ? y : x;
        attachItems = attach({
          x: lx,
          y: ly,
          o: o.concat([]),
          value: theValue,
          width,
          height: height,
          api: api,
          params: params,
        });
      }
      if (attachItems && !Array.isArray(attachItems)) {
        attachItems = [attachItems];
      }
      groupItems = groupItems.concat(attachItems || []);
    }
    return {
      type: "group",
      children: groupItems,
    };
  };
}

export default renderBarItem;
