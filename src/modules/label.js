/**
 * 提供一种通用的label方案
 */

import utils from "./util";

function createLabel(value, option) {
  let {
    x,
    y,
    xAlign = "center",
    yAlign = "bottom",
    offsetX = 0,
    offsetY = 0,
    formatter,
    thousands,
    unit,
    style = {},
    unitStyle = {},
    show,
    rich,
    correction,
    labelData,
  } = option;

  let textAlign = option.textAlign || xAlign;
  let textVerticalAlign = option.textVerticalAlign || yAlign;

  if (thousands && /^\d+(\.\d+)?$/.test(value)) {
    value = utils.thousands(value);
  }
  if (typeof formatter == "function") {
    value = formatter(value);
  }

  if (formatter && typeof formatter == "string") {
    labelData = labelData || {};
    labelData.value = labelData.value || value;
    value = utils.formatLabel(formatter, labelData);
  }

  if (!value) {
    value = "";
  }

  if (unit) {
    value = `${value} {unit|${unit}}`;
  }

  let lx = x + offsetX,
    ly = y - offsetY;

  var labelText = Object.assign(
    {},
    {
      x: lx,
      y: ly,
      textAlign,
      textVerticalAlign,
      textLineHeight: 18,
      textPadding: 3,
      text: "" + value,
      fill: style.color || style.textFill || option.color || "#fff",
      font:
        style.font ||
        `${style.fontSize ||
          option.fontSize ||
          14}px ${style.fontFamily}, sans-serif`,
      rich: Object.assign(
        {
          /*blue: {
            textFill: "rgba(0,208,255,1)",
          },
          yellow: {
            textFill: "rgba(255,219,0,1)",
          },
          green: {
            textFill: "rgba(0,255,146,1)",
          },*/
          white: {
            textFill: "#fff",
          },
          yellow: {
            textFill: "#FCC102",
          },
          blue: {
            textFill: "#468FFF",
          },
          orange: {
            textFill: "#F76B1C",
          },
          red: {
            textFill: "#B42323",
          },
          green: {
            textFill: "#429321",
          },
          black: {
            textFill: "#666",
          },
          unit: (() => {
            let theUnitStyle = Object.assign({}, style, unitStyle);
            let { fontSize, fontFamily, color, ...elseStyle } = theUnitStyle;
            if (color) {
              elseStyle.textFill = color;
            }
            return Object.assign(
              {},
              {
                font: `${fontSize || 14}px ${fontFamily}, sans-serif`,
              },
              elseStyle
            );
          })(),
        },
        rich || {}
      ),
    }
  );

  if (typeof correction == "function") {
    correction(labelText);
  }

  var items = [
    {
      type: "text",
      invisible: show === false,
      style: labelText,
      z2: 30,
    },
  ];

  /*if (unit && typeof unit == "string") {
    unit = "" + unit.trim();
    var text = labelText.text,
      fontSize = 14;

    let dx=0,dy=0;
    dx = ((text.length - 2) * fontSize) / 3;
    //dy = (-1 * fontSize) / 7;

    labelText.x += dx;
    labelText.textAlign = "right";
    var unitText = Object.assign({}, labelText, {
      textAlign: "left",
      text: unit,
      //textPadding: 0,
      y: labelText.y + dy,
      font: unitStyle.font || '12px "Microsoft YaHei", sans-serif',
    });
    items.push({
      type: "text",
      invisible: show === false,
      style: unitText,
    });
  }*/
  return {
    type: "group",
    children: items,
    origin: [lx, ly],
  };
}

function customBarLabel(value, props, { params, x, y }) {
  let { label, layout, dataSource } = props;
  let { seriesName, seriesIndex, dataIndex } = params || {};
  let _label;
  if (typeof label == "function") {
    _label = Object.assign({}, label(arguments[2]));
  } else {
    _label = Object.assign({}, label || {});
  }
  let { formatter } = _label;
  if (Array.isArray(formatter)) {
    _label.formatter = formatter[seriesIndex];
  }
  let isLandscape = layout === "y";
  let labelLayout = isLandscape ? { yAlign: "center", xAlign: "left" } : {};
  let record = utils.findRecordBy("name", seriesName, dataSource.data);
  let labelProps = Object.assign({ x, y, value }, labelLayout, _label);
  if (!record) {
    return createLabel(value, labelProps);
  }
  let labelData = {
    name: record.name,
    seriesName,
    value,
  };
  Object.keys(record).forEach((key) => {
    // 从数据源中取出该柱子对应的额外维度值，写入labelData
    if (key === "value") {
      return;
    }
    let item = record[key];
    if (!Array.isArray(item)) {
      return;
    }
    let fieldValue = item[dataIndex];
    labelData[key] = fieldValue;
  });
  labelProps.labelData = Object.assign(labelProps.labelData || {}, labelData);
  return createLabel(value, labelProps);
}

export default createLabel;

export { customBarLabel };
