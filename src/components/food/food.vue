<template >
<transition name="move">
  <div class="food" v-show="showFlag" ref="food">
    <div class="food-conter">
      <div class="image-header">
        <img :src="food.image" alt="无法加载">
        <div class="back">
          <i class="icon-arrow_lift" @click="hide"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}</span>
          <span class="rating">好评率{{food.rating}}</span>
        </div>
        <div class="price">
          <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
        </div>
        <div class="cartcontrol-wrapper">
          <cartcontrol @add="addFood" :food="food"></cartcontrol>
        </div>
        <transition name="fade">
          <div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst">
            加入购物车
          </div>
        </transition>
      </div>
      <splite v-show="food.info"></splite>
      <div class="info" v-show="food.info">
        <h1 class="title">商品信息</h1>
        <p class="text">{{food.info}}</p>
      </div>
      <splite v-show="food.info"></splite>
      <div class="rating">
        <h1 contenteditable="title">商品评价</h1>
        <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import BScroll from 'better-scroll';
import cartcontrol from '../../components/cartcont/cartcont';
import splite from '../../components/splite/splite';
import ratingselect from '../../components/ratingselect/ratingselect';
import Vue from 'vue';
// const POSITIVE = 0;
// const NEGATIVE = 1;
const ALL = 2;
export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    };
  },
  methods: {
    show() {
      this.selectType = ALL;
      this.onlyContent = true;
      this.showFlag = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(event) {
      // 防止在PC触发两次。_constructed是手机端属性，
      if (!event._constructed) {
        return;
      }
      // 想上传递参数$emit
      this.$emit('add', event.target);
      // vue.set为全局注册
      Vue.set(this.food, 'count', 1);
    },
    addFood(target) {
      // 想上传递参数$emit
      this.$emit('add', event.target);
    }
  },
  components: {
    cartcontrol,
    splite,
    ratingselect
  }
};
</script>

<style lang="stylus" rel='stylesheet/stylus'>
  .food
    position:fixed
    left:0
    top:0
    bottom:48px
    z-index:30
    width:100%
    background:#fff
    transform:translate3d(0,0,0)
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
    &.move-enter, &.move-leave-active
      transform:translate3d(100%,0,0)
    .image-header
      position:relative
      width:100%
      height:0
      padding-top:100%
      img
        position:absolute
        left:0
        top:0
        width:100%
        height:100%
      .back
        position:absolute
        top:10px
        left:0
        .icon-arrow_lift
          display:block
          padding:10px
          font-size:20px
          color:#fff
    .content
      position:relative
      padding:18px
      .title
        font-size:14px
        font-weight:700
        line-height:14px
        margin-bottom:8px
        color:rgb(7,17,27)
      .detail
        font-size:0
        line-height:10px
        height:10px
        margin-bottom:18px
        .sell-count, .rating
          font-size:10px
          color:rgb(147,153,159)
        .sell-count
          margin-right:12px
      .price
        font-weight:700
        line-height:24px
        .now
          margin-right:8px
          font-size:14px
          color:rgb(240,20,20)
        .old
          text-decoration:line-through
          font-size:10px
          color:rgb(147,153,159)
      .cartcontrol-wrapper
        position:absolute
        right:12px
        bottom:12px
      .buy
        position:absolute
        right:18px
        bottom:18px
        z-index:10
        height:24px
        line-height:24px
        padding:0 12px
        box-sizing:border-box
        font-size:10px
        border-radius:12px
        color:#fff
        background:rgb(0,160,220)
        opacity:1
        &.fade-enter-active, &.fade-leave-active
          transition:all 0.2s
        &.fade-enter, &.fade-leave-active
          opacity:0
    .info
      padding:18px
      .title
        line-height:14px
        margin-bottom:6px
        font-size:14px
        color:rgb(7,17,27)
      .text
        line-height:24px
        padding:0 8px
        font-size:12px
        color:rgb(77,85,93)
    .rating
      padding-top:18px
      .title
        line-height:14px
        margin-left:18px
        font-size:14px
        color:rgb(7,17,27)




</style>
