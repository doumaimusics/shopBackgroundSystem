webpackJsonp([26],{"0hIN":function(t,a,e){"use strict";a.b=function(t){return Object(n.a)({url:s+"/balance/balanceList",method:"post",params:t})},a.c=function(){return Object(n.a)({url:s+"/balance/cateRateList",method:"post"})},a.a=function(t){return Object(n.a)({url:s+"/balance/balanceDetail",method:"post",params:t})};var n=e("vLgD"),s="/shop"},"1JAg":function(t,a,e){(t.exports=e("FZ+f")(!1)).push([t.i,"\n.settleInfoBox[data-v-7ae702b0] {\n  font-size: 14px;\n}\n.settleInfoBox .sameOrder[data-v-7ae702b0] {\n  padding: 20px;\n  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);\n          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);\n  margin-bottom: 25px;\n}\n.settleInfoBox .sameOrder th[data-v-7ae702b0] {\n  padding-bottom: 20px;\n}\n.settleInfoBox .orderInfo[data-v-7ae702b0] {\n  margin-top: 30px;\n}\n.settleInfoBox .orderInfo td[data-v-7ae702b0] {\n  padding: 10px 0;\n}\n.settleInfoBox .sameTable table[data-v-7ae702b0] {\n  width: 100%;\n  border-bottom: 1px solid #ebeef5;\n  border-left: 1px solid #ebeef5;\n  font-size: 14px;\n  color: #606266;\n  text-align: center;\n}\n.settleInfoBox .sameTable th[data-v-7ae702b0] {\n  padding: 10px 0;\n  color: #909399;\n  border-top: 1px solid #ebeef5;\n  border-right: 1px solid #ebeef5;\n}\n.settleInfoBox .sameTable td[data-v-7ae702b0] {\n  padding: 10px;\n  border-top: 1px solid #ebeef5;\n  border-right: 1px solid #ebeef5;\n}\n.settleInfoBox .sameTable b[data-v-7ae702b0] {\n  display: block;\n  padding-bottom: 20px;\n}\n.settleInfoBox .btn[data-v-7ae702b0] {\n  float: right;\n  margin-bottom: 30px;\n}\n",""])},"5ve0":function(t,a,e){var n=e("1JAg");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);e("rjj0")("1e76ad69",n,!0)},aWjO:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var n=e("0hIN"),s=e("GKmE"),o={data:function(){return{data:{}}},created:function(){this.init()},filters:{orderStatus:function(t){var a=void 0;switch(t){case"NEW":a="新建/待付款";break;case"DEALING":a="支付中";break;case"PAYFAIL":a="支付失败";break;case"PAID":a="已支付/待收货";break;case"REVIEW":a="代买审核中";break;case"AGENCYCOMPLETED":a="等待完成／等待收货";break;case"DELIVERED":a="待收货";break;case"FINISHED":case"REBATED":a="订单完成";break;case"CLOSED":a="订单关闭(未付款或退款成功)";break;case"WAIT_REFUND":a="等待退款";break;case"DEAL_REFUNDING":a="退款中";break;case"PROCESSING":a="订单处理中"}return a},changeTime:function(t,a,e,n){return"CLOSED"===n?Object(s.c)(t):"FINISHED"===n?Object(s.c)(a):"REBATED"===n?Object(s.c)(e):""}},methods:{init:function(){var t=this;Object(n.a)({orderId:this.$route.params.id}).then(function(a){t.data=a.data})},formatDateFn:function(t){if(t)return Object(s.c)(t)},changeTxt:function(t){return 0===t?"未结算":1===t?"已结算":void 0}}},r={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"components-container settleInfoBox"},[e("div",{staticClass:"orderInfo sameOrder"},[e("table",[t._m(0),t._v(" "),e("tr",[e("td",{attrs:{width:"300"}},[t._v("订单号："+t._s(t.data.orderNo))]),t._v(" "),e("td",{attrs:{width:"300"}},[t._v("订单状态："+t._s(t._f("orderStatus")(t.data.status)))]),t._v(" "),e("td",{attrs:{width:"300"}},[t._v("创建时间："+t._s(t.formatDateFn(t.data.gmtCreate)))])]),t._v(" "),e("tr",[e("td",{attrs:{width:"300"}},[t._v("付款时间："+t._s(t.formatDateFn(t.data.gmtPay)))]),t._v(" "),e("td",{attrs:{width:"300"}},[t._v("发货时间："+t._s(t.formatDateFn(t.data.gmtDeliver)))]),t._v(" "),e("td",{attrs:{width:"300"}},[t._v("完成（关闭）时间："+t._s(t._f("changeTime")(t.data.gmtClosed,t.data.gmtFinished,t.data.gmtRebated,t.data.status)))])])])]),t._v(" "),e("div",{staticClass:"goodInfo sameOrder sameTable"},[e("b",[t._v("商品信息")]),t._v(" "),e("table",[t._m(1),t._v(" "),e("tbody",[t.data.balanceGoodsList?e("tr",[e("td",[t._v(t._s(t.data.balanceGoodsList[0].goodsName))]),t._v(" "),e("td",[t._v(t._s(t.data.balanceGoodsList[0].barCode))]),t._v(" "),e("td",[t._v(t._s(t.data.balanceGoodsList[0].goodsPriceName))]),t._v(" "),e("td",[t._v("¥"+t._s(t.data.balanceGoodsList[0].saleAmount))]),t._v(" "),e("td",[t._v(t._s(t.data.balanceGoodsList[0].count))]),t._v(" "),e("td",[t._v("¥"+t._s(t.data.allAcuFee)+" "),e("br"),t._v("（含快递: "+t._s(t.data.addExpressFee)+"）")])]):t._e()])])]),t._v(" "),e("div",{staticClass:"settleInfo sameOrder sameTable"},[e("b",[t._v("结算信息")]),t._v(" "),e("span",[t._v("结算状态："+t._s(t.changeTxt(t.data.balanceStatus))+" ")]),e("span",{staticStyle:{"margin-left":"40px"}},[t._v("结算时间："+t._s(t.formatDateFn(t.data.balanceTime)))]),t._v(" "),e("el-table",{staticStyle:{"margin-top":"20px"},attrs:{data:t.data.balanceDos,border:"",stripe:""}},[e("el-table-column",{attrs:{prop:"result",label:"结算对象"}}),t._v(" "),e("el-table-column",{attrs:{prop:"categoryName",label:"类目"}}),t._v(" "),e("el-table-column",{attrs:{prop:"actualAmountl",label:"实付款"}}),t._v(" "),e("el-table-column",{attrs:{prop:"commissionRate",label:"佣金比例"}}),t._v(" "),e("el-table-column",{attrs:{prop:"balacneAmount",label:"结算金额"}})],1)],1),t._v(" "),e("router-link",{staticClass:"btn el-button el-button--default el-button--medium",attrs:{tag:"button",to:{name:"settleOrder"}}},[t._v("返回")])],1)},staticRenderFns:[function(){var t=this.$createElement,a=this._self._c||t;return a("tr",[a("th",{attrs:{colpan:"3",align:"left"}},[this._v("订单信息")])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("thead",[e("tr",[e("th",{attrs:{width:"20.5%"}},[t._v("商品")]),t._v(" "),e("th",{attrs:{width:"16%"}},[t._v("条形码")]),t._v(" "),e("th",{attrs:{width:"14.5%"}},[t._v("规格")]),t._v(" "),e("th",{attrs:{width:"14.5%"}},[t._v("单价")]),t._v(" "),e("th",{attrs:{width:"14.5%"}},[t._v("数量")]),t._v(" "),e("th",[t._v("实付款")])])])}]};var d=e("VU/8")(o,r,!1,function(t){e("5ve0")},"data-v-7ae702b0",null);a.default=d.exports}});