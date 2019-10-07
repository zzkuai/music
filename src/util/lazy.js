import Vue from 'vue';

function lazy(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = function () {
            resolve();
            img = null;
        };
        img.onerror = function (e) {
            reject(e);
            img = null;
        };
        img.src = url;
    });
}

Vue.prototype.$lazy = lazy;