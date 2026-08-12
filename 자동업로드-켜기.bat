@echo off
chcp 65001 >nul
setlocal
set TASK=ClaudePractice-AutoPush

schtasks /Create /TN "%TASK%" /TR "powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \"%~dp0auto-push.ps1\"" /SC MINUTE /MO 30 /F
if errorlevel 1 (
  echo.
  echo [오류] 자동 업로드 등록에 실패했습니다.
  pause
  exit /b 1
)

echo.
echo ====================================
echo   자동 업로드가 켜졌습니다
echo   30분마다 변경사항을 GitHub에 올립니다
echo   기록은 .auto-push.log 에 남습니다
echo ====================================
echo.
echo   끄려면 "자동업로드-끄기.bat" 을 실행하세요
echo.
pause
