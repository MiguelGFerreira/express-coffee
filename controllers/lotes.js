import sql from 'mssql';

export const getLotes = (req, res) => {
	const query = `
	SELECT CONVERT(VARCHAR, NF.data_entrada, 103) data_entrada, RT.referencia, NF.valor_total, I.descricao, L.idlote, L.numLote
		,NF.qtd_sacas, NF.qtd_kg, P.pesoliquido, 'CORRETOR' as corretor, TRIM(C.nome) nome, TRIM(C.cidade) cidade, 'Não classificado' status
	FROM NotaFiscal NF
	JOIN Tb_Notas_Rec_Transp RT ON NF.id = RT.idNotaFiscal
		AND NF.num_nota = RT.numeroNota
		AND RT.status = 0
	JOIN itens_nota_fiscal I ON NF.id = I.id_nf
	JOIN numLote L WITH (NOLOCK) ON L.idNF = NF.id
	JOIN Pesagem P on RT.idPesagem = P.idpesagem
	JOIN Clifor C ON NF.ID_Fornecedor = C.idclifor
	WHERE CAST(NF.data_entrada AS DATE) > '20240701'
	`
	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const getLoteById = (req, res) => {
	const query = `
	SELECT CONVERT(VARCHAR, NF.data_entrada, 103) data_entrada, RT.referencia, NF.valor_total, I.descricao, L.idlote, L.numLote
		,NF.qtd_sacas, NF.qtd_kg, P.pesoliquido, 'CORRETOR' as corretor, TRIM(C.nome) nome, TRIM(C.cidade) cidade, 'Não classificado' status
	FROM NotaFiscal NF
	JOIN Tb_Notas_Rec_Transp RT ON NF.id = RT.idNotaFiscal
		AND NF.num_nota = RT.numeroNota
		AND RT.status = 0
	JOIN itens_nota_fiscal I ON NF.id = I.id_nf
	JOIN numLote L WITH (NOLOCK) ON L.idNF = NF.id
	JOIN Pesagem P on RT.idPesagem = P.idpesagem
	JOIN Clifor C ON NF.ID_Fornecedor = C.idclifor
	WHERE L.idlote = ${req.params.idlote}
	`

	console.log(query);
	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}
