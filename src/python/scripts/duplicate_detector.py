from difflib import SequenceMatcher

def get_similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def remove_duplicates(new_questions: list, existing_questions: list, threshold: float = 0.85) -> list:
    """Impede a entrada de perguntas muito parecidas com as já existentes no banco de dados."""
    unique_questions = []
    
    for new_q in new_questions:
        is_duplicate = False
        for exist_q in existing_questions:
            sim = get_similarity(new_q['question'], exist_q['question'])
            if sim > threshold:
                print(f"  ⚠️ Duplicata detectada (Similaridade {sim:.0%}): {new_q['question'][:40]}...")
                is_duplicate = True
                break
                
        if not is_duplicate:
            unique_questions.append(new_q)
            # Adiciona ao pool existente para evitar duplicatas dentro do próprio lote novo
            existing_questions.append(new_q)
            
    return unique_questions