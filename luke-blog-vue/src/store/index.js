import Vue from 'vue'
import Vuex from 'vuex'
// import * as getters from './getters.js'

Vue.use(Vuex)

/** 状态定义 */
export const state = {
  loading: false,
  // themeObj: 0,//主题
  themeObj: {
    user_start: '这是静态的打字机文本', // 这里设定好打字机显示的文字
    top_image: 'static/img/background.jpg',  // 头部背景图
    head_portrait: 'static/img/tou.png',     // 头像
    autograph: '三更灯火五更鸡，正是男儿读书时' // 个性签名
  },
  keywords: '',//关键词
  errorImg: 'this.onerror=null;this.src="' + require('../../static/img/tou.jpg') + '"',
  baseURL: 'http://localhost:7777/'
}


export default new Vuex.Store({
  state,
})
