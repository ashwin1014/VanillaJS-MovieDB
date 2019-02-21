import { API_URL, API_KEY} from './config.js';
import moviesDisplayContainer from './components/MovieDisplayGridComponent.js';
import movieDetails from './components/MovieDetailsComponent.js';
import actorDetails from './components/ActorDetailsComponent.js';


  document.addEventListener('DOMContentLoaded', function () {
     "use strict";

     window.onload = ()=> {
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1&include_adult=true`;
        fetchPopularMovieDetails(endpoint, false);
     };

     window.onbeforeunload = ()=>{ return null; };

    const fetchPopularMovieDetails = async (url, isSearched) => {
        let response = await fetch(url).catch((err) => { alert('TMDB server down'); console.log(err);});
        let movieData = await response.json();
        // console.log(movieData.results[0]);
        isSearched ? document.querySelector('#MovieDisplayGrid h3').innerText='Search results': document.querySelector('#MovieDisplayGrid h3').innerText='Popular movies'
        if(isSearched) document.querySelector('.MovieDisplayGrid__container').innerHTML = '';

        // Populate Movies
        moviesDisplayContainer(movieData);

       const movieRefernce = document.querySelectorAll('.mov-details');
        movieRefernce.forEach((ele)=>{
           ele.addEventListener('click', async(event)=>{
              event.preventDefault();
              const movieId = event.currentTarget.getAttribute('data-reference');
              // window.location.pathname = `/${movieId}`;
              let results = await Promise.all([
                fetch(`${API_URL}movie/${movieId}?api_key=${API_KEY}&include_adult=true`).catch((err) => { console.log(err); }),
                fetch(`${API_URL}movie/${movieId}/videos?api_key=${API_KEY}&include_adult=true`).catch((err) => { console.log(err); }),
                fetch(`${API_URL}movie/${movieId}/casts?api_key=${API_KEY}&include_adult=true`).catch((err) => { console.log(err); })
              ].map(url =>
                    url.then(
                        (response) => response.json()
                     ))
              );
           //    console.log(results)
              let genres = results[0].genres.map((ele)=>{
                return ele.name;
              });

              let actors = results[2].cast.map(ele => {
                return {
                  name: ele.name,
                  picture: ele.profile_path,
                  character: ele.character,
                  actorId: ele.id
                };
              });

               // console.log(actors)

               let videoUrl = results[1].results[0] ? `<iframe  src="https://www.youtube.com/embed/${results[1].results[0].key}" frameborder="0" allowfullscreen></iframe>`:'<p class="flow-text">No video available</p>'

               movieDetails(genres, actors, videoUrl, results[0]);

               actorDetails();
            });

        });
    };

    let timeout = null;
    document.getElementById('movieSearch').addEventListener('keydown', ()=>{
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            let searchedItem = document.getElementById('movieSearch').value;
            let endpoint;
          //  console.log(searchedItem);
            if(searchedItem === ''){
              endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1&include_adult=true`;
            } else {
              endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchedItem}&page=1&include_adult=true`;
            }
           fetchPopularMovieDetails(endpoint, true);
        }, 600);
    });

    let count = 1;
    document.getElementById('loadMoreBtn').addEventListener('click', ()=> {

      let searchedItem = document.getElementById('movieSearch').value;
      let endpoint;

      if(searchedItem === ''){
        endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${++count}&include_adult=true`;
      } else{
        endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchedItem}&page=${++count}&include_adult=true`;
      }
        fetchPopularMovieDetails(endpoint, false);
    });

    document.querySelector('.brand-logo').addEventListener('click', ()=>{
      window.location.reload(true);
    });


    document.querySelector('i.material-icons.left').addEventListener('click', ()=>{
      document.querySelector('#movieSection__details').style.display="none";
      document.querySelector('#movieSection__all').style.display="block";
      document.querySelector('i.material-icons.left').style.visibility="hidden";
      document.documentElement.scrollTop = 0;
    });

  });
