-- SQLite: O ATALHO PRA EXECUTAR COMANDOS SQL: ctrl + shift + Q

--SELECT * FROM FORNECEDORES;

SELECT id, nome_pessoa, nome_empresa, ocultarPedido, updated_at
FROM pedidos_especiais
ORDER BY id;
   