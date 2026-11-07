// PhishShield - Lógica del verificador
let totalAnalizados = 12480;

function analizarURL() {
    const input = document.getElementById('urlInput');
    const url = input.value.trim().toLowerCase();
    const resultadoDiv = document.getElementById('resultado');
    const titulo = document.getElementById('resultadoTitulo');
    const desc = document.getElementById('resultadoDesc');
    const barra = document.getElementById('barraRiesgo');
    const porcentaje = document.getElementById('porcentajeRiesgo');
    const lista = document.getElementById('listaAlertas');

    if (!url) {
        alert('Por favor pega una URL para analizar.');
        return;
    }

    let riesgo = 0;
    let alertas = [];

    // Reglas de detección simples pero efectivas
    const dominiosSospechosos = ['【entity-paypal¦canonical_name=PayPal】', 'banco', '【entity-bancolombia¦canonical_name=【entity-bancolombia¦canonical_name=bancolombia】】', '【entity-nequi¦canonical_name=nequi】', 'daviplata', '【entity-amazon¦canonical_name=amazon】', '【entity-netflix¦canonical_name=netflix】', 'facebook', 'instagram', 'whatsapp'];
    const palabrasPeligrosas = ['login', 'verificar', 'actualizar', 'seguro', 'urgente', 'gratis', 'premio', 'cuenta-suspendida', 'confirmar'];
    const tldsPeligrosos = ['.xyz', '.top', '.click', '.tk', '.ml', '.ga'];

    // 1. No tiene https
    if (!url.includes('https://')) {
        riesgo += 25;
        alertas.push('⚠️ No usa HTTPS seguro, la conexión no está cifrada.');
    }

    // 2. Usa IP en vez de dominio
    if (/\d+\.\d+\.\d+\.\d+/.test(url)) {
        riesgo += 35;
        alertas.push('🚨 Usa una dirección IP en lugar de un dominio, típico de phishing.');
    }

    // 3. Palabras de urgencia / suplantación
    palabrasPeligrosas.forEach(palabra => {
        if (url.includes(palabra)) {
            riesgo += 12;
            alertas.push(`⚠️ Contiene la palabra sospechosa: "${palabra}"`);
        }
    });

    // 4. Dominio con guiones excesivos o suplantación
    if ((url.match(/-/g) || []).length >= 3) {
        riesgo += 20;
        alertas.push('⚠️ Tiene demasiados guiones, los sitios falsos los usan para imitar marcas.');
    }

    // 5. TLD sospechoso
    tldsPeligrosos.forEach(tld => {
        if (url.includes(tld)) {
            riesgo += 25;
            alertas.push(`🚨 Usa un dominio barato y muy usado para estafas: ${tld}`);
        }
    });

    // 6. Dominio muy largo
    if (url.length > 60) {
        riesgo += 15;
        alertas.push('⚠️ URL demasiado larga, intentan ocultar el dominio real.');
    }

    // 7. Suplantación de marca + dominio no oficial
    dominiosSospechosos.forEach(marca => {
        if (url.includes(marca) && !url.includes(marca + '.com') && !url.includes(marca + '.com.co')) {
            riesgo += 30;
            alertas.push(`🚨 Parece imitar a "${marca}" pero no es su dominio oficial.`);
        }
    });

    if (riesgo > 95) riesgo = 95;
    if (riesgo < 5 && alertas.length === 0) {
        alertas.push('✅ No se encontraron patrones sospechosos.');
        riesgo = 5;
    }

    // Mostrar resultado
    resultadoDiv.classList.remove('hidden');
    barra.style.width = riesgo + '%';
    porcentaje.textContent = `Nivel de riesgo: ${riesgo}%`;

    if (riesgo >= 60) {
        titulo.textContent = '🔴 PELIGRO ALTO - NO HAGAS CLIC';
        titulo.style.color = '#dc2626';
        barra.style.background = '#dc2626';
        desc.textContent = 'Esta URL tiene muchas señales de phishing. No ingreses datos ni descargues nada.';
    } else if (riesgo >= 30) {
        titulo.textContent = '🟡 RIESGO MEDIO - TEN CUIDADO';
        titulo.style.color = '#d97706';
        barra.style.background = '#f59e0b';
        desc.textContent = 'Tiene algunas señales sospechosas. Verifica por otro medio antes de entrar.';
    } else {
        titulo.textContent = '🟢 RIESGO BAJO - PARECE SEGURO';
        titulo.style.color = '#16a34a';
        barra.style.background = '#22c55e';
        desc.textContent = 'No se detectaron amenazas evidentes, pero siempre mantente alerta.';
    }

    lista.innerHTML = alertas.map(a => `<li>${a}</li>`).join('');

    // Actualizar contador
    totalAnalizados++;
    document.getElementById('stat-analizados').textContent = totalAnalizados.toLocaleString('es-CO');

    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Permitir analizar con Enter
document.getElementById('urlInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') analizarURL();
});