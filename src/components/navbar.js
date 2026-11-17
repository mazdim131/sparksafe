(function renderNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const pathname = (window.location.pathname || "").replace(/\\/g, "/");
  const isInsidePage = pathname.includes("/src/page/");
  const rootPrefix = isInsidePage ? "../../" : "./";
  const pagePrefix = isInsidePage ? "./" : "src/page/";
  const imgPrefix = isInsidePage ? "../assets/images/" : "src/assets/images/";

  navbar.innerHTML = `
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container">
    <a href="${rootPrefix}index.html" class="brand-logo">
      <img src="${imgPrefix}ic-navbar.png" alt="SparkSave Logo" style="height: 38px;">
      <span>SparkSave</span>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0 nav-links justify-content-center mx-auto">
        <li><a href="${rootPrefix}index.html#hero" class="nav-link" data-nav="home">Beranda</a></li>
        <li><a href="${rootPrefix}index.html#mengapa-penting" class="nav-link" data-nav="why">Mengapa Penting</a></li>
        <li><a href="${pagePrefix}Eco_Detective_Operation_Green_Campus_v3.html" class="nav-link" data-nav="solution">Solusi & Aksi</a></li>
        <li><a href="${pagePrefix}data.html" class="nav-link" data-nav="data">Data & Fakta</a></li>
        <li><a href="${pagePrefix}about.html" class="nav-link" data-nav="about">Tentang</a></li>
        <li><a href="${pagePrefix}to_do.html" class="nav-link" data-nav="todo">Zona Evaluasi Diri</a></li>
      </ul>
      <div class="d-flex align-items-center">
        <a href="${rootPrefix}index.html#solusi" class="btn-join">
          <span>Aksi Nyata</span>
        </a> 
      </div>
    </div>
  </div>
</nav>
`;

  // Tandai menu aktif berdasarkan halaman yang sedang dibuka
  const path = pathname.toLowerCase();
  let key = "home";
  if (path.endsWith("data.html")) key = "data";
  else if (path.endsWith("about.html")) key = "about";
  else if (path.endsWith("to_do.html")) key = "todo";
  else if (path.includes("eco_detective")) key = "solution";

  const links = document.querySelectorAll(".nav-link[data-nav]");
  links.forEach((l) => {
    if (l.getAttribute("data-nav") === key) l.classList.add("active");
  });
})();
