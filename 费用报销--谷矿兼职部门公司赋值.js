// 获取主表字段fieldId
const bxrFieldMark = formSdk.convertFieldNameToId("bxr");
const bxbmFieldMark = formSdk.convertFieldNameToId("bxbm");
const bxdwnFieldMark = formSdk.convertFieldNameToId("bxdwn");
pageSdk.on('formReady', (args) => {
    const bxrfieldValue = formSdk.getFieldValue(bxrFieldMark);
    const wffpSdk = window.weappWorkflow.getFlowPageSDK();
    if (bxrfieldValue == '1212244585139986432' && wffpSdk.getBaseParam().userCurrentNodeId == '1273793545325469710') {
        const depart = {id: "1212243309509533733", name: "总经办"};
        const company = {id: "1213702194103640065", name: "内蒙古南戈壁能源有限公司"};
        formSdk.changeFieldValue(bxbmFieldMark, {specialObj: [depart]});
        formSdk.changeFieldValue(bxdwnFieldMark, {specialObj: [company]});
    }
});


/// 检验公司抬头与报销单位的名称一致性，公司抬头为空的值忽略。
formSdk.registerCheckEvent(window.WeFormSDK.OPER_SAVE, (successFn, failFn) => {
    const basepara = wffpSdk.getBaseParam();
    // 当前节点判断
    if (wffpSdk.getBaseParam().userCurrentNodeId === '1273793545325469710') {
        const fydetail = formsdk.convertFieldNameToId('ft_1222869_mxb1');
        const cldetail = formsdk.convertFieldNameToId('ft_1222869_clfbxl');
        const fygsttMark = formsdk.convertFieldNameToId("gstt", fydetail);
        const clgsttMark = formsdk.convertFieldNameToId("gstt", cldetail);
        const bxdwMark = formsdk.convertFieldNameToId("bxdw");
        const bxdwValue = formSdk.getFieldValue(bxdwMark);

        const valueSet = new Set();

        // 明细表1循环
        const fyrows = formsdk.getDetailRowCount(fydetail) || 0;
        for (let i = 1; i <= fyrows; i++) {
            const fyRowId = formsdk.getDetailRowIdByIndex(fydetail, i);
            const val = formsdk.getFieldValue(`${fygsttMark}_${fyRowId}`);
            if (val !== null && val !== undefined && val !== '') {
                valueSet.add(val);
            }
        }

        // 明细表2循环（修复你原有bug：使用cldetail行id，不是fyRowId）
        const clrows = formsdk.getDetailRowCount(cldetail) || 0;
        for (let i = 1; i <= clrows; i++) {
            const clRowId = formsdk.getDetailRowIdByIndex(cldetail, i);
            const val = formsdk.getFieldValue(`${clgsttMark}_${clRowId}`);
            if (val !== null && val !== undefined && val !== '') {
                valueSet.add(val);
            }
        }

        // 校验逻辑：集合内所有非空值必须等于 bxdwValue
        let isValid = true;
        for (const v of valueSet) {
            if (v !== bxdwValue) {
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


