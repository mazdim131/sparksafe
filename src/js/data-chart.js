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

    if (r.kategori && r.kategori_persen) {
      const setStat = (id, pct, count) => {
        const target = document.getElementById(id);
        if (target) {
          target.innerHTML = `${pct.toFixed(1)}% <small>(${count} siswa)</small>`;
        }
      };
      setStat("stat-val-sangatbaik", r.kategori_persen["Sangat Baik"] || 0, r.kategori["Sangat Baik"] || 0);
      setStat("stat-val-baik", r.kategori_persen["Baik"] || 0, r.kategori["Baik"] || 0);
      setStat("stat-val-cukup", r.kategori_persen["Cukup"] || 0, r.kategori["Cukup"] || 0);
      setStat("stat-val-kurang", r.kategori_persen["Kurang"] || 0, r.kategori["Kurang"] || 0);
    }
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
          borderWidth: 3,
          borderColor: "#ffffff",
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: "bottom", 
            labels: { 
              boxWidth: 14, 
              padding: 14, 
              font: { size: 12, family: "'Google Sans', sans-serif" } 
            } 
          },
          tooltip: {
            callbacks: {
              label: (c) => c.label + ": " + c.parsed + " siswa (" + (r.kategori_persen[c.label] || 0).toFixed(1) + "%)"
            }
          }
        },
        cutout: "62%"
      }
    });
  }

  function makeButirChart(data) {
    const items = (data.per_butir || []).slice().sort((a, b) => b.rata_rata - a.rata_rata);
    const labels = items.map((i) => i.kode + " - " + i.label);
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
          label: "Rata-rata skor",
          data: values,
          backgroundColor: colors,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 22
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => "Rata-rata: " + c.parsed.x.toFixed(2) + " / 4,00" } }
        },
        scales: {
          x: { 
            min: 3.0, 
            max: 3.6, 
            ticks: { stepSize: 0.1, font: { family: "'Google Sans', sans-serif" } },
            grid: { color: "rgba(0, 0, 0, 0.05)" }
          },
          y: {
            ticks: { font: { size: 11, family: "'Google Sans', sans-serif" } },
            grid: { display: false }
          }
        }
      }
    });
  }

  function makeJurusanChart(data) {
    const items = (data.per_jurusan || []).slice().sort((a, b) => b.rata_rata_skor - a.rata_rata_skor);
    const labels = items.map((i) => i.kode + " (" + i.nama + ")");
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
          borderSkipped: false,
          maxBarThickness: 56
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
                return "Skor: " + c.parsed.y.toFixed(2) + " (" + it.jumlah_responden + " siswa)";
              }
            }
          }
        },
        scales: {
          y: { 
            min: 2.8, 
            max: 3.7, 
            ticks: { stepSize: 0.1, font: { family: "'Google Sans', sans-serif" } },
            grid: { color: "rgba(0, 0, 0, 0.05)" }
          },
          x: {
            ticks: { font: { size: 12, family: "'Google Sans', sans-serif" } },
            grid: { display: false }
          }
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
          backgroundColor: mode === "rombel" ? PALETTE.secondary : PALETTE.primary,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: mode === "rombel" ? 42 : 54
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
                return "Rata-rata skor: " + c.parsed.y.toFixed(2) + (it.jumlah_responden ? " (" + it.jumlah_responden + " siswa)" : "");
              }
            } 
          }
        },
        scales: {
          y: { 
            min: 2.8, 
            max: 3.7, 
            ticks: { stepSize: 0.1, font: { family: "'Google Sans', sans-serif" } },
            grid: { color: "rgba(0, 0, 0, 0.05)" }
          },
          x: { 
            ticks: { 
              font: { size: mode === "rombel" ? 11 : 12, family: "'Google Sans', sans-serif" }, 
              maxRotation: 45, 
              minRotation: mode === "rombel" ? 35 : 0 
            },
            grid: { display: false }
          }
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
