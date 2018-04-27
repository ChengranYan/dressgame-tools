<template>
  <ul class="list">
    <router-link to="/male" tag="li" class="item">
      <span class="gender">男生</span>
    </router-link>
    <router-link to="/female" tag="li" class="item">
      <span class="gender">女生</span>
    </router-link>
  </ul>
</template>

<script>
export default {
  name: 'tab'
}
</script>

<style scoped lang="stylus">
@import '../../assets/styles/common/varibles.styl'
  .list
    width 300px
    margin 0 auto
    display flex
    text-align center
    line-height 40px
    font-size 20px
    font-weight bold
    color $gray-3
    .item
      width 50%
    .router-link-active
      color $blue-4
      span 
        display inline-block
        padding 0 10px
        border-bottom 4px solid $blue-3
</style>