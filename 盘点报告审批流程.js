/*
1、在保存提交时会自动依盘点结论来设置数值正负数
 */

const formsdk = window.WeFormSDK.getWeFormInstance();
const wffpSdk = window.weappWorkflow.getFlowPageSDK();

formSdk.registerCheckEvent(window.WeFormSDK.OPER_SAVE, (successFn, failFn) => {
        const basepara = wffpSdk.getBaseParam();
        const fkdetail = formsdk.convertFieldNameToId('ft_1233367_mxb1');
        const fyrows = formsdk.getDetailRowCount(fkdetail)||0;
        const pdjlMark = formSdk.convertFieldNameToId("pdjl");
        const pyhpkslMark = formSdk.convertFieldNameToId("pyhpksl");
          for (var i = 1; i <= fyrows; i++) {
               const curRowId = formsdk.getDetailRowIdByIndex(fkdetail, i);
               var pdjlValue =  formsdk.getFieldValue(`${pdjlMark}_${curRowId}`);
               var pyhpkslValue =  formsdk.getFieldValue(`${pyhpkslMark}_${curRowId}`);
               if(pdjlValue=='1') {
                  formSdk.changeFieldValue(`${pyhpkslMark}_${curRowId}`,{value: Math.abs(pyhpkslValue)*(-1)});
               }else {
                 formSdk.changeFieldValue(`${pyhpkslMark}_${curRowId}`,{value: Math.abs(pyhpkslValue)});
               }
           }
           successFn() ;
});

/*
2、在函数联动里也设置了依盈亏变化修改数字的正负
 */

