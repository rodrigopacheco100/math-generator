-- Migration para melhorar armazenamento de respostas
-- Mover todas as respostas de texto para o campo value para consistência

-- Converter user_answer de texto direto para objeto com value
UPDATE answers 
SET user_answer = jsonb_build_object('value', user_answer)
WHERE jsonb_typeof(user_answer) = 'string';

-- Converter correct_answer de texto direto para objeto com value
UPDATE answers 
SET correct_answer = jsonb_build_object('value', correct_answer)
WHERE jsonb_typeof(correct_answer) = 'string';

-- O schema agora terá formato consistente: { "value": ... }
-- Novas implementações usarão arrays diretamente para divisibilidade