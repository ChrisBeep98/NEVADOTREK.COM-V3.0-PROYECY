
async function checkTours() {
    const url = `https://api-wgfhwjbpva-uc.a.run.app/public/tours?t=${Date.now()}`;
    console.log(`📡 Consultando API: ${url}\n`);
    
    try {
        const response = await fetch(url);
        const tours = await response.json();
        
        console.log(`✅ Total de tours encontrados: ${tours.length}`);
        tours.forEach(t => {
            console.log(`- [${t.tourId}] ${t.name.es} (Active: ${t.isActive})`);
        });
    } catch (e) {
        console.error("❌ Error consultando la API:", e);
    }
}

checkTours();
