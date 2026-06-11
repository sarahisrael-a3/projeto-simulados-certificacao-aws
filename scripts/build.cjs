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

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

const publicDataFiles = [
  'clf-c02.json',
  'clf-c02-en.json',
  'saa-c03.json',
  'saa-c03-en.json',
  'aif-c01.json',
  'aif-c01-en.json',
  'dva-c02.json',
  'dva-c02-en.json',
  'nivelamento/diagnostic-clf-c02.json',
  'nivelamento/diagnostic-clf-c02-en.json',
  'nivelamento/diagnostic-saa-c03.json',
  'nivelamento/diagnostic-saa-c03-en.json',
  'nivelamento/diagnostic-aif-c01.json',
  'nivelamento/diagnostic-aif-c01-en.json',
  'nivelamento/diagnostic-dva-c02.json',
  'nivelamento/diagnostic-dva-c02-en.json',
  'gamificacao/interactive-challenges.json'
];

console.log('🔨 Building...');

try {
  // Copiar JS
  console.log('📦 Copiando arquivos JS...');
  copyDirectoryRecursive('src/frontend/js', 'public/js');

  // Copiar CSS
  console.log('🎨 Copiando arquivos CSS...');
  copyDirectoryRecursive('src/frontend/styles', 'public/css');

  // Copiar SERVICES (necessário para api.js ser encontrado)
  console.log('🔗 Copiando arquivos de SERVICES...');
  if (fs.existsSync('src/services')) {
    copyDirectoryRecursive('src/services', 'public/services');
  } else {
    console.warn('⚠️  Pasta src/services/ não encontrada - pulando...');
  }

  // Copiar DATA (NOVO - necessário para os JSONs serem servidos)
  console.log('📊 Copiando arquivos de DATA...');
  if (fs.existsSync('data')) {
    fs.rmSync('public/data', { recursive: true, force: true });
    for (const file of publicDataFiles) {
      const srcPath = path.join('data', file);
      const destPath = path.join('public/data', file);

      if (!fs.existsSync(srcPath)) {
        throw new Error(`Arquivo de dados publico nao encontrado: ${srcPath}`);
      }

      copyFile(srcPath, destPath);
    }
  } else {
    throw new Error('Pasta data/ nao encontrada. O build precisa copiar os JSONs para public/data/.');
  }

  // Copiar painel de validacao estatico
  console.log('Copiando painel de VALIDATION...');
  if (fs.existsSync('validation/valid.html')) {
    copyFile('validation/valid.html', 'public/validation/valid.html');
    copyDirectoryRecursive('validation/css', 'public/validation/css');
    copyDirectoryRecursive('validation/js', 'public/validation/js');
  } else {
    console.warn('validation/valid.html nao encontrado - pulando painel de validacao...');
  }

  // Copiar .nojekyll para o build (necessário para GitHub Pages)
  console.log('⚙️  Copiando .nojekyll para GitHub Pages...');
  if (fs.existsSync('.nojekyll')) {
    fs.copyFileSync('.nojekyll', 'public/.nojekyll');
  }

  // Copiar 404.html para o build (necessário para SPA em GitHub Pages)
  console.log('⚙️  Copiando 404.html para GitHub Pages...');
  if (fs.existsSync('public/404.html')) {
    // já está em public/
  } else {
    console.warn('⚠️  public/404.html não encontrado - SPA fallback pode não funcionar');
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
