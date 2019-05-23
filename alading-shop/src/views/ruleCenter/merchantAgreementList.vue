<template>
    <div class="list_box">
        <div class="content_box">

        
            <div class="title">商家协议</div>

            <!-- 规则列表 -->
            <div class="list">
                <ul>
                    <li v-for="(item,index) in ruleData" :key="index" @click="goRuleDetails(item.id)">
                        <p>{{item.text}}</p>
                        <p class="time">{{item.time}}</p>
                    </li>
                </ul>

                <Pagination 
                  :pageSize="pagination.pageSize"
                  :pageNo="pagination.curentPage"
                  :totalCount="pagination.totalCount"
                  v-if="ruleData.length >= 10"
                ></Pagination>
            </div>        
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
export default {
    data(){
        return{
            pagination: {    // 分页配置项
                pageSize: 10,   // 每页显示的条数
                curentPage: 1,   // 当前页数
                totalCount: 0    // 总条数
            },
            ruleData:[    // 规则数据
                {
                    text:'SpringBoot整合JavaMail通过阿里云企业邮箱发送邮件1',
                    time:'2019-10-10',
                    id:1
                },
                {
                    text:'SpringBoot整合JavaMail通过阿里云企业邮箱发送邮件2',
                    time:'2019-10-10',
                    id:2
                },
                {
                    text:'SpringBoot整合JavaMail通过阿里云企业邮箱发送邮件3',
                    time:'2019-10-10',
                    id:3
                },
                {
                    text:'SpringBoot整合JavaMail通过阿里云企业邮箱发送邮件4',
                    time:'2019-10-10',
                    id:4
                },
                {
                    text:'SpringBoot整合JavaMail通过阿里云企业邮箱发送邮件5',
                    time:'2019-10-10',
                    id:5
                },
                {
                    text:'SpringBoot整合JavaMail通过阿里云企业邮箱发送邮件6',
                    time:'2019-10-10',
                    id:6
                },
                {
                    text:'SpringBoot整合JavaMail通过阿里云企业邮箱发送邮件7',
                    time:'2019-10-10',
                    id:7
                },
                {
                    text:'SpringBoot整合JavaMail通过阿里云企业邮箱发送邮件8',
                    time:'2019-10-10',
                    id:8
                },
                {
                    text:'SpringBoot整合JavaMail通过阿里云企业邮箱发送邮件9',
                    time:'2019-10-10',
                    id:9
                },
                {
                    text:'SpringBoot整合JavaMail通过阿里云企业邮箱发送邮件10',
                    time:'2019-10-10',
                    id:10
                }
            ],
        }
    },
    methods: {
        goRuleDetails(id){    // 跳转规则详情
           this.$router.push({ path:'agreementDetails/'+id});
        },

        // 处理分页
    //   handleCurrentChange(val) {
    //     this.pagination.currentPage = val
    //     // this.mountAfterServiceGoods()
    //   },
    },
    created() {
        this.pagination.totalCount = this.ruleData.length;
        this.pagination.pageSize = 10;
        this.handleCurrentChange(1)
    },
    components:{
        Pagination
    }

}
</script>

<style lang="scss" scoped>
    @import './ruleStyle.scss';
</style>

