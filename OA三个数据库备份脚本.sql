-- ========== 数据库自动备份脚本 SQL Server 2019 ==========
DECLARE
    @Today VARCHAR(8),
    @BackupRoot VARCHAR(100) = 'C:\dbback\',
    @BackupPath VARCHAR(100),
    @CmdMkDir VARCHAR(200),
    @FileEteams VARCHAR(200),
    @FileEcology VARCHAR(200),
    @FileDbIm VARCHAR(200);

-- 获取8位日期 yyyymmdd
SET @Today = CONVERT(VARCHAR(8), GETDATE(), 112);
SET @BackupPath = @BackupRoot + @Today;

-- 拼接完整备份文件路径
SET @FileEteams = @BackupPath + '\eteams_' + @Today + '.bak';
SET @FileEcology = @BackupPath + '\ecology10_' + @Today + '.bak';
SET @FileDbIm = @BackupPath + '\db_im_' + @Today + '.bak';

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
BACKUP DATABASE eteams
TO DISK = @FileEteams
WITH COMPRESSION, INIT, STATS=10;

-- 备份 ecology10
BACKUP DATABASE ecology10
TO DISK = @FileEcology
WITH COMPRESSION, INIT, STATS=10;

-- 备份 db_im
BACKUP DATABASE db_im
TO DISK = @FileDbIm
WITH COMPRESSION, INIT, STATS=10;

-- 关闭xp_cmdshell
EXEC sp_configure 'xp_cmdshell', 0;
RECONFIGURE;
EXEC sp_configure 'show advanced options', 0;
RECONFIGURE;

PRINT '备份完成，路径：' + @BackupPath;

