
let arcBorderWidth = 1;

function makeTheme({ colors, arcColors, arcBorder }, axis) {
  let lT, aLT;
  if (axis == "y") {
    lT = [0, 0, 0, 1];
    aLT = [0, 0, 1, 0];
  } else {
    lT = [0, 0, 1, 0];
    aLT = [0, 0, 0, 1];
  }
  return {
    arcBorder: {
      type: "linear",
      x: aLT[0],
      y: aLT[1],
      x2: aLT[2],
      y2: aLT[3],
      colorStops: arcBorder.map((item, i) => {
        return {
          offset: i,
          color: item,
        };
      }),
    },
    arcBorderWidth,
    arcColor: {
      type: "linear",
      x: aLT[0],
      y: aLT[1],
      x2: aLT[2],
      y2: aLT[3],
      colorStops: arcColors.map((item, i) => {
        return {
          offset: i,
          color: item,
        };
      }),
    },
    color: {
      type: "linear",
      x: lT[0],
      y: lT[1],
      x2: lT[2],
      y2: lT[3],
      colorStops: colors.map((item, i) => {
        return {
          offset: i * 0.25,
          color: item,
        };
      }),
    },
    standFill: {
      type: "linear",
      x: lT[0],
      y: lT[1],
      x2: lT[2],
      y2: lT[3],
      colorStops: [
        "transparent",
        "rgb(26,100,139)",
        "rgb(26,100,139)",
        "rgb(26,100,139)",
        "transparent",
      ].map((item, i) => {
        return {
          offset: i * 0.25,
          color: item,
        };
      }),
    },
    standShadowFill: {
      type: "radial",
      x: 0.5,
      y: 0.5,
      r: 0.5,
      colorStops: [
        {
          offset: 0,
          color: "transparent",
        },
        {
          offset: 0.5,
          color: colors[2].replace(/,[^,]+\)$/, ",0.5)"),
        },
        {
          offset: 0.75,
          color: colors[2].replace(/,[^,]+\)$/, ",0.2)"),
        },
        {
          offset: 1,
          color: "rgba(28,97,190,0)",
        },
      ],
    },
  };
}

let themeOptions = {
  blue: {
    colors: [
      "rgb(118,135,204)",
      "rgb(1,51,148)",
      "rgb(2,45,157)",
      "rgb(44,101,214)",
      "rgb(159,180,245)",
    ].map((item) => item.replace("rgb", "rgba").replace(")", ",1)")),
    arcColors: ["rgb(44,101,214)", "rgb(130,148,224)"].map((item) =>
      item.replace("rgb", "rgba").replace(")", ",1)")
    ),
    arcBorder: ["rgb(22,107,159)", "rgb(52,200,230)"],
  },
  green: {
      colors: [
          "rgb(2,186,75)",
          "rgb(156,232,158)",
          "rgb(0,228,86)",
          "rgb(156,232,158)",
          "rgb(2,186,75)",
      ].map((item) => item.replace("rgb", "rgba").replace(")", ",1)")),
      arcColors: ["rgb(0,228,86)", "rgb(156,252,158)"].map((item) =>
          item.replace("rgb", "rgba").replace(")", ",1)")
      ),
      arcBorder: ["rgb(156,252,158)", "rgb(156,252,158)"],
  },
  yellow: {
    colors: [
      "rgb(184,156,33)",
      "rgb(255,234,94)",
      "rgb(224,188,38)",
       "rgb(255,234,94)",
        "rgb(184,156,33)",
    ].map((item) => item.replace("rgb", "rgba").replace(")", ",1)")),
    arcColors: ["rgb(211,199,61)", "rgb(242,236,37)"].map((item) =>
      item.replace("rgb", "rgba").replace(")", ",1)")
    ),
    arcBorder: ["rgb(242,236,37)", "rgb(208,195,64)"],
  },
  silver: {
      colors: [
          "rgb(80,89,86)",
          "rgb(224,233,230)",
          "rgb(156,166,158)",
          "rgb(224,233,230)",
          "rgb(75,77,55)",
      ].map((item) => item.replace("rgb", "rgba").replace(")", ",1)")),
      arcColors: ["rgb(156,166,158)", "rgb(224,233,230)"].map((item) =>
          item.replace("rgb", "rgba").replace(")", ",1)")
      ),
      arcBorder: ["rgb(156,166,158)", "rgb(156,166,158)"],
  },
  black: {
      colors: [
          "rgb(39,40,42)",
          "rgb(66,67,71)",
          "rgb(153,153,153)",
          "rgb(44,44,44)",
          "rgb(39,39,39)",
      ].map((item) => item.replace("rgb", "rgba").replace(")", ",1)")),
      arcColors: ["rgb(53,53,53)", "rgb(53,53,53)"].map((item) =>
          item.replace("rgb", "rgba").replace(")", ",1)")
      ),
      arcBorder: ["rgb(53,53,53)", "rgb(53,53,53)"],
  },
  blue_empty: {
    colors: [
      "rgb(26,158,189)",
      "rgb(16,57,118)",
      "rgb(16,57,110)",
      "rgb(16,57,113)",
      "rgb(23,128,190)",
    ].map((item) => item.replace("rgb", "rgba").replace(")", ",0.5)")),
    arcColors: ["rgb(23,110,183)", "rgb(27,182,217)"].map((item) =>
      item.replace("rgb", "rgba").replace(")", ",0.2)")
    ),
    arcBorder: ["rgb(52,200,230)", "rgb(22,107,159)"].map((item) =>
      item.replace("rgb", "rgba").replace(")", ",0.2)")
    ),
  },
  yellow_empty: {
    colors: [
      "rgb(207,195,76)",
      "rgb(80,80,30)",
      "rgb(80,80,30)",
      "rgb(80,80,30)",
      "rgb(183,166,13)",
    ].map((item) => item.replace("rgb", "rgba").replace(")", ",0.5)")),
    arcColors: ["rgb(211,199,61)", "rgb(242,236,37)"].map((item) =>
      item.replace("rgb", "rgba").replace(")", ",0.1)")
    ),
    arcBorder: ["rgb(242,236,37)", "rgb(208,195,64)"].map((item) =>
      item.replace("rgb", "rgba").replace(")", ",0.3)")
    ),
  },
};

let themes = {};
for (let name in themeOptions) {
  let item = themeOptions[name];
  themes[name] = makeTheme(item);
}
for (let name in themeOptions) {
  let item = themeOptions[name];
  themes[name + "_level"] = makeTheme(item, "y");
}

export default themes;
