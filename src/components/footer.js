(function renderFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  const pathname = (window.location.pathname || "").replace(/\\/g, "/");
  const isInsidePage = pathname.includes("/src/page/");
  const rootPrefix = isInsidePage ? "../../" : "./";
  const pagePrefix = isInsidePage ? "./" : "src/page/";
  const imgPrefix = isInsidePage ? "../assets/images/" : "src/assets/images/";

  footer.innerHTML = `
<footer class="footer-section py-5 w-100">
  <div class="container">
    <div class="footer-card p-4 p-md-5">
      <div class="row gy-4">
        
        <div class="col-lg-5">
          <div class="d-flex align-items-center gap-2 mb-3">
            <img src="${imgPrefix}ic-navbar.png" alt="SparkSave Logo" style="height: 38px;">
            <h3 class="m-0" style="font-weight: 800; color: #ffffff;">SparkSave</h3>
          </div>
          <p>
            SparkSave adalah inisiatif kampanye digital edukatif yang berkomitmen membangun kesadaran
            kolektif siswa dalam penghematan listrik, pengurangan emisi karbon, dan pelestarian bumi mulai
            dari ruang kelas dan laboratorium sekolah.
          </p>
        </div>

        <div class="col-lg-2 col-6">
          <h6 class="fw-bold">Fitur Edukasi</h6>
          <ul class="list-unstyled">
            <li class="mb-2"><a href="${pagePrefix}Eco_Detective_Operation_Green_Campus_v3.html">Eco Detective Game</a></li>
            <li class="mb-2"><a href="${pagePrefix}data.html">Data & Fakta Riset</a></li>
            <li class="mb-2"><a href="${pagePrefix}to_do.html">Jurnal 7 Hari</a></li>
          </ul>
        </div>

        <div class="col-lg-2 col-6">
          <h6 class="fw-bold">Eksplorasi</h6>
          <ul class="list-unstyled">
            <li class="mb-2"><a href="${rootPrefix}index.html#mengapa-penting">Mengapa Penting</a></li>
            <li class="mb-2"><a href="${rootPrefix}index.html#solusi">Solusi & Aksi</a></li>
          </ul>
        </div>

        <div class="col-lg-3 col-12">
          <h6 class="fw-bold">Navigasi Utama</h6>
          <ul class="list-unstyled">
            <li class="mb-2"><a href="${rootPrefix}index.html#hero">Beranda</a></li>
            <li class="mb-2"><a href="${pagePrefix}about.html">Tentang Kampanye</a></li>
            <li class="mb-2"><a href="${pagePrefix}Eco_Detective_Operation_Green_Campus_v3.html" class="badge text-bg-success px-2 py-1 text-decoration-none">🎮 Mainkan Game</a></li>
          </ul>
        </div>
      </div>

      <hr class="mt-4 mb-3">
      <div class="row align-items-center">
        <div class="col-md-6 text-center text-md-start">
          <small>© 2026 SparkSave · SMK Wikrama Bogor. Hak cipta dilindungi.</small>
        </div>
        <div class="col-md-6 text-center text-md-end mt-2 mt-md-0">
          <small class="text-secondary">Satu Sakelar Dimatikan, Satu Langkah Bumi Diselamatkan 🌱</small>
        </div>
      </div>
    </div>
  </div>
</footer>
`;
})();
