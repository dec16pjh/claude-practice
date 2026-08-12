@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo ==========================================
echo    GitHub 저장소 설정
echo ==========================================
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo [오류] git이 설치되어 있지 않습니다.
  echo        https://git-scm.com/download/win 에서 설치 후 다시 실행하세요.
  pause
  exit /b 1
)

if exist ".git" (
  echo [1/4] 이전에 만들다 만 .git 폴더를 정리합니다...
  rmdir /s /q ".git"
)

echo [2/4] git 저장소를 초기화합니다...
git init -b main
git config user.name "John Park"
git config user.email "john.tium@gmail.com"
git config core.autocrlf false

echo [3/4] 첫 커밋을 만듭니다...
git add -A
git commit -m "Initial commit: Claude Code skills and configuration"
if errorlevel 1 (
  echo [오류] 커밋에 실패했습니다. 위 메시지를 확인하세요.
  pause
  exit /b 1
)

echo [4/4] 결과 확인
git log --oneline -1
echo.
git status --short
echo.

echo ==========================================
echo    다음 단계: GitHub에 올리기
echo ==========================================
echo.
echo  1) https://github.com/new 에서 저장소를 만드세요
echo       Repository name : claude-practice
echo       공개 범위       : Private
echo       README / .gitignore / license 는 체크하지 마세요
echo.
echo  2) 아래 두 줄을 복사해서 이 창에 붙여넣으세요
echo     (USERNAME 을 본인 GitHub 아이디로 바꾸세요)
echo.
echo       git remote add origin https://github.com/USERNAME/claude-practice.git
echo       git push -u origin main
echo.
echo ==========================================
cmd /k
