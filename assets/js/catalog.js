/**
 * AI Capabilities Catalog — catalog.js
 * Handles data loading, filtering, sorting, and rendering of the model table.
 */

(function (global) {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Utility helpers                                                       */
  /* ------------------------------------------------------------------ */

  function esc(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fmt(val) {
    if (val === null || val === undefined || val === "") return '<span style="color:var(--text-dim)">—</span>';
    return esc(String(val));
  }

  function yesNo(val) {
    if (val === true || val === "yes" || val === "true" || val === 1)
      return '<span class="badge-yes">✓ Yes</span>';
    if (val === false || val === "no" || val === "false" || val === 0)
      return '<span class="badge-no">✗ No</span>';
    if (val === "partial")
      return '<span class="badge-partial">~ Partial</span>';
    return fmt(val);
  }

  function typeTags(types) {
    if (!types) return "";
    const arr = Array.isArray(types) ? types : [types];
    return arr.map(t => {
      const cls = t === "open-source" ? "tag-open-source"
                : t === "proprietary" ? "tag-proprietary"
                : "tag-" + t.toLowerCase().replace(/\s+/g, "-");
      return `<span class="tag ${cls}">${esc(t)}</span>`;
    }).join(" ");
  }

  function deployTags(deps) {
    if (!deps) return "";
    const arr = Array.isArray(deps) ? deps : [deps];
    return arr.map(d => {
      const cls = "tag-" + d.toLowerCase().replace(/\s+/g, "-");
      return `<span class="tag ${cls}">${esc(d)}</span>`;
    }).join(" ");
  }

  function modalityTags(mods) {
    if (!mods) return "";
    const arr = Array.isArray(mods) ? mods : [mods];
    return arr.map(m => `<span class="tag" style="background:rgba(139,148,158,.12);border:1px solid rgba(139,148,158,.25);color:#c9d1d9">${esc(m)}</span>`).join(" ");
  }

  function engineTags(engines) {
    if (!engines) return "";
    const arr = Array.isArray(engines) ? engines : [engines];
    return arr.map(e => `<span class="tag" style="background:rgba(188,140,255,.1);border:1px solid rgba(188,140,255,.25);color:#bc8cff;font-size:.7rem">${esc(e)}</span>`).join(" ");
  }

  function linkChips(model) {
    const links = [];
    if (model.hf_url)  links.push(`<a class="link-chip" href="${esc(model.hf_url)}" target="_blank" rel="noopener">🤗 HF</a>`);
    if (model.gh_url)  links.push(`<a class="link-chip" href="${esc(model.gh_url)}" target="_blank" rel="noopener">⚙ GitHub</a>`);
    if (model.api_url) links.push(`<a class="link-chip" href="${esc(model.api_url)}" target="_blank" rel="noopener">☁ API</a>`);
    if (model.paper_url) links.push(`<a class="link-chip" href="${esc(model.paper_url)}" target="_blank" rel="noopener">📄 Paper</a>`);
    return links.join(" ");
  }

  /* ------------------------------------------------------------------ */
  /* Column renderers                                                      */
  /* ------------------------------------------------------------------ */

  const COLUMN_DEFS = {
    name: {
      header: "Model",
      sortKey: m => (m.name || "").toLowerCase(),
      render: m => `
        <div class="model-name">${esc(m.name)}</div>
        <div class="model-org">${esc(m.organization)}</div>
        ${m.description ? `<div class="model-desc">${esc(m.description)}</div>` : ""}
      `
    },
    type: {
      header: "Type",
      sortKey: m => (Array.isArray(m.type) ? m.type[0] : m.type || ""),
      render: m => typeTags(m.type)
    },
    deployment: {
      header: "Deployment",
      sortKey: m => (Array.isArray(m.deployment) ? m.deployment[0] : m.deployment || ""),
      render: m => deployTags(m.deployment)
    },
    params: {
      header: "Params",
      sortKey: m => parseFloat(m.params_b) || 0,
      render: m => m.params_b ? `<strong>${fmt(m.params_b)}B</strong>` : fmt(m.params_label)
    },
    context: {
      header: "Context",
      sortKey: m => parseInt(String(m.context_window).replace(/[^0-9]/g, "")) || 0,
      render: m => fmt(m.context_window)
    },
    ram_min: {
      header: "RAM Min",
      sortKey: m => parseFloat(m.ram_min_gb) || 0,
      render: m => m.ram_min_gb ? `${fmt(m.ram_min_gb)} GB` : fmt(m.ram_min_label)
    },
    ram_rec: {
      header: "RAM Rec.",
      sortKey: m => parseFloat(m.ram_rec_gb) || 0,
      render: m => m.ram_rec_gb ? `${fmt(m.ram_rec_gb)} GB` : fmt(m.ram_rec_label)
    },
    vram: {
      header: "VRAM",
      sortKey: m => parseFloat(m.vram_gb) || 0,
      render: m => m.vram_gb ? `${fmt(m.vram_gb)} GB` : fmt(m.vram_label)
    },
    storage_q4: {
      header: "Storage Q4",
      sortKey: m => parseFloat(m.storage_q4_gb) || 0,
      render: m => m.storage_q4_gb ? `${fmt(m.storage_q4_gb)} GB` : fmt(m.storage_q4_label)
    },
    architecture: {
      header: "Architecture",
      sortKey: m => (m.architecture || "").toLowerCase(),
      render: m => fmt(m.architecture)
    },
    license: {
      header: "License",
      sortKey: m => (m.license || "").toLowerCase(),
      render: m => `<span style="font-size:.8rem">${fmt(m.license)}</span>`
    },
    modalities: {
      header: "Modalities",
      sortKey: m => Array.isArray(m.modalities) ? m.modalities.join(",") : (m.modalities || ""),
      render: m => modalityTags(m.modalities)
    },
    on_device: {
      header: "On-Device",
      sortKey: m => (m.on_device ? 1 : 0),
      render: m => yesNo(m.on_device)
    },
    offline: {
      header: "Offline",
      sortKey: m => (m.offline ? 1 : 0),
      render: m => yesNo(m.offline)
    },
    privacy: {
      header: "Privacy",
      sortKey: m => (m.privacy_preserving ? 1 : 0),
      render: m => yesNo(m.privacy_preserving)
    },
    quantizations: {
      header: "Quantizations",
      sortKey: m => Array.isArray(m.quantizations) ? m.quantizations.length : 0,
      render: m => {
        if (!m.quantizations) return fmt(null);
        const arr = Array.isArray(m.quantizations) ? m.quantizations : [m.quantizations];
        return arr.map(q => `<code>${esc(q)}</code>`).join(" ");
      }
    },
    inference_engines: {
      header: "Inference Engines",
      sortKey: m => Array.isArray(m.inference_engines) ? m.inference_engines.join(",") : "",
      render: m => engineTags(m.inference_engines)
    },
    ollama_name: {
      header: "Ollama",
      sortKey: m => (m.ollama_name || "").toLowerCase(),
      render: m => m.ollama_name ? `<code>${esc(m.ollama_name)}</code>` : fmt(null)
    },
    webllm_id: {
      header: "WebLLM ID",
      sortKey: m => (m.webllm_id || "").toLowerCase(),
      render: m => m.webllm_id ? `<code style="font-size:.72rem">${esc(m.webllm_id)}</code>` : fmt(null)
    },
    pricing: {
      header: "Pricing",
      sortKey: m => (m.pricing || "").toLowerCase(),
      render: m => `<span style="font-size:.8rem;color:var(--text-muted)">${fmt(m.pricing)}</span>`
    },
    api_url: {
      header: "API Docs",
      sortKey: m => (m.api_url || "").toLowerCase(),
      render: m => m.api_url
        ? `<a href="${esc(m.api_url)}" target="_blank" rel="noopener" class="link-chip">Docs ↗</a>`
        : fmt(null)
    },
    moe: {
      header: "MoE",
      sortKey: m => (m.moe ? 1 : 0),
      render: m => {
        if (!m.moe) return '<span class="badge-no">—</span>';
        let s = '<span class="badge-yes">✓</span>';
        if (m.active_params_b) s += ` <span style="font-size:.78rem;color:var(--text-muted)">Active: ${fmt(m.active_params_b)}B</span>`;
        return s;
      }
    },
    links: {
      header: "Links",
      sortKey: m => (m.hf_url || m.gh_url || "").toLowerCase(),
      render: m => `<div class="link-row">${linkChips(m)}</div>`
    }
  };

  /* ------------------------------------------------------------------ */
  /* State                                                                 */
  /* ------------------------------------------------------------------ */

  const DEFAULT_COLUMNS = [
    "name","type","deployment","params","context","ram_min",
    "storage_q4","modalities","on_device","offline","privacy","license","links"
  ];

  /* ------------------------------------------------------------------ */
  /* Main init                                                             */
  /* ------------------------------------------------------------------ */

  async function initPage(opts) {
    const {
      jsonPath          = "./data/models.json",
      statsContainerId  = "stats",
      tableContainerId  = "catalog",
      filterContainerId = "filters",
      defaultFilters    = {},
      columns           = DEFAULT_COLUMNS,
      pageTitle         = ""
    } = opts || {};

    const statsEl  = document.getElementById(statsContainerId);
    const tableEl  = document.getElementById(tableContainerId);
    const filterEl = document.getElementById(filterContainerId);

    if (tableEl) tableEl.innerHTML = '<div class="loading-spinner"></div>';

    let allModels = [];
    try {
      const res = await fetch(jsonPath);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      allModels = Array.isArray(data) ? data : (data.models || []);
    } catch (e) {
      if (tableEl) tableEl.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠</div><p>Could not load model data: ${esc(e.message)}</p></div>`;
      return;
    }

    /* Active filter state */
    const active = {
      type:       (defaultFilters.type       || []).slice(),
      deployment: (defaultFilters.deployment || []).slice(),
      search:     ""
    };

    let sortCol = null;
    let sortDir = 1; // 1=asc, -1=desc

    /* Render stats */
    if (statsEl) renderStats(statsEl, allModels, active);

    /* Render filters */
    if (filterEl) renderFilters(filterEl, allModels, active, onChange);

    /* Initial render */
    if (tableEl) renderTable(tableEl, columns, filtered());

    function filtered() {
      return allModels.filter(m => {
        if (active.type.length > 0) {
          const mt = Array.isArray(m.type) ? m.type : [m.type];
          if (!active.type.some(t => mt.includes(t))) return false;
        }
        if (active.deployment.length > 0) {
          const md = Array.isArray(m.deployment) ? m.deployment : [m.deployment];
          if (!active.deployment.some(d => md.includes(d))) return false;
        }
        if (active.search) {
          const q = active.search.toLowerCase();
          const hay = [m.name, m.organization, m.description, m.architecture,
                       m.license, m.ollama_name, m.webllm_id,
                       ...(Array.isArray(m.modalities) ? m.modalities : []),
                       ...(Array.isArray(m.inference_engines) ? m.inference_engines : [])
                      ].filter(Boolean).join(" ").toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
    }

    function onChange() {
      const rows = sorted(filtered());
      if (tableEl) renderTable(tableEl, columns, rows);
      if (statsEl) renderStats(statsEl, allModels, active);
    }

    function sorted(rows) {
      if (!sortCol) return rows;
      const def = COLUMN_DEFS[sortCol];
      if (!def || !def.sortKey) return rows;
      return rows.slice().sort((a, b) => {
        const va = def.sortKey(a);
        const vb = def.sortKey(b);
        if (va < vb) return -sortDir;
        if (va > vb) return sortDir;
        return 0;
      });
    }

    /* Wire up sort */
    document.addEventListener("click", function (e) {
      const th = e.target.closest("th[data-col]");
      if (!th) return;
      const col = th.dataset.col;
      if (sortCol === col) sortDir = -sortDir;
      else { sortCol = col; sortDir = 1; }
      // Update header UI
      document.querySelectorAll("th[data-col]").forEach(h => {
        h.classList.remove("sort-asc", "sort-desc");
        const ico = h.querySelector(".sort-icon");
        if (ico) ico.textContent = "↕";
      });
      th.classList.add(sortDir === 1 ? "sort-asc" : "sort-desc");
      const ico = th.querySelector(".sort-icon");
      if (ico) ico.textContent = sortDir === 1 ? "↑" : "↓";
      onChange();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Stats renderer                                                        */
  /* ------------------------------------------------------------------ */

  function renderStats(el, allModels, active) {
    const total = allModels.length;
    const openSource = allModels.filter(m => {
      const mt = Array.isArray(m.type) ? m.type : [m.type];
      return mt.includes("open-source");
    }).length;
    const mobile = allModels.filter(m => {
      const md = Array.isArray(m.deployment) ? m.deployment : [m.deployment];
      return md.includes("mobile");
    }).length;
    const desktop = allModels.filter(m => {
      const md = Array.isArray(m.deployment) ? m.deployment : [m.deployment];
      return md.includes("desktop");
    }).length;
    const datacenter = allModels.filter(m => {
      const md = Array.isArray(m.deployment) ? m.deployment : [m.deployment];
      return md.includes("datacenter");
    }).length;
    const onDevice = allModels.filter(m => m.on_device === true || m.on_device === "yes").length;

    el.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">${total}</div>
          <div class="stat-label">Total Models</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${openSource}</div>
          <div class="stat-label">Open Source</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${total - openSource}</div>
          <div class="stat-label">Proprietary</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${mobile}</div>
          <div class="stat-label">Mobile Ready</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${desktop}</div>
          <div class="stat-label">Desktop</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${datacenter}</div>
          <div class="stat-label">Datacenter</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${onDevice}</div>
          <div class="stat-label">On-Device</div>
        </div>
      </div>
    `;
  }

  /* ------------------------------------------------------------------ */
  /* Filters renderer                                                      */
  /* ------------------------------------------------------------------ */

  function renderFilters(el, allModels, active, onChange) {
    const typeValues = ["open-source", "proprietary"];
    const deployValues = ["mobile", "desktop", "datacenter", "edge", "api"];

    function chipClass(arr, val) {
      return "filter-chip" + (arr.includes(val) ? " active" : "");
    }

    function renderInner() {
      el.innerHTML = `
        <div class="filter-bar">
          <div class="filter-section">
            <span class="filter-label">Type</span>
            <div class="filter-chips" id="filter-type">
              ${typeValues.map(v => `<button class="${chipClass(active.type, v)}" data-filter="type" data-value="${esc(v)}">${esc(v)}</button>`).join("")}
            </div>
          </div>
          <div class="filter-section">
            <span class="filter-label">Deployment</span>
            <div class="filter-chips" id="filter-deploy">
              ${deployValues.map(v => `<button class="${chipClass(active.deployment, v)}" data-filter="deployment" data-value="${esc(v)}">${esc(v)}</button>`).join("")}
            </div>
          </div>
          <div class="search-wrapper">
            <input type="text" class="search-input" id="catalog-search" placeholder="Search models…" value="${esc(active.search)}">
          </div>
        </div>
      `;

      el.querySelectorAll(".filter-chip").forEach(btn => {
        btn.addEventListener("click", function () {
          const f = this.dataset.filter;
          const v = this.dataset.value;
          const arr = active[f];
          const idx = arr.indexOf(v);
          if (idx === -1) arr.push(v);
          else arr.splice(idx, 1);
          renderInner();
          onChange();
        });
      });

      const searchEl = el.querySelector("#catalog-search");
      if (searchEl) {
        searchEl.addEventListener("input", function () {
          active.search = this.value.trim();
          onChange();
        });
        searchEl.focus();
      }
    }

    renderInner();
  }

  /* ------------------------------------------------------------------ */
  /* Table renderer                                                        */
  /* ------------------------------------------------------------------ */

  function renderTable(el, columns, models) {
    if (models.length === 0) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <p>No models match your current filters. Try removing a filter or clearing the search.</p>
        </div>
      `;
      return;
    }

    const validCols = columns.filter(c => COLUMN_DEFS[c]);

    const thead = `
      <thead>
        <tr>
          ${validCols.map(c => `
            <th data-col="${esc(c)}">
              ${esc(COLUMN_DEFS[c].header)}
              <span class="sort-icon">↕</span>
            </th>
          `).join("")}
        </tr>
      </thead>
    `;

    const tbody = `
      <tbody>
        ${models.map(m => `
          <tr>
            ${validCols.map(c => `<td>${COLUMN_DEFS[c].render(m)}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    `;

    el.innerHTML = `
      <div class="table-wrapper">
        <table class="catalog-table">
          ${thead}
          ${tbody}
        </table>
      </div>
    `;
  }

  /* ------------------------------------------------------------------ */
  /* Export                                                                */
  /* ------------------------------------------------------------------ */

  global.Catalog = { initPage };

})(window);
