/*
  //可通过this对象获取行数据，this对象格式：{target: ..., data: {...}}
        //获取明细行数据，比如该行数据为{rowId: 1, subFormId: xxx, dataId: xxx, formId: xxx, layoutMultiId:xxx}
        var data = this.data;    //data = {rowId: 1, subFormId: xxx, dataId: xxx, formId: xxx, layoutMultiId: xxx}
        var rowId = data.rowId;    //获取明细行rowId
*/

// 1. 明细表ID初始化
//let formSdk=window.WeFormSDK.getWeFormInstance();
//var formSdk;
//formSdk=window.formSdk.getWeFormInstance();
const weFormSdk = window.WeFormSDK.getWeFormInstance();
const pzdetail = weFormSdk.convertFieldNameToId('ft_1222869_pzxx');
const clrow = weFormSdk.getDetailRowCount(pzdetail) || 0;

// 金额保留2位小数工具
function toFixedNum(val) {
  const num = parseFloat(val || 0) || 0;
  return Math.round(num * 100) / 100;
}
let jfvar = 0;
if (clrow > 0) {
  // 明细字段ID统一转换（修复缺失ybjeField）
  const kmField = weFormSdk.convertFieldNameToId("km", pzdetail);
  const jejfField = weFormSdk.convertFieldNameToId("jejf", pzdetail);
  const jedfField = weFormSdk.convertFieldNameToId("jedf", pzdetail);
  const ybjeField = weFormSdk.convertFieldNameToId("ybje", pzdetail); // 补原币字段
  // 修复循环：下标从1开始 i <= clrow
  for (let i = 1; i <= clrow; i++) {
    const curPZRowId = weFormSdk.getDetailRowIdByIndex(pzdetail, i);
    let jfVal = parseFloat(weFormSdk.getFieldValue(`${jejfField}_${curPZRowId}`)) || 0;
    jfvar += jfVal;
  }
  let daifangkm2={ "id": "03010101", "name": "A/P - Trade",  "data": { "科目编码": "03010101" }  };
  weFormSdk.addDetailRow(pzdetail, {
    [kmField]:{specialObj: [daifangkm2]},
    [jedfField]: { value: toFixedNum(jfvar) },
    [ybjeField]: { value: toFixedNum(jfvar) }
  });
}





