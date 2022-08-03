require('dotenv').config()

const Telegraf = require('telegraf');

const {
	bot_token
} = process.env

const bot = new Telegraf(bot_token)

const axios = require('axios');


bot.start((ctx) => ctx.reply("Olá, aqui eu mostro algumas funções do Brasil-API, use /help para maiores informações."));


bot.command('help', async (ctx) => {
	const helpMessage = `
Comandos
/CEP <número> - Retorna informações de um determinado CEP.
/CNPJ <número> - Retorna informações de um determinado CNPJ.
/DDD <número> - Retorna informações de um determinado DDD.
`
	try {
		ctx.reply(`${helpMessage}`)
	} catch (e) {
		console.log(e);
	}
})
bot.command('cep', async (ctx) => {
	const cep_number = String(ctx.message.text).slice(-8)
	const cep_url = `https://brasilapi.com.br/api/cep/v2/${cep_number}`

	try {
		const res = await axios.get(cep_url);

		if (res.status === 200) return ctx.reply(`CEP: ${res.data.cep} ${'\n'}Estado: ${res.data.state} ${'\n'}Cidade: ${res.data.city}${'\n'}Bairro: ${res.data.neighborhood} ${'\n'}Rua: ${res.data.street}`)
	} catch (e) {
		if (e.response.status === 404) return ctx.reply('CEP não encontrado.')
	}
})

bot.command('cnpj', async (ctx) => {
	const cnpj_number = String(ctx.message.text).slice(-14)
	const cnpj_url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj_number}`

	try {
		const res = await axios.get(cnpj_url);

		if (res.status === 200) return ctx.reply(`CNPJ: ${res.data.cnpj} ${'\n'}Identificador Matriz Filial: ${res.data.identificador_matriz_filial} ${'\n'}Descrição Matriz Filial: ${res.data.descricao_matriz_filial} ${'\n'}Razão Social: ${res.data.razao_social} ${'\n'}Nome Fantasia: ${res.data.nome_fantasia} ${'\n'}Situação Cadastral: ${res.data.situacao_cadastral} ${'\n'}Descrição situação cadastral: ${res.data.descricao_situacao_cadastral} ${'\n'}`)
	} catch (e) {
		if (e.response.status === 404) return ctx.reply('CNPJ não encontrado.')
	}
})

bot.command('ddd', async (ctx) => {
	const ddd_number = String(ctx.message.text).slice(-2)
	const ddd_url = `https://brasilapi.com.br/api/ddd/v1/${ddd_number}`

	try {
		const res = await axios.get(ddd_url);

		if (res.status === 200) return ctx.reply(`Estado: ${res.data.state} ${'\n'}Cidades: ${res.data.cities}${'\n'}`)
	} catch (e) {
		if (e.response.status === 404) return ctx.reply('DDD não encontrado.')
	}
})


const startBot = async () => {
  try {
    await bot.launch();
    console.log('✅ - » Bot Brasil-Api iniciado com sucesso.')
  } catch(error) {
    console.error(error);
  }
}


startBot();
