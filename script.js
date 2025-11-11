// Elementos do DOM
const form = document.getElementById('conviteForm');
const nomeInput = document.getElementById('nome');
const telefoneInput = document.getElementById('telefone');
const tipoInput = document.getElementById('tipo');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const resultado = document.getElementById('resultado');
const resultadoInfo = document.getElementById('resultadoInfo');
const btnDownload = document.getElementById('btnDownload');
const toast = document.getElementById('toast');

let convidadoAtual = null;

// Formatar telefone
telefoneInput.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length <= 2) {
        valor = valor.replace(/(\d{0,2})/, '($1');
    } else if (valor.length <= 7) {
        valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else {
        valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    e.target.value = valor;
});

// Mostrar toast
function mostrarToast(mensagem, tipo = 'success') {
    toast.textContent = mensagem;
    toast.className = `toast ${tipo} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Normalizar texto
function normalizar(texto) {
    return texto.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Verificar convite
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nome = nomeInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const tipo = tipoInput.value;
    
    if (!nome || !telefone || !tipo) {
        mostrarToast('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    // Mostrar loading
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    form.querySelector('button').disabled = true;
    
    // Simular busca
    setTimeout(() => {
        const nomeNormalizado = normalizar(nome);
        const telefoneNormalizado = telefone.replace(/\D/g, '');
        
        const convidado = CONVIDADOS.find(c => {
            const cNome = normalizar(c.nome);
            const cTelefone = c.telefone.replace(/\D/g, '');
            return cNome === nomeNormalizado && 
                   cTelefone === telefoneNormalizado && 
                   c.tipo.toLowerCase() === tipo.toLowerCase();
        });
        
        // Resetar botão
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        form.querySelector('button').disabled = false;
        
        if (convidado) {
            convidadoAtual = convidado;
            mostrarResultado(convidado);
            mostrarToast('Convite encontrado com sucesso!');
        } else {
            resultado.style.display = 'none';
            mostrarToast('Convidado não encontrado. Verifique seus dados.', 'error');
        }
    }, 1000);
});

// Mostrar resultado
function mostrarResultado(convidado) {
    const tipos = {
        'convidado': 'Convidado(a)',
        'padrinho': 'Padrinho',
        'madrinha': 'Madrinha',
        'paraninfo': 'Paraninfo(a)',
        'homenageado': 'Homenageado(a)',
        'familiar': 'Familiar'
    };
    
    resultadoInfo.innerHTML = `
        <div class="info-item">
            <span class="info-label">Nome:</span>
            <span class="info-value">${convidado.nome}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Telefone:</span>
            <span class="info-value">${convidado.telefone}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Tipo:</span>
            <span class="tipo-badge">${tipos[convidado.tipo.toLowerCase()] || convidado.tipo}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Responsável:</span>
            <span class="info-value">${convidado.aluno_responsavel}</span>
        </div>
    `;
    
    resultado.style.display = 'block';
    resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Gerar PDF
btnDownload.addEventListener('click', async () => {
    if (!convidadoAtual) return;
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Cores do Colégio
        const azulEscuro = [1, 58, 137];      // #013A89
        const azulMedio = [78, 107, 208];     // #4E6BD0
        const rosa = [238, 116, 212];         // #EE74D4
        
        // Background azul claro
        doc.setFillColor(240, 248, 255);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Borda decorativa azul escuro
        doc.setDrawColor(...azulEscuro);
        doc.setLineWidth(2);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
        
        // Borda interna azul médio
        doc.setDrawColor(...azulMedio);
        doc.setLineWidth(0.5);
        doc.rect(12, 12, pageWidth - 24, pageHeight - 24);
        
        // Header com fundo azul escuro
        doc.setFillColor(...azulEscuro);
        doc.rect(15, 15, pageWidth - 30, 35, 'F');
        
        // Logo do colégio
        const logoUrl = 'https://customer-assets.emergentagent.com/job_ccc59e95-7fd4-48e3-a746-8b1aa59da1db/artifacts/qf1bp2ln_1762870726512.png';
        try {
            await doc.addImage(logoUrl, 'PNG', 20, 18, 30, 30);
        } catch (e) {
            console.log('Erro ao adicionar logo:', e);
        }
        
        // Título
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('CONVITE DE FORMATURA', pageWidth / 2, 28, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('Colégio Técnico de Bom Jesus - UFPI', pageWidth / 2, 38, { align: 'center' });
        
        // Seção principal do convite
        let yPos = 65;
        
        // Box com informações
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(...azulMedio);
        doc.setLineWidth(1);
        doc.roundedRect(20, yPos, pageWidth - 40, 95, 3, 3, 'FD');
        
        yPos += 15;
        
        // Mensagem de boas-vindas
        doc.setTextColor(...azulEscuro);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('É com grande alegria que convidamos', pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 15;
        doc.setFontSize(20);
        doc.setTextColor(...azulMedio);
        doc.text(convidadoAtual.nome.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 15;
        doc.setFontSize(14);
        doc.setTextColor(...azulEscuro);
        doc.setFont('helvetica', 'normal');
        
        const tiposFormatados = {
            'convidado': 'Convidado(a)',
            'padrinho': 'Padrinho',
            'madrinha': 'Madrinha',
            'paraninfo': 'Paraninfo(a)',
            'homenageado': 'Homenageado(a)',
            'familiar': 'Familiar'
        };
        
        const tipoFormatado = tiposFormatados[convidadoAtual.tipo.toLowerCase()] || convidadoAtual.tipo;
        
        doc.text(`Para participar como ${tipoFormatado}`, pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 10;
        doc.text('da nossa cerimônia de formatura', pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 20;
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Responsável: ${convidadoAtual.aluno_responsavel}`, pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 8;
        doc.text(`Telefone: ${convidadoAtual.telefone}`, pageWidth / 2, yPos, { align: 'center' });
        
        // Informações do evento
        yPos = 175;
        doc.setFillColor(...azulEscuro);
        doc.rect(20, yPos, pageWidth - 40, 50, 'F');
        
        yPos += 10;
        doc.setTextColor(...rosa);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMAÇÕES DO EVENTO', pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 10;
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Data: A ser confirmada', pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 8;
        doc.text('Local: Colégio Técnico de Bom Jesus - UFPI', pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 8;
        doc.text('Horário: A ser confirmado', pageWidth / 2, yPos, { align: 'center' });
        
        // Data de emissão
        yPos = 240;
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        const dataEmissao = new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        doc.text(`Convite emitido em: ${dataEmissao}`, pageWidth / 2, yPos, { align: 'center' });
        
        // Footer
        yPos = 260;
        doc.setFillColor(...azulEscuro);
        doc.rect(15, yPos, pageWidth - 30, 20, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('Turma de 2025', pageWidth / 2, yPos + 8, { align: 'center' });
        doc.text('"A vitória pertence aos mais perseverantes"', pageWidth / 2, yPos + 14, { align: 'center' });
        
        // Salvar PDF
        const nomeArquivo = `Convite_${convidadoAtual.nome.replace(/\s+/g, '_')}.pdf`;
        doc.save(nomeArquivo);
        
        mostrarToast('PDF gerado com sucesso!');
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        mostrarToast('Erro ao gerar PDF. Tente novamente.', 'error');
    }
});