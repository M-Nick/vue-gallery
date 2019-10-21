import Vue from 'vue'
import Gallery from './components/Gallery.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Gallery),
}).$mount('#app')
