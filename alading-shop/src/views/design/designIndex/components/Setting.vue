<template>
  <div class="setModule">
    <div v-if="data.type!=='goodsSort'">
      <ul class="ulBox">
        <li v-for="(item, index) in data.goodsList" :key="item.goodsId" :class="{imgSin:data.type==='imgSingle'}">
          <div class="left" v-if="data.type!=='imgSingle'">
            <div>
              <el-button type="text" @click="sortItem(index, -1)" :disabled="index<=0">
                向上
              </el-button>
            </div>
            <div>
              <el-button type="text" @click="sortItem(index, 1)" :disabled="index>=data.goodsList.length-1">
                向下
              </el-button>
            </div>
          </div>
          <div class="middle">
            <el-button type="default" v-if="!item.id" @click="addBtn(index)">添加商品</el-button>
            <i v-else><img :src="item.goodsIcon" alt=""></i>
            <ImgUpload
              v-if="['imgSingle', 'imgDouble', 'imgCarousel'].indexOf(data.type)>-1"
              :isSingle="true"
            ></ImgUpload>
          </div>
          <div class="right" v-if="data.type!=='imgSingle'">
            <el-button type="text" @click="onDel(index)" :disabled="data.goodsList.length<2">删除</el-button>
          </div>
        </li>
      </ul>
      <div class="addBtn">
        <el-button type="primary" plain @click="addItem" v-if="data.goodsList.length<listLength[data.type]">
          添加（{{data.goodsList.length}}/{{listLength[data.type]}}）
        </el-button>
      </div>

      <div v-if="['goodsSingle', 'goodsDouble', 'imgCarousel'].indexOf(data.type)>-1">
        <div class="sort" v-if="data.type!=='imgCarousel'">
          <span>排序规则：</span>
          <el-select v-model="data.sort">
            <el-option
              v-for="item in sortList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="checkbox">
          <el-checkbox v-model="data.isHideBar">隐藏模块下方白边</el-checkbox>
        </div>
      </div>
    </div>

    <div class="goodsSort" v-if="data.type==='goodsSort'">
      <p>系统自动抓取店铺销量前三的商品，快速引导买家购买店铺爆款。</p>
    </div>

    <div class="saveBtn">
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>

    <!-- 商品选择组件 -->
    <GoodsSelect :isShow.sync="visible" :onSubmit="addGoods" :limitCount="1"></GoodsSelect>
  </div>
</template>

<script>
  import { typeTrans } from '@/filters/transform'
  import GoodsSelect from '@/components/GoodsSelect/index'
  import ImgUpload from '@/components/ImgUpload/index'

  export default {
    props: ['obj', 'value'],
    filters: { typeTrans },
    components: { GoodsSelect, ImgUpload },
    data() {
      return {
        data: {
          type: '',
          goodsList: [''],
          sort: 0, // 排序规则
          isHideBar: 0 // 隐藏白边
        },
        sortList: [
          { label: '手动调整', value: 0 },
          { label: '上架时间从近到远', value: 1 },
          { label: '上架时间从远到近', value: 2 },
          { label: '销量从高到低', value: 3 },
          { label: '销量从低到高', value: 4 },
          { label: '价格从高到低', value: 5 },
          { label: '价格从低到高', value: 6 }
        ],
        listLength: {
          goodsSingle: 6,
          goodsDouble: 12,
          imgCarousel: 4,
          marketCoupon: 6
        },
        visible: false,
        index: -1 // 临时保存添加商品按钮项的索引
      }
    },
    created() {
      this.backData()
    },
    methods: {
      // 回显数据
      backData() {
        this.data.type = this.obj.type
        if (this.obj.type === 'goodsSingle' || this.obj.type === 'goodsDouble') {
          if (this.obj.goodsList) {
            this.data = JSON.parse(JSON.stringify(this.obj))
          }
        }
        console.log(this.data)
      },
      // 添加项
      addItem() {
        this.data.goodsList.push({})
      },
      // 删除项
      onDel(index) {
        this.$confirm('确定删除该项？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.data.goodsList.splice(index, 1)
        }).catch(() => {})
      },
      // 向上或向下
      sortItem(index, num) {
        const temp = this.data.goodsList[index + num]
        this.data.goodsList[index + num] = this.data.goodsList[index]
        this.data.goodsList[index] = temp
        this.data.goodsList = JSON.parse(JSON.stringify(this.data.goodsList))
      },
      // 保存
      onSave() {
        let temp = []
        switch (this.data.type) {
          case 'goodsSingle':
            temp = this.data.goodsList.filter(v => {
              return !!v.id
            })
            if (temp.length < 1) {
              this.$message({ type: 'warning', message: '请至少添加一个商品' })
              return
            }
            this.data.goodsList = temp
            this.$emit('saveData', this.data)
            break
          case 'goodsDouble':
            this.data.goodsList = this.data.goodsList.filter(v => {
              return !!v.id
            })
            if (this.data.goodsList.length < 2) {
              this.$message({ type: 'warning', message: '请至少添加两个商品' })
              return
            }
            this.$emit('saveData', this.data)
            break
        }
        if (this.data.type === 'goodsSingle' || this.data.type === 'goodsDouble') {
          this.data.goodsList = this.data.goodsList.filter(v => {
            return !!v.id
          })
          if (this.data.type) { this.$emit('saveData', this.data) }
        }
        this.$emit('input', false)
      },
      // 添加商品按钮
      addBtn(index) {
        this.index = index
        this.visible = true
      },
      // 添加商品回调
      addGoods(data) {
        this.data.goodsList[this.index] = data[0]
      }
    }
  }
</script>

<style lang="less" scoped>
  .setModule {
    padding: 0 20px;
  }

  .ulBox {
    > li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      border-top: 1px solid #ccc;
      margin: 5px 0;
      padding: 0 10px;
      .middle {
        display: flex;
        align-items: center;
        .el-button {
          width: 100px;
          height: 40px;
        }
        i {
          display: inline-block;
          width: 60px;
          height: 60px;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
      .right {
        display: flex;
        align-items: center;
      }
      &:first-child {
        border-top: none;
      }
      &.imgSin {
        justify-content: center;
        height: 73px;
      }
    }
  }

  .addBtn {
    .el-button {
      width: 100%;
    }
  }

  .sort {
    padding: 20px 0;
  }

  .checkbox {
    padding-bottom: 30px;
  }

  .saveBtn {
    text-align: right;
  }

  .goodsSort {
    padding-top: 20px;
    padding-bottom: 40px;
    font-size: 14px;
  }
</style>
