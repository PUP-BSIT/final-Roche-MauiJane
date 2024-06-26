const container = document.querySelector('#container');
const inputId = document.querySelector('#movie_id');
const inputTitle = document.querySelector('#title');
const inputMovieDescription = document.querySelector('#movie_description');
const inputGenre = document.querySelector('#genre');
const inputDirector = document.querySelector('#director');
const inputReleaseDate = document.querySelector('#release_date');

const endpoint = 'https://iraya.site/api/movie.php';

async function getMovie() {
  const response = await fetch(endpoint);
  const data = await response.json();

  container.innerHTML = '';

  for (const item of data) {
      const row = document.createElement('tr');
      const editButton = getEditButton(item);
      const deleteButton = getDeleteButton(item);

      row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.title}</td>
          <td>${item.movie_description}</td>
          <td>${item.genre}</td>
          <td>${item.director}</td>
          <td>${item.release_date}</td>`;

      row.append(editButton);
      row.append(deleteButton);
      container.append(row);
  }

  setInputs();
}

async function insertMovie() {
  const options = {
      method: 'POST',
      headers: {
          "Content-type": "application/x-www-form-urlencoded",
      },
      body: `title=${inputTitle.value}&\
          movie_description=${inputMovieDescription.value}&\
          genre=${inputGenre.value}&\
          director=${inputDirector.value}&\
          release_date=${inputReleaseDate.value}`
  };

  const response = await fetch(endpoint, options);
  const data = await response.text();

  getMovie();
}

async function updateMovie() {
  const options = {
      method: 'PATCH',
      headers: {
          "Content-type": "application/x-www-form-urlencoded",
      },
      body: `id=${inputId.value}&\
          title=${inputTitle.value}&\
          movie_description=${inputMovieDescription.value}&\
          genre=${inputGenre.value}&\
          director=${inputDirector.value}&\
          release_date=${inputReleaseDate.value}`
  };

  const response = await fetch(endpoint, options);
  const data = await response.text();

  getMovie();
}

async function deleteMovie(id) {
  const options = {
      method: 'DELETE',
      headers: {
          "Content-type": "application/x-www-form-urlencoded",
      },
      body: `id=${id}`
  };

  const response = await fetch(endpoint, options);
  const data = await response.text();

  getMovie();
}

function getDeleteButton(item) {
  const cell = document.createElement('td');
  const button = document.createElement('button');

  button.addEventListener('click', deleteMovie.bind(null, item.id));

  button.textContent = 'Delete';
  cell.append(button);
  return cell;
}

function getEditButton(item) {
  const cell = document.createElement('td');
  const button = document.createElement('button');

  button.addEventListener('click', setInputs.bind(null, item.id, 
    item.title, item.movie_description, item.genre, item.director,
    item.release_date));

  button.textContent = 'Edit';
  cell.append(button);

  return cell;
}

function setInputs(id, title, movie_description, genre,
  director, release_date) {
   inputId.value = id ?? '';
   inputTitle.value = title ?? '';
   inputMovieDescription.value = movie_description ?? '';
   inputGenre.value = genre ?? '';
   inputDirector.value = director ?? '';
   inputReleaseDate.value = release_date ?? '';
}

getMovie();