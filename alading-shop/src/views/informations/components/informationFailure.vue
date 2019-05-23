<template>
    <div class="failure">
        <div class="icon_img"></div>
        <p>店铺资料变更审核失败，原因：提交信息不符</p>
        <div class="btn_box">
            <el-button type="primary" @click="goEdit">重新编辑</el-button>
            <el-button @click="goInformation">放弃修改</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        goEdit() {
            this.$router.push({
                path: 'informationEdit'
            })
        },
        goInformation() {
            this.$emit("childFailure",0)
        }
    },
}
</script>

<style lang="scss" scoped>
    .failure {
        width: 100%;
        min-height: calc(100vh - 50px);
        background: #fff;
        padding-top: 70px;
       text-align: center;
        .icon_img{
            width: 100px;
            height: 100px;
            background: url(https://img.51fanbei.com/h5/admin/visualH5/icon_w_failure.png) no-repeat;
            background-size: cover;
             margin: 0 auto;
            margin-bottom: 12px;
            
        }
        p{
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(0,0,0,0.65);
            line-height:20px;
            margin-bottom: 40px;
        }
        .btn_box{

        }
    }
</style>