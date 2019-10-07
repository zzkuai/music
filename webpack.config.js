const path = require('path');
module.exports = {
    entry: './src/main.js',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
};