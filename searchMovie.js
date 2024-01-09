'use strict';

window.onload = showMovie;

let input = document.querySelector('input[name="search-box_input"]');

input.addEventListener("keyup", function(e) {
    if (e.keyCode === 13) {
        e.preventDefault;
        keywordSearch();
    }
});

function showMovie() {
    const url = "http://127.0.0.1:8082/api/movies"; //서버로 요청을 보내는 엔드포인트 변경
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        }
    };

    fetch(url, options)
    .then(res => res.json())
    .then(json => printData(json.results))
    .catch(err => console.error('error:' + err));
}

function printData(data) {

    data.forEach(element => {
        let {id, backdrop_path, original_title, overview, vote_average} = element;

        const showMovieDiv = document.createElement('div');
        showMovieDiv.classList.add('show-movie');

        const movieId = document.createElement("input");

        const movieImageDiv = document.createElement('div');
        movieImageDiv.classList.add('movie-image');
        
        const image = document.createElement('img');

        const movieInfoDiv = document.createElement('div');
        movieInfoDiv.classList.add('movie-info');

        const movieInfoTitleDiv = document.createElement('div');
        movieInfoTitleDiv.classList.add('movie-info_title');
        
        const movieInfoContentDiv = document.createElement('div');
        movieInfoContentDiv.classList.add('movie-info_content');

        const movieRatingDiv = document.createElement('div');
        movieRatingDiv.classList.add('movie-info_rating');

        showMovieDiv.appendChild(movieImageDiv);
        showMovieDiv.appendChild(movieInfoDiv);
        showMovieDiv.appendChild(movieId);

        movieImageDiv.appendChild(image);

        movieInfoDiv.appendChild(movieInfoTitleDiv);
        movieInfoDiv.appendChild(movieInfoContentDiv);
        movieInfoDiv.appendChild(movieRatingDiv);

        document.querySelector('.show-movies').appendChild(showMovieDiv);
        
        image.src = `https://image.tmdb.org/t/p/original${backdrop_path}`
        movieInfoTitleDiv.textContent = original_title;
        movieInfoContentDiv.textContent = overview;
        movieRatingDiv.textContent = `Rating :  ${vote_average}`;

        movieId.type = 'hidden';
        movieId.setAttribute('value', id);

        showMovieDiv.addEventListener('click', function(event) {
            const clickedElement = event.target;
            let showMovieDiv = clickedElement.closest('.show-movie');

            if (showMovieDiv) {
                alert(showMovieDiv.querySelector('input[type="hidden"]').value);
            }
        });
    });
}


function keywordSearch() {
    const keyword = input.value;

    const nodeList = document.querySelectorAll('.movie-info_title');
    const nodeArr = Array.from(nodeList);
    
    nodeArr.filter(element => {
        if (!element.innerHTML.toLowerCase().includes(keyword)) {
            element.parentNode.parentNode.style.display = 'none';
        } else {
            element.parentNode.parentNode.style.display = 'block';
        }
    });
}

