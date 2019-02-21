import { IMAGE_BASE_URL, BACKDROP_SIZE } from '../config.js';

export default function(genres, actors, videoUrl, results_0) {

    let actorsHtml = actors.slice(0,8).map((ele) => {
     // console.log(ele)
      let imageUrl = ele.picture ? `${IMAGE_BASE_URL}/w300${ele.picture}`: 'images/no_image.jpg';
      let html = `<div class="col s6 m3 center actor-card" data-id="${ele.actorId}">
      <div class="card-panel"><img class="responsive-img hoverable" src="${imageUrl}" alt="${ele.name}-poster">
      <h6 class="truncate">${ele.name}</h6>
             as
      <h6 class="truncate">"${ele.character}"</h6>
      </div></div>`;
      return html;
    });

     document.querySelector('#movieSection__all').style.display="none";
     document.querySelector('i.material-icons.left').style.visibility="visible";
     document.querySelector('#movieSection__details').style.display="block";
     document.documentElement.scrollTop = 0;

    // let videoUrl = results[1].results[0] ? `<iframe  src="https://www.youtube.com/embed/${results[1].results[0].key}" frameborder="0" allowfullscreen></iframe>`:'<p class="flow-text">No video available</p>'
    document.querySelector('#movieSection__details .container').innerHTML = `
       <div class="row">
         <div class="col m4 s12">
             <img class="materialboxed responsive-img" src="${IMAGE_BASE_URL}${BACKDROP_SIZE}${results_0.poster_path}" alt="${results_0.original_title}-poster">
         </div>
         <div class="col m8 s12">
             <div style="display: inline-block">
               <h3>${results_0.original_title}</h3>             
              ${results_0.tagline ? 
               ` <blockquote>
                  <i class="material-icons" style="transform: scaleX(-1)">format_quote</i>
                  ${results_0.tagline}
                  <i class="material-icons">format_quote</i>
                </blockquote>` : null              
              }
               <h6><b>Runtime:</b> ${results_0.runtime} minutes</h6>
               <h6><b>Genres:</b> ${genres}</h6>
               <h6><b>Release date:</b> ${results_0.release_date}</h6>
               <h6><b>Home page:</b><a href="${results_0.homepage}">&nbsp;Visit homepage</a></h6>
             </div>
             <p>
               ${results_0.overview}
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
     </div>`;

     const elems = document.querySelectorAll('.materialboxed');
     M.Materialbox.init(elems);
}
