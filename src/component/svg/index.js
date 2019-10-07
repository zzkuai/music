import Vue from 'vue';
import SvgIcon from './SvgIcon';

Vue.component('svg-icon', SvgIcon);

const context = require.context('../../asset/images/svg/', true, /\.svg$/);
context.keys().map(context);
