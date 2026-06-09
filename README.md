# AI Capabilities Catalog

[![Open Source](https://img.shields.io/badge/open--source-models-3fb950?style=flat-square)](https://equalinformation.com/ai-capabilities/pages/open-source.html)
[![License: MIT](https://img.shields.io/badge/license-MIT-58a6ff?style=flat-square)](LICENSE)
[![Models](https://img.shields.io/badge/models-35%2B-bc8cff?style=flat-square)](data/models.json)
[![WebGPU Demo](https://img.shields.io/badge/demo-WebGPU-ffa657?style=flat-square)](https://equalinformation.com/ai-capabilities/demos/webllm/index.html)

The most exhaustive open reference for AI models — from 22M embedding models running on your
phone to 671B reasoning giants requiring GPU clusters. Built to accelerate the path to on-device AGI.

---

## Mission

This catalog exists to collect and organize every meaningful AI model ever created — organized by
deployment target, capability, and hardware requirements. The goal is a single, always-current
reference that any developer can open and answer: *"What is the best model I can run right now,
on my hardware, privately, offline?"*

We believe the most important breakthrough in AI is not the next GPT release — it is the moment a
phone in someone's pocket becomes a fully capable reasoning agent that never phones home. On-device
AGI means privacy is not a feature you pay extra for. It means the intelligence gap between the
richest and poorest humans on earth collapses entirely. Every entry in this catalog is
cross-referenced with the hardware required to run it, the inference engines that support it,
quantization formats available, and whether it can operate fully offline.

---

## Quick Links

| Page | Description |
|---|---|
| [Home / Full Catalog](https://equalinformation.com/ai-capabilities/) | All models, all filters, stats overview |
| [Open Source Models](https://equalinformation.com/ai-capabilities/pages/open-source.html) | Free to download, run, and modify |
| [Proprietary Models](https://equalinformation.com/ai-capabilities/pages/proprietary.html) | Commercial APIs: GPT-4o, Claude, Gemini, Grok |
| [Mobile Models](https://equalinformation.com/ai-capabilities/pages/mobile.html) | LLMs proven on smartphones and edge devices |
| [Desktop Models](https://equalinformation.com/ai-capabilities/pages/desktop.html) | Personal computer models with hardware guide |
| [Datacenter Models](https://equalinformation.com/ai-capabilities/pages/datacenter.html) | GPU cluster models: DeepSeek R1, Qwen3 235B |
| [AGI Roadmap](https://equalinformation.com/ai-capabilities/pages/agi-roadmap.html) | Capability table, pipeline architecture, gaps |
| [WebLLM Demo](https://equalinformation.com/ai-capabilities/demos/webllm/index.html) | Run LLMs in your browser via WebGPU |
| [Transformers.js Demo](https://equalinformation.com/ai-capabilities/demos/transformers-js/index.html) | NLP tasks in-browser, no install |
| [ONNX Web Demo](https://equalinformation.com/ai-capabilities/demos/onnx-web/index.html) | ONNX Runtime in the browser |

---

## Project Structure

```
ai-capabilities/
├── index.html                    # Main landing page + full catalog
├── data/
│   └── models.json               # Model database (add entries here)
├── assets/
│   ├── css/
│   │   └── styles.css            # Global dark theme stylesheet
│   └── js/
│       └── catalog.js            # Filter, sort, render logic (window.Catalog)
├── pages/
│   ├── open-source.html          # Pre-filtered: type = open-source
│   ├── proprietary.html          # Pre-filtered: type = proprietary
│   ├── mobile.html               # Pre-filtered: deployment = mobile
│   ├── desktop.html              # Pre-filtered: deployment = desktop
│   ├── datacenter.html           # Pre-filtered: deployment = datacenter
│   └── agi-roadmap.html          # Static AGI capability reference (no catalog table)
├── demos/
│   ├── webllm/
│   │   ├── index.html            # WebGPU chat demo
│   │   └── benchmark.html        # Token speed benchmark
│   ├── transformers-js/
│   │   ├── index.html            # Transformers.js demo hub
│   │   ├── embeddings.html       # Sentence embedding demo
│   │   ├── text-generation.html  # Text generation demo
│   │   └── vision.html           # Image classification demo
│   └── onnx-web/
│       └── index.html            # ONNX Runtime Web demo
├── LICENSE                       # MIT License
└── README.md                     # This file
```

---

## How to Use

### Option 1 — Open directly in a browser

Most pages work by opening `index.html` directly from your filesystem. The catalog loads
`data/models.json` via `fetch()`, which requires a local server for CORS reasons on some browsers.

### Option 2 — Serve locally (recommended)

```bash
# Python 3
cd ai-capabilities
python3 -m http.server 8080
# Then open http://localhost:8080
```

```bash
# Node.js (npx)
npx serve .
```

```bash
# Ruby
ruby -run -e httpd . -p 8080
```

### Option 3 — GitHub Pages / Netlify / Vercel

Push to a GitHub repo, enable GitHub Pages on the `main` branch. The entire site is static HTML —
no build step required.

---

## Categories Explained

| Category | Deployment Tag | What it means |
|---|---|---|
| **Open Source** | `type: open-source` | Weights are freely downloadable. Apache 2.0, MIT, Llama license, etc. |
| **Proprietary** | `type: proprietary` | Closed weights. Access via paid API only. GPT-4o, Claude, Gemini, Grok. |
| **Mobile** | `deployment: mobile` | Proven to run on smartphones / tablets. Under ~6 GB RAM. |
| **Desktop** | `deployment: desktop` | Personal computer. 8–128 GB RAM range. Ollama, LM Studio, MLX. |
| **Datacenter** | `deployment: datacenter` | Requires GPU cluster or high-memory server. 80+ GB VRAM. |
| **Edge** | `deployment: edge` | Raspberry Pi, Jetson, embedded Linux. Constrained compute. |
| **API** | `deployment: api` | Proprietary models served only via API. No local download. |

---

## In-Browser Demos

Three demo sections let you run AI directly in your browser — no installation, no Python, no GPU required (except WebLLM which needs WebGPU).

### WebLLM (WebGPU)
- **Requires:** Chrome 113+, Edge 113+, or Safari 18+
- **Models:** Llama 3.2, Qwen2.5, Phi-4, Gemma, SmolLM2, DeepSeek-R1 distill
- **How it works:** MLC LLM compiles models to WebGPU shaders. First load downloads weights to browser cache (~700 MB for 1B, ~4 GB for 8B). Subsequent loads are instant.
- **Privacy:** After model download, zero network traffic. Inspect with browser devtools.

### Transformers.js (WASM + WebGPU)
- **Requires:** Any modern browser
- **Tasks:** Sentiment analysis, NER, question answering, translation, embeddings, zero-shot classification
- **How it works:** Hugging Face Transformers.js runs ONNX-converted models in WebAssembly or WebGPU backend.

### ONNX Runtime Web
- **Requires:** Any modern browser
- **Models:** Whisper, encoder models, classification models
- **How it works:** Microsoft's ONNX Runtime compiled to WASM with optional WebGPU backend.

---

## How to Contribute — Adding a Model

All model data lives in `data/models.json`. It is a plain JSON array. To add a model:

1. Fork this repository
2. Open `data/models.json`
3. Add an entry following the schema below
4. Submit a pull request

**Example entry:**

```json
{
  "id": "your-model-id",
  "name": "Model Name",
  "organization": "Organization",
  "description": "One-sentence description of what makes this model notable.",
  "type": ["open-source"],
  "deployment": ["mobile", "desktop"],
  "params_b": 7,
  "context_window": "128K",
  "ram_min_gb": 5,
  "ram_rec_gb": 8,
  "vram_gb": 5,
  "storage_q4_gb": 4.7,
  "architecture": "Llama",
  "license": "Apache 2.0",
  "modalities": ["text"],
  "on_device": true,
  "offline": true,
  "privacy_preserving": true,
  "quantizations": ["Q4_K_M", "Q5_K_M", "Q8_0"],
  "inference_engines": ["llama.cpp", "Ollama", "LM Studio"],
  "ollama_name": "modelname:7b",
  "webllm_id": null,
  "hf_url": "https://huggingface.co/org/model",
  "gh_url": "https://github.com/org/repo",
  "paper_url": "https://arxiv.org/abs/XXXX.XXXXX",
  "api_url": null,
  "moe": false,
  "active_params_b": null,
  "pricing": null
}
```

---

## Model JSON Schema — Field Reference

| Field | Type | Description | Example |
|---|---|---|---|
| `id` | `string` | Unique kebab-case identifier | `"llama-3.1-8b"` |
| `name` | `string` | Human-readable model name | `"Llama 3.1 8B"` |
| `organization` | `string` | Creator / research lab | `"Meta"` |
| `description` | `string` | One-sentence description | `"Efficient 8B..."` |
| `type` | `string[]` | `"open-source"` or `"proprietary"` | `["open-source"]` |
| `deployment` | `string[]` | `"mobile"`, `"desktop"`, `"datacenter"`, `"edge"`, `"api"` | `["mobile","desktop"]` |
| `params_b` | `number\|null` | Parameter count in billions | `8` |
| `context_window` | `string\|null` | Context length (display string) | `"128K"` |
| `ram_min_gb` | `number\|null` | Minimum RAM to run (GB) at Q4 | `5` |
| `ram_rec_gb` | `number\|null` | Recommended RAM for good UX | `8` |
| `vram_gb` | `number\|null` | VRAM needed for GPU inference | `5` |
| `storage_q4_gb` | `number\|null` | Disk size of Q4_K_M GGUF | `4.7` |
| `architecture` | `string\|null` | Model family / arch name | `"Llama"` |
| `license` | `string\|null` | License identifier | `"Apache 2.0"` |
| `modalities` | `string[]` | Supported I/O types | `["text","image"]` |
| `on_device` | `boolean` | Can run on personal hardware | `true` |
| `offline` | `boolean` | Works without internet | `true` |
| `privacy_preserving` | `boolean` | No data leaves device | `true` |
| `quantizations` | `string[]\|null` | Available quant formats | `["Q4_K_M","Q8_0"]` |
| `inference_engines` | `string[]\|null` | Runtimes that support it | `["Ollama","llama.cpp"]` |
| `ollama_name` | `string\|null` | `ollama run <name>` string | `"llama3.1:8b"` |
| `webllm_id` | `string\|null` | MLC WebLLM model ID | `"Llama-3.1-8B-..."` |
| `hf_url` | `string\|null` | Hugging Face model card URL | `"https://huggingface.co/..."` |
| `gh_url` | `string\|null` | GitHub repository URL | `"https://github.com/..."` |
| `paper_url` | `string\|null` | ArXiv or paper URL | `"https://arxiv.org/..."` |
| `api_url` | `string\|null` | API documentation URL | `"https://platform.openai.com/..."` |
| `moe` | `boolean` | Is this a Mixture of Experts model? | `false` |
| `active_params_b` | `number\|null` | Active params per forward pass (MoE) | `37` |
| `pricing` | `string\|null` | API pricing (proprietary only) | `"$5/$15 per 1M tok"` |

**Type constraints:**
- `type` values: `"open-source"` | `"proprietary"`
- `deployment` values: `"mobile"` | `"desktop"` | `"datacenter"` | `"edge"` | `"api"`
- `modalities` values: `"text"` | `"image"` | `"audio"` | `"video"`

---

## Catalog JS API

The `window.Catalog` object (from `assets/js/catalog.js`) exposes one method:

```js
Catalog.initPage({
  jsonPath: './data/models.json',   // Path to models.json (relative to HTML file)
  statsContainerId: 'stats',        // <div id="stats"> for stat cards
  tableContainerId: 'catalog',      // <div id="catalog"> for the table
  filterContainerId: 'filters',     // <div id="filters"> for filter chips
  defaultFilters: {
    type: ['open-source'],          // Pre-selected type filters
    deployment: ['mobile']          // Pre-selected deployment filters
  },
  columns: [                        // Ordered list of column keys to show
    'name', 'params', 'context', 'ram_min', 'storage_q4',
    'modalities', 'on_device', 'offline', 'privacy', 'license', 'links'
  ],
  pageTitle: 'My Page Title'        // Optional, not currently rendered
});
```

Available column keys: `name`, `type`, `deployment`, `params`, `context`, `ram_min`, `ram_rec`,
`vram`, `storage_q4`, `architecture`, `license`, `modalities`, `on_device`, `offline`, `privacy`,
`quantizations`, `inference_engines`, `ollama_name`, `webllm_id`, `pricing`, `api_url`, `moe`, `links`

---

## License

MIT License. See [LICENSE](LICENSE) for the full text.

Model data is sourced from official model cards, research papers, and community benchmarks.
Accuracy is best-effort — always verify against official documentation before production use.
Pricing data for proprietary models changes frequently; check vendor pricing pages directly.

---

*Built for developers pursuing on-device AGI. Contributions welcome.*
