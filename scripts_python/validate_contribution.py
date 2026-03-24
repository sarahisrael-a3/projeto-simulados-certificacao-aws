#!/usr/bin/env python3
"""
Validador de Contribuições de Questões
Valida questões individuais antes de serem mergeadas no banco principal
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime

class ContributionValidator:
    """Valida questões contribuídas pela comunidade"""
    
    REQUIRED_FIELDS = [
        'domain', 'subdomain', 'service', 'difficulty', 
        'type', 'tags', 'question', 'options', 'correct', 'explanation'
    ]
    
    VALID_DIFFICULTIES = ['easy', 'medium', 'hard']
    VALID_TYPES = ['multiple-choice', 'multiple-answer']
    
    VALID_DOMAINS = {
        'clf-c02': ['conceitos-cloud', 'seguranca', 'tecnologia', 'faturamento'],
        'saa-c03': ['design-resiliente', 'design-performatico', 'design-seguro', 'design-otimizado'],
        'aif-c01': ['fundamentos-ia', 'aplicacoes-ia', 'seguranca-ia', 'governanca-ia'],
        'dva-c02': ['desenvolvimento', 'seguranca', 'deployment', 'troubleshooting']
    }
    
    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.question: Dict[str, Any] = {}
        
    def validate(self) -> bool:
        """Executa todas as validações"""
        print(f"🔍 Validando: {self.file_path.name}")
        print("=" * 60)
        
        # 1. Validação de arquivo
        if not self._validate_file():
            return False
        
        # 2. Carrega JSON
        if not self._load_json():
            return False
        
        # 3. Validações de estrutura
        self._validate_required_fields()
        self._validate_field_types()
        self._validate_domain()
        self._validate_difficulty()
        self._validate_type()
        self._validate_tags()
        self._validate_question_text()
        self._validate_options()
        self._validate_correct_answer()
        self._validate_explanation()
        self._validate_contributor()
        
        # 4. Exibe resultados
        return self._display_results()
    
    def _validate_file(self) -> bool:
        """Valida se o arquivo existe e está no local correto"""
        if not self.file_path.exists():
            self.errors.append(f"❌ Arquivo não encontrado: {self.file_path}")
            return False
        
        if not self.file_path.suffix == '.json':
            self.errors.append("❌ Arquivo deve ter extensão .json")
            return False
        
        # Verifica se está na pasta contributions
        if 'contributions' not in str(self.file_path):
            self.warnings.append("⚠️  Arquivo não está na pasta data/contributions/")
        
        # Verifica nomenclatura
        if self.file_path.name.startswith('_'):
            self.errors.append("❌ Nome do arquivo não pode começar com underscore (reservado para templates)")
            return False
        
        return True
    
    def _load_json(self) -> bool:
        """Carrega e valida JSON"""
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                self.question = json.load(f)
            return True
        except json.JSONDecodeError as e:
            self.errors.append(f"❌ JSON inválido: {e}")
            return False
        except Exception as e:
            self.errors.append(f"❌ Erro ao ler arquivo: {e}")
            return False
    
    def _validate_required_fields(self):
        """Valida campos obrigatórios"""
        missing = [field for field in self.REQUIRED_FIELDS if field not in self.question]
        if missing:
            self.errors.append(f"❌ Campos obrigatórios faltando: {', '.join(missing)}")
    
    def _validate_field_types(self):
        """Valida tipos de dados dos campos"""
        if 'question' in self.question and not isinstance(self.question['question'], str):
            self.errors.append("❌ Campo 'question' deve ser string")
        
        if 'options' in self.question and not isinstance(self.question['options'], list):
            self.errors.append("❌ Campo 'options' deve ser array")
        
        if 'tags' in self.question and not isinstance(self.question['tags'], list):
            self.errors.append("❌ Campo 'tags' deve ser array")
        
        if 'explanation' in self.question and not isinstance(self.question['explanation'], str):
            self.errors.append("❌ Campo 'explanation' deve ser string")
    
    def _validate_domain(self):
        """Valida domínio da questão"""
        domain = self.question.get('domain', '')
        
        # Tenta detectar certificação pelo caminho do arquivo
        cert_id = None
        for cert in ['clf-c02', 'saa-c03', 'aif-c01', 'dva-c02']:
            if cert in str(self.file_path):
                cert_id = cert
                break
        
        if cert_id and domain not in self.VALID_DOMAINS.get(cert_id, []):
            self.warnings.append(
                f"⚠️  Domínio '{domain}' pode não ser válido para {cert_id}. "
                f"Domínios válidos: {', '.join(self.VALID_DOMAINS[cert_id])}"
            )
    
    def _validate_difficulty(self):
        """Valida nível de dificuldade"""
        difficulty = self.question.get('difficulty', '')
        if difficulty not in self.VALID_DIFFICULTIES:
            self.errors.append(
                f"❌ Dificuldade '{difficulty}' inválida. "
                f"Use: {', '.join(self.VALID_DIFFICULTIES)}"
            )
    
    def _validate_type(self):
        """Valida tipo de questão"""
        q_type = self.question.get('type', '')
        if q_type not in self.VALID_TYPES:
            self.errors.append(
                f"❌ Tipo '{q_type}' inválido. "
                f"Use: {', '.join(self.VALID_TYPES)}"
            )
    
    def _validate_tags(self):
        """Valida tags"""
        tags = self.question.get('tags', [])
        
        if not tags:
            self.warnings.append("⚠️  Nenhuma tag definida. Recomenda-se adicionar pelo menos 2 tags")
        elif len(tags) < 2:
            self.warnings.append("⚠️  Apenas 1 tag definida. Recomenda-se adicionar pelo menos 2 tags")
        
        # Verifica se tags são strings
        if not all(isinstance(tag, str) for tag in tags):
            self.errors.append("❌ Todas as tags devem ser strings")
    
    def _validate_question_text(self):
        """Valida texto da questão"""
        question = self.question.get('question', '')
        
        if len(question) < 50:
            self.warnings.append("⚠️  Questão muito curta (< 50 caracteres). Adicione mais contexto")
        
        if len(question) > 1000:
            self.warnings.append("⚠️  Questão muito longa (> 1000 caracteres). Considere simplificar")
        
        if not question.endswith('?'):
            self.warnings.append("⚠️  Questão não termina com '?'")
    
    def _validate_options(self):
        """Valida opções de resposta"""
        options = self.question.get('options', [])
        
        if len(options) != 4:
            self.errors.append(f"❌ Deve haver exatamente 4 opções. Encontradas: {len(options)}")
        
        # Verifica se opções são strings
        if not all(isinstance(opt, str) for opt in options):
            self.errors.append("❌ Todas as opções devem ser strings")
        
        # Verifica tamanho das opções
        for i, opt in enumerate(options):
            if len(opt) < 5:
                self.warnings.append(f"⚠️  Opção {i+1} muito curta (< 5 caracteres)")
            if len(opt) > 200:
                self.warnings.append(f"⚠️  Opção {i+1} muito longa (> 200 caracteres)")
    
    def _validate_correct_answer(self):
        """Valida resposta correta"""
        correct = self.question.get('correct')
        q_type = self.question.get('type', '')
        options = self.question.get('options', [])
        
        if q_type == 'multiple-choice':
            if not isinstance(correct, int):
                self.errors.append("❌ Para 'multiple-choice', 'correct' deve ser um número (índice)")
            elif correct < 0 or correct >= len(options):
                self.errors.append(f"❌ Índice 'correct' ({correct}) fora do range de opções (0-{len(options)-1})")
        
        elif q_type == 'multiple-answer':
            if not isinstance(correct, list):
                self.errors.append("❌ Para 'multiple-answer', 'correct' deve ser um array de índices")
            elif not all(isinstance(idx, int) for idx in correct):
                self.errors.append("❌ Todos os índices em 'correct' devem ser números")
            elif any(idx < 0 or idx >= len(options) for idx in correct):
                self.errors.append(f"❌ Algum índice em 'correct' está fora do range (0-{len(options)-1})")
            elif len(correct) < 2:
                self.errors.append("❌ 'multiple-answer' deve ter pelo menos 2 respostas corretas")
            
            # Verifica se a questão indica quantas opções escolher
            question_text = self.question.get('question', '').lower()
            if 'escolha' not in question_text and 'selecione' not in question_text:
                self.warnings.append(
                    f"⚠️  Questão de múltipla resposta deve indicar quantas opções escolher "
                    f"(ex: 'Escolha {len(correct)}' ou 'Selecione {len(correct)}')"
                )
    
    def _validate_explanation(self):
        """Valida explicação"""
        explanation = self.question.get('explanation', '')
        
        if len(explanation) < 50:
            self.warnings.append("⚠️  Explicação muito curta (< 50 caracteres). Seja mais detalhado")
        
        if len(explanation) > 1000:
            self.warnings.append("⚠️  Explicação muito longa (> 1000 caracteres). Considere resumir")
    
    def _validate_contributor(self):
        """Valida informações do contribuidor"""
        contributor = self.question.get('contributor', {})
        
        if not contributor:
            self.warnings.append("⚠️  Campo 'contributor' não encontrado. Adicione suas informações!")
            return
        
        if 'name' not in contributor:
            self.warnings.append("⚠️  Nome do contribuidor não informado")
        
        if 'github' not in contributor:
            self.warnings.append("⚠️  GitHub do contribuidor não informado")
        
        if 'date' not in contributor:
            self.warnings.append("⚠️  Data da contribuição não informada")
        else:
            # Valida formato da data
            try:
                datetime.strptime(contributor['date'], '%Y-%m-%d')
            except ValueError:
                self.errors.append("❌ Data deve estar no formato YYYY-MM-DD (ex: 2026-03-24)")
    
    def _display_results(self) -> bool:
        """Exibe resultados da validação"""
        print()
        
        if self.errors:
            print("❌ ERROS ENCONTRADOS:")
            for error in self.errors:
                print(f"  {error}")
            print()
        
        if self.warnings:
            print("⚠️  AVISOS:")
            for warning in self.warnings:
                print(f"  {warning}")
            print()
        
        if not self.errors and not self.warnings:
            print("✅ VALIDAÇÃO PASSOU!")
            print("   Sua questão está pronta para ser submetida via Pull Request!")
            print()
            return True
        elif not self.errors:
            print("✅ VALIDAÇÃO PASSOU COM AVISOS")
            print("   Sua questão pode ser submetida, mas considere revisar os avisos acima.")
            print()
            return True
        else:
            print("❌ VALIDAÇÃO FALHOU")
            print("   Corrija os erros acima antes de submeter.")
            print()
            return False


def main():
    """Função principal"""
    if len(sys.argv) < 2:
        print("Uso: python validate_contribution.py <caminho-para-questao.json>")
        print()
        print("Exemplo:")
        print("  python validate_contribution.py data/contributions/clf-c02/minha-questao.json")
        sys.exit(1)
    
    file_path = sys.argv[1]
    validator = ContributionValidator(file_path)
    
    success = validator.validate()
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
