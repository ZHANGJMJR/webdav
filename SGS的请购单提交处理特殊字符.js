// 获取主表字段fieldId
    const lbFieldMark = formSdk.convertFieldNameToId("lb");
    // 绑定单个字段
    formSdk.bindFieldChangeEvent(lbFieldMark, (data) => {
      const wldetail = formSdk.convertFieldNameToId('uf_cgqgdsp_mxb1');
      formSdk.delDetailRow(wldetail, "all");
    });


   formSdk.registerCheckEvent(window.WeFormSDK.OPER_SAVE, (successFn, failFn) => {
    function toFullWidthSymbol(text) {
        if (text === null || text === undefined) return '';
        let str = String(text);
        str = str.replace(/\s+/g, '');
        str = str.replace(/\\/g, '＼');
        str = str.replace(/"/g, '＂');
        str = str.replace(/,/g, '，');
        str = str.replace(/{/g, '《');
        str = str.replace(/}/g, '》');
        //str = str.replace(/|/g, '〡');
        return str;
    }
        const wldetail = formSdk.convertFieldNameToId('uf_cgqgdsp_mxb1');
        const gnxqMark = formSdk.convertFieldNameToId("gnxq", wldetail);
        const invdesforlanMark = formSdk.convertFieldNameToId("invdesforlan", wldetail);

        const wlrows = formSdk.getDetailRowCount(wldetail) || 0;
        for (let i = 1; i <= wlrows; i++) {
            const wlRowId = formSdk.getDetailRowIdByIndex(wldetail, i);
            const gnxqVal = formSdk.getFieldValue(`${gnxqMark}_${wlRowId}`);
            const invdesforlanVal = formSdk.getFieldValue(`${invdesforlanMark}_${wlRowId}`);
            formSdk.changeFieldValue(`${gnxqMark}_${wlRowId}`,{value:  toFullWidthSymbol(gnxqVal) });
            formSdk.changeFieldValue(`${invdesforlanMark}_${wlRowId}`,{value:  toFullWidthSymbol(invdesforlanVal) });
        }
    successFn();
});




/*  前台页面上的调试代码。


const formSdk = window.WeFormSDK.getWeFormInstance();
function toFullWidthSymbol(text) {
        if (text === null || text === undefined) return '';
        let str = String(text);
        str = str.replace(/\s+/g, '');
        str = str.replace(/\\/g, '＼');
        str = str.replace(/"/g, '＂');
        str = str.replace(/,/g, '，');
        str = str.replace(/{/g, '《');
        str = str.replace(/}/g, '》');
        //str = str.replace(/|/g, '〡');
        return str;
    }
debugger;
        const wldetail = formSdk.convertFieldNameToId('uf_cgqgdsp_mxb1');
        const gnxqMark = formSdk.convertFieldNameToId("gnxq", wldetail);
        const invdesforlanMark = formSdk.convertFieldNameToId("invdesforlan", wldetail);

        const wlrows = formSdk.getDetailRowCount(wldetail) || 0;
        for (let i = 1; i <= wlrows; i++) {
            const wlRowId = formSdk.getDetailRowIdByIndex(wldetail, i);
            const gnxqVal = formSdk.getFieldValue(`${gnxqMark}_${wlRowId}`);
            const invdesforlanVal = formSdk.getFieldValue(`${invdesforlanMark}_${wlRowId}`);
            formSdk.changeFieldValue(`${gnxqMark}_${wlRowId}`,{value:  toFullWidthSymbol(gnxqVal) });
            formSdk.changeFieldValue(`${invdesforlanMark}_${wlRowId}`,{value:  toFullWidthSymbol(invdesforlanVal) });
        }

 */