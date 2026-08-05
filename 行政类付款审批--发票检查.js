
const formsdk = window.WeFormSDK.getWeFormInstance();
const wffpSdk = window.weappWorkflow.getFlowPageSDK();


formSdk.registerCheckEvent(window.WeFormSDK.OPER_SAVE, (successFn, failFn) => {
        const basepara = wffpSdk.getBaseParam();
        const sfyfpMark = formSdk.convertFieldNameToId("sfyfp");
        const fkdwMark = formSdk.convertFieldNameToId("fkdw");
        const fkjeMark = formSdk.convertFieldNameToId("fkje");
        const dzfpjeMark = formSdk.convertFieldNameToId("dzfpje");
        const dzfphmMark = formSdk.convertFieldNameToId("dzfphm");
        const sfyfpValue = formSdk.getFieldValue(sfyfpMark);
        const fkdwBrow = formsdk.getBrowserOptionEntity(fkdwMark);
        const fkdetail = formsdk.convertFieldNameToId('uf_htfkspl_mxb1');
        const fyrows = formsdk.getDetailRowCount(fkdetail)||0;
        function checkAllSame(kpdwlist, formdw) {
            const cleanStr = (str) => str.replace(/[()（）]/g, '').trim();
            return kpdwlist.split(',').every(item => cleanStr(item) == cleanStr(formdw));
        }
        function checkDuplicateInvoiceNo(joinStr) {
                if (!joinStr) return true;
                const arr = joinStr.split(',')
                    .map(item => item.trim())
                    .filter(item => item !== "");
                const unique = new Set(arr);
                return arr.length === unique.size;
            }
        //successFn();
        if((basepara.userCurrentNodeId=='1292383946231619595' && sfyfpValue=='1' )||basepara.userCurrentNodeId=='1292383946231619601'){
          var dzfphmValue ;
          const fkdw = fkdwBrow[0].name;
          if (fyrows<=0) failFn({msg: '付款明细中无数据, 不允许提交！'});
          const dzfpkpdwMark = formsdk.convertFieldNameToId('dzfpkpdw',fkdetail);
           for (var i = 1; i <= fyrows; i++) {
               const curRowId = formsdk.getDetailRowIdByIndex(fkdetail, i);
               var dzfpkpdwValue =  formsdk.getFieldValue(`${dzfpkpdwMark}_${curRowId}`);
               var fkjeValue =  formsdk.getFieldValue(`${fkjeMark}_${curRowId}`);
               var fpjeValue =  formsdk.getFieldValue(`${dzfpjeMark}_${curRowId}`);
               dzfphmValue +=','+formsdk.getFieldValue(`${dzfphmMark}_${curRowId}`);

               if(!checkAllSame(dzfpkpdwValue,fkdw) && basepara.userCurrentNodeId=='1292383946231619595'){
                   failFn({msg: '开票单据与付款单位不致, 不允许提交！'});
                   break;
               }
               if(sfyfpValue=='1' && (fpjeValue==null || fpjeValue<fkjeValue)){
                  failFn({msg: '开票金额不得小于付款金额, 不允许提交！'});
                   break;
               }
              if (!checkDuplicateInvoiceNo(dzfphmValue)) {
                  failFn({msg: '电子发票---存在重复，请检查明细表, 不允许提交！'});
                  break;
              }
           }
           successFn() ;
        }else{successFn() ;}
});
