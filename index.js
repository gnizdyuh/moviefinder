const TrendingFilms = async () => {
  const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${api_key}`
  let response = await fetch(url)
  let films = await response.json()
  let collection = []
  await films.results.forEach((film) => {
    collection.push(`<a class="collection-item">${film.title}</li>`)
  })
  const container = document.querySelector('#search-results')
  container.innerHTML = `
    <div class="collection">
      ${collection.join("")}
    </div>
  `
  return;
}

const FindHandler = async () => {
  let input = document.querySelector('#search').value
  if (!input.length) input = "*"
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${input}`
  let response = await fetch(url)
  let films = await response.json()
  const collection = document.querySelector('#search-results')
  console.log(films)
  collection.innerHTML = await DisplayFilm(films)
  document.querySelector('#search').value = ""
}

const DisplayFilm = ({ results }) => {
  if (!results.length) {
    TrendingFilms()
    return;
  }
  let collection = []
  results.forEach(result => {
    let { title, backdrop_path, overview } = result
    backdrop_path ? img = `<img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${backdrop_path}"></img>` : img = ""
    collection.push(`<li class="collection-item">
          <div class="card">
            <div class="card-image">${img}</div>
            <div class="card-content">
              <span class="card-title">${title}</span>
              <p>${overview}</p>
              <h5>Recomendations</h5>
              
            </div>
          </div>
        </li>`)
  })
  console.log(collection)
  return `<ul class="collection">${collection.join("")}</ul>`
}