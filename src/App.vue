<template>
  <div id="app">
    <iframe class="iframe" ref="iframe" :src="cosplayUri" @load="loaded"></iframe>
    <Tab />
    <HeadBar class="head-bar"/>
    <keep-alive>
      <router-view class="app-main"></router-view>
    </keep-alive>
    <!-- <Display /> -->
    <!-- <tab class="app-tab" ></tab> -->
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
      // gender: 'male',
      vm: {},
      resources: [
        [
          'https://cosplay.yangcong345.com/1010021/head_cloth_1_ske.json',
          'https://cosplay.yangcong345.com/1010021/head_cloth_1_tex.json',
          'https://cosplay.yangcong345.com/1010021/head_cloth_1_tex.png'
        ],
        [
          'https://cosplay.yangcong345.com/1010021/head_cloth_ske.json',
          'https://cosplay.yangcong345.com/1010021/head_cloth_tex.json',
          'https://cosplay.yangcong345.com/1010021/head_cloth_tex.png'
        ]
      ]
    }
  },
  mounted () {
    this.bindEvents()
  },
  computed: {
    ...mapState(['gender']),
    cosplayUri () {
      return `http://localhost:8080/static/index.html?gender=${this.gender}`
    }
  },
  methods: {
    loaded () {
      this.vm = this.$refs.iframe.contentWindow
      console.log(this.vm)
      window.vm = this.vm
      // setTimeout(() => {
      //   this.vm.COSPLAY_STAGE.setSlotDisplay('head_cloth_1', 'https://cosplay.yangcong345.com/1010025/head_cloth_1_ske.json', 'https://cosplay.yangcong345.com/1010025/head_cloth_1_tex.json', 'https://cosplay.yangcong345.com/1010025/head_cloth_1_tex.png')
      //   this.vm.COSPLAY_STAGE.setSlotDisplay('head_cloth', 'https://cosplay.yangcong345.com/1010025/head_cloth_ske.json', 'https://cosplay.yangcong345.com/1010025/head_cloth_tex.json', 'https://cosplay.yangcong345.com/1010025/head_cloth_tex.png')
      // }, 500)
      // setTimeout(() => {
      //   this.vm.COSPLAY_STAGE.setAvatarBackground('https://cosplay.yangcong345.com/1060006/background.png')
      // }, 5000)
      // setTimeout(() => {
      //   this.vm.COSPLAY_STAGE.setDefaultSlot('head')
      // }, 10000)
      // slotName, skeData, texData, texture
      // vm.COSPLAY.setSlotDisplay('head_cloth_1', 'https://cosplay.yangcong345.com/1010025/head_cloth_1_ske.json', 'https://cosplay.yangcong345.com/1010025/head_cloth_1_tex.json')
    },
    bindEvents () {
      window.onresize = () => {
        this.vm.location.reload()
      }
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
    // .app-tab
    //   position: fixed
    //   bottom: 0
    //   left: 0
    //   right: 0
    //   height: 1.03rem
    //   background: #fff
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
</style>
