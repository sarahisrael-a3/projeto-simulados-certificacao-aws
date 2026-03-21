def validate_semantics(questions: list, exame_id: str) -> list:
    """Verifica se o conteúdo das questões faz sentido logicamente e respeita o escopo do exame."""
    valid_questions = []
    
    # Dicionário de escopo de serviços por exame
    ESCOPO_SERVICOS = {
        "clf-c02": ["S3", "EC2", "Lambda", "DynamoDB", "RDS", "VPC", "IAM", "CloudFront", "Route 53", "CloudWatch", "CloudTrail", "SNS", "SQS", "WAF", "Shield", "Organizations", "Cost Explorer", "Budgets", "KMS"],
        
        "saa-c03": ["S3", "EC2", "Lambda", "DynamoDB", "RDS", "Aurora", "VPC", "IAM", "CloudFront", "Route 53", "CloudWatch", "CloudTrail", "SNS", "SQS", "KMS", "EKS", "ECS", "Fargate", "Transit Gateway", "Direct Connect", "Snowball", "Redshift", "ElastiCache", "Macie", "GuardDuty", "WAF", "Shield", "Cognito", "API Gateway", "Step Functions", "EventBridge", "Kinesis", "Glue", "Athena", "EFS", "FSx"]
    }
    
    servicos_permitidos = ESCOPO_SERVICOS.get(exame_id, [])

    for q in questions:
        # 1. Validação de Coerência
        correct_idx = q['correct']
        correct_text = q['options'][correct_idx]
        
        if correct_text.lower() not in q['explanation'].lower():
            print(f"  ⚠️ Semântica falhou: A justificativa não menciona a resposta correta '{correct_text}'.")
            continue
            
        # 2. Validação de Escopo (só aplica se tivermos uma lista definida para o exame)
        if servicos_permitidos:
            is_valid_service = any(servico.lower() in correct_text.lower() for servico in servicos_permitidos)
            if not is_valid_service and "AWS" not in correct_text and "Amazon" not in correct_text:
                print(f"  ⚠️ Semântica falhou: '{correct_text}' não parece estar no escopo do {exame_id.upper()}.")
                continue
            
        valid_questions.append(q)
        
    return valid_questions