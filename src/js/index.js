
import '../css/style.styl'
import axios from 'axios';

const i18n = {
    'en': require('./en.js'),
    'zh-tw': require('./zh-tw.js')
};

const state = {};
const game = "League%20of%20Legends";

class Search {
    constructor(game) {
        this.game = game;
        this.offset = 0;
        this.limit = 15;
        this.isLoading = false;
        this.lang = 'zh-tw';
    }

    async getResults() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const clientId = 'q4r0rk3n7i2x239kt0tpwck70iu7yo'
        this.isLoading = true;
        try {
            const res = await axios(`${proxy}https://api.twitch.tv/kraken/streams/?client_id=${clientId}&game=${game}&limit=${this.limit}&offset=${this.offset}&language=${this.lang}`);
            this.result = res.data.streams;
        } catch(error) {
            console.log(error);
        }   
    } 
};

const languageSwitch = lang => {
    document.querySelector('.title_h1').textContent = i18n[lang]['TITLE'];
    streamerRenew();
}

const streamerRenew = async () => {
    state.search.offset = 0;
    document.querySelector('.row').innerHTML = '';
    await state.search.getResults();
    renderResults(state.search.result);
}

const renderStreamer = streamer => {
    const markup = `
    <div class = "col">
        <a href = "${streamer.channel.url}" target="_blank" class = "intro">
            <div class = "preview" >                        
                <img src = ${streamer.preview.medium}  onload="this.style.opacity = 1;">
            </div>
            <div class = "bottom">
                <div class = "avatar"><img src = ${streamer.channel.logo} onload = "this.style.opacity = 1;"></div>
                <div class = "intro">
                    <div class = "title">${streamer.channel.status}</div>
                    <div class = "Streamer">${streamer.channel.display_name}</div>
                </div>
            </div>
        </a>
    </div>`

    document.querySelector('.row').insertAdjacentHTML('beforeend', markup);
}


const renderResults = res => {
    res.forEach(el => renderStreamer(el));
    state.search.isLoading = false;
}



const ctrlSearch = async () => {
    state.search = new Search(game);
    try {
        await state.search.getResults();
        renderResults(state.search.result);
    } catch (err){
        console.log(err);
    }
}

const infiniteScroll = () => {

    window.addEventListener('scroll', () => {
        if (window.scrollY + window.innerHeight > document.body.offsetHeight - 200) {
            if (!state.search.isLoading) {
                state.search.offset += state.search.limit;
                state.search.getResults();
                renderResults(state.search.result);
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    ctrlSearch();
    infiniteScroll()

    document.querySelector('.Cht').addEventListener('click', () => {
        state.search.lang = 'zh-tw';
        languageSwitch('zh-tw');
    });
    
    document.querySelector('.Eng').addEventListener('click', () => {
        state.search.lang = 'en';
        languageSwitch('en');
    });
}); 