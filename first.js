const curformsdk = window.WeFormSDK.getWeFormInstance();

// 费用明细表id
const feiyongdetail = curformsdk.convertFieldNameToId('ft_1222869_mxb1');
// 差旅明细表id
const chailvdetail = curformsdk.convertFieldNameToId('ft_1222869_clfbxl');
// 凭证明细表id
const pzdetail = curformsdk.convertFieldNameToId('ft_1222869_pzxx');

// 遍历获取明细表整表数据
const fyrow = curformsdk.getDetailRowCount(feiyongdetail);

// 获取报销人姓名（已修复、健壮）
const bxr = curformsdk.getBrowserOptionEntity(curformsdk.convertFieldNameToId("bxr"));
const bxrName = (bxr && bxr.length > 0 && bxr[0] && bxr[0].name) ? bxr[0].name : '';

if (fyrow > 0) {
  // 凭证明细字段
  const zhaiyaoField = curformsdk.convertFieldNameToId("zy", pzdetail);
  const jejfField = curformsdk.convertFieldNameToId("jejf", pzdetail);
  const ybjeField = curformsdk.convertFieldNameToId("hj", pzdetail);

  // 费用明细字段
  const zhaiyaoFieldMark = curformsdk.convertFieldNameToId("kznr", feiyongdetail);
  const bxjeFieldMark = curformsdk.convertFieldNameToId("bxje", feiyongdetail);
  const zzsseFieldMark = curformsdk.convertFieldNameToId("zzsse", feiyongdetail);

  // 差旅明细字段
  const xmFieldMark = curformsdk.convertFieldNameToId("kznr", chailvdetail);
  const jtfjeFieldMark = curformsdk.convertFieldNameToId("jtfje", chailvdetail);

  // 清空凭证明细
  curformsdk.delDetailRow(pzdetail, "all");

  // 循环从 0 开始（明细表索引规则）
  for (var i = 0; i < fyrow; i++) {
    const curFeiYongRowId = curformsdk.getDetailRowIdByIndex(feiyongdetail, i);

    // 获取开支内容名称
    const zhaiyaovar = curformsdk.getBrowserOptionEntity(`${zhaiyaoFieldMark}_${curFeiYongRowId}`);
    const zhaiyaoV = (zhaiyaovar && zhaiyaovar.length > 0 && zhaiyaovar[0] && zhaiyaovar[0].name) ? zhaiyaovar[0].name : '';

    // ✅ 修复：你写了不存在的变量 FyjineMark，正确是 bxjeFieldMark
    const bxjeV = curformsdk.getFieldValue(`${bxjeFieldMark}_${curFeiYongRowId}`) || 0;

    // 插入凭证明细
    curformsdk.addDetailRow(pzdetail, {
      [zhaiyaoField]: { value: bxrName + ' ' + zhaiyaoV },
      [jejfField]: { value: bxjeV },
      [ybjeField]: { value: bxjeV }
    });
  }
}