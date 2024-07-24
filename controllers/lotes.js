import sql from 'mssql';

export const getLotes = (req, res) => {
	const query = `
	SELECT CONVERT(VARCHAR, NF.data_entrada, 103) data_entrada
		,RT.referencia
		,NF.valor_total
		,RIGHT(RTRIM(I.descricao), CHARINDEX(' ', REVERSE(RTRIM(I.descricao)) + ' ') - 1) descricao
		,L.idlote
		,L.numLote
		,NF.qtd_sacas
		,NF.qtd_kg
		,P.pesoliquido
		,'CORRETOR' AS corretor
		,TRIM(C.nome) nome
		,TRIM(C.cidade) cidade
		,CASE WHEN TC.clas_id IS NULL THEN 'Não Classificado' ELSE 'Classificado' END AS status
	FROM NotaFiscal NF
	JOIN Tb_Notas_Rec_Transp RT ON NF.id = RT.idNotaFiscal
		AND NF.num_nota = RT.numeroNota
		AND RT.STATUS = 0
	JOIN itens_nota_fiscal I ON NF.id = I.id_nf
	JOIN numLote L WITH (NOLOCK) ON L.idNF = NF.id
	JOIN Pesagem P ON RT.idPesagem = P.idpesagem
	JOIN Clifor C ON NF.ID_Fornecedor = C.idclifor
	LEFT JOIN TCE_classificacao TC ON L.idlote = TC.idlote
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
	SELECT CONVERT(VARCHAR, NF.data_entrada, 103) data_entrada
		,RT.referencia
		,NF.valor_total
		,RIGHT(RTRIM(I.descricao), CHARINDEX(' ', REVERSE(RTRIM(I.descricao)) + ' ') - 1) descricao
		,L.idlote
		,L.numLote
		,NF.qtd_sacas
		,NF.qtd_kg
		,P.pesoliquido
		,'CORRETOR' AS corretor
		,TRIM(C.nome) nome
		,TRIM(C.cidade) cidade
		,CASE WHEN TC.clas_id IS NULL THEN 'Não Classificado' ELSE 'Classificado' END AS status
	FROM NotaFiscal NF
	JOIN Tb_Notas_Rec_Transp RT ON NF.id = RT.idNotaFiscal
		AND NF.num_nota = RT.numeroNota
		AND RT.STATUS = 0
	JOIN itens_nota_fiscal I ON NF.id = I.id_nf
	JOIN numLote L WITH (NOLOCK) ON L.idNF = NF.id
	JOIN Pesagem P ON RT.idPesagem = P.idpesagem
	JOIN Clifor C ON NF.ID_Fornecedor = C.idclifor
	LEFT JOIN TCE_classificacao TC ON L.idlote = TC.idlote
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

export const postLote = (req, res) => {
	const query = `INSERT INTO TCE_classificacao VALUES(
		${req.body.idlote}
		,'${req.body.numLote}'
		,${req.body.defeitos}
		,${req.body.umidade}
		,${req.body.fundo10}
		,${req.body.impurezas}
		,${req.body.broca}
		,${req.body.p18}
		,${req.body.p17}
		,${req.body.mk10}
		,${req.body.p16}
		,${req.body.p15}
		,${req.body.p14}
		,${req.body.p13}
		,${req.body.p12}
		,${req.body.p10_11}
		,${req.body.cata}
		)`;

	console.log(query);
	
	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}
