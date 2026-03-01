// scripts/firebase-config.js

// Configuração do Firebase - USAIN SOLUÇÕES
const firebaseConfig = {
    apiKey: "AIzaSyCQ_lLUIeVorFcTaWBwo8H-xvwD8pZDjzY",
    authDomain: "usain-solucoes.firebaseapp.com",
    projectId: "usain-solucoes",
    storageBucket: "usain-solucoes.firebasestorage.app",
    messagingSenderId: "415030524070",
    appId: "1:415030524070:web:e6611fa85b69e284ea9c67",
    measurementId: "G-J1TM7MP2EM"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Função para salvar contato no Firestore
async function salvarContato(dados) {
    try {
        const docRef = await db.collection('contatos').add({
            ...dados,
            dataEnvio: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'novo',
            lido: false,
            projeto: 'usain-solucoes'
        });
        return { sucesso: true, id: docRef.id };
    } catch (error) {
        console.error('Erro ao salvar no Firebase:', error);
        return { sucesso: false, erro: error.message };
    }
}

// Event listener do formulário
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formContato');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btnSubmit = document.getElementById('btnEnviar');
        const btnText = btnSubmit.querySelector('.btn-text');
        const btnLoading = btnSubmit.querySelector('.btn-loading');
        const formMessage = document.getElementById('formMessage');
        
        // Mostrar loading
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        btnSubmit.disabled = true;
        formMessage.style.display = 'none';
        
        // Coletar dados
        const dados = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone')?.value || '',
            projeto: document.getElementById('projeto').value,
            mensagem: document.getElementById('mensagem').value,
            origem: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
        
        // Salvar no Firebase
        const resultado = await salvarContato(dados);
        
        // Esconder loading
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        btnSubmit.disabled = false;
        
        // Mostrar mensagem
        formMessage.style.display = 'block';
        
        if (resultado.sucesso) {
            formMessage.style.backgroundColor = '#d4edda';
            formMessage.style.color = '#155724';
            formMessage.style.border = '1px solid #c3e6cb';
            formMessage.innerHTML = '✅ Mensagem enviada com sucesso! Em breve entraremos em contato.';
            form.reset();
        } else {
            formMessage.style.backgroundColor = '#f8d7da';
            formMessage.style.color = '#721c24';
            formMessage.style.border = '1px solid #f5c6cb';
            formMessage.innerHTML = '❌ Erro ao enviar. Tente novamente ou contato direto no WhatsApp.';
        }
        
        // Esconder mensagem após 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    });
});

// Função para formatar telefone (opcional)
function formatarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, '');
    if (numeros.length === 11) {
        return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
}