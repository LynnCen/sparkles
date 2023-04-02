set UserDomain=vrplanner@192.168.1.118
set dir=G:\Company\editor

scp -C .\dist\*.bat %UserDomain%:%dir%
::backup
ssh %UserDomain% powershell -c "cd %dir%;.\backup.bat"
::copy
scp -rC .\dist\compress .\dist\icon .\dist\images .\dist\js .\dist\mapsweb .\dist\index* .\dist\*.js %UserDomain%:%dir%
