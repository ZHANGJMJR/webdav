



// 获取主表字段fieldId
const bxrFieldMark = formSdk.convertFieldNameToId("bxr");
const bxbmFieldMark = formSdk.convertFieldNameToId("bxbm");
const bxdwnFieldMark = formSdk.convertFieldNameToId("bxdwn");
pageSdk.on('formReady', (args) => {
    const bxrfieldValue = formSdk.getFieldValue(bxrFieldMark);
    const wffpSdk = window.weappWorkflow.getFlowPageSDK();
    if(bxrfieldValue=='1212244585139986432' && wffpSdk.getBaseParam().userCurrentNodeId=='1273793545325469710'){
        const depart =  {  id: "1212243309509533733",  name: "总经办"  };
        const company= {  id: "1213702194103640065",  name: "内蒙古南戈壁能源有限公司" };
        formSdk.changeFieldValue(bxbmFieldMark, {specialObj: [depart]});
        formSdk.changeFieldValue(bxdwnFieldMark, {specialObj: [company]});
    }
});
