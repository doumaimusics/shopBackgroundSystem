<template>
  <div class="modules" @click="onToggle" :class="type">
    <!-- 商品类 -->
    <section v-if="type==='goodsSingle'">
      <i>单列商品</i>
    </section>
    <section v-if="type==='goodsDouble'">
      <div class="left"><i>双列商品</i></div>
      <div class="right"></div>
    </section>
    <section v-if="type==='goodsSort'">
      <div class='left'><i>商品排行榜</i></div>
      <div class='right'>
        <div class='top'></div>
        <div class='bottom'></div>
      </div>
    </section>
    <!-- 图片类 -->
    <section v-if="type==='imgSingle'">
      <i>单列图片</i>
    </section>
    <section v-if="type==='imgDouble'">
      <div class="left"><i>双列图片</i></div>
      <div class="right"></div>
    </section>
    <section v-if="type==='imgCarousel'">
      <i>轮播图</i>
    </section>
    <!-- 营销类 -->
    <section v-if="type==='marketCoupon'">
      <div class="left"><i>优惠券</i></div>
      <div class="right"></div>
    </section>
  </div>
</template>

<script>
  export default {
    props: ['type', 'toggleOpera', 'index'],
  
    data() {
      return {

      }
    },

    methods: {
      onToggle() {
        this.$emit('toggleOpera', { index: this.index })
      }
    }
  }
</script>

<style lang="less" scoped>
  .modules {
    cursor: pointer;
  }
  section {
    width: 375px;
    height: 100%;
    border: 1px solid #ccc;
    background-color: #fff;
    display: flex;
    div {
      height: 100%;
    }
    i {
      display: flex;
      align-items: center;
      color: #ccc;
      font-size: 20px;
      padding-left: 20px;
      height: 100%;
    }
  }
  .red {
    section {
      border-color: #FF5252;
    }
  }

  .goodsSingle {
    height: 120px;
  }
  .goodsDouble {
    height: 120px;
    .left {
      width: 187px;
      border-right: 1px solid #ccc;
    }
    .right {
      width: 187px;
    }
  }
  .goodsSort {
    height: 120px;

    .left {
      width: 240px;
      border-right: 1px solid #ccc;
    }
    .right {
      width: 135px;

      div {
        height: 50%;
        
        &:first-child {
          border-bottom: 1px solid #ccc;
        }
      }
    }
  }

  .imgSingle {
    height: 120px;
  }
  .imgDouble {
    height: 120px;

    .left {
      width: 187px;
      border-right: 1px solid #ccc;
    }
    .right {
      width: 187px;
    }
  }
  .imgCarousel {
    height: 120px;
  }

  .marketCoupon {
    height: 120px;
  }
</style>