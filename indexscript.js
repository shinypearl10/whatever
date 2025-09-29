const INFO_DATA = {
    "info-mamalia": { title: "Mamalia", body: "Mamalia adalah haiwan vertebrata berdarah panas, dicirikan oleh kelenjar susu, rambut atau bulu, dan melahirkan anak." },
    "info-reptilia": { title: "Reptilia", body: "Reptilia adalah kelas haiwan vertebrata yang berdarah sejuk, bernafas dengan paru-paru dan biasanya bertelur di darat, dengan kulit bersisik." },
    "info-aves": { title: "Aves (Burung)", body: "Aves (Burung) adalah kelas haiwan berdarah panas yang dicirikan dengan bulu, paruh tanpa gigi, dan bertelur. Mereka biasanya boleh terbang." },
    "info-amfibia": { title: "Amfibia", body: "Amfibia adalah haiwan yang boleh hidup di darat dan air, bermula dengan insang dan berkembang menjadi paru-paru (contohnya katak). Mereka memiliki kulit lembap." },
    "info-ikan": { title: "Ikan", body: "Ikan adalah haiwan akuatik berdarah sejuk, biasanya mempunyai insang untuk bernafas, badan bersisik, dan sirip untuk bergerak." },
    
    "info-fizik": { title: "Fizik", body: "Fizik adalah kajian tentang jirim, tenaga, gerakan, dan kekuatan yang mengawalinya. Ia cuba memahami bagaimana alam semesta berfungsi." },
    "info-kimia": { title: "Kimia", body: "Kimia adalah kajian tentang komposisi, struktur, sifat dan perubahan jirim. Ia melibatkan interaksi antara atom dan molekul." },
    "info-biologi": { title: "Biologi", body: "Biologi adalah kajian tentang kehidupan dan organisma hidup, termasuk struktur, fungsi, pertumbuhan, evolusi, dan taksonomi mereka." },
    "info-astronomi": { title: "Astronomi", body: "Astronomi adalah kajian objek dan fenomena samawi yang berasal di luar atmosfera Bumi, seperti bintang, planet, dan galaksi." },
    "info-geologi": { title: "Geologi", body: "Geologi adalah sains bumi yang prihatin dengan Bumi yang padat, batu, dan proses di mana mereka berubah dari masa ke masa." },
    "info-matematik": { title: "Matematik", body: "Matematik adalah kajian tentang kuantiti, struktur, ruang, dan perubahan. Ia adalah alat asas bagi banyak disiplin sains." }
};

const STATE = {
    activeMap: 'haiwan' // Tetapan awal
};

// Fungsi utiliti untuk mendapatkan koordinat pusat bubble
function getBubbleCenter(bubbleElement) {
    const rect = bubbleElement.getBoundingClientRect();
    const containerRect = bubbleElement.parentElement.getBoundingClientRect();
    
    // Hitung koordinat relatif terhadap container (Mind Map)
    const x = (rect.left + rect.width / 2) - containerRect.left;
    const y = (rect.top + rect.height / 2) - containerRect.top;
    
    return { x, y };
}

// Fungsi untuk Melukis Garis SVG (Memastikan garis disambung secara dinamik)
function drawMindMapLines(mapId) {
    const container = document.getElementById(`${mapId}-map-container`);
    const svg = document.getElementById(`svg-${mapId}`);
    if (!container || !svg) return;

    // Bersihkan SVG sedia ada
    svg.innerHTML = ''; 

    // Cari Bubble Pusat
    const centerBubble = container.querySelector('.center-bubble');
    const center = getBubbleCenter(centerBubble);

    // Cari semua Bubble Pinggir
    const peripheralBubbles = container.querySelectorAll('.bubble[data-info-id]');

    peripheralBubbles.forEach(bubble => {
        const peripheral = getBubbleCenter(bubble);
        
        // Cipta elemen garis SVG
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', center.x);
        line.setAttribute('y1', center.y);
        line.setAttribute('x2', peripheral.x);
        line.setAttribute('y2', peripheral.y);
        line.setAttribute('stroke', '#4b5563'); /* Kelabu */
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-linecap', 'round');
        
        // Tambahkan ke SVG
        svg.appendChild(line);
    });
}

// Fungsi untuk Menukar Mind Map yang Aktif
function switchMap(targetMap) {
    const allMaps = document.querySelectorAll('.mind-map-container');
    allMaps.forEach(map => map.classList.add('hidden'));

    const activeMap = document.getElementById(`${targetMap}-map-container`);
    if (activeMap) {
        activeMap.classList.remove('hidden');
        STATE.activeMap = targetMap;
        
        // Pastikan layout sudah dimuat sebelum melukis garis
        setTimeout(() => {
            drawMindMapLines(targetMap);
        }, 50); // Kelewatan kecil untuk memastikan elemen berada di posisi akhir
    }
    
    // Kemaskini gaya butang navigasi
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-map') === targetMap) {
            btn.classList.add('bg-emerald-700');
            btn.classList.remove('bg-emerald-500');
        } else {
            btn.classList.add('bg-emerald-500');
            btn.classList.remove('bg-emerald-700');
        }
    });
}

// Fungsi untuk Membuka Pop-up
function openModal(infoId) {
    const data = INFO_DATA[infoId];
    const modal = document.getElementById('info-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (data) {
        modalTitle.textContent = data.title;
        modalBody.textContent = data.body;
        modal.style.display = 'block';
    }
}

// Fungsi untuk Menutup Pop-up
function closeModal() {
    document.getElementById('info-modal').style.display = 'none';
}

// Inisialisasi Aplikasi (DOM siap)
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Setup Listeners Navigasi
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const targetMap = e.target.getAttribute('data-map');
            switchMap(targetMap);
        });
    });

    // 2. Setup Listeners Bubble (Klik untuk Pop-up)
    document.querySelectorAll('.bubble[data-info-id]').forEach(bubble => {
        bubble.addEventListener('click', (e) => {
            const infoId = e.currentTarget.getAttribute('data-info-id');
            openModal(infoId);
        });
    });

    // 3. Setup Listeners Modal (Tutup)
    document.getElementById('close-modal').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('info-modal')) {
            closeModal();
        }
    });
    
    // 4. Inisialisasi Mind Map (Tampilkan 'Haiwan' secara default)
    switchMap(STATE.activeMap);

    // 5. Melukis garis secara responsif
    // Lukis semula garis apabila saiz skrin berubah
    window.addEventListener('resize', () => {
        // Lukis semula peta yang sedang aktif sahaja
        if (STATE.activeMap) {
            drawMindMapLines(STATE.activeMap);
        }
    });

});