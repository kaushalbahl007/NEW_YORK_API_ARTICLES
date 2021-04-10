const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const key = '1ABeiCboVp03uLcbU2A06mA7osVwvpx5';

let url;

const searchItem = document.querySelector('.search');
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');


const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

const section = document.querySelector('section');
const nav = document.querySelector('nav');
//seach after submit the form 
let pageNumber = 0;
//hide nav no need right now;
nav.style.display ='none';


searchForm.addEventListener('submit', submitSearch);
nextBtn.addEventListener('click', nextSearch);
prevBtn.addEventListener('click', prevSearch);
 
function submitSearch(e) {
    pageNumber = 0;
    fetchResult(e);
}

function fetchResult(e) {
    e.preventDefault();

    url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchItem.value + '&fq=document_type:("article")';

    if (startDate.value !== '') {
        url += '&begin_date=' + startDate.value;
        
    }
    if (endDate.value !== '') {
        url += '&end_date=' + endDate.value;

    };
    fetch(url).then(function(result){
        return result.json();
    }).then(function(json){
        displayResults(json);
    });
}

function displayResults(json) {
    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }

    const articles =json.response.docs;

    console.log(articles);
    console.log(articles.length);

    if (articles.length ===10) {
        nav.style.display = 'block';
    } else {
        nav.style.display = 'none';
    }

    if (articles.length === 0) {
        const para = document.createElement('p');
        para.textContent="NO results returned."
        section.appendChild(para);
    } else {
        for (let i = 0; i < articles.length; i++){
            const article = document.createElement('article');
            const heading = document.createElement('h2');
            const link = document.createElement('a');
            const img= document.createElement('img');
            const para1 = document.createElement('p');
            const para2 = document.createElement('p');
            const clearFix = document.createElement('div');

            let current = articles[i];
            console.log(current);

            link.href = current.web_url;
            link.textContent = current.headline.main;
            para1.textContent = current.snippet;
            para2.textContent = 'keywords';
            for (let j = 0; j < current.keywords.length; j++){
                const snap = document.createElement('span');
                snap.textContent += current.keywords[j].value + ' ';
                para2.appendChild(snap);
            }
            if (current.multimedia.length > 0) {
                img.src = 'https://www.nytimes.com/' + current.multimedia[0].url;
                img.alt = current.headline.main;
            }
            clearFix.setAttribute('class', 'clearfix');
            article.appendChild(heading);
            heading.appendChild(link);
            article.appendChild(img);
            article.appendChild(para1);
            article.appendChild(para2);
            article.appendChild(clearFix);
            section.appendChild(article);
        }
    }
}

function nextSearch(e) {
    pageNumber++;
    fetchResult(e);
    
}
function prevSearch(e) {
    if (pageNumber > 0) {
        pageNumber--;

    } else {
        return;
    }
    fetchResult(e);
    
}
