import { API_URL, API_KEY, IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE } from './config.js';
window.onload = ()=> {
    'use strict';
    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    renderMovies.fetchPopularMovieDetails(endpoint);
};

let renderMovies = (()=> {
    'use strict';
    let state = [];
    const fetchPopularMovieDetails = (endpoint)=> {
        fetch(endpoint)
        .then(data=> data.json())
        .then(data=> {
            //console.log(data);
            state.push(data);
            // console.log(state)
            state.map(element=>{
               // console.log(element); 
                let ele = element.results[Math.floor(Math.random() * 20)];
                document.querySelector('.HeroImage__image').style.background =`linear-gradient(to bottom, rgba(0,0,0,0)
                39%, rgba(0,0,0,0)
                41%, rgba(0,0,0,0.65)
                100%),
                url('${IMAGE_BASE_URL}${BACKDROP_SIZE}${ele.backdrop_path}'), #1c1c1c`;
                document.querySelector('.HeroImage__description h4').innerText = ele.original_title;
                document.querySelector('.HeroImage__description p').innerText = ele.overview;          
             });

            // document.querySelector('.MovieDisplayGrid__container').innerHTML = '';
            state[0].results.map(element=> {
                // displaying all popular movies
                // console.log(element)
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

            // document.querySelector('.MovieDisplayGrid__container').innerHTML += '<a id="loadMoreBtn" class="waves-effect waves-light btn"><i class="material-icons right">cloud</i>Load more</a>';
        })
        .catch(err=> console.log(err));
    };

    const visibleObj ={
        fetchPopularMovieDetails: fetchPopularMovieDetails,
    };

    return visibleObj;
})();

let timeout = null;
document.getElementById('movieSearch').addEventListener('keydown', ()=>{
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        console.log(document.getElementById('movieSearch').value);
        // const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        // renderMovies.fetchItems(endpoint);
    }, 600);
});
let count = 2;
document.getElementById('loadMoreBtn').addEventListener('click', ()=> {
   const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${count++}`;
   renderMovies.fetchPopularMovieDetails(endpoint);
});

