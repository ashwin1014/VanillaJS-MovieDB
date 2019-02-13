import { API_URL, API_KEY, IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE } from './config.js';

 (()=>{
     "use strict";

     window.onload = ()=> {
        // document.querySelector('#movieSection__details').remove();
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1&include_adult=true`;
        fetchPopularMovieDetails(endpoint, false);
     };


    const fetchPopularMovieDetails = async (url, isSearched) => {
        let response = await fetch(url);
        let movieData = await response.json();
        // console.log(movieData.results[0]);
        isSearched ? document.querySelector('#MovieDisplayGrid h3').innerText='Search results': document.querySelector('#MovieDisplayGrid h3').innerText='Popular movies'
        if(isSearched) document.querySelector('.MovieDisplayGrid__container').innerHTML = '';

        movieData.results.map(element=>{
             // console.log(element);
             let imagePath = element.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}` : 'images/no_image.jpg';
             document.querySelector('.MovieDisplayGrid__container').innerHTML += `
             <div class="col s6 m3 l3 xl3">
             <div class="card hoverable">
               <div class="card-image">
                 <img src="${imagePath}">
                <!-- <span class="card-title">${element.original_title}</span> -->
               </div>
               <div class="card-content">
                 <p class="">${element.overview}</p>
               </div>
               <div class="card-action">
                 <a class="mov-details" data-reference=${element.id}>Details</a>
               </div>
             </div>
            </div>`;
          });

        let randomMovie = movieData.results[Math.floor(Math.random() * 20)];
        document.querySelector('.HeroImage__image').style.background =`linear-gradient(to bottom, rgba(0,0,0,0)
        39%, rgba(0,0,0,0)
        41%, rgba(0,0,0,0.65)
        100%),
        url('${IMAGE_BASE_URL}${BACKDROP_SIZE}${randomMovie.backdrop_path}'), #1c1c1c`;
        document.querySelector('.HeroImage__description h4').innerText = randomMovie.original_title;
        document.querySelector('.HeroImage__description p').innerText = randomMovie.overview;

       const movieRefernce = document.querySelectorAll('.mov-details');
        movieRefernce.forEach((ele)=>{
           ele.addEventListener('click', async(event)=>{
              event.preventDefault();
              const movieId = event.currentTarget.getAttribute('data-reference');
              let results = await Promise.all([
                fetch(`${API_URL}movie/${movieId}?api_key=${API_KEY}&include_adult=true`),
                fetch(`${API_URL}movie/${movieId}/videos?api_key=${API_KEY}&include_adult=true`),
                fetch(`${API_URL}movie/${movieId}/casts?api_key=${API_KEY}&include_adult=true`)
              ].map(url =>
                    url.then(
                        (response) => response.json()
                     ))
              );
               console.log(results)
              let genres = results[0].genres.map((ele)=>{
                return ele.name
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


               let actorsHtml = actors.slice(0,8).map((ele) => {
                 let imageUrl = ele.picture ? `${IMAGE_BASE_URL}/w300${ele.picture}`: 'images/no_image.jpg';
                 let html = `<div class="col s6 m3 center actor-card" data-id="${ele.actorId}">
                 <div class="card-panel"><img class="responsive-img hoverable" src="${imageUrl}">
                 <h6>${ele.name}</h6>
                        as
                 <h6 class="truncate">"${ele.character}"</h6>
                 </div></div>`;
                 return html
               });

                document.querySelector('#movieSection__all').style.display="none";
                document.querySelector('i.material-icons.left').style.visibility="visible";
                document.querySelector('#movieSection__details').style.display="block";
                document.documentElement.scrollTop = 0;

              let videoUrl = results[1].results[0] ? `<iframe  src="https://www.youtube.com/embed/${results[1].results[0].key}" frameborder="0" allowfullscreen></iframe>`:'<p class="flow-text">No video available</p>'
              document.querySelector('#movieSection__details .container').innerHTML = `
                  <div class="row">
                    <div class="col m4 s12">
                        <img class="materialboxed responsive-img" src="${IMAGE_BASE_URL}${BACKDROP_SIZE}${results[0].poster_path}">
                    </div>
                    <div class="col m8 s12">
                        <div style="display: inline-block">
                          <h3>${results[0].original_title}</h3>
                          <blockquote>
                          <i class="material-icons" style="transform: scaleX(-1)">format_quote</i>
                           ${results[0].tagline}
                           <i class="material-icons">format_quote</i>
                          </blockquote>
                          <h6><b>Runtime:</b> ${results[0].runtime} minutes</h6>
                          <h6><b>Genres:</b> ${genres}</h6>
                          <h6><b>Release date:</b> ${results[0].release_date}</h6>
                          <h6><b>Home page:</b><a href="${results[0].homepage}">&nbsp;Visit homepage</a></h6>
                        </div>
                        <p>
                          ${results[0].overview}
                        </p>
                    </div>
                </div>
                <div class="row">
                    <h4>Top Cast</h4>
                    ${actorsHtml.join('')}
                </div>
                <div class="row">
                    <div class="video-container">
                        ${videoUrl}
                    </div>
                </div>
              `
                const elems = document.querySelectorAll('.materialboxed');
                const instances = M.Materialbox.init(elems);

                const m_elems = document.querySelector('.modal');
                const m_instances = M.Modal.init(m_elems);

                document.querySelectorAll('.actor-card').forEach((ele)=>{
                  // console.log(ele)
                  ele.addEventListener('click', async(event)=>{
                    // console.log(event)
                    let id = ele.getAttribute("data-id");
                    // console.log(id)
                    let url =  `${API_URL}person/${id}?api_key=${API_KEY}&language=en-US`;
                    let response = await fetch(url);
                    let actorData = await response.json();
                    // console.log(actorData)
                    m_instances.open();
                    document.querySelector('.modal-content h4').innerText = actorData.name;
                    document.querySelector('.modal-content p').innerText = actorData.biography;
                    document.querySelector('.modal-content h6').innerText = `Birthday: ${actorData.birthday} \n Birth place: ${actorData.place_of_birth}`;
                  });
                });
            });

        });

    };

    let timeout = null;
    document.getElementById('movieSearch').addEventListener('keydown', ()=>{
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            let searchedItem = document.getElementById('movieSearch').value;
            let endpoint;
            console.log(searchedItem);
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


 })();
