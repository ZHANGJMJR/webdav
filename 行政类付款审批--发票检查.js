// 1262979350249586696   申请人提交发票  "1277530385981169679"
// 1248885071343689739   发起节点  "1277530385981169673"


const formsdk = window.WeFormSDK.getWeFormInstance();
const wffpSdk = window.weappWorkflow.getFlowPageSDK();

formSdk.registerCheckEvent(window.WeFormSDK.OPER_SAVE, (successFn, failFn) => {
        //获取流程当前节点
        const basepara = wffpSdk.getBaseParam();
        // 获取字段的fieldId
        const sfyfpMark = formSdk.convertFieldNameToId("sfyfp");
        const fkdwMark = formSdk.convertFieldNameToId("fkdw");
        // 获取是否有发票字段值
        const sfyfpValue = formSdk.getFieldValue(sfyfpMark);
        const fkdwBrow = formsdk.getBrowserOptionEntity(fkdwMark);
        const fkdetail = formsdk.convertFieldNameToId('uf_htfkspl_mxb1');
        const fyrows = formsdk.getDetailRowCount(fkdetail)||0;
        function checkAllSame(kpdwlist, formdw) {
            const cleanStr = (str) => str.replace(/[()（）]/g, '').trim();
            return kpdwlist.split(',').every(item => cleanStr(item) == cleanStr(formdw));
        }
        if((basepara.userCurrentNodeId=='1277530385981169673' && sfyfpValue=='1' )||basepara.userCurrentNodeId=='1277530385981169679'){
          const fkdw = fkdwBrow[0].name;
          if (fyrows<=0) failFn({msg: '付款明细中无数据, 不允许提交！'});
          const dzfpkpdwMark = formsdk.convertFieldNameToId('dzfpkpdw',fkdetail);
           for (var i = 1; i <= fyrows; i++) {
               const curRowId = formsdk.getDetailRowIdByIndex(fkdetail, i);
               var dzfpkpdwValue =  formsdk.getFieldValue(`${dzfpkpdwMark}_${curRowId}`);
               if(!checkAllSame(dzfpkpdwValue,fkdw)){
                   failFn({msg: '开票单据与付款单位不致, 不允许提交！'});
                   break;
               }
           }
           successFn() ;
        }else{successFn() ;}

});
const formsdk = window.WeFormSDK.getWeFormInstance();
//
const wldetail = curformsdk.convertFieldNameToId('ft_1222224_mxb1');
const tkslFieldMark = curformsdk.convertFieldNameToId("tksl", wldetail);
 const fyrows = formsdk.getDetailRowCount(fkdetail)||0;
  for (var i = 1; i <= fyrows; i++) {
        const curRowId = formsdk.getDetailRowIdByIndex(fkdetail, i);
        formSdk.changeFieldValue(`${tkslFieldMark}_${curRowId}`,{value: 0});
  }