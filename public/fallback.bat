:: backup subdirectory name parameter e.g. 202000520

@echo off
setlocal enabledelayedexpansion

set backup=.\backup\
set compress=.\compress\

if "%1" == "" echo "Missing backup subdirectory name parameter, e.g. 202000520"
:: echo %1|findstr \ >nul
:: if %errorlevel% equ 0 () else ()

if not exist %backup%%1 (
  echo "dir %backup%%1 not exist!" && pause
) else (
  :: del /\d+.js.gz/
  if not exist %backup%%1%compress% (
    echo "dir %backup%%1%compress% not exist" && pause
  ) else (
    for /f "delims=" %%a in ('dir /a-d/b /on %compress%*.js.gz ^| findstr "^[0-9]*.js.gz$"') do (
      del "%compress%%%a"
    )
  :: fallback from .\backup\%1
    xcopy %backup%%1\* .\ /y/s
  )
)