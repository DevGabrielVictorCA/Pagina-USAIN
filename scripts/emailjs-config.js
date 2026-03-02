// Inicializar EmailJS com sua Public Key
(function() {
    emailjs.init("4gJBhNg3-kfMpUkcn"); 
})();

// Função para enviar email
async function enviarEmail(dados) {
    try {
        // Parâmetros que serão enviados para o template
        const templateParams = {
            nome: dados.nome,
            email: dados.email,
            telefone: dados.telefone || 'Não informado',
            projeto: dados.projeto || 'Não especificado',
            mensagem: dados.mensagem,
            data: new Date().toLocaleString('pt-BR'),
            origem: window.location.href
        };

        // Enviar email
        const response = await emailjs.send(
            'service_ogjv3v6',
            'template_sleq4ta',
            templateParams
        );

        console.log('Email enviado:', response);
        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        return { sucesso: false, erro: error };
    }
}