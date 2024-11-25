document.addEventListener('DOMContentLoaded', (event) => {
    const popup = document.getElementById('infoPopup');
    const closeBtn = document.querySelector('.popup .close');
    const buttons = document.querySelectorAll('.button.button--flex');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            popup.style.display = 'block';
            document.body.classList.add('no-scroll');
        });
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
        document.body.classList.remove('no-scroll');
    });

    window.addEventListener('click', (event) => {
        if (event.target == popup) {
            popup.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    });
});