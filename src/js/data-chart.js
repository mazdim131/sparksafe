// Data & Fakta - Chart rendering (Fase 2) - data asli kuesioner
(function () {
  "use strict";

  const PALETTE = {
    primary: "#059669",
    secondary: "#10b981",
    accent: "#f39c12",
    muted: "#64748b",
    danger: "#ef4444",
    info: "#3b82f6",
    purple: "#8b5cf6"
  };

  const KATEGORI_COLORS = {
    "Sangat Baik": PALETTE.primary,
    "Baik": PALETTE.secondary,
    "Cukup": PALETTE.accent,
    "Kurang": PALETTE.danger
  };

  function setStatus(msg, isError) {
    const el = document.getElementById("chart-status");
    if (!el) return;
    el.textContent = msg || "";
    el.classList.toggle("error", !!isError);
  }

  // Hybrid loader: prioritaskan fetch JSON, fallback ke DATA_ENERGI global
  async function loadData() {
    try {
      const res = await fetch("../data/data-perilaku-energi.json");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      return json;
    } catch (err) {
      if (typeof DATA_ENERGI !== "undefined" && DATA_ENERGI) {
        setStatus("Data dimuat dari cadangan (buka via Live Server untuk data terbaru).", false);
        return DATA_ENERGI;
      }
      setStatus("Gagal memuat data. Buka halaman via Live Server.", true);
      throw err;
    }
  }

  function renderKPI(data) {
    const r = data.ringkasan;
    const meta = data.meta;
    const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    el("kpi-responden", (meta.jumlah_responden || 0).toLocaleString("id-ID"));
    el("kpi-skor", (r.rata_rata_skor || 0).toFixed(2) + " / 4,00");
    el("kpi-sering", (r.persen_sering_rata_rata || 0).toFixed(2) + "%");
    const sb = r.kategori_persen && r.kategori_persen["Sangat Baik"];
    el("kpi-sangatbaik", (sb != null ? sb : 0).toFixed(1) + "%");
  }

  let chartKategori, chartButir, chartJurusan, chartFilter;

  function makeKategoriChart(data) {
    const r = data.ringkasan;
    const labels = Object.keys(r.kategori);
    const values = labels.map((l) => r.kategori[l]);
    const ctx = document.getElementById("chart-kategori");
    if (!ctx) return;
    if (chartKategori) chartKategori.destroy();
    chartKategori = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: labels.map((l) => KATEGORI_COLORS[l] || PALETTE.muted),
          borderWidth: 2,
          borderColor: "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 14, padding: 12, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: (c) => c.label + ": " + c.parsed + " siswa (" + (r.kategori_persen[c.label] || 0).toFixed(1) + "%)"
            }
          }
        },
        cutout: "60%"
      }
    });
  }

  function makeButirChart(data) {
    const items = (data.per_butir || []).slice().sort((a, b) => b.rata_rata - a.rata_rata);
    const labels = items.map((i) => i.kode + " " + i.label);
    const values = items.map((i) => i.rata_rata);
    const colors = items.map((i) => i.rata_rata >= 3.4 ? PALETTE.primary : (i.rata_rata >= 3.25 ? PALETTE.secondary : PALETTE.accent));
    const ctx = document.getElementById("chart-butir");
    if (!ctx) return;
    if (chartButir) chartButir.destroy();
    chartButir = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Rata-rata",
          data: values,
          backgroundColor: colors,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => "Rata-rata: " + c.parsed.x.toFixed(2) } }
        },
        scales: {
          x: { min: 3.0, max: 3.6, ticks: { stepSize: 0.1 } }
        }
      }
    });
  }

  function makeJurusanChart(data) {
    const items = (data.per_jurusan || []).slice().sort((a, b) => b.rata_rata_skor - a.rata_rata_skor);
    const labels = items.map((i) => i.kode);
    const values = items.map((i) => i.rata_rata_skor);
    const ctx = document.getElementById("chart-jurusan");
    if (!ctx) return;
    if (chartJurusan) chartJurusan.destroy();
    chartJurusan = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Rata-rata skor",
          data: values,
          backgroundColor: PALETTE.primary,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => {
                const it = items[c.dataIndex];
                return it.nama + ": " + c.parsed.y.toFixed(2) + " (" + it.jumlah_responden + " siswa)";
              }
            }
          }
        },
        scales: {
          y: { min: 2.8, max: 3.7, ticks: { stepSize: 0.1 } }
        }
      }
    });
  }

  let currentFilterData = null;

  function makeFilterChart(mode) {
    const data = currentFilterData;
    if (!data) return;
    let items = [];
    if (mode === "rombel") {
      items = (data.per_rombel || []).slice().sort((a, b) => b.rata_rata_skor - a.rata_rata_skor);
    } else {
      items = (data.per_rayon || []).slice().sort((a, b) => b.rata_rata_skor - a.rata_rata_skor);
    }
    const labels = items.map((i) => mode === "rombel" ? i.rombel : i.rayon);
    const values = items.map((i) => i.rata_rata_skor);
    const ctx = document.getElementById("chart-filter");
    if (!ctx) return;
    if (chartFilter) chartFilter.destroy();
    chartFilter = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Rata-rata skor",
          data: values,
          backgroundColor: PALETTE.secondary,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => c.parsed.y.toFixed(2) } }
        },
        scales: {
          y: { min: 2.8, max: 3.7, ticks: { stepSize: 0.1 } },
          x: { ticks: { font: { size: 10 }, maxRotation: 60, minRotation: 45 } }
        }
      }
    });
  }

  async function init() {
    let data;
    try {
      data = await loadData();
    } catch (e) {
      return;
    }
    if (!data) return;
    currentFilterData = data;
    renderKPI(data);
    makeKategoriChart(data);
    makeButirChart(data);
    makeJurusanChart(data);
    makeFilterChart("rayon");

    const sel = document.getElementById("filter-view");
    if (sel) {
      sel.addEventListener("change", (e) => makeFilterChart(e.target.value));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
