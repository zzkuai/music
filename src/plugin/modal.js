import Vue from 'vue';

const Modal = {
    install(Vue) {
        if (this.installed) return;
        this.installed = true;

        this.modalVisible = false;
        Vue.prototype.$modal = (msg, duration = 3500) => {
            if (this.modalVisible) return;
            this.modalVisible = true;
            const modalEl = document.createElement('div');
            modalEl.setAttribute('class', 'modal ignore t-tac');
            modalEl.innerHTML = msg;
            document.body.appendChild(modalEl);
            setTimeout(() => {
                document.body.removeChild(modalEl);
                this.modalVisible = false;
            }, duration);
        };
    }
};

Vue.use(Modal);
