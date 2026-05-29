# =========================================================
# deploy.ps1 - Envia atualizacoes do Cartao Digital ao GitHub
# =========================================================

$timestamp = Get-Date -Format "dd/MM/yyyy HH:mm"
$mensagem = "Atualizacao: $timestamp"

Write-Host "Preparando arquivos..." -ForegroundColor Cyan
git add .

Write-Host "Salvando alteracoes..." -ForegroundColor Cyan
git commit -m $mensagem

Write-Host "Enviando para o GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host ""
Write-Host "Pronto! Cartao Digital atualizado no GitHub." -ForegroundColor Green
Write-Host "Acesse: https://juliana35-hub.github.io/Cart-o-Digital/" -ForegroundColor Yellow
