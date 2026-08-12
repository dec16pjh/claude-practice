Set-Location -LiteralPath $PSScriptRoot
git add -A
$staged = git diff --cached --name-only
if ($staged) {
    $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
    git commit -m "Auto $stamp"
    git push 2>&1 | Out-File -FilePath "$PSScriptRoot\.auto-push.log" -Append -Encoding utf8
    "[$stamp] pushed: $($staged.Count) file(s)" | Out-File -FilePath "$PSScriptRoot\.auto-push.log" -Append -Encoding utf8
}
