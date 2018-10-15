var globalMovieList = [];

function getMovies() {

	let movieDataPromise = fetch('http://localhost:3000/movies', {
		method: 'get'
	}).then(response => response.json());

	movieDataPromise
		.then(parseListOfAllMovies)
		.catch(parseError);

	return movieDataPromise;
}

function parseError(error) {
	//console.log('Error occured');
	console.log(error.message);
}

function parseListOfAllMovies(listOfMovies) {

	if (Array.isArray(listOfMovies)) {

		globalMovieList = [];
		globalMovieList = listOfMovies;

		listOfMovies.forEach(element => {

			let innerContent = `
				<li id='${element.id}'>
					<span>${element.title}</span>
					<button id='addMovieButton' type='button' class='btn btn-link' value='${element.id}' onclick="addFavourite('${element.id}')">
						Add to Fav
					</button>
				</li>
			`;

			document.getElementById('moviesList').innerHTML += innerContent;
		})
	}
}

function getFavourites() {

	let favDataPromise = fetch('http://localhost:3000/favourites', {
		method: 'get'
	}).then(response => response.json());

	favDataPromise
		.then(parseListOfAllFavourites)
		.catch(parseError);

	return favDataPromise;

}

function parseListOfAllFavourites(listOfFavs) {

	document.getElementById('favouritesList').innerHTML = '';
	if (Array.isArray(listOfFavs)) {
		listOfFavs.forEach(element => {

			let innerContent = `
				<li id='${element.id}'>
					<span>${element.title}</span>
					<button id='removeMovieButton' type='button' class='btn btn-link' value='${element.id}'>Remove</button>
				</li>
			`;

			document.getElementById('favouritesList').innerHTML += innerContent;
		})
	}
}

function addFavourite(movieID) {
	//console.log(`Movie ID = ${movieID}`);

	let selectedMovie;

	if(movieID) {
		selectedMovie = globalMovieList.find(element => {
			//console.log(`Movie ID = ${element.id}`);
			return element.id === movieID;
		});
	}

	// console.log('selectedMovie : ');
	// console.log(JSON.stringify(selectedMovie));

	let favDataAddPromise = fetch('http://localhost:3000/favourites', {
		method: 'POST',
		body: JSON.stringify(selectedMovie),
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	}).then((res) => {
		if(res.ok) {
			console.log(`Movie is successfully added to favourites`)
			res.json();
		} else {
			throw new Error(`Movie is already added to favourites`);
		}
	});

	favDataAddPromise
	.then(getFavourites)
	.catch(parseError);

	return favDataAddPromise;
}

module.exports = {
	getMovies,
	getFavourites,
	addFavourite
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution


