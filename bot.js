require('dotenv').config();

const Telegraf = require('telegraf');

const { bot_token } = process.env;

const bot = new Telegraf(bot_token);

const axios = require('axios');

const unMask = value => value.replace(/\D/g, '');



bot.start(ctx => ctx.reply("Olá, aqui eu mostro algumas funções do Brasil-API, use /help para mais informações."));

bot.command('help', async ctx => {
	const helpMessage = `
Comandos
/cep <número> - Retorna informações de um determinado CEP.
/cnpj <número> - Retorna informações de um determinado CNPJ.
/ddd <número> - Retorna informações de um determinado DDD.
/banco <número> - Retorna informações de um determinado Banco.
/dominio <dominio> - Retorna informações de um determinado dominio .br.
`;
	try {
		ctx.reply(helpMessage);
	} catch (e) {
		console.log(e);
	}
})
bot.command('cep', async ctx => {
	const cep_number = unMask(ctx.message.text.slice(5));
	const cep_url = `https://brasilapi.com.br/api/cep/v2/${cep_number}`;

	try {
		const res = await axios.get(cep_url);

		if (res.status === 200) return ctx.reply(`CEP: ${res.data.cep}\nEstado: ${res.data.state}\nCidade: ${res.data.city}\nBairro: ${res.data.neighborhood}\nRua: ${res.data.street}`);
	} catch (e) {
		if (e.response.status === 404) return ctx.reply('CEP não encontrado.');
	}
})
bot.command('cnpj', async ctx => {
	const cnpj_number = unMask(ctx.message.text.slice(6));
	const cnpj_url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj_number}`;

	try {
		const res = await axios.get(cnpj_url);

		if (res.status === 200) return ctx.reply(`CNPJ: ${res.data.cnpj}\nIdentificador Matriz Filial: ${res.data.identificador_matriz_filial}\nDescrição Matriz Filial: ${res.data.descricao_identificador_matriz_filial}\nRazão Social: ${res.data.razao_social}\nNome Fantasia: ${res.data.nome_fantasia}\nSituação Cadastral: ${res.data.situacao_cadastral}\nDescrição situação cadastral: ${res.data.descricao_situacao_cadastral}\n`);
	} catch (e) {
		if (e.response.status === 404) return ctx.reply('CNPJ não encontrado.');
	}
})
bot.command('ddd', async ctx => {
	const ddd_number = String(ctx.message.text).slice(-2);
	const ddd_url = `https://brasilapi.com.br/api/ddd/v1/${ddd_number}`;

	try {
		const res = await axios.get(ddd_url);

		if (res.status === 200) return ctx.reply(`Estado: ${res.data.state}\nCidades: ${(res.data.cities).join('\n')}`);
	} catch (e) {
		if (e.response.status === 404) return ctx.reply('DDD não encontrado.');
	}
})
bot.command('banco', async ctx => {
	const bank_number = String(ctx.message.text).slice(7);
	const bank_url = `https://brasilapi.com.br/api/banks/v1/${bank_number}`;

	try {
		const res = await axios.get(bank_url);

		if (res.status === 200) return ctx.reply(`Nome: ${res.data.fullName}\nCódigo: ${(res.data.code)}\nISPB: ${(res.data.ispb)}`);
	} catch (e) {
		if (e.response.status === 404) return ctx.reply('Banco não encontrado.');
	}
})
bot.command('dominio', async ctx => {
	const domain_br = String(ctx.message.text).slice(9);
	const domain_url = `https://brasilapi.com.br/api/registrobr/v1/${domain_br}`;

	try {
		const res = await axios.get(domain_url);

		if (res.status === 200) return ctx.reply(`Status: ${res.data.status}\nFQDN: ${(res.data.fqdn)}\nHosts:\n ${(res.data.hosts).join('\n')}\nSugestões:\n ${(res.data.suggestions).join('\n')}`);
	} catch (e) {
		if (e.response.status === 400) return ctx.reply('Erro ao consultar o domínio .br');
	}
})



const startBot = async () => {
	try {
		await bot.launch();
		console.log('✅ - Brasil-Api iniciado com sucesso.');
	} catch(error) {
		console.error(error);
	}
}
startBot();
