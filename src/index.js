import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce'
const DEBOUNCE_DELAY = 300;
const listRef = document.querySelector('.country-list')
const boxRef = document.querySelector('.country-list')
const options = new URLSearchParams({
    fields:'name,capital,population,flags,languages'
}
)

function fetchCountries(name){
    return fetch(`https://restcountries.com/v3.1/name/${name}?${options}`)
    .then(r=>{
        if (!r.ok) {
         throw new Error(r.status)
        }
        return r.json()})
        .then(data => {
            markup(data)
           })
           .catch(error => {
            Notiflix.Notify.failure('Oops, there is no country with that name')
           })
}

document.querySelector('#search-box').addEventListener('input',debounce((e)=>{
    fetchCountries(e.target.value.trim())
if (e.target.value==='') {
    boxRef.innerHTML = ''
}
    },DEBOUNCE_DELAY))


    function markup(data){
       
        if(data.length>=2 && data.length<=10){
        const listMarkup = data.map(({name,flags})=>{
            return `<li class="item"><img src="${flags.svg}" alt="flag of ${name.official}" class="flag"></img>
            <p>${name.official}</p></li>`
        }).join("")
        listRef.insertAdjacentHTML('beforeend',listMarkup)
        document.querySelector('.box').remove()
    }
        else if(data.length>10){
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
        }
        else if (data.length===1){
            const boxMarkup = data.map(({name,capital,population,flags,languages})=>{
                return `<div class="box"><img src="${flags.svg}" alt="flag of ${name.official}" class="flag"></img>
                <p><b>${name.official}</b></p>
                <p><b>Capital :</b> ${capital}</p>
                <p><b>Population :</b> ${population}</p>
                <p><b>Languages :</b> ${Object.values(languages)}</p></div>`
            }).join("")
            listRef.innerHTML = ''
            boxRef.insertAdjacentHTML('beforeend',boxMarkup)
        }
    }