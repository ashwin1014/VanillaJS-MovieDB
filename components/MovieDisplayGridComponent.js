import { IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE } from '../config.js';

export default function(movieData) {
          
  if(movieData.results.length===0) document.querySelector('#MovieDisplayGrid h3').innerText='No results found'
            movieData.results.map((element, index)=>{
             // console.log(element);
             let imagePath = element.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}` : '../images/no_image.jp';
             document.querySelector('.MovieDisplayGrid__container').innerHTML += `
             <div class="col s6 m3 l3 xl3 mov-details" data-reference=${element.id} key="${index}">
             <div class="card hoverable">
               <div class="card-image">
                 <img src="${imagePath}" alt="${element.original_title}-poster">
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
        // Banner image
        let randomMovie = movieData.results[Math.floor(Math.random() * 20)];
        document.querySelector('.HeroImage__image').style.background =`linear-gradient(to bottom, rgba(0,0,0,0)
        39%, rgba(0,0,0,0)
        41%, rgba(0,0,0,0.65)
        100%),
        url('${IMAGE_BASE_URL}${BACKDROP_SIZE}${randomMovie.backdrop_path}'), #1c1c1c`;
        document.querySelector('.HeroImage__description h4').innerText = randomMovie.original_title;
        document.querySelector('.HeroImage__description p').innerText = randomMovie.overview;
}
