const loading = (load) => {
  if (load) {
    document.querySelector('#search-results').innerHTML = `<div class="preloader-wrapper active">
    <div class="spinner-layer spinner-blue-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>`;
  }
}

const TrendingFilms = async () => {
  loading(true);
  const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${api_key}`
  let response = await fetch(url)
  let films = await response.json()
  let collection = []
  await films.results.forEach((film) => {
    collection.push(`<a class="collection-item" onclick="FindFilm('${film.id}')">${film.title}</li>`)
  })
  const container = document.querySelector('#search-results')
  container.innerHTML = `
    <div class="collection">
      ${collection.join("")}
    </div>
  `
  loading(false);
  return;
}

const FindHandler = (e) => {
  e.preventDefault()
  let input = document.querySelector('#search').value
  FindFilm(input)
}

const FindFilm = async (film) => {
  loading(true)
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${film}`
  if (film.match(/\d{6}/)) {
    url = `https://api.themoviedb.org/3/movie/${film}?api_key=${api_key}&external_source=imdb_id`
  }
  if (!film.length) {
    TrendingFilms();
    return;
  }
  let response = await fetch(url)
  let films = await response.json()
  const collection = document.querySelector('#search-results')
  loading(false)
  collection.innerHTML = DisplayFilm(films)
  document.querySelector('#search').value = ""
}

const DisplayFilm = (films) => {
  let results
  if (films.status_code === 34) {
    TrendingFilms()
    return;
  }
  if (films.results) {
    if (!films.results.length || films.status_code === 34) {
      TrendingFilms()
      return;
    }
    results = films.results
  } else {
    results = [films]
  }

  let collection = []
  let img
  results.forEach(result => {
    let { id, title, backdrop_path, overview } = result
    DisplayRecomendations(id)
    backdrop_path ? img = `<img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${backdrop_path}"></img>` : img = "";
    collection.push(`<li class="collection-item">
          <div class="card">
            <div class="card-image">${img}</div>
            <div class="card-content">
              <span class="card-title">${title}</span>
              <p>${overview}</p>
              <span id="recomendations${id}"></span>
            </div>
          </div>
        </li>`)
  })
  return `<ul class="collection">${collection.join("")}</ul>`
}

const DisplayRecomendations = async (movie_id) => {
  let span
  try {
    let url = `https://api.themoviedb.org/3/movie/${movie_id}/recommendations?api_key=${api_key}`
    let response = await fetch(url)
    let films = await response.json()
    let { results } = films
    let film_titles = []
    results.forEach(film => {
      film_titles.push(`<a class="collection-item" onclick="FindFilm('${film.id}')">${film.title}</a>`)
    }
    )
    span = await document.querySelector(`#recomendations${movie_id}`)
    if (film_titles.length)
      span.innerHTML = `<h5>Recomendations</h5><div class="collection">${film_titles.join("")}</div>`
  } catch (error) {
    console.log(error)
  }

}