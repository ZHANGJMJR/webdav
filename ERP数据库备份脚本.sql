DECLARE
    @Today VARCHAR(8),
    @BackupRoot VARCHAR(100) = 'C:\dbback\',
    @BackupPath VARCHAR(100),
    @CmdMkDir VARCHAR(200),
    @FileU8CDBPRD VARCHAR(200);

-- 获取8位日期 yyyymmdd
SET @Today = CONVERT(VARCHAR(8), GETDATE(), 112);
SET @BackupPath = @BackupRoot + @Today;

-- 拼接完整备份文件路径
SET @FileU8CDBPRD = @BackupPath + '\U8CDBPRD_' + @Today + '.bak';

-- 开启xp_cmdshell
IF NOT EXISTS (SELECT 1 FROM sys.configurations WHERE name = 'xp_cmdshell' AND value_in_use = 1)
BEGIN
    EXEC sp_configure 'show advanced options', 1;
    RECONFIGURE;
    EXEC sp_configure 'xp_cmdshell', 1;
    RECONFIGURE;
END

-- 创建日期文件夹
SET @CmdMkDir = 'md "' + @BackupPath + '"';
EXEC xp_cmdshell @CmdMkDir, NO_OUTPUT;

-- 备份 eteams
BACKUP DATABASE U8CDBPRD
TO DISK = @FileU8CDBPRD
WITH COMPRESSION, INIT, STATS=10;


-- 关闭xp_cmdshell
EXEC sp_configure 'xp_cmdshell', 0;
RECONFIGURE;
EXEC sp_configure 'show advanced options', 0;
RECONFIGURE;

PRINT '备份完成，路径：' + @BackupPath;
