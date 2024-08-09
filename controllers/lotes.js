import sql from 'mssql';

export const getLotes = (req, res) => {
	// Receiving data sent by client side
	const { lotNumber, isClassified, date, seller } = req.query;
	
	let query = `
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
	`

	if (!date) {
		query += "WHERE CAST(NF.data_entrada AS DATE) = CAST(GETDATE() AS DATE)";
	} else {
		query += `WHERE CAST(NF.data_entrada AS DATE) = '${date}'`;
	}
	if (lotNumber) {
		query += ` AND L.numLote LIKE '%${lotNumber}%'`;
	}
	if (isClassified) {
		if (isClassified === 'classificado') {
			query += ` AND TC.clas_id IS NOT NULL`;
		} else if (isClassified === 'naoClassificado') {
			query += ` AND TC.clas_id IS NULL`;
		}
	}
	if (seller) {
		query += ` AND C.nome LIKE '%${seller}%'`
	}

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
		,TC.clas_id
		,TC.clas_defeitos
		,TC.clas_umidade
		,TC.clas_fundo10
		,TC.clas_impurezas
		,TC.clas_broca
		,TC.clas_ac18
		,TC.clas_moka10
		,TC.clas_peneira17
		,TC.clas_peneira16
		,TC.clas_peneira15
		,TC.clas_peneira14
		,TC.clas_peneira13
		,TC.clas_peneira12
		,TC.clas_peneira10_11
		,TC.clas_cata
		,TC.clas_resultado
		,TC.clas_pagamento
		,TC.clas_usuario
		,TC.clas_editado
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
		,${req.body.ac18}
		,${req.body.moka10}
		,${req.body.peneira17}
		,${req.body.peneira16}
		,${req.body.peneira15}
		,${req.body.peneira14}
		,${req.body.peneira13}
		,${req.body.peneira12}
		,${req.body.peneira10_11}
		,${req.body.cata}
		,'${req.body.resultado}'
		,'${req.body.pagamento}'
		,'${req.body.usuario}'
		,''
		)`;

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const patchLote = (req, res) => {
	const query = `UPDATE TCE_classificacao SET
		clas_defeitos = ${req.body.defeitos}
		,clas_umidade = ${req.body.umidade}
		,clas_fundo10 = ${req.body.fundo10}
		,clas_impurezas = ${req.body.impurezas}
		,clas_broca = ${req.body.broca}
		,clas_ac18 = ${req.body.ac18}
		,clas_moka10 = ${req.body.moka10}
		,clas_peneira17 = ${req.body.peneira17}
		,clas_peneira16 = ${req.body.peneira16}
		,clas_peneira15 = ${req.body.peneira15}
		,clas_peneira14 = ${req.body.peneira14}
		,clas_peneira13 = ${req.body.peneira13}
		,clas_peneira12 = ${req.body.peneira12}
		,clas_peneira10_11 = ${req.body.peneira10_11}
		,clas_cata = ${req.body.cata}
		,clas_resultado = '${req.body.resultado}'
		,clas_pagamento = '${req.body.pagamento}'
		,clas_editado = '${req.body.editado}'
		WHERE clas_id = ${req.body.clas_id}`;

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}
