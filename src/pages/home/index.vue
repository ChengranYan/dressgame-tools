<<template>
  <div>
    <iframe class="iframe" ref="iframe" :src="cosplayUri" @load="loaded"></iframe>
  </div>
</template>

<script>
export default{
  data () {
    return {
      gender: 'male',
      vm: {},
      token: '',
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
    this.vm.COSPLAY_STAGE && console.log(this.vm.COSPLAY_STAGE.setSlotDisplay)
    this.bindEvents()
  },
  computed: {
    cosplayUri () {
      return `http://localhost:8080/static/index.html?gender=${this.gender}`
    }
  },
  methods: {
    loaded () {
      this.vm = this.$refs.iframe.contentWindow
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
  .iframe
    width 100%
    height 50%
    border 0
</style>
