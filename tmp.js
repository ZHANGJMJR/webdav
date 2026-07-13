{
    "apiModule": "workflow",
    "testOperateUserId": "1212244460510437726",
    "identityId": "1212244460510437726",
    "identityType": 0,
    "isCreate": true,
    "requestId": "1278542361763045378",
    "workflowId": "1277530385981169665",
    "userCurrentNodeId": "1277530385981169673",
    "isAgent": false,
    "beAgentId": "0",
    "fixedNodeId": "1277530385981169673",
    "authStr": "ZmFjZVZlcmlmaWNhdGlvbj0xMjc3NTMwMzg1OTgxMTY5NjY1XzEyMTIyNDQ0NjA1MTA0Mzc3MjZfMTc4MDg4Mzg0MTY2MXxub2RlSWQ9MTI3NzUzMDM4NTk4MTE2OTY3M3w=",
    "authSignatureStr": "f27069c5bc51a15cf267ef18df2e61c9",
    "isTest": true,
    "pageKey": "create_1277530385981169665_1780883841157"
}"1277530385981169675"




// 1、直接使用formSdk实例，相关源码入口：1、表单设计器源码；2、表单设置→自定义ecode开发；
formSdk;

// 2、注: 这是初始化完成回调，同jQuery的onload
pageSdk.on('formReady',(args)=>{
    //获取最上层活动窗口的实例
    a、window.WeFormSDK.getWeFormInstance()
    //获取以moduleKey为隔离的最上层活动窗口实例
    b、window.WeFormSDK.getWeFormInstance(moduleKey)
    //获取以moduleKey和formId为隔离的最上层活动窗口实例
    c、window.WeFormSDK.getWeFormInstance(moduleKey, formId)
    //获取以moduleKey、formId和dataId为隔离的最上层活动窗口实例
    d、window.WeFormSDK.getWeFormInstance(moduleKey, formId, dataId)
    注：E10单个页面，可能会打开多份表单，有条件的情况下，建议使用粒度细的方式，以避免出现获取到其他表单的实例
});



