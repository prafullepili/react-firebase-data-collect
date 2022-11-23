import React, { useState, useEffect, useCallback, useRef } from 'react';

const Movie = (props) => {
  return (
    <li className='movie'>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
    </li>
  );
};

const MovieList = (props) => {
  return (
    <ul className='movies-list'>
      {props.movies.map((movie) => (
        <Movie
          key={movie.id}
          title={movie.title}
          releaseDate={movie.releaseDate}
          openingText={movie.openingText}
        />
      ))}
    </ul>
  );
};

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const AddMovie = (props) => {
    const titleRef = useRef('');
    const openingTextRef = useRef('');
    const releaseDateRef = useRef('');

    function submitHandler(event) {
      event.preventDefault();
      // could add validation here...
      const movie = {
        title: titleRef.current.value,
        openingText: openingTextRef.current.value,
        releaseDate: releaseDateRef.current.value,
      };

      props.onAddMovie(movie);
      document.getElementById('movieAddForm').reset();
    }

    return (
      <form onSubmit={submitHandler} id="movieAddForm">
        <div className='control'>
          <label htmlFor='title'>Title</label>
          <input type='text' id='title' ref={titleRef} required={true} />
        </div>
        <div className='control'>
          <label htmlFor='opening-text'>Opening Text</label>
          <textarea rows='5' id='opening-text' ref={openingTextRef} required={true}></textarea>
        </div>
        <div className='control'>
          <label htmlFor='date'>Release Date</label>
          <input type='text' id='date' ref={releaseDateRef} required={true} />
        </div>
        <button type='submit'>Add Movie</button>
        <button type='button' onClick={props.onFetchMovie}>Fetch Movies</button>
      </form>
    );
  }

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-https-50028-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        })
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);


  // Add movie in firebase
  async function addMovieHandler(movie) {

    const response = await fetch('https://react-https-50028-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      fetchMoviesHandler();
    }
    // const data = await response.json();
  }

  let content = <p>Found no movies.</p>;
  if (movies.length > 0) {
    content = <MovieList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} onFetchMovie={fetchMoviesHandler} />
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
