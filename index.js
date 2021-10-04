const express = require('express')
const app = express()
const port = 3000

const axios = require('axios')

const peopleUrl = 'https://swapi.dev/api/people'
const planetsUrl = 'https://swapi.dev/api/planets'

app.set('json spaces', 2)

app.listen(port, () => {
	console.log(`SWAPI app listening at http://localhost:${port}`)
})

app.get('/people', async (req, res) => {
	let people = await getAllResponses(peopleUrl)

	if (req.query.sortBy == 'name') {
		people.sort((a, b) => (a.name > b.name ? 1 : -1))
	}

	if (req.query.sortBy == 'height') {
		people.sort(function (a, b) {
			if (!isFinite(a.height) && !isFinite(b.height)) {
				return 0
			}
			if (!isFinite(a.height)) {
				return 1
			}
			if (!isFinite(b.height)) {
				return -1
			}
			return a.height - b.height
		})
	}

	if (req.query.sortBy == 'mass') {
		people.sort(function (a, b) {
			if (!isFinite(a.mass) && !isFinite(b.mass)) {
				return 0
			}
			if (!isFinite(a.mass)) {
				return 1
			}
			if (!isFinite(b.mass)) {
				return -1
			}
			return a.mass - b.mass
		})
	}

	res.send(people)
})

app.get('/planets', async (req, res) => {
	let planets = await getAllResponses(planetsUrl)

	for (const planet of planets) {
		let nameArr = []

		for (let resident of planet.residents) {
			let name = await axios.get(resident)

			nameArr.push(name.data.name)
		}

		planet.residents = nameArr
	}

	res.send(planets)
})

async function getAllResponses(url) {
	let responses = []

	do {
		let response = await axios.get(url)
		url = response.data.next
		responses = responses.concat(response.data.results)
	} while (url != null)

	return responses
}
