window.onload = showMovie;

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
        
        image.src = `https://image.tmdb.org/t/p/original${element.backdrop_path}`
        movieInfoTitleDiv.textContent = element.original_title;
        movieInfoContentDiv.textContent = element.overview;
        movieRatingDiv.textContent = `Rating :  ${element.vote_average}`;

        movieId.type = 'hidden';
        movieId.setAttribute('value', element.id);

        showMovieDiv.addEventListener('click', function(){
            alert(showMovieDiv.lastChild.value);
        });
    });
}

function keywordSearch() {
    const keyword = document.querySelector('input[name="search-box_input"]').value;

    const nodeList = document.querySelectorAll('.movie-info_title');
    const nodeArr = Array.from(nodeList);
    
    nodeArr.filter(element => {
        if (!element.innerHTML.toLowerCase().includes(keyword)) {
            element.parentNode.parentNode.style.display = 'none';
        }
    });
}