const abrirMenuBtn = document.querySelector('.abrir-menu');
const navBar = document.getElementById('nav-bar');
const btnTopo = document.getElementById("voltar-topo");

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

navBar.addEventListener('click', (e) => {
  if(e.target.className === "navbar-link" || e.target.className === "btn-destaque-mobile"){
    navBar.classList.remove('active');
    abrirMenuBtn.classList.remove('open');
  }
})

// Voltar ao Topo
window.onscroll = function() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    btnTopo.style.display = "block";
  } else {
    btnTopo.style.display = "none";
  }
};

btnTopo.addEventListener("click", function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Ano atualizado no footer
document.getElementById('ano').textContent = new Date().getFullYear();

