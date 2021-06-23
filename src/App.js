import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchBox from './components/SearchBox';
import AddFavourites from './components/AddFavourites';
import RemoveFavourites from './components/RemoveFavourites';

const App = () => {
    const [movies, setMovies] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const getMovieRequest = async (searchValue) => {
        const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=7d497e19`;

        const response = await fetch(url);
        const responseJson = await response.json();

        if (responseJson.Search) {
            setMovies(responseJson.Search);
        };
    };

    useEffect(() => {
        getMovieRequest(searchValue);
    }, [searchValue]);

    useEffect(() => {
        const movieFavourites = JSON.parse(
            localStorage.getItem('react-movie-app-favourites')
        );
        if (movieFavourites) {
			setFavourites(movieFavourites);
		}
    }, []);

    const saveToLocalStorage = (items) => {
        localStorage.setItem('react-movie-app-favourites', JSON.stringify(items))
    };

    const addFavouriteMovie = (movie) => {
        const newFavouriteList =[...favourites, movie];
        setFavourites(newFavouriteList);
        saveToLocalStorage(newFavouriteList);
    };

    const removeFavouriteMovie = (movie) => {
        const newFavouriteList = favourites.filter(
            (favourites) => favourites.imdbID !== movie.imdbID
        );
        setFavourites(newFavouriteList);
        saveToLocalStorage(newFavouriteList);
    };

    return (
		<div className='container-fluid movie-app m-4'>
            {/* Search section */}
			<div className='row d-flex align-items-flex-center mt-4 mb-4'>
                <MovieListHeading heading="Movies" />
                <SearchBox searchValue={searchValue} setSearchValue={setSearchValue}/>
            </div>
            <div className='row'>
				<MovieList 
                    movies={movies}
                    handleFavouritesClick={addFavouriteMovie} 
                    favouritesComponent={AddFavourites} 
                />
			</div>
            {/* Favourites section */}
            <div className='row'>
                <MovieListHeading heading="Favourites" />
            </div>
            <div className='row'>
				<MovieList 
                    movies={favourites}
                    handleFavouritesClick={removeFavouriteMovie} 
                    favouritesComponent={RemoveFavourites} 
                />
			</div>
		</div>
    );
};

export default App;