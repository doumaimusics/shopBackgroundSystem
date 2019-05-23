<template>
    <div class="details_box">
        <div class="details_content">
            <!-- 头部 -->
             <div class="title_box">
                 <h4>SpringBoot整合JavaMail通过阿里云企业邮箱发送邮件</h4>
                 <p>2019-10-10</p>
             </div>

            <!-- 中间内容 -->
            <div class="content_box">
                Learn how to influence others, to motivate, lead, empower, communicate, cooperate and coordinate, how to establish mutual trust handle change effectively. 懂得如何在工作上影响他人，如何高效地进行激励、领导、授权及沟通、配合、协调的有效方法，建立相互信任和应付变化。
            </div>

            <!-- 按钮 -->
            <div class="btn_box">
                <router-link :to="{name:'merchantAgreementList'}">
                    <el-button type="primary" >返回</el-button>
                </router-link>
                 
                 <el-button @click="goNext(11)">上一篇</el-button>
                 <el-button @click="goNext(10)">下一篇</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    methods: {
        goNext(id){
            this.$router.push({ 
                params:{
                    id:id
                }
            
            });
        }
        
    },
}
</script>

<style lang="scss" scoped>
    @import './ruleStyle.scss';
</style>