const TOKEN = '8514499815:AAFBke3vKTems9glQ4mfZbTgWlLXYkuta20';
const CHAT_ID = '-5182905509';
const URL_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`

const succes = document.querySelector('.succes');

document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();

    let message = 'Зявка на создание турнира\n' + 'Имя: ' + this.name.value + '\n' +
    'Номер телефона: ' + this.phone.value;

    axios.post(URL_API, {
        chat_id: CHAT_ID,
        parse_mode: 'html',
        text: message
    })
    .then((res) => {
        succes.classList.remove('disp');
    })
    .catch((err) => {
        console.warn(err);
    })
    .finally(() => {
        console.log('Скрипт выполнен')
    })
})
