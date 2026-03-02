// scripts/firebase-config.js

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCQ_lLUIeVorFcTaWBwo8H-xvwD8pZDjzY",
    authDomain: "usain-solucoes.firebaseapp.com",
    projectId: "usain-solucoes",
    storageBucket: "usain-solucoes.firebasestorage.app",
    messagingSenderId: "415030524070",
    appId: "1:415030524070:web:e6611fa85b69e284ea9c67"
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