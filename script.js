import { API_URL, API_KEY, IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE } from './config.js';

// (()=>{
     window.onload = ()=> {
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        fetchPopularMovieDetails(endpoint, false);
     };

    "use strict";
    const fetchPopularMovieDetails = async (url, isSearched) => {
        let response = await fetch(url);
        let movieData = await response.json();
    //    console.log(movieData.results[0]);
        movieData.results.map(element=>{
            //  console.log(element); 
            // isSearched ?  document.querySelector('.MovieDisplayGrid__container').innerHTML = '' : null
             document.querySelector('.MovieDisplayGrid__container').innerHTML += `
             <div class="col s12 m3 l3 xl3">
             <div class="card">
               <div class="card-image">
                 <img src="${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}">
                <!-- <span class="card-title">${element.original_title}</span> -->
               </div>
               <div class="card-content">
                 <p class="truncate">${element.overview}</p>
               </div>
               <div class="card-action">
                 <a href="#">Details</a>
               </div>
             </div>
            </div>                
             `;         
          });

        let randomMovie = movieData.results[Math.floor(Math.random() * 20)];
        document.querySelector('.HeroImage__image').style.background =`linear-gradient(to bottom, rgba(0,0,0,0)
        39%, rgba(0,0,0,0)
        41%, rgba(0,0,0,0.65)
        100%),
        url('${IMAGE_BASE_URL}${BACKDROP_SIZE}${randomMovie.backdrop_path}'), #1c1c1c`;
        document.querySelector('.HeroImage__description h4').innerText = randomMovie.original_title;
        document.querySelector('.HeroImage__description p').innerText = randomMovie.overview;          
    
    };

    let timeout = null;
    document.getElementById('movieSearch').addEventListener('keydown', ()=>{
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            console.log(document.getElementById('movieSearch').value);
        //    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=3`;
        //    fetchPopularMovieDetails(endpoint, true);
        }, 600);
    });

    let count = 2;
    document.getElementById('loadMoreBtn').addEventListener('click', ()=> {
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${count++}`;
        fetchPopularMovieDetails(endpoint, false);
    });

// })();
