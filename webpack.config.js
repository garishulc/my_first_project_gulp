const config = {
	mode: 'production',
	entry: {
		//каждый новый js файл необходимо
		//добавлять сюда
		index: './src/js/index.js',
		//contacts: './src/js/contacts.js',
		//about: './src/js/about.js',
	},
	output: {
		filename: '[name].bundle.js',
	},
	//правило для загрузки css файлов
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};

module.exports = config;