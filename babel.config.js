module.exports = function (api) {
  api.cache(false);

  const presets = [
    [
      "@babel/env",
      {
        "targets": {
          "browsers": [
            "last 2 versions",
            "ie 11",
          ]
        },
        "useBuiltIns": "entry",
        "corejs": 3,
        "modules": false
      }
    ]
  ];

  const plugins = [
    "@babel/plugin-transform-object-assign",
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-transform-arrow-functions",
  ];

  return {
    presets,
    plugins
  };
}
