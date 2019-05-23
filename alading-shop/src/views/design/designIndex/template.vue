<template>
  <div class="designTemplate">
    <div class="content">
      <div class="component">
        <div class="goodsComp">
          <h4>商品类</h4>
          <ul>
            <li>
              <div draggable="true" data-type="goodsSingle"><i class="el-icon-plus"></i></div>
              <p>单列商品</p>
              <p>0/5</p>
            </li>
            <li>
              <div draggable="true" data-type="goodsDouble"><i class="el-icon-plus"></i></div>
              <p>双列商品</p>
              <p>0/5</p>
            </li>
            <li>
              <div draggable="true" data-type="goodsSort"><i class="el-icon-plus"></i></div>
              <p>商品排行榜</p>
              <p>0/5</p>
            </li>
          </ul>
        </div>
        <div class="imgComp">
          <h4>图片类</h4>
          <ul>
            <li>
              <div draggable="true" data-type="imgSingle"><i class="el-icon-plus"></i></div>
              <p>单列图片</p>
              <p>0/5</p>
            </li>
            <li>
              <div draggable="true" data-type="imgDouble"><i class="el-icon-plus"></i></div>
              <p>双列图片</p>
              <p>0/5</p>
            </li>
            <li>
              <div draggable="true" data-type="imgCarousel"><i class="el-icon-plus"></i></div>
              <p>轮播图</p>
              <p>0/5</p>
            </li>
          </ul>
        </div>
        <div class="marketingComp">
          <h4>营销类</h4>
          <ul>
            <li>
              <div draggable="true" data-type="marketCoupon"><i class="el-icon-plus"></i></div>
              <p>优惠券</p>
              <p>0/5</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="template">
        <div class="tempTop">
          <div class="header">
            <div class="header-top clearfix">
              <img class="goBack" src="https://f.51fanbei.com/h5/app/activity/2018/09/invite_left_a.png">
              <img class="img" src="https://img.51fanbei.com/h5/app/activity/2018/09/shop.png">
              <div class="shopTitle">
                <p class="name">我的店铺名称</p>
                <p class="msg">总商品0件</p>
              </div>
              <div class="btn">
                <img class="icon" src="https://f.51fanbei.com/h5/app/activity/2018/09/icon@2x.png">收藏
              </div>
            </div>
            <div class="togglePage">
              <div class="index active">店铺首页</div>
              <div class="goods">全部商品</div>
            </div>
          </div>
          <div class="info">
            <p>店招模块</p>
          </div>
        </div>
        
        <!-- 店铺模板 -->
        <div class="shopTemplate">
          <ul>
            <li v-for="(item, index) in data" :key="item.id" :data-index="index">
              <!-- 模板项 -->
              <Modules 
                :type="item.type" 
                @toggleOpera="toggleOpera" 
                :index="index" 
                :class="{red: index===showIndex}"
              ></Modules>
              <!-- 操作 -->
              <div class="operation">
                <div class='info' v-show="!(index===showIndex)">{{item.type | typeTrans}}</div>
                <div class='setting' v-show="index===showIndex">
                  <el-button type="text" @click="setItem(index)">设置</el-button>
                  <el-button type="text" @click="sortItem(index, -1)" :disabled="index<=0">向上</el-button>
                  <el-button type="text" @click="sortItem(index, 1)" :disabled="index>=data.length-1">向下</el-button>
                  <el-button type="text" @click="deleteItem(index)">删除</el-button>
                </div>
              </div>
            </li>
            <div class="cover"></div>
          </ul>
        </div>
      </div>
    </div>

    <div class="saveBtn">
      <el-button type="default" @click="goBack">返回</el-button>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </div>

    <el-dialog
      v-if="dialogVisible"
      :title="data[showIndex].type | typeTrans" 
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="450px"
    >
      <Setting :obj="data[showIndex]" v-model="dialogVisible" @saveData="saveModuleData"></Setting>
    </el-dialog>
    
  </div>
</template>

<script>
  import Modules from './components/Modules'
  import Setting from './components/Setting'
  import { typeTrans } from '@/filters/transform'
  import { getTemplDetail, setSaveTempl } from '@/api/design'

  export default {
    components: { Modules, Setting },
    filters: { typeTrans },
    data() {
      return {
        data: [],
        showIndex: -1, // 显示设置栏的li的index
        txt: '',
        dialogVisible: false,
        id: ''
      }
    },
    created() {
      this.getParams()
      this.initData()
    },
    mounted() {
      this.initTemp()
    },
    methods: {
      getParams() {
        this.id = this.$route.query.id
      },
      // 初始化数据回显
      initData() {
        const params = {
          id: this.id
        }
        getTemplDetail(params).then(res => {
          this.data = res.data
        })
      },
      // 初始化模板事件
      initTemp() {
        const that = this
        // 记录拖拽的元素
        let current = null
        // 所有要拖拽的元素
        const compLis = document.querySelectorAll('.component li > div')
        // 拖拽目的地元素
        const target = document.querySelector('.shopTemplate ul')
        // 控制可拖拽元素，解决拖拽API的bug
        let canDrop = false
        // 绑定事件
        for (let i = 0; i < compLis.length; i++) {
          compLis[i].ondragstart = function(e) {
            current = this
            canDrop = true
          }
          compLis[i].ondragend = function(e) {
            canDrop = false
          }
        }
        target.ondragover = function(e) {
          if (!canDrop) {
            return
          }
          if (e.preventDefault) {
            e.preventDefault()
          } else {
            // ie的阻止浏览器默认行为
            e.returnValue = false
          }
        }
        target.ondrop = function(e) {
          const className = current.dataset.type
          // 末尾追加数据项
          if (e.target.nodeName === 'UL') {
            that.data.push({ type: className })
            that.showIndex = that.data.length - 1
            return
          }
          // 获取拖拽释放位置的li元素
          const targetLi = e.target.nodeName === 'LI' ? e.target : e.target.offsetParent
          // 指定位置追加数据项
          const index = +targetLi.dataset.index
          that.data.splice(index + 1, 0, { type: className })
          that.showIndex = index + 1
        }
      },
      // 切换设置菜单
      toggleOpera(obj) {
        if (this.showIndex === obj.index) {
          this.showIndex = -1
        } else {
          this.showIndex = obj.index
        }
      },
      // 删除项
      deleteItem(index) {
        this.$confirm('确定删除该项？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.data.splice(index, 1)
        }).catch(() => {})
      },
      // 向上或向下
      sortItem(index, num) {
        const temp = this.data[index + num]
        this.data[index + num] = this.data[index]
        this.data[index] = temp
        this.data = JSON.parse(JSON.stringify(this.data))
        this.showIndex += num
      },
      // 设置按钮
      setItem(index) {
        this.dialogVisible = true
      },
      // 子组件保存数据事件
      saveModuleData(obj) {
        this.data[this.showIndex] = obj
        console.log(this.data)
      },
      goBack() {
        this.$confirm('请别忘了保存您的修改', '温馨提示', {
          confirmButtonText: '继续返回',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.go(-1)
        }).catch(() => {})
      },
      // 保存提交
      onSubmit() {
        console.log(this.data)
        const params = {
          id: this.id
        }
        setSaveTempl(params).then(res => {
          this.$message({ type: 'success', message: '模板保存成功' })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @rem: 50;

  .designTemplate {
    padding: 20px;
    position: relative;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .content {
    display: flex;
  }

  // 左侧组件
  .component {
    width: 260px;
    margin-right: 100px;
    border: 1px solid #ccc;
    padding: 10px;

    h4 {
      padding: 5px 0 10px;
      font-weight: 700;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 10px;

      li {
        padding: 5px 20px;

        & > div {
          width: 60px;
          height: 60px;
          line-height: 60px;
          text-align: center;
          border: 1px solid #666;
          margin-bottom: 5px;
        }
        i {
          font-size: 40px;
          vertical-align: middle;
          color: #666;
        }
        p {
          text-align: center;
          padding: 2px 0;
        }
      }
    }
  }

  .template {
    width: 475px;
    // border: 1px solid #ccc;
    height: 812px - 20;
    position: relative;
  }
  .tempTop {
    display: flex;

    .info {
      padding-left: 20px;
      display: flex;
      align-items: center;
      text-align: center;

      p {
        width: 20px;
      }
    }
  }
  .header {
    height: 2.74px*@rem - 20;
    background: #f6f6f6;
    margin-bottom: 10px;
    padding-top: 10px;
    // border: 1px solid #ccc;
    overflow: hidden;
    width: 375px;
    
    .header-top {
      padding: .1px*@rem .4px*@rem .1px*@rem .7px*@rem;
    }
    .goBack {
      width: .14px*@rem;
      height: .29px*@rem;
      padding: 0.15px*@rem 0.2px*@rem;
      position: absolute;
      left: 0.15px*@rem;
      top: 0.1px*@rem + 10;
      box-sizing: content-box;
    }
    .img {
      width: 1.1px*@rem;
      height: 1.1px*@rem;
      border-radius: .08px*@rem;
      background: #f8f8f8;
      float: left;
      margin: 0 .21px*@rem;
      border: 1px solid #eeeeee;
    }
    .shopTitle {
      float: left;
      margin-top: .11px*@rem;
      .name {
        font-size: .3px*@rem;
        line-height: .45px*@rem;
        width: 3px*@rem;
        height: .45px*@rem;
        overflow: hidden;
        color: #2E2E2E;
      }
      .msg {
        font-size: .26px*@rem;
        color: #999;
      }
    }
    .btn {
      float: right;
      display: flex;
      width: 1.44px*@rem;
      height: .5px*@rem;
      line-height: .5px*@rem;
      margin-top: .28px*@rem;
      border: 1px solid #979797;
      border-radius: 1px*@rem;
      font-size: .24px*@rem;
      color: #2E2E2E;
      text-align: center;
      justify-content: center;
      align-items: center;
      .icon {
        width: .18px*@rem;
        height: .18px*@rem;
        margin-right: .1px*@rem;
      }
    }
    .togglePage {
      display: flex;
      // background-color: #fff;
      &>div {
        flex: 1;
        height: .88px*@rem;
        line-height: .88px*@rem;
        color: #404040;
        text-align: center;
        font-size: .3px*@rem;
        &.active {
          color: #FF5252;
        }
      }
    }
  }

  .shopTemplate {
    height: 670px;
    overflow: auto;
    background-color: #f6f6f6;
    position: relative;
    ul {
      padding-bottom: 10px;
      min-height: 100%;
      position: relative;
    }
    li {
      display: flex;
      position: relative;
      padding-bottom: 10px;
    }
    .operation {
      padding-left: 20px;
      display: flex;
      align-items: center;
      text-align: center;
      position: absolute;
      height: 120px;
      left: 375px;
      top: 0;
      z-index: 2;
      user-select:none;
      .info {
        width: 20px;
      }
      .setting {
        width: 40px;
        border: 1px solid #ccc;
        .el-button+.el-button {
          margin-left: 0;
        }
        .el-button--medium {
          padding: 0;
        }
        .el-button {
          padding: 5px 0;
        }
      }
    }
    .cover {
      height: 100%;
      width: 100px;
      background-color: #fff;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 1;
    }
  }

  .saveBtn {
    position: absolute;
    left: 900px;
    top: 20px;
    width: 180px;
  }

  /deep/ .el-dialog__body {
    padding-top: 10px;
  }
</style>
