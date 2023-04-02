set UserDomain=Administrator@47.96.133.22
set dir=D:\deploy\hdj\web\editor

scp -P 2200 -C .\dist\*.bat %UserDomain%:%dir%
::backup
ssh -p 2200 %UserDomain% powershell -c "cd %dir%;.\backup.bat"
::copy
::scp -r .\dist\animate vrplanner@192.168.1.118:/G:/Shanghai/editor/ -C
scp -P 2200 -rC .\dist\compress .\dist\icon .\dist\images .\dist\js .\dist\mapsweb .\dist\index* .\dist\*.js %UserDomain%:%dir%
