module.exports = api => {
  const { BABEL_MODULE, BUILD_ENV } = process.env;
  const needPolyfill = !BABEL_MODULE;
  const useESModules = BABEL_MODULE !== 'commonjs';
  const isTest = api.env('test');
  const presetEnvConfig = isTest ? {
    targets: { node: 'current' }
  } : {
    modules: useESModules ? false : 'commonjs',
    useBuiltIns: needPolyfill ? 'usage' : false
  };
  if (presetEnvConfig.useBuiltIns) {
    presetEnvConfig.corejs = {
      'version': '3'
    };
  }

  api && api.cache.using(() => process.env.BABEL_MODULE);

  const config = {
    presets: [
      [
        '@babel/preset-env',
        presetEnvConfig
      ],
      [
        '@babel/preset-typescript',
        {
          'isTSX': true,
          'allExtensions': true
        }
      ],
      '@vue/babel-preset-jsx'
    ],
    plugins: [
      [
        '@babel/plugin-proposal-decorators',
        {
          // 'decoratorsBeforeExport': true,
          'legacy': true
        }
      ],
      [
        '@babel/proposal-class-properties',
        {
          'loose': true
        }
      ],
      '@babel/proposal-object-rest-spread',
      [
        '@babel/plugin-transform-runtime',
        {
          'corejs': false,
          'helpers': true,
          'regenerator': false,
          useESModules
        }
      ]
    ]
  };

  if (BUILD_ENV) {
    config.plugins.push(['@babel/plugin-syntax-dynamic-import']);
  }

  return config;
};
