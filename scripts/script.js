const abrirMenuBtn = document.querySelector('.abrir-menu');
const navBar = document.getElementById('nav-bar');

let slides = document.getElementById('radio1').checked = true;
let contador = 1;
let intervalo;

// Menu Hamburger

abrirMenuBtn.addEventListener('click', ()=>{
    abrirMenuBtn.classList.toggle('open')
    navBar.classList.toggle('active')
})

document.addEventListener('click', (event) => {
    if (!event.target.closest('#nav-bar') && !event.target.closest('.abrir-menu')){
            navBar.classList.remove('active');
            abrirMenuBtn.classList.remove('open');
    }
})

// Prova Slider

function passarImagem() {
    contador++;
    if (contador > 3) contador = 1;
    document.getElementById('radio' + contador).checked = true;
}

function reiniciarIntervalo() {
    clearInterval(intervalo);
    intervalo = setInterval(passarImagem, 5000);
}

document.querySelectorAll('input[type="radio"]').forEach((radio, index) => {
    radio.addEventListener('change', () => {
        contador = index + 1;
        reiniciarIntervalo();
    });
});

reiniciarIntervalo();
