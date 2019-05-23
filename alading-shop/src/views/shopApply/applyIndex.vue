<template>
  <div class="shopCon">
    <el-row>
      <el-col :span="12">
        <dl>
          <dt>
            <h3>企业入驻</h3>
          </dt>
          <dd class="tips">适合公司／企业入驻，提供营业执照等资料即可入驻</dd>
          <dd class="selected">
            <p>
              <el-radio v-model="radio" label="0">旗舰店</el-radio>
              <span>经营一个自有品牌或品牌方独家授权的一级代理</span>
            </p>
            <p>
              <el-radio v-model="radio" label="1">专卖店</el-radio>
              <span>经营一个他人授权品牌的代理</span>
            </p>
            <p>
              <el-radio v-model="radio" label="2">专营店</el-radio>
              <span>经营多个他人授权品牌的代理</span>
            </p>
          </dd>
          <dd>
            <el-button type="primary" class="applyBtn" @click="companyApply">申请入驻</el-button>
          </dd>
        </dl>
      </el-col>
      <el-col :span="12">
        <dl>
          <dt>
            <h3>个人入驻</h3>
          </dt>
          <dd class="tips">适合个人、个体户入驻，提供身份证即可入驻</dd>
          <dd>
            <router-link
              tag="button"
              class="el-button applyBtn el-button--primary el-button--medium applyBtn personalBtn"
              :to="{name:'exclusiveShop',query:{type:3}}"
            >申请入驻</router-link>
          </dd>
        </dl>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        radio: ''
      }
    },
    created() {
      if (this.$route.query.redirect) {
        return false
      }
      const shopStatus = this.$store.getters.shopinfo.verify
      if (!shopStatus) {
        return
      }
      if (shopStatus === 2) {
        // 已提交，待审核 redirect
        this.$router.push({ name: 'auditing' })
      } else if (shopStatus === 3) {
        // 审核失败
        this.$router.push({ name: 'auditFail' })
      } else if (shopStatus === 4) {
        // 审核成功
        this.$router.push({ name: 'auditSuccess' })
      }
    },
    methods: {
      // 企业入驻  // 0:旗舰店  1：专卖店  2：专营店  3：个人店
      companyApply() {
        if (!this.radio) {
          this.$message({
            showClose: true,
            message: '请选择申请店铺类型',
            type: 'warning'
          })
          return false
        }
        if (this.radio == 0) {
          this.$router.push({ name: 'exclusiveShop', query: { type: 0 }})
        } else if (this.radio == 1) {
          this.$router.push({ name: 'exclusiveShop', query: { type: 1 }})
        } else if (this.radio == 2) {
          this.$router.push({ name: 'exclusiveShop', query: { type: 2 }})
        }
      }
    }
  }
</script>

<style scoped lang="less">
.shopCon {
  margin-top: 30px;
  dl {
    width: 450px;
    border: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    padding-bottom: 25px;
    margin: auto;
  }
  dt {
    text-align: center;
  }
  .tips {
    font-size: 14px;
  }
  .selected {
    font-size: 13px;
    p {
      margin: 20px 0;
    }
    span {
      padding-left: 20px;
      color: #908c8c;
    }
  }
  h3 {
    font-weight: 700;
    padding: 20px 0;
  }
  dd {
    padding-left: 40px;
  }
}
.applyBtn {
  display: block;
  margin: auto;
  &.personalBtn {
    margin-top: 128px;
  }
}
</style>
