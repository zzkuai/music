import Vue from 'vue';

const Toast = {
    install(Vue) {
        if (this.installed) return;
        this.installed = true;

        this.toastEl = null;
        this.timer = null;
        Vue.prototype.$toast = (msg, options) => {
            const defaultOpt = { duration: 3500, position: 'bottom' };
            options = { ...defaultOpt, ...options };
            if (this.toastEl && this.timer) {
                document.body.removeChild(this.toastEl);
                clearTimeout(this.timer);
            }
            this.toastEl = document.createElement('div');
            this.toastEl.setAttribute('class', `toast ignore t-tac ${ options.position }`);
            this.toastEl.innerHTML = msg;
            document.body.appendChild(this.toastEl);
            this.timer = setTimeout(() => {
                document.body.removeChild(this.toastEl);
                this.timer = null;
            }, options.duration);
        };
    }
};

Vue.use(Toast);
