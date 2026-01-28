const TOKEN = '8514499815:AAFBke3vKTems9glQ4mfZbTgWlLXYkuta20';
const CHAT_ID = '-5182905509';
const URL_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`

const form = document.getElementById('form');
const modal = document.getElementById('my-modal');
const successMessage = document.getElementById('message-delivered');

document.getElementById('open-modal').addEventListener('click', function() {
    modal.style.display = 'grid';
});

form.addEventListener('submit', function(e) {
    e.preventDefault();

    let message = 'Заявка на создание турнира\n' + 
                  'Имя: ' + this.name.value + '\n' +
                  'Номер телефона: ' + this.phone.value + '\n' + 
                  'Телеграм: ' + this.telegram.value;

    axios.post(URL_API, {
        chat_id: CHAT_ID,
        parse_mode: 'html',
        text: message
    })
    .then((res) => {
        successMessage.style.display = 'grid';
        modal.style.display = 'none';
    })
    .catch((err) => {
        console.warn(err);
    })
    .finally(() => {
        form.reset();
    });
    setTimeout(() => document.getElementById('message-delivered').style.display = 'none', 2000);
});