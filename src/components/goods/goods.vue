<template lang="html">
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item" :class="{'current':curentIndex===index}" @click="selectMenu(index,$event)">
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
              {{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li  @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
                <div class="icon">
                  <img :src="food.icon" width="57" height="57">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol @add="addFood" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script>
import BSscroll from 'better-scroll';
import shopcart from '../../components/shopcart/shopcart';
import cartcontrol from '../../components/cartcont/cartcont';
import food from '../../components/food/food';
const ERR_OK = 0;
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    };
  },
  // jisuan--->:class
  computed: {
    curentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
    },
    selectFoods() {
      let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    this.$http.get('/api/goods').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        // nextTick初始化，操作原声DOM，一定要用这个，这样就渲染好了
        this.$nextTick(() => {
          this._initScroll();
          this.calculateHeight();
        });
      }
    });
  },
  // fenzhuangfangfa
  methods: {
    selectMenu(index, event) {
      // 防止在PC触发两次。_constructed是手机端属性，
      if (!event._constructed) {
        return;
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
    },
    selectFood(food, event) {
      // 防止在PC触发两次。_constructed是手机端属性，
      if (!event._constructed) {
        return;
      }
      this.selectedFood = food;
      this.$refs.food.show();
    },
    addFood(target) {
      this._drop(target);
    },
    _drop(target) {
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target);
      });
    },
    _initScroll() {
      this.meunScroll = new BSscroll(this.$refs.menuWrapper, {
        click: true
      });
      this.foodsScroll = new BSscroll(this.$refs.foodsWrapper, {
        // scroll 实时监听滚动位置
        click: true,
        probeType: 3
      });

      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    calculateHeight() {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  }
};
</script>

<style lang="stylus" rel='stylesheet/stylus'>
  @import '../../common/stylus/mixin'
  .goods
    position:absolute
    top:174px
    bottom:46px
    display:flex
    overflow:hidden
    width:100%
    .menu-wrapper
      flex:0 0 80px
      width:80px
      background:#f3f5f7
      .menu-item
        display:table
        height:54px
        width:56px
        line-height:14px
        padding:0 12px
        &.current
          background:#fff
          font-weight:700
          position:relative
          z-index:10
          margin-top:-1px
          .text
            border-none()
        .icon
          display:inline-block
          vertical-align:top
          width:12px
          height:12px
          margin-right:2px
          background-size:12px 12px
          background-repeat:no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          font-size:12px
          display:table-cell
          width:56px
          border-1px(rgba(7,17,27,0.1))
          vertical-align:middle
    .foods-wrapper
      flex:1
      .title
        padding-left:14px
        height:26px
        line-height:26px
        border-left:2px solid #d9dde1
        font-size:12px
        color:rgb(147,153,159)
        background:#f3f5f7
      .food-item
        display:flex
        margin:18px
        padding-bottom:18px
        border-1px(rgba(7,17,27,0.1))
      &:last-child
        border-none()
        margin-bottom:0
      .icon
        flex:0 0 57px
        margin-right:10px
      .content
        flex:1
        .name
          font-size:14px
          line-height:14px
          margin:2px 0 8px 0
          height:14px
          color:rgb(7,17,27)
        .desc
          line-height:12px
          font-size:10px
          color:rgb(147,153,159)
          margin-bottom:8px
        .extra
          line-height:10px
          font-size:10px
          color:rgb(147,153,159)
          .count
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
          right:0
          bottom:12px




</style>
