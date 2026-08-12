@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [오류] 여기는 git 저장소가 아닙니다.
  pause
  exit /b 1
)

git add -A

git diff --cached --quiet
if not errorlevel 1 (
  echo 변경된 내용이 없습니다. 올릴 것이 없습니다.
  timeout /t 3 >nul
  exit /b 0
)

echo --- 올릴 변경사항 ---
git diff --cached --stat
echo.

for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm'"`) do set STAMP=%%i

git commit -m "Update %STAMP%"
if errorlevel 1 (
  echo [오류] 커밋 실패
  pause
  exit /b 1
)

git push
if errorlevel 1 (
  echo.
  echo [오류] push 실패. 인터넷 연결이나 GitHub 로그인을 확인하세요.
  pause
  exit /b 1
)

echo.
echo ====================================
echo   업로드 완료  %STAMP%
echo ====================================
timeout /t 4 >nul
