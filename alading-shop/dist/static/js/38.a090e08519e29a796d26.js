webpackJsonp([38],{"5vgI":function(t,e,a){var n=a("zUWd");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a("rjj0")("66999070",n,!0)},e2B8:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("8ghC"),i={components:{Pagination:a("1onU").a},data:function(){return{form:{},tableData:[],multipleSelection:[],id:"",pagination:{currentPage:1,pageSize:20,totalCount:0}}},created:function(){this.getParams(),this.getTableData()},methods:{getParams:function(){this.id=this.$route.query.id},getTableData:function(t){var e=this,a={id:this.id};a.pageNo=t?this.pagination.currentPage:1,Object(n.t)(a).then(function(t){e.form=t.data.afCouponDo,e.tableData=t.data.userList,e.pagination.totalCount=t.totalCount,e.pagination.pageSize=t.pageSize})},goBack:function(){this.$router.history.go(-1)},setSend:function(t){var e=this,a={};if(t)a.userIds=t.join();else{if(this.multipleSelection.length<=0)return void this.$message({type:"warning",message:"请先勾选"});a.userIds=this.multipleSelection.map(function(t){return t.userId}).join()}a.couponId=this.id,this.$confirm("确认发放优惠券?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(n.I)(a).then(function(t){e.$message({type:"success",message:"发放成功"}),e.getTableData()})}).catch(function(){})},handleSelectionChange:function(t){this.multipleSelection=t},handleCurrentChange:function(t){this.pagination.currentPage=t,this.getTableData(!0)}}},o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"sendCoupon"},[a("el-card",[a("h4",[t._v("优惠券说明")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("优惠券名称：")]),t._v(" "),a("p",[t._v(t._s(t.form.name))])]),t._v(" "),a("li",[a("p",[t._v("优惠券类型：")]),t._v(" "),a("p",[t._v(t._s("FULLVOUCHER"===t.form.type?"满减券":""))])]),t._v(" "),a("li",[a("p",[t._v("优惠券金额：")]),t._v(" "),a("p",[t._v("￥"+t._s(t.form.amount))])]),t._v(" "),a("li",[a("p",[t._v("使用限制：")]),t._v(" "),a("p",[t._v("满￥"+t._s(t.form.limitAmount)+"可使用")])]),t._v(" "),a("li",[a("p",[t._v("有效时间：")]),t._v(" "),"R"===t.form.expiryType?a("p",[t._v(t._s(t.form.gmtStartTime)+" 至 "+t._s(t.form.gmtEndTime))]):t._e(),t._v(" "),"D"===t.form.expiryType?a("p",[t._v("领取后"+t._s(t.form.validDays)+"天")]):t._e()]),t._v(" "),a("li",[a("p",[t._v("使用范围：")]),t._v(" "),a("p",[t._v(t._s(9===t.form.isGlobal?"全店":""))])])])]),t._v(" "),a("el-table",{attrs:{data:t.tableData,stripe:""},on:{"selection-change":t.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55"}}),t._v(" "),a("el-table-column",{attrs:{prop:"userName",label:"用户账号"}}),t._v(" "),a("el-table-column",{attrs:{prop:"orderNumber",label:"本店下单次数"}}),t._v(" "),a("el-table-column",{attrs:{prop:"buyNumber",label:"本店购买次数"}}),t._v(" "),a("el-table-column",{attrs:{prop:"latelyTime",label:"最近下单时间"}}),t._v(" "),a("el-table-column",{attrs:{label:"操作",width:"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){t.setSend([e.row.userId])}}},[t._v("发放")])]}}])})],1),t._v(" "),a("Pagination",{attrs:{pageNo:t.pagination.currentPage,pageSize:t.pagination.pageSize,totalCount:t.pagination.totalCount,handleChange:t.handleCurrentChange}}),t._v(" "),a("div",{staticClass:"multiSend"},[a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.setSend(!1)}}},[t._v("批量发放")])],1),t._v(" "),a("div",{staticClass:"back"},[a("el-button",{attrs:{type:"default"},on:{click:t.goBack}},[t._v("返回")])],1)],1)},staticRenderFns:[]};var l=a("VU/8")(i,o,!1,function(t){a("5vgI")},"data-v-56db20ad",null);e.default=l.exports},zUWd:function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,"\n.sendCoupon[data-v-56db20ad] {\n  padding: 20px;\n}\n.el-card[data-v-56db20ad] {\n  margin-bottom: 30px;\n}\n.el-card h4[data-v-56db20ad] {\n  padding-bottom: 20px;\n  font-weight: 700;\n}\n.el-card ul[data-v-56db20ad] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n.el-card ul li[data-v-56db20ad] {\n  width: 33%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  line-height: 2.5;\n}\n.el-card ul li p[data-v-56db20ad]:first-child {\n  width: 90px;\n  color: #666;\n}\n.multiSend[data-v-56db20ad] {\n  padding: 20px 0;\n}\n.back[data-v-56db20ad] {\n  text-align: right;\n  padding-right: 40px;\n}\n",""])}});