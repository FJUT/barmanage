var fs = require('fs')

fs.readFile('./city-code.json', (err, content) => {
	var json = JSON.parse(content)

	json = json.map(item => {
		console.log(item.cities)
		for (var i = 0; i < item.cities.length; i++) {
			delete item.cities[i].cities
		}

		return item
	})

	json = JSON.stringify(json)

	fs.writeFile('./city-code.json', json, {
		encoding: 'utf8'
	})
})