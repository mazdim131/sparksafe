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
          <li><a href="/index.html#hero" class="nav-link">Beranda</a></li>
          <li><a href="/index.html#mengapa-penting" class="nav-link">Mengapa Penting</a></li>
          <li><a href="/index.html#solusi" class="nav-link">Solusi & Aksi</a></li>
          <li><a href="/src/page/about.html" class="nav-link">Tentang</a></li>
        </ul>
      <form class="d-flex" role="search">
        <a href="#solusi" class="btn-join justify-content-center mx-auto">
          <span>Join Kampanye</span>
        </a> 
    </div>
  </div>
</nav>

`;
