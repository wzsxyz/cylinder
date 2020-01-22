/**
 * 常用函数方法
 */

// 解决四维运算,js计算失去精度的问题

// 加法
Number.prototype.add = function(arg) {
  var r1, r2, m;
  try {
    r1 = this.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (this * m + arg * m) / m;
};
// 减法
Number.prototype.sub = function(arg) {
  return this.add(-arg);
};
// 乘法
Number.prototype.mul = function(arg) {
  var m = 0,
    s1 = this.toString(),
    s2 = arg.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {
    console.log(e);
  }
  try {
    m += s2.split(".")[1].length;
  } catch (e) {
    console.log(e);
  }
  return (
    (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
    Math.pow(10, m)
  );
};

const utils = {
  thousands(num) {
    // 数字千分位
    num = num + "";
    if (!num || num == "null" || isNaN(num)) {
      return num;
    }
    if (/^.*\..*$/.test(num)) {
      let pointIndex = num.lastIndexOf(".");
      let intPart = num.substring(0, pointIndex);
      let pointPart = num.substring(pointIndex + 1, num.length);
      intPart = intPart + "";
      let re = /(-?\d+)(\d{3})/;
      while (re.test(intPart)) {
        intPart = intPart.replace(re, "$1,$2");
      }
      num = intPart + "." + pointPart;
    } else {
      num = num + "";
      let re = /(-?\d+)(\d{3})/;
      while (re.test(num)) {
        num = num.replace(re, "$1,$2");
      }
    }
    return num;
  },
  isJSONObject(obj) {
    // 判断简单json对象
    if (!obj) {
      return false;
    }
    return (
      typeof obj == "object" &&
      Object.prototype.toString.call(obj).toLowerCase() == "[object object]"
    );
  },
  extend() {
    // 类似Object.assign，但会递归继承每个字段
    let [target, ...sources] = Array.from(arguments);
    for (let i = 0; i < sources.length; i++) {
      utils.merge(target, sources[i]);
    }
    return target;
  },
  merge(target, source, onMerge) {
    // 深层合并两个对象
    for (let key in source) {
      let item = source[key];
      if (typeof onMerge == "function") {
        let re = onMerge(target[key], item);
        if (typeof re !== "undefined") {
          target[key] = re;
          continue;
        }
      }
      if (Array.isArray(item)) {
        target[key] = item.concat([]);
      } else if (utils.isJSONObject(item)) {
        if (
          !target[key] ||
          typeof target[key] != "object" ||
          Array.isArray(target[key])
        ) {
          target[key] = {};
        }
        utils.merge(target[key], item);
      } else {
        if (typeof item !== "undefined") {
          target[key] = item;
        }
      }
    }
    return target;
  },
  clone(source) {
    // 深层克隆
    return Array.isArray(source) ? source.concat([]) : utils.extend({}, source);
  },
  mergeArray(target, origin) {
    // 合并数组（逐个递归合并）
    if (!Array.isArray(origin)) {
      return target;
    }
    if (!Array.isArray(target)) {
      target = [];
    }

    let onMerge = (targetItem, sourceItem) => {
      if (Array.isArray(sourceItem)) {
        return utils.mergeArray(targetItem, sourceItem);
      } else if (utils.isJSONObject(sourceItem)) {
        return utils.merge(targetItem || {}, sourceItem, onMerge);
      } else {
        return sourceItem;
      }
    };

    origin.forEach((item, i) => {
      if (utils.isJSONObject(item)) {
        target[i] = utils.merge(target[i] || {}, item || {}, onMerge);
      } else if (Array.isArray(item)) {
        target[i] = utils.mergeArray(target[i], item);
      } else {
        target[i] = item;
      }
    });
    return target;
  },
  formatDate(date, formatString) {
    // 格式化日期对象
    let fixNumber = (number) => {
      return number < 10 ? "0" + number : "" + number;
    };

    let rDate = date;
    if (typeof date == "string") {
      rDate = new Date(date);
    }
    if (isNaN(rDate)) {
      return date;
    }

    formatString = formatString || "YY-MM-DD";

    let params = {
      YY: rDate.getFullYear(),
      MM: fixNumber(rDate.getMonth() + 1),
      DD: fixNumber(rDate.getDate()),
      hh: fixNumber(rDate.getHours()),
      mm: fixNumber(rDate.getMinutes()),
      ss: fixNumber(rDate.getSeconds()),
    };
    let result = formatString;
    for (let name in params) {
      result = result.replace(name, params[name]);
    }
    return result;
  },
  formatLabel(str, data) {
    // label的模板格式化
    let { seriesName, name, value } = data;
    let nullFormat = utils.nullFormat;
    return str
      .replace(/\{a\}/g, nullFormat(seriesName))
      .replace(/\{b\}/g, nullFormat(name))
      .replace(/\{c\}/g, nullFormat(value))
      .replace(/\{value\}/g, value)
      .replace(/{[\w\u4e00-\u9fa5]+\}/g, (match) => {
        let fieldName = match.replace(/[{}]/g, "");
        let fieldValue = data[fieldName];
        return nullFormat(fieldValue);
      });
  },
  nullFormat(value, nullStr = "") {
    return value || value === 0 ? value : nullStr;
  },
  isPromise(fn) {
    // 判断是否Promise
    return Object.prototype.toString.call(fn) == "[object Promise]";
  },
  getDomProps(props) {
    // 粗略筛选传递给react dom的属性，大致过滤组件自身props
    let domProps = {};
    Object.keys(props).forEach((name) => {
      if (
        /^on[A-Z][a-zA-Z]+$/.test(name) ||
        /^data-/.test(name) ||
        ["id", "style", "className", "name", "src", "href"].indexOf(name) != -1
      ) {
        domProps[name] = props[name];
      }
    });
    return domProps;
  },
  roundOff(number, x = 2) {
    // 保留x位小数，x默认为2
    let num = parseFloat(number);
    let r = Math.pow(10, x);
    return Math.round(num * r) / r;
  },
  forceTwo(num) {
    num = "" + (num || "");
    let arr = num.split(".");
    if (!arr[1]) {
      arr[1] = "00";
    }
    if (arr.length) {
      arr[1] = (arr[1].charAt(0) || "0") + (arr[1].charAt(1) || "0");
    }
    return arr.join(".");
  },
  isIE() {
    let userAgent = navigator.userAgent;
    let isIE =
      userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    let isIE11 =
      userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
    return isIE || isIE11;
  },
  isDOM(obj) {
    return (
      obj &&
      typeof obj === "object" &&
      obj.nodeType === 1 &&
      typeof obj.nodeName === "string"
    );
  },
  /**
   * 将主题对象字段写入css变量
   * @param {
       theme:主题对象,
       target: 写入目标，可以是一个dom对象，或者是className
     }
   * */
  transThemeToCssVar(theme, target) {
    // 将主题对象写入css变量，target参数标识变量的作用对象
    const isDOM = utils.isDOM;
    if (
      !utils.isIE() &&
      isDOM(target) &&
      target.style &&
      target.style.setProperty
    ) {
      Object.keys(theme).forEach((key) => {
        target.style.setProperty(`--${key}`, theme[key]);
      });
    } else if (typeof target == "string") {
      let className = target;
      let styleEl = document.getElementById(`theme_${className}`);
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = `theme_${className}`;
        document.body.appendChild(styleEl);
      }
      let styleStr = "";
      Object.keys(theme).forEach((key) => {
        styleStr += `--${key}:${theme[key]};`;
      });
      styleEl.innerHTML = `
      body .${className} {
        ${styleStr}
      }
    `;
    }
  },
  /**
   * jumpUrl:页面跳转，用于导航类组件
   * @param {
       url:跳转地址,
       target: 打开方式 默认为当前页打开
     }
   * */
  jumpUrl({ url, target = "_self" }) {
    if (window.isDataVPlatform && !window.isPlatFormPreview) {
      console.log("当前处于设计器环境，禁止跳转");
      return;
    }
    url && window.open(url, target);
  },
  makeSimpleGradientColor(colors, type) {
    if (!Array.isArray(colors)) {
      colors = [];
    }
    if (colors.length == 1) {
      return colors[0];
    }
    let typesDict = {
      left: {
        type: "linear",
        direction: [1, 0, 0, 0],
      },
      right: {
        type: "linear",
        direction: [0, 0, 1, 0],
      },
      up: {
        type: "linear",
        direction: [0, 0, 0, 1],
      },
      down: {
        type: "linear",
        direction: [0, 1, 0, 0],
      },
      inside: {
        type: "radial",
        direction: [0, 1],
      },
      outside: {
        type: "radial",
        direction: [1, 0],
      },
    };
    let theType = typesDict[type];
    let typeParams = {};
    let direction = theType.direction;
    if (theType.type == "radial") {
      typeParams = {
        type: theType.type,
        x: 0.5,
        y: 0.5,
        r: 0.5,
        colorStops: colors.map((item, i) => ({
          offset:
            direction[0] +
            (i * (direction[1] - direction[0])) / (colors.length - 1),
          color: item,
        })),
      };
    } else if (type == "linear") {
      typeParams = {
        type: theType.type,
        x: direction[0],
        y: direction[1],
        x2: direction[2],
        y2: direction[2],
        colorStops: colors.map((item, i) => ({
          offset: i / (colors.length - 1),
          color: item,
        })),
      };
    }
    return typeParams;
  },
  /**
   * js计算优化
    * @param {
       i:需要处理的值,
       digit: 多少次幂
     }
   * */
  formatterNum(i, digit = 10) {
    if (typeof i != "number") return i;
    let m = Math.pow(10, digit);
    return parseInt(i * m, 10) / m;
  },

  /**
   * 将数字转换成百分比
   * */
  numToPercentage(i, fixed) {
    if (typeof i != "number") return i + "%";
    /**
     let m = 0;
     i = i.toString();
     if (i.indexOf(".") > -1) {
      m = i.split(".")[1].length;
    }
     let v = (Number(i.replace(".","")) * 100) / Math.pow(10,m);
     * */
    let v = this.formatterNum(i.mul(100));
    let f = parseInt(fixed);
    if (typeof fixed === "undefined") {
      v = v + "%";
    } else {
      v = v.toFixed(f) + "%";
    }
    return v;
  },
  findIndexBy(fieldsName, value, records) {
    // 根据某个属性值在数组中查找目标的下标（仅返回第一个符合的成员）
    if (!records || !records.length) {
      return null;
    }
    let result;
    for (let i = 0; i < records.length; i++) {
      let item = records[i];
      if (item && item[fieldsName] === value) {
        result = i;
        break;
      }
    }
    return result;
  },
  findRecordBy(fieldsName, value, records) {
    // 根据某个属性值在数组中查找目标（仅返回第一个符合的成员）
    if (!records || !records.length) {
      return null;
    }
    return records[utils.findIndexBy(fieldsName, value, records)];
  },
  eachTree(tree, func, indexCode = "") {
    // 递归遍历树形，回调函数会获得参数(treeNode, indexCode), 1为节点对象，2为节点在属性中的位置标识（在每一层的下标，用-连接）
    if (Array.isArray(tree)) {
      tree.forEach((item, i) =>
        utils.eachTree(item, func, indexCode ? `${indexCode}-${i}` : "" + i)
      );
    } else {
      func(tree, indexCode);
      if (Array.isArray(tree.children)) {
        utils.eachTree(tree.children, func, indexCode);
      }
    }
  },
  getTreeDeep(tree) {
    // 返回树形最大深度
    let level = 0;
    utils.eachTree(tree, (item, indexCode) => {
      let deep = indexCode.split("-").length;
      if (deep > level) {
        level = deep;
      }
    });
    return level;
  },
  isPlatformEditor() {
    return window.isDataVPlatform && !window.isPlatFormPreview;
  },
};

export default utils;
