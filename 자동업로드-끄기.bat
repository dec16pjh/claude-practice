@echo off
chcp 65001 >nul
schtasks /Delete /TN "ClaudePractice-AutoPush" /F
echo.
echo 자동 업로드를 껐습니다.
echo.
pause
