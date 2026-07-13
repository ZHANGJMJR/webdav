// 1. 初始化空数组，用来存放表格原始数据
 const expenseList = [];
 // 获取表格tbody里所有数据行
 const rows = document.querySelectorAll('#expenseTable tbody tr');
 // 2. 循环遍历每一行，提取单元格数据
 rows.forEach(row => {
   // 按单元格顺序取值，索引0=费用类型，索引1=金额
   const costType = row.cells[0].innerText.trim();
   // 金额转为数字类型，避免字符串相加出错
   const money = Number(row.cells[1].innerText.trim());

   // 塞入原始数据数组
   expenseList.push({
     type: costType,
     money: money
   });
 });
 console.log('从表格提取的原始数据', expenseList);
 // 3. 执行费用合并累加逻辑（沿用之前的聚合代码）
 const resultMap = {};
 expenseList.forEach(item => {
   resultMap[item.type] = (resultMap[item.type] || 0) + item.money;
 });
 // 转为最终展示数组
 const mergeList = Object.entries(resultMap).map(([type, totalMoney]) => {
   return { type, totalMoney };
 });
 console.log('合并汇总后数据', mergeList);