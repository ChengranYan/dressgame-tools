<template>
  <ul class="head-bar-con">
    <!-- <router-link class="head-bar" :to="tab1" tag="li">
          <span class="part">头部</span>
        </router-link>
        <router-link class="head-bar" :to="tab2" tag="li">
          <span class="part">上衣</span>
        </router-link> -->
    <router-link v-for="(part, index) in parts" class="head-bar" :to="part.to" tag="li" :key="index">
        <span class="part">{{ part.name }}</span>
    </router-link>
  </ul>
</template>

<script>
  export default {
    name: 'tab',
    data () {
      return {
        tab1: '/design/male',
        parts: [
          {
            name: '头部',
            to: 'head'
          },
          {
            name: '上衣',
            to: 'body'
          },
          {
            name: '下装',
            to: 'leg'
          },
          {
            name: '鞋子',
            to: 'foot'
          },
          {
            name: '饰品',
            to: 'decorate'
          },
          {
            name: '背景',
            to: 'background'
          }
        ]
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../../assets/styles/common/varibles.styl'
  .head-bar-con
    display flex
    justify-content center
    text-align center
    background $gray-1
    .head-bar
      width 50%
      line-height 50px
      font-weight bold
      font-size 14px
      color $gray-3
    .router-link-active
      color $blue-3
      .part
        padding 0 4px
        text-align center
        display inline-block
</style>