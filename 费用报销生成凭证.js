/*
  //可通过this对象获取行数据，this对象格式：{target: ..., data: {...}}
        //获取明细行数据，比如该行数据为{rowId: 1, subFormId: xxx, dataId: xxx, formId: xxx, layoutMultiId:xxx}
        var data = this.data;    //data = {rowId: 1, subFormId: xxx, dataId: xxx, formId: xxx, layoutMultiId: xxx}
        var rowId = data.rowId;    //获取明细行rowId
*/

const curformsdk = window.WeFormSDK.getWeFormInstance();
// 币种常量
const RMB = {value:'1212228586470695011', specialObj: [{ "id": "1212228586470695011", "name": "人民币" }] };
// 费用明细表id
const feiyongdetail = curformsdk.convertFieldNameToId('ft_1222869_mxb1');
// 差旅明细表id
const chailvdetail = curformsdk.convertFieldNameToId('ft_1222869_clfbxl');
// 凭证明细表id
const pzdetail = curformsdk.convertFieldNameToId('ft_1222869_pzxx');

// 遍历获取明细表整表数据
const fyrow = curformsdk.getDetailRowCount(feiyongdetail)||0;
const clrow = curformsdk.getDetailRowCount(chailvdetail)||0;

// 获取报销人姓名（已修复、健壮）
const bxr = curformsdk.getBrowserOptionEntity(curformsdk.convertFieldNameToId("bxr"));
const bxrName = (bxr && bxr.length > 0 && bxr[0] && bxr[0].name) ? bxr[0].name : '';

if ((fyrow+clrow) > 0) {
  // 凭证明细字段，摘要，金额借方，原币，币种，金额贷方,币种编码
  const zhaiyaoField = curformsdk.convertFieldNameToId("zy", pzdetail);
  const jejfField = curformsdk.convertFieldNameToId("jejf", pzdetail);
  const ybjeField = curformsdk.convertFieldNameToId("hj", pzdetail);
  const bizFieldld= curformsdk.convertFieldNameToId("biz", pzdetail);
  const jedfField = curformsdk.convertFieldNameToId("jedf", pzdetail);
  const bzbmField = curformsdk.convertFieldNameToId("bzbm", pzdetail);

  // 费用明细字段,开支内容,报销金额,可抵扣税额
  const zhaiyaoFieldMark = curformsdk.convertFieldNameToId("kznr", feiyongdetail);
  const bxjeFieldMark = curformsdk.convertFieldNameToId("bxje", feiyongdetail);
  const zzsseFieldMark1 = curformsdk.convertFieldNameToId("zzsse", feiyongdetail);

  // 差旅明细字段,费用名称,报销金额,可抵扣税额
  const xmFieldMark = curformsdk.convertFieldNameToId("xm", chailvdetail);
  const jtfjeFieldMark = curformsdk.convertFieldNameToId("jtfje", chailvdetail);
  const zzsseFieldMark2 = curformsdk.convertFieldNameToId("zzsse", chailvdetail);

  // 清空凭证明细
  curformsdk.delDetailRow(pzdetail, "all");
  // 生成数据结果集
  const resultMap = {};
  // 循环从 0 开始（明细表索引规则）
  for (var i = 1; i <= fyrow; i++) {
    const curFeiYongRowId = curformsdk.getDetailRowIdByIndex(feiyongdetail, i);

    // 获取开支内容名称
    const zhaiyaovar = curformsdk.getBrowserOptionEntity(`${zhaiyaoFieldMark}_${curFeiYongRowId}`);
    const zhaiyaoV = (zhaiyaovar && zhaiyaovar.length > 0 && zhaiyaovar[0] && zhaiyaovar[0].name) ? zhaiyaovar[0].name : '';

    const bxjeV = parseFloat(curformsdk.getFieldValue(`${bxjeFieldMark}_${curFeiYongRowId}`) || 0)||0;
    const dikouShuiV = parseFloat(curformsdk.getFieldValue(`${zzsseFieldMark1}_${curFeiYongRowId}`) || 0)||0;
    resultMap[zhaiyaoV] = (resultMap[zhaiyaoV] || 0) + bxjeV - dikouShuiV;
    if(dikouShuiV>0){
        resultMap[zhaiyaoV+'可抵扣税']= (resultMap[zhaiyaoV+'可抵扣税'] || 0) + dikouShuiV;
    }
  }
  for (var i = 1; i <= clrow; i++) {
    const curFeiYongRowId = curformsdk.getDetailRowIdByIndex(chailvdetail, i);

    // 获取开支内容名称
    const zhaiyaovar = curformsdk.getBrowserOptionEntity(`${xmFieldMark}_${curFeiYongRowId}`);
    const zhaiyaoV = (zhaiyaovar && zhaiyaovar.length > 0 && zhaiyaovar[0] && zhaiyaovar[0].name) ? zhaiyaovar[0].name : '';

    const bxjeV = parseFloat(curformsdk.getFieldValue(`${jtfjeFieldMark}_${curFeiYongRowId}`) || 0) || 0;
    const dikouShuiV = parseFloat(curformsdk.getFieldValue(`${zzsseFieldMark2}_${curFeiYongRowId}`) || 0)||0;

    resultMap[zhaiyaoV] = (resultMap[zhaiyaoV] || 0) + bxjeV - dikouShuiV;
    if(dikouShuiV>0){
        resultMap[zhaiyaoV+'可抵扣税']= (resultMap[zhaiyaoV+'可抵扣税'] || 0) + dikouShuiV;
    }
  }

  console.log(resultMap);
  let totalJE=0.00;
  // 遍历汇总结果，添加到凭证明细表
Object.entries(resultMap).forEach(([zhaiyaoV, money]) => {
  totalJE+=money;
  curformsdk.addDetailRow(pzdetail, {
    [zhaiyaoField]: { value: `${bxrName}报销${zhaiyaoV}`  }, // 摘要 `${bxrName}报销${title}`
    [jejfField]: { value: money },                      // 借方金额
    [ybjeField]: { value: money },                       // 原币金额
    [bizFieldld]: RMB, //币种
    [bzbmField]:"CNY"
  },{dataLinkage: false,jsApiChange:true});});

  curformsdk.addDetailRow(pzdetail, {
    [zhaiyaoField]: { value: `${bxrName}报销费用` }, // 摘要bxrName + '报销费用'
    [jedfField]: { value: totalJE },                      // 借方金额
    [ybjeField]: { value: totalJE },                       // 原币金额
    [bizFieldld]: RMB, //币种
    [bzbmField]:"CNY"
  },{dataLinkage: false,jsApiChange:true});

  // // 再次update币种并联动
  //   const bizList = [];
  //   const c = curformsdk.getDetailRowCount(pzdetail) || 0;
  //   if ((curformsdk.getDetailRowCount(pzdetail) || 0) > 0) {
  //       for (i = 1; i <= curformsdk.getDetailRowCount(pzdetail) || 0; i++) {
  //           const curPzRowId = curformsdk.getDetailRowIdByIndex(pzdetail, i);
  //           bizList.push({rowId: curPzRowId, [bizFieldld]: {specialObj: [{"id": "1212228586470695011", "name": "人民币"}]}});
  //       }
  //        // 批量添加明细数据，并设置不执行联动
  //        curformsdk.changeDetailData(pzdetail, bizList, {dataLinkage: true,jsApiChange:true})
  //   }

}


