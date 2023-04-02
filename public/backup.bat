@echo off
setlocal enabledelayedexpansion

set year=%date:~0,4%
set month=%date:~5,2%
set day=%date:~8,2%
set d=%year%%month%%day%
echo %d%

:: js files after compiled
xcopy .\compress\*.js ".\backup\%d%\compress\" /y
:: index.html index.css index.css.gz
xcopy .\index.* ".\backup\%d%\" /y
:: .\manifest.js
xcopy .\manifest.js ".\backup\%d%\" /y
:: del /\d+.js.gz/
set compress=.\compress\
for /f "delims=" %%a in ('dir /a-d/b /ON %compress%*.js.gz') do (
  del "%compress%%%a"
)