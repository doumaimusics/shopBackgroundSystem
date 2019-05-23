<template>
  <div class="deliveryDialog">
    <div class="deliveryText">
      <a href="javascript:;" @click="showDialog">查看物流信息</a>
    </div>

    <!-- Form -->
    <el-dialog title="查看物流" :visible.sync="dialogVisible">
      <div class="deliveryPath">
        <ul>
          <li v-for="(item, index) in deliveryPathList" :key="index">
            <div class="date">
              <p>{{item.acceptTime.day}}</p>
              <p>{{item.acceptTime.time}}</p>
            </div>
            <div class="path">{{item.acceptStation}}</div>
            <i class="el-icon-location"></i>
          </li>
        </ul>
      </div>

      <div class="btnOper">
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
  import { getDeliveryPath } from '@/api/deal.js'
  import { formatTimestamp } from '@/utils/tools.js'

  export default {
    props: ['orderId'],

    data() {
      return {
        dialogVisible: false, // 控制模态框的显示隐藏

        deliveryPathList: [] // 物流轨迹列表
      }
    },

    created() {
      this.mountDeliveryPath()
    },

    methods: {
      // 显示模态框
      showDialog() {
        this.dialogVisible = true
      },
      // 确定按钮 关闭模态框
      confirm() {
        this.dialogVisible = false
      },

      // 加载物流轨迹
      mountDeliveryPath() {
        if (!this.orderId) {
          return
        }
        getDeliveryPath(this.orderId).then(res => {
          if (res.data.length === 0) {
            this.deliveryPathList = []
            return
          }
  
          if (res.data[0]) {
            if (res.data[0].acceptStation === '暂无物流轨迹') {
              res.data[0].acceptTime = ''
              this.deliveryPathList = res.data
              return
            }
          }

          // 数据处理，格式化时间戳
          const newData = res.data.map(v => {
            const date = formatTimestamp(v.acceptTime).split(' ')
            return {
              acceptTime: {
                day: date[0],
                time: date[1]
              },
              acceptStation: v.acceptStation
            }
          })

          this.deliveryPathList = newData.reverse()
        })
      }

    },

    watch: {
      orderId(val) {
        if (val) {
          this.mountDeliveryPath()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .deliveryDialog {
    position: relative;
    display: inline-block;

    /deep/ .el-dialog {
      max-height: 80%;
      display: flex;
      flex-direction: column;
    }

    /deep/ .el-dialog__body {
      padding: 0 20px;
      padding-bottom: 10px;
      flex: 1;
      overflow: auto;
    }
  }

  .deliveryPath {
    padding: 0 20px;

    ul>li {
      display: flex;
      position: relative;

      .date {
        flex: 1;
        width: 100px;
        min-width: 100px;
        max-width: 100px;
        border-right: 1px solid #aaa;
        padding-top: 10px;
        text-align: right;
        color: #aaa;

        p {
          padding-right: 20px;
        }
      }
      .path {
        flex: 5;
        height: 60px;
        display: flex;
        align-items: center;
        overflow: hidden;
        color: #aaa;
        padding-left: 15px;
      }
      i {
        position: absolute;
        left: 99px;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        color: #aaa;
      }

      &:first-child {
        i {
          color: #666;
          font-size: 22px;
        }
        .path, 
        .date {
          color: #666;
        }
      }
      &:last-child {
        i {
          font-size: 22px;
        }
      }
    }
  }

  .btnOper {
    text-align: right;
    padding-right: 20px;
  }
</style>
