const navbar = document.getElementById("navbar");

navbar.innerHTML = `

<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-sm container-fluid">
      <a href="/index.html" class="brand-logo">
        <div>
          <img src="/src/assets/images/ic-navbar.png" style="height: 40px;">
        </div>
        <span>SparkSave</span>
      </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 nav-links justify-content-center mx-auto ">
          <li><a href="/index.html#hero" class="nav-link" data-nav="home">Beranda</a></li>
          <li><a href="/index.html#mengapa-penting" class="nav-link" data-nav="why">Mengapa Penting</a></li>
          <li><a href="/index.html#solusi" class="nav-link" data-nav="solution">Solusi & Aksi</a></li>
          <li><a href="/src/page/data.html" class="nav-link" data-nav="data">Data & Fakta</a></li>
          <li><a href="/src/page/about.html" class="nav-link" data-nav="about">Tentang</a></li>
        </ul>
      <form class="d-flex" role="search">
        <a href="#solusi" class="btn-join justify-content-center mx-auto">
          <span>Join Kampanye</span>
        </a> 
    </div>
  </div>
</nav>

`;

// Tandai menu aktif berdasarkan halaman yang sedang dibuka
(function markActiveNav() {
  const path = (window.location.pathname || "").toLowerCase();
  let key = "home";
  if (path.endsWith("data.html")) key = "data";
  else if (path.endsWith("about.html")) key = "about";
  const links = document.querySelectorAll(".nav-link[data-nav]");
  links.forEach((l) => {
    if (l.getAttribute("data-nav") === key) l.classList.add("active");
  });
})();
