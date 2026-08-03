
const bxrFieldMark = formSdk.convertFieldNameToId("bxr");
const bxbmFieldMark = formSdk.convertFieldNameToId("bxbm");
const bxdwnFieldMark = formSdk.convertFieldNameToId("bxdwn");
const wffpSdk = window.weappWorkflow.getFlowPageSDK();

pageSdk.on('formReady', (args) => {
    const bxrfieldValue = formSdk.getFieldValue(bxrFieldMark);
    if(bxrfieldValue=='1212244585139986432' && wffpSdk.getBaseParam().userCurrentNodeId=='1273793545325469710'){
        const depart =  {  id: "1212243309509533733",  name: "总经办"  };
        const company= {  id: "1213702194103640065",  name: "内蒙古南戈壁能源有限公司" };
        formSdk.changeFieldValue(bxbmFieldMark, {specialObj: [depart]});
        formSdk.changeFieldValue(bxdwnFieldMark, {specialObj: [company]});
    }
});

formSdk.registerCheckEvent(window.WeFormSDK.OPER_SAVE, (successFn, failFn) => {
    function cleanText(text) {
          if (text === null || text === undefined) return '';
          let str = String(text);
          str = str.replace(/\s+/g, '');
          str = str.replace(/（/g, '');
          str = str.replace(/）/g, '');
          str = str.replace(/\(/g, '');
          str = str.replace(/\)/g, '');
          return str;
      }

    const basepara = wffpSdk.getBaseParam();
    if (wffpSdk.getBaseParam().userCurrentNodeId === '1273793545325469710') {
        const fydetail = formSdk.convertFieldNameToId('ft_1222869_mxb1');
        const cldetail = formSdk.convertFieldNameToId('ft_1222869_clfbxl');
        const fygsttMark = formSdk.convertFieldNameToId("gstt", fydetail);
        const clgsttMark = formSdk.convertFieldNameToId("gstt", cldetail);
        const bxdwMark = formSdk.convertFieldNameToId("bxdw");
        const bxdwValue = formSdk.getFieldValue(bxdwMark);
        const cleanBxdw = cleanText(bxdwValue);

        const valueSet = new Set();
        const fyrows = formSdk.getDetailRowCount(fydetail) || 0;
        for (let i = 1; i <= fyrows; i++) {
            const fyRowId = formSdk.getDetailRowIdByIndex(fydetail, i);
            const val = formSdk.getFieldValue(`${fygsttMark}_${fyRowId}`);
            const cleanVal = cleanText(val);
            if (cleanVal !== '') {
                valueSet.add(cleanVal);
            }
        }

        const clrows = formSdk.getDetailRowCount(cldetail) || 0;
        for (let i = 1; i <= clrows; i++) {
            const clRowId = formSdk.getDetailRowIdByIndex(cldetail, i);
            const val = formSdk.getFieldValue(`${clgsttMark}_${clRowId}`);
            const cleanVal = cleanText(val);
            if (cleanVal !== '') {
                valueSet.add(cleanVal);
            }
        }

        let isValid = true;
        for (const v of valueSet) {
            if (v !== cleanBxdw) {
                isValid = false;
                break;
            }
        }

        if (!isValid) {
            failFn({msg:'发票中的【公司抬头】必须与【报销单位】一致！'});
            return;
        }
    }
    successFn();
});



