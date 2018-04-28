<template>
  <div id="app">
    <iframe class="iframe" ref="iframe" :src="cosplayUri" @load="loaded"></iframe>
    <Tab />
    <HeadBar class="head-bar"/>
    <keep-alive>
      <router-view class="app-main"></router-view>
    </keep-alive>
    <div class="upload">
      <input type="file" webkitdirectory multiple @change="handleInputFile">
      <img src="./assets/imgs/upload.png" alt="" ref="img">
    </div>
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
    // console.log(this.$refs.img.src)
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
    },
    handleInputFile (e) {
      console.log(e.target.files)
      // this.$refs.img.src = 'http://tpc.googlesyndication.com/daca_images/simgad/4985974306114514385'
      // var files = e.target.files
      // for (var i = 0, f; f = files[i]; i++) {

      //   // Only process image files.
      //   if (!f.type.match('image.*')) {
      //     continue;
      //   }

      //   var reader = new FileReader();

      //   // Closure to capture the file information.
      //   reader.onload = (function(theFile) {
      //     return function(event) {
      //       // Render thumbnail.
      //       // var span = document.createElement('span');
      //       // span.innerHTML = ['<img class="thumb" src="', e.target.result,
      //       //                   '" title="', escape(theFile.name), '"/>'].join('');
      //       // document.getElementById('list').insertBefore(span, null);
      //       this.$refs.img.src = event.target.result
      //     };
      //   })(f);

      //   // Read in the image file as a data URL.
      //   reader.readAsDataURL(f);
      // }
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
