import { API_URL, API_KEY} from '../config.js';

export default function() {
  const m_elems = document.querySelector('.modal');
  const m_instances = M.Modal.init(m_elems);

  document.querySelectorAll('.actor-card').forEach((ele)=>{
   //  console.log(ele)
    ele.addEventListener('click', async()=>{
      // console.log(event)
      let id = ele.getAttribute("data-id");
      // console.log(id)
      let url =  `${API_URL}person/${id}?api_key=${API_KEY}&language=en-US`;
      let response = await fetch(url).catch((err) => { console.log(err); });
      let actorData = await response.json();
      // console.log(actorData)
      m_instances.open();
      document.querySelector('.modal-content h4').innerText = actorData.name;
      document.querySelector('.modal-content p').innerText = actorData.biography?actorData.biography:'No data available';
      document.querySelector('.modal-content h6').innerText = `Birthday: ${actorData.birthday ? actorData.birthday:'No data available'} \n Birth place: ${actorData.place_of_birth ? actorData.place_of_birth : 'No data available'}`;
    });
  });

  document.querySelector('.modal-close').addEventListener('click', ()=>{
    m_instances.close();
    m_instances.destroy();
  });
}
