//ft_1222224_mxb1


formSdk.registerCheckEvent(window.WeFormSDK.OPER_SAVE, (successFn, failFn) => {
    const wldetail = formSdk.convertFieldNameToId('ft_1222224_mxb1');
    const wlrows = formSdk.getDetailRowCount(wldetail) || 0;
    const kcslMark = formSdk.convertFieldNameToId("kcsl", wldetail);
    const slMark = formSdk.convertFieldNameToId("sl", wldetail);
    const ypflMark = formSdk.convertFieldNameToId("ypfl", wldetail);
    for (var i = 1; i <= wlrows; i++) {
        const curRowId = formSdk.getDetailRowIdByIndex(wldetail, i);
        let kcslValue = formSdk.getFieldValue(`${kcslMark}_${curRowId}`);
        let slValue = formSdk.getFieldValue(`${slMark}_${curRowId}`);
        let ypflValue = formSdk.getFieldValue(`${ypflMark}_${curRowId}`);

        // 转为数字，空值按0处理
        const kcslNum = Number(kcslValue) || 0;
        const slNum = Number(slValue) || 0;

        // ypfl存储值等于"2"的时候，才做库存校验
        if (ypflValue === '2' && slNum > kcslNum) {
            failFn({ msg: '第' + i + '行 领用数量大于库存数量, 不允许提交！' });
            return;
        }
    }
    successFn();
});
