/*
  //可通过this对象获取行数据，this对象格式：{target: ..., data: {...}}
        //获取明细行数据，比如该行数据为{rowId: 1, subFormId: xxx, dataId: xxx, formId: xxx, layoutMultiId:xxx}
        var data = this.data;    //data = {rowId: 1, subFormId: xxx, dataId: xxx, formId: xxx, layoutMultiId: xxx}
        var rowId = data.rowId;    //获取明细行rowId
*/
const curformsdk = window.WeFormSDK.getWeFormInstance();
// 币种常量
const RMB = { specialObj: [{ "id": "1212228586470695011", "name": "人民币" }] };
// 费用明细表id
const feiyongdetail = curformsdk.convertFieldNameToId('ft_nmgngbm_fybxlmxbxx');

// 凭证明细表id
const pzdetail = curformsdk.convertFieldNameToId('ft_nmgngbm_mxb2');

// 遍历获取明细表整表数据
const fyrow = curformsdk.getDetailRowCount(feiyongdetail)||0;
// 工具函数：安全转数字（确保两位小数、无精度错误）
function toFixedNum(val) {
  return Math.round(parseFloat(val || 0) * 100) / 100;
}
if ((fyrow+0) > 0) {
  // 凭证明细字段，摘要，金额借方，原币，币种，金额贷方,币种编码
  const zhaiyaoField = curformsdk.convertFieldNameToId("zy", pzdetail);
  const jejfField = curformsdk.convertFieldNameToId("jejf", pzdetail);
  const ybjeField = curformsdk.convertFieldNameToId("hj", pzdetail);
  const bizFieldld= curformsdk.convertFieldNameToId("biz", pzdetail);
  const jedfField = curformsdk.convertFieldNameToId("jedf", pzdetail);
  const bzbmField = curformsdk.convertFieldNameToId("bzbm", pzdetail);

  // 费用明细字段,开支内容,报销金额,报销人
  const zhaiyaoFieldMark = curformsdk.convertFieldNameToId("zffs", feiyongdetail);
  const bxjeFieldMark = curformsdk.convertFieldNameToId("je", feiyongdetail);
  const bxrFieldMark = curformsdk.convertFieldNameToId("bxr", feiyongdetail);
  // 清空凭证明细
  curformsdk.delDetailRow(pzdetail, "all");
  // 生成数据结果集
  const resultMap = {};
  // 循环从 0 开始（明细表索引规则）
  for (var i = 1; i <= fyrow; i++) {
    const curFeiYongRowId = curformsdk.getDetailRowIdByIndex(feiyongdetail, i);
    // 获取报销人员相关信息
    const zhaiyaovar = curformsdk.getBrowserOptionEntity(`${bxrFieldMark}_${curFeiYongRowId}`);
    let zhaiyao = '支付'+((zhaiyaovar && zhaiyaovar.length > 0 && zhaiyaovar[0] && zhaiyaovar[0].name) ? zhaiyaovar[0].name : '') +'报销款';
    const bxjeV = parseFloat(curformsdk.getFieldValue(`${bxjeFieldMark}_${curFeiYongRowId}`) || 0)||0;
    resultMap[zhaiyao] = toFixedNum((resultMap[zhaiyao] || 0) + bxjeV );
  }
  // 遍历汇总结果，添加到凭证明细表
Object.entries(resultMap).forEach(([zhaiyaoV, money]) => {
  curformsdk.addDetailRow(pzdetail, {
            [zhaiyaoField]: { value: `${zhaiyaoV}`  }, // 摘要 `${bxrName}报销${title}`
            [jejfField]: { value: money },                      // 借方金额
            [ybjeField]: { value: money },                       // 原币金额
            [bizFieldld]: RMB, //币种
            [bzbmField]:"CNY"
          },{dataLinkage: false,jsApiChange:true});
    curformsdk.addDetailRow(pzdetail, {
        [zhaiyaoField]: { value: `${zhaiyaoV}`  }, // 摘要 `${bxrName}报销${title}`
        [jedfField]: { value: money },                      // 借方金额
        [ybjeField]: { value: money },                       // 原币金额
        [bizFieldld]: RMB, //币种
        [bzbmField]:"CNY"
      },{dataLinkage: false,jsApiChange:true});
});
}
