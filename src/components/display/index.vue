<template>
  <div class="wrapper">
    <template v-if="isTest">
      <ul>
        <li v-for="(item, index) in testData" :key="index" v-if="item.thumbnail">
          <div class="img-con" @click="handleTestDressUp(index, item.thumbnail)" isdressed="false" :ref="item.thumbnail">
            <img :src="item.thumbnail">
          </div>
          <p>
            <span>{{item.name}}</span>
          </p>
        </li>
      </ul>
    </template>
    <template v-if="!isTest && isMale">
      <ul>
        <li v-for="item in maleclothes[part].rows" :key="item.id" v-if="item.thumbnail">
          <div class="img-con" @click="handleDressUp(item.id, item.thumbnail, $event)" isdressed="false" :ref="item.id">
            <img :src="item.thumbnail" :data-id="item.id">
          </div>
          <p>
            <span>{{item.name}}</span>
          </p>
        </li>
      </ul>
    </template>
    <template v-if="!isTest && !isMale">
      <ul>
        <li v-for="item in femaleclothes[part].rows" :key="item.id" v-if="item.thumbnail">
          <div class="img-con" @click="handleDressUp(item.id, item.thumbnail, $event)" isdressed="false" :ref="item.id">
            <img :src="item.thumbnail" :data-id="item.id">
          </div>
          <p>{{item.name}}</p>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import BScroll from 'better-scroll'
export default{
  data () {
    return {
      maleclothes: {
        head: {
          rows: []
        }
      },
      femaleclothes: {
        head: {
          rows: []
        }
      },
      testMaleData: [],
      testFemaleData: [],
      background_reg: /background_/,
      decorate_reg: /decoration_cloth_/,
      head_frame_reg: /head_frame_/,
      detailId: '',
      part: 'head',
      inFrameStatus: false,
      maleToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZTI5NjFhMjlhNzY5NTZlMWRlNGM3ZCIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNTI0Nzk5NDkxLCJleHAiOjE1MjczOTE0OTF9.XFVpeV8xOy47YSltWzs7asp4TEqY1vLDD9IW4T11-g4',
      femaleToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZTI5NzAyMjlhNzY5NTZlMWRlNGM3ZSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNTI0Nzk5NTc5LCJleHAiOjE1MjczOTE1Nzl9.Ym7ZLN3iTEk21irBYc-8BVoMUBtfkcLnrPnWoEUK3Ac'
    }
  },
  watch: {
    $route (to, from) {
      this.part = this.$route.params.part
      this.changeGender(this.$route.params.gender)
    }
  },
  computed: {
    ...mapState(['gender']),
    isMale () {
      return this.gender === 'male'
    },
    isTest () {
      return this.part === 'test'
    },
    testData () {
      if (this.gender === 'male') {
        return this.testMaleData
      } else {
        return this.testFemaleData
      }
    },
    detailUrl () {
      return `https://api-test.yangcong345.com/cosplay/handbook/${this.part}/${this.detailId}`
      // return `http://localhost:3000/cosplay/handbook/${this.part}/${this.detailId}`
    },
    token () {
      return this.gender === 'male' ? this.maleToken : this.femaleToken
    }
  },
  mounted () {
    this.scroll = new BScroll('.wrapper')
    this.getDress('male')
    this.getDress('female')
    this.getTestData()
  },
  methods: {
    ...mapMutations(['changeGender']),
    handleDressUp (id, name, e) {
      if (this.$refs[id][0].attributes['isdressed'].value === 'true' && this.part !== 'decorate') {
        window.vm.COSPLAY_STAGE.setDefaultSlot(this.part)
        this.$refs[id][0].attributes['isdressed'].value = 'false'
      } else {
        if (this.inFrameStatus) {
          window.vm.COSPLAY_STAGE.exitAvatar()
          this.inFrameStatus = false
        }
        this.detailId = id
        this.$http({
          method: 'get',
          url: this.detailUrl,
          headers: {
            Authorization: this.token
          }
        }).then((res) => {
          var { data } = res
          if (this.part === 'decorate' || this.part === 'background') {
            this.handleDecorateDressUp(name, data.resources, id)
          } else {
            window.vm.COSPLAY_STAGE.setSlotDisplayByResources(data.resources)
            this.$refs[id][0].attributes['isdressed'].value = 'true'
          }
        })
      }
    },
    handleTestDressUp (index, id) {
      if (this.$refs[id][0].attributes['isdressed'].value === 'true') {
        window.vm.COSPLAY_STAGE.setDefaultSlot(this.partReturn(id))
        this.$refs[id][0].attributes['isdressed'].value = 'false'
      } else {
        window.vm.COSPLAY_STAGE.setSlotDisplayByResources(this.testData[index].resources)
        this.$refs[id][0].attributes['isdressed'].value = 'true'
      }
    },
    partReturn (name) {
      if (/head/.test(name)) {
        return 'head'
      } else if (/body/.test(name)) {
        return 'body'
      } else if (/leg/.test(name)) {
        return 'leg'
      } else if (/foot/.test(name)) {
        return 'foot'
      } else if (/decoration_cloth/.test(name)) {
        return 'bonusDecorate'
      } else {
        return ''
      }
    },
    handleDecorateDressUp (name, resources, id) {
      if (this.isBackground(name)) {
        this.setBackground(resources)
      } else if (this.isHeadFrame(name)) {
        this.inFrameStatus = true
        window.vm.COSPLAY_STAGE.entryAvatar(resources.back, resources.front)
        // window.vm.COSPLAY_STAGE.setAvatarBackground(resources.back, resources.font)
      } else if (this.isDecorateCloth(name)) {
        if (this.$refs[id][0].attributes['isdressed'].value === 'true') {
          window.vm.COSPLAY_STAGE.setDefaultSlot('bonusDecorate')
          this.$refs[id][0].attributes['isdressed'].value = 'false'
        } else {
          window.vm.COSPLAY_STAGE.setSlotDisplayByResources(resources)
          this.$refs[id][0].attributes['isdressed'].value = 'true'
          // alert(this.$refs[id][0].attributes['isdressed'].value)
        }
      }
    },
    getDress (gender) {
      this.$http({
        method: 'get',
        url: 'https://api-test.yangcong345.com/cosplay/handbook',
        // url: 'http://localhost:3000/cosplay/handbook',
        headers: {
          Authorization: gender === 'male' ? this.maleToken : this.femaleToken
        }
      }).then((res) => {
        if (gender === 'male') {
          this.maleclothes = res.data
        } else {
          this.femaleclothes = res.data
        }
      })
    },
    setBackground (url) {
      // url = 'https://cosplay.yangcong345.com/1060004/background_thumbnail.png'
      window.vm.document.body.style.backgroundImage = `url(${url})`
    },
    isBackground (name) {
      return this.background_reg.test(name)
    },
    isDecorateCloth (name) {
      return this.decorate_reg.test(name)
    },
    isHeadFrame (name) {
      return this.head_frame_reg.test(name)
    },
    getTestData () {
      this.$http({
        method: 'get',
        // url: 'https://api-test.yangcong345.com/cosplay/handbook',
        url: 'http://10.8.8.8:60000/cosplay/handbook/testcontent'
      }).then((res) => {
        console.log(res.data)
        this.testMaleData = res.data.maleData
        this.testFemaleData = res.data.femaleData
        // this.testData = res.data.data
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../../assets/styles/common/varibles.styl'
  ul
    display flex
    justify-content flex-start
    flex-wrap wrap
    li
      width 12.5%
      .img-con
        padding 10px
        display flex
        justify-content center 
        align-items center
      img 
        width 60px
      p
        font-weight 600
        color $gray-3
        text-align center
        padding 0 5px
        span 
          display inline-block
          padding 4px
          border-radius 4px
      .active 
        background $green-4
        color #fff
</style>
