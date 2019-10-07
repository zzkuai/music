const path = require('path');
const resolve = (dir) => path.resolve(__dirname, dir);
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? 'https://www.zzkuai.top/music/' : '/',
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        devServer: {
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                }
            }
        },
    },
    chainWebpack: (config) => {
        const svgRule = config.module.rule('svg');
        svgRule.uses.clear();
        svgRule.include.add(resolve('src/asset/images/svg')).end();
        svgRule.exclude.add(/node_modules/).end();
        svgRule.test(/\.svg$/)
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
            symbolId: 'icon-[name]'
        });

        const imagesRule = config.module.rule('images');
        imagesRule.exclude.add(resolve('src/asset/images/svg')).end();
    },
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/asset/style/common/mixin.scss";@import "@/asset/style/common/color.scss";`
            }
        }
    }
};
