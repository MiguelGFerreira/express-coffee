import sql from 'mssql';

export const getLotes = (req, res) => {
	const query = `
	SELECT NF.data_entrada, RT.referencia, NF.valor_total, I.descricao, L.numLote, NF.qtd_sacas, NF.qtd_kg, P.pesoliquido, 'CORRETOR' as corretor, C.nome, C.cidade
	FROM NotaFiscal NF
	JOIN Tb_Notas_Rec_Transp RT ON NF.id = RT.idNotaFiscal
	AND NF.num_nota = RT.numeroNota
	AND RT.status = 0
	JOIN itens_nota_fiscal I ON NF.id = I.id_nf
	JOIN numLote L WITH (NOLOCK) ON L.idNF = NF.id
	JOIN Pesagem P on RT.idPesagem = P.idpesagem
	JOIN Clifor C ON NF.ID_Fornecedor = C.idclifor
	`
	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}
