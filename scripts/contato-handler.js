// Gerenciador completo de contato - Firebase + EmailJS

class ContatoHandler {
    constructor() {
        this.form = document.getElementById('formContato');
        this.btnSubmit = document.getElementById('btnEnviar');
        this.btnText = this.btnSubmit?.querySelector('.btn-text');
        this.btnLoading = this.btnSubmit?.querySelector('.btn-loading');
        this.formMessage = document.getElementById('formMessage');
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    // Mostrar loading
    showLoading() {
        this.btnText.style.display = 'none';
        this.btnLoading.style.display = 'inline';
        this.btnSubmit.disabled = true;
        this.formMessage.style.display = 'none';
    }
    
    // Esconder loading
    hideLoading() {
        this.btnText.style.display = 'inline';
        this.btnLoading.style.display = 'none';
        this.btnSubmit.disabled = false;
    }
    
    // Mostrar mensagem
    showMessage(texto, tipo) {
        this.formMessage.style.display = 'block';
        
        if (tipo === 'sucesso') {
            this.formMessage.style.backgroundColor = '#F2F2F2';
            this.formMessage.style.color = '#0A2C59';
            this.formMessage.style.border = '1px solid #c3e6cb';
        } else {
            this.formMessage.style.backgroundColor = '#f8d7da';
            this.formMessage.style.color = '#721c24';
            this.formMessage.style.border = '1px solid #f5c6cb';
        }
        
        this.formMessage.innerHTML = texto;
        
        setTimeout(() => {
            this.formMessage.style.display = 'none';
        }, 5000);
    }
    
    // Coletar dados do formulário
    getDados() {
        return {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone')?.value || '',
            projeto: document.getElementById('projeto').value,
            mensagem: document.getElementById('mensagem').value,
            origem: window.location.href,
            userAgent: navigator.userAgent,
            dataEnvio: new Date().toLocaleString('pt-BR')
        };
    }
    
    // Validar formulário
    validarDados(dados) {
        if (!dados.nome || dados.nome.length < 3) {
            this.showMessage('Por favor, preencha seu nome completo', 'erro');
            return false;
        }
        if (!dados.email || !dados.email.includes('@')) {
            this.showMessage('Por favor, preencha um email válido', 'erro');
            return false;
        }
        if (!dados.mensagem || dados.mensagem.length < 10) {
            this.showMessage('Por favor, escreva uma mensagem com mais detalhes', 'erro');
            return false;
        }
        return true;
    }
    
    // Enviar para Firebase
    async salvarNoFirebase(dados) {
        try {
            const docRef = await db.collection('contatos').add({
                ...dados,
                dataFirebase: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'novo',
                lido: false
            });
            return { sucesso: true, id: docRef.id };
        } catch (error) {
            console.error('Erro Firebase:', error);
            return { sucesso: false, erro: error.message };
        }
    }
    
    // Enviar emails (empresa + cliente)
    async enviarEmails(dados) {
        const resultados = { empresa: false, cliente: false };
        
        // Email para empresa
        try {
            await emailjs.send(
                'service_ogjv3v6',
                'template_sleq4ta',
                {
                    nome: dados.nome,
                    email: dados.email,
                    telefone: dados.telefone || 'Não informado',
                    projeto: dados.projeto || 'Não especificado',
                    mensagem: dados.mensagem,
                    data: dados.dataEnvio
                }
            );
            resultados.empresa = true;
            console.log('Email enviado para empresa');
        } catch (error) {
            console.error('Erro email empresa:', error);
        }
        
        // Email para cliente
        try {
            await emailjs.send(
                'service_ogjv3v6',
                'template_7d3q779',
                {
                    nome: dados.nome,
                    email: dados.email,
                    projeto: dados.projeto || 'não especificado',
                    mensagem: dados.mensagem
                }
            );
            resultados.cliente = true;
            console.log('Email enviado para cliente');
        } catch (error) {
            console.error('Erro email cliente:', error);
        }
        
        return resultados;
    }
    
    // Handler principal
    async handleSubmit(e) {
        e.preventDefault();
        
        this.showLoading();
        
        const dados = this.getDados();
        
        if (!this.validarDados(dados)) {
            this.hideLoading();
            return;
        }
        
        // Salvar no Firebase
        const firebaseResult = await this.salvarNoFirebase(dados);
        
        // Enviar emails
        const emailResult = await this.enviarEmails(dados);
        
        this.hideLoading();
        
        // Mensagem de resultado
        if (firebaseResult.sucesso) {
            if (emailResult.empresa && emailResult.cliente) {
                this.showMessage('Tudo certo! Você receberá uma confirmação no seu email.', 'sucesso');
            } else if (emailResult.empresa) {
                this.showMessage('Mensagem recebida! Em breve entraremos em contato.', 'sucesso');
            } else {
                this.showMessage('Mensagem salva com sucesso!', 'sucesso');
            }
            this.form.reset();
        } else {
            if (emailResult.empresa) {
                this.showMessage('Mensagem enviada! (Banco de dados temporário)', 'sucesso');
                this.form.reset();
            } else {
                this.showMessage('Erro ao enviar. Tente novamente ou use o WhatsApp.', 'erro');
            }
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.contatoHandler = new ContatoHandler();
});