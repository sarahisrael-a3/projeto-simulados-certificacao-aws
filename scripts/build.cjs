#!/usr/bin/env node

/**
 * Build script - Copia arquivos de src/frontend para public/
 * Necessário porque o index.html espera os arquivos em public/js e public/css
 * Também copia /data para public/data para que as APIs funcionem
 */

const fs = require('fs');
const path = require('path');

function copyDirectoryRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('🔨 Building...');

try {
  // Copiar JS
  console.log('📦 Copiando arquivos JS...');
  copyDirectoryRecursive('src/frontend/js', 'public/js');

  // Copiar CSS
  console.log('🎨 Copiando arquivos CSS...');
  copyDirectoryRecursive('src/frontend/styles', 'public/css');

  // Copiar DATA (NOVO - necessário para os JSONs serem servidos)
  console.log('📊 Copiando arquivos de DATA...');
  if (fs.existsSync('data')) {
    copyDirectoryRecursive('data', 'public/data');
  } else {
    console.warn('⚠️  Pasta data/ não encontrada - pulando...');
  }

  console.log('✅ Build concluído com sucesso!');
  console.log('');
  console.log('Próximas etapas:');
  console.log('  1. Abra http://localhost:8000');
  console.log('  2. Ou execute: npx live-server public');
} catch (error) {
  console.error('❌ Erro ao fazer build:', error.message);
  process.exit(1);
}
