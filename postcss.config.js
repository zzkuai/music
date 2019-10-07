module.exports = {
    'plugins': {
        'postcss-write-svg': {
            'utf8': false
        },
        'postcss-preset-env': {},
        'cssnano': {
            'autoprefixer': false,
            'postcss-zindex': false
        },
        'postcss-px-to-viewport': {
            'viewportWidth': 375,
            'unitPrecision': 3,
            'viewportUnit': 'vw',
            'selectorBlackList': [ '.ignore', /^\.bf-/, /\.swiper-/, /size-/ ],
            'minPixelValue': 1,
            'mediaQuery': false
        }
    }
};
