/**
 * 图片预览 公共组件
 * 默认图片宽高为60px，可通过覆盖style样式调整大小
 *
 * Created by hanxueqiang on 2018/09/14
 */
<template>
  <div class="imgPreview">
    <div class="imgBox">
      <div class="imgWrap" v-for="(item, index) in imgList" :key="index">
        <img class="img" :src="item" alt="" @click="setPreview(item)">
      </div>
    </div>
    <div class="imgDialog" v-show="showImgDialog" @click="closePreview">
      <div class="imgWrapper">
        <img :src="urlPreview" alt="photo">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      imgList: { // 图片地址组成的数组
        type: Array,
        required: true,
        default() { return [] }
      }
    },
    data() {
      return {
        urlPreview: '',
        showImgDialog: false
      }
    },
    methods: {
      // 展示模态框
      setPreview(url) {
        this.urlPreview = url
        this.showImgDialog = true
        document.body.style.overflow = 'hidden'
      },
      // 关闭模态框
      closePreview() {
        this.showImgDialog = false
        document.body.style.overflow = 'auto'
      }
    }
  }
</script>

<style lang="scss" scoped>
  // 总容器
  .imgPreview {
    user-select: none;
    display: inline-block;

    img {
      border: none;
      cursor: pointer;
    }
  }

  // 图片小图盒子
  .imgBox{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;

    .imgWrap {
      margin-right: 10px;
      overflow: hidden;

      img {
        width: 60px;
        height: 60px;

        &[src=""],
        &:not([src]) {
          display: none;
        }
      }
    }
  }

  // 图片预览模态框
  .imgDialog {
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;

    .imgWrapper {
      min-width: 50%;
      height: auto;
      max-width: 90%;
      max-height: 90%;
      overflow: auto;
      text-align: center;

      img {
        min-width: 100%;
        height: auto;
      }
    }
  }

  // 滚动条
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
    background-color: #fff;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: hsla(220,4%,58%,.5);
  }
</style>
