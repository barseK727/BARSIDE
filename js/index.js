document.getElementById("open-modal").addEventListener("click", function() {
    document.getElementById("my-modal").classList.add("open")
})

document.getElementById("close-my-modal").addEventListener("click", function() {
    document.getElementById("my-modal").classList.remove("open")
})

// Закрыть модальное окно при нажатии на Esc
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
    document.getElementById("my-modal").classList.remove("open");
    }
});

// Закрыть модальное окно при клике вне его
document.querySelector('#my-modal .modal-box').addEventListener('click', event => {
    event.isClickWithInModal = true;
});

document.getElementById("my-modal").addEventListener('click', event => {
    if (event.isClickWithInModal) return;
    event.currentTarget.classList.remove('open');
});

