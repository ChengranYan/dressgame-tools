<template>
  <div id="app">
    <iframe class="iframe" ref="iframe" :src="cosplayUri" @load="loaded"></iframe>
    <Tab />
    <HeadBar class="head-bar" ref="headbar" />
    <keep-alive>
      <router-view class="app-main"></router-view>
    </keep-alive>
    <!-- <div class="upload">
      <input type="file" multiple webkitdirectory @change="handleInputFile">
      <img src="./assets/imgs/upload.png" alt="" ref="img">
    </div> -->
  </div>
</template>

<script>
import Tab from '@/components/tab/'
import { mapState } from 'vuex'
import Display from '@/components/display/'
import HeadBar from '@/components/headBar/'
export default {
  name: 'app',
  components: {
    Tab,
    Display,
    HeadBar
  },
  data () {
    return {
      vm: {}
    }
  },
  mounted () {
    this.bindEvents()
    this.setWidth()
  },
  computed: {
    ...mapState(['gender']),
    cosplayUri () {
      return `/static/index.html?gender=${this.gender}`
    },
    width () {
      return window.innerHeight / 2 * 2.5
    }
  },
  methods: {
    loaded () {
      this.vm = this.$refs.iframe.contentWindow
      window.vm = this.vm
      setTimeout(() => {
        this.vm.COSPLAY_STAGE.playBoneAnimation()
      }, 500)
    },
    setWidth () {
      // console.log(this.width)
      // console.log(this.$refs.headbar.$el.style.clientWidth)
      // this.$refs.headbar.$el.style.width = this.width
    },
    bindEvents () {
      window.onresize = () => {
        this.vm.location.reload()
      }
    },
    handleInputFile (e) {
      const data = new FormData()
      data.append('logo', e.target.files)
      // data.append('param', 0)
      // data.append('secondParam', 0)
      // data.append('file', new Blob(['test payload'], { type: 'text/csv' }))
      for (let index = 0; index < e.target.files.length; index++) {
        const element = e.target.files[index]
        data.append('logo', element)
      }
      this.$http.post('http://localhost:6000/cosplay/handbook/upload', data)
          .catch((err) => {
            console.log('error' + err)
          })
    }
  }
}
</script>

<style scoped lang="stylus">
  #app
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    display: flex
    flex-direction: column
    .iframe
      width 100%
      height 50%
      border 0
    .head-bar
      width 66%
      margin 0 auto 
      background $gray-1
    .app-main
      flex 1
      background #fff
      width 72%
      margin 0 auto
      overflow hidden
    .upload
      position absolute
      top 40%
      right 20%
      img 
        width 50px
      input
        width 50px
        height 50px
        opacity 0
        position absolute
        right 0
</style>
