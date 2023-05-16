let apiKeys = {
    "weather": "c0d3b5a8be5118d38fc0cf3181f4ade4",
    "city": "MSjp475TM3y2iW623s-JgGIxNuhXZE22r-wctB7NLm4"
};
let timer;
let selectedIndex = -1;

const button = document.querySelector('#btnSubmit');
const searchBar = document.getElementById('searchBar');
const citiesDropdown = document.querySelector('.ddCities');
const weather = document.querySelector('.weather');

// API CALLS
const getCityInfo =  () => {
    return fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + searchBar.value + '&limit=5&appid=' + apiKeys.weather)
    .then(response => response.json())
    .then(data => {
        return data;
    })
};

const fetchWeather = (city) => {
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + city.lat + '&lon=' + city.lon + '&units=metric&appid=' + apiKeys.weather)
    .then(response => response.json())
    .then(data => {
        if(weather.innerHTML === ""){
            weather.innerHTML = '<h2 class="city"></h2><h1 class="temp"></h1><div class="description"></div>';
        }

        searchBar.style.border = 'none';
        document.body.style.backgroundImage = 'url(https://source.unsplash.com/random/?' + city.name.replace(/ /g, '') + '/?landscape)';
        document.querySelector('.city').textContent = city.name;
        document.querySelector('.temp').textContent = data.main.temp + '°C';
        document.querySelector('.description').innerHTML = '<img src="" alt="" class="icon">' + '<p>' + data.weather[0].main + '</p>';
        document.querySelector('.icon').src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
        weather.style.opacity = '1';
        citiesDropdown.style.display = 'none';
    });
    searchBar.value = "";
}




const displaySuggestions = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        if(searchBar.value != ""){
            getCityInfo()
            .then(result => {
                citiesDropdown.innerHTML = "";
                result.forEach(element => {
                    const ddItem = document.createElement('a');
                    ddItem.innerHTML = '<span class = "left">' + element.name  + '</span>'+ '<span class = "right">' + element.country + '</span>';
                    citiesDropdown.appendChild(ddItem);
                    ddItem.addEventListener('click', () => {
                        weather.style.opacity = '0';
                        ddItem.classList.remove('selected');
                        fetchWeather(element);
                    });
                });
                citiesDropdown.style.display = 'block';
            });
        }
        else{
            citiesDropdown.style.display = 'none';
        }
    }, 500);
};

// SEARCH BAR EVENT LISTENERI


searchBar.addEventListener('focus', () => {
    searchBar.dispatchEvent(new Event('input'));
});

searchBar.addEventListener('input', displaySuggestions);

searchBar.addEventListener('blur', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        if(citiesDropdown != document.activeElement)
            document.querySelector('.ddCities').style.display = 'none';
    }, 100);
});

searchBar.addEventListener('keydown', (event) =>{
    switch(event.key){
        case 'ArrowUp':
            selectItem(-1);
            break;
        case 'ArrowDown':
            selectItem(1);
            break;
        case 'Enter':
            const selectedItem = document.querySelector('.selected');
            
            (selectedItem != null)? selectedItem.dispatchEvent(new Event('click')) : button.dispatchEvent(new Event('click'));
            selectedIndex = -1;
            break;
    }
});

// BUTTON EVENT LISTENER

button.addEventListener('click', () => {
    getCityInfo()
    .then(result => {
        weather.style.opacity = '0';
        fetchWeather(result[0]);
    })
    .catch(error => {
        searchBar.style.border = '1px solid red';
        weather.style.opacity = '1';
    });
});

// POMOCNE METODE

const selectItem = (increment) => {
    const suggestionItems = document.querySelectorAll('.ddCities a');

    suggestionItems.forEach(item => {
        item.classList.remove('selected');
    });

    selectedIndex += increment;

    if(selectedIndex < 0){
        selectedIndex = suggestionItems.length - 1;
    }
    else if(selectedIndex >= suggestionItems.length){
        selectedIndex = 0;
    }

    suggestionItems[selectedIndex].classList.add('selected');
};


// Promjena pozadinske slike koristeci API, sporo je ucitavalo te sam iskoristio drugi nacin.

// const getCityImage = () => {
//     fetch('https://api.unsplash.com/photos/random?query=' + searchBar.value + '&orientation=landscape&client_id=' + apiKeys.city)
//     .then(response => response.json())
//     .then(data => {
//         console.log(data.links.download + '&client_id=' + apiKeys.city);
//         //document.body.style.backgroundImage = 'url(' + data.links.download  + '&client_id=' + apiKeys.city + ')';

//     })
//     .catch(error => {
//         console.log(error);
//     });
// };



