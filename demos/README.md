# AI Capabilities — Browser Demos

Run large language models and AI pipelines **entirely in your browser** — no server, no installation, no data sent anywhere. All inference is local.

---

## What's Here

| File | Technology | Description |
|------|-----------|-------------|
| `webllm/index.html` | WebLLM + WebGPU | Full chat interface for 16 LLMs (Llama, Qwen, Phi, Gemma, Mistral, DeepSeek…) |
| `webllm/benchmark.html` | WebLLM + WebGPU | Token-speed benchmark across models with CSS bar charts and JSON export |
| `transformers-js/index.html` | Transformers.js | Hub page + live sentiment analysis demo |
| `transformers-js/text-generation.html` | Transformers.js | Text generation with DistilGPT-2, GPT-2, SmolLM2, BLOOM, Qwen |
| `transformers-js/embeddings.html` | Transformers.js | Sentence similarity, semantic search, PCA cluster visualization |
| `transformers-js/vision.html` | Transformers.js | Image classification (ViT), zero-shot (CLIP), object detection (DETR), captioning |
| `onnx-web/index.html` | ONNX Runtime Web | Hub page, performance comparison table, code reference |
| `onnx-web/phi-mini.html` | ONNX RT Web + Transformers.js | Phi-3 Mini chat with execution provider selection (WASM / WebGPU) |

---

## Browser Requirements

### WebLLM demos (`webllm/`)
- **Chrome 113+** or **Edge 113+** — WebGPU is required
- **Safari 17+** (macOS Sonoma) — WebGPU available but may need flags
- Firefox — WebGPU not yet fully supported in stable builds
- Enable at: `chrome://flags/#enable-unsafe-webgpu` if not enabled by default
- At least **6GB free RAM** recommended for 7B+ models; 4GB for 1–3B models
- GPU with 4GB+ VRAM strongly recommended (integrated graphics will be very slow)

### Transformers.js demos (`transformers-js/`)
- **Any modern browser** — uses WebAssembly (WASM) which is universally supported
- Chrome, Firefox, Safari, Edge — all work
- Mobile browsers supported but will be significantly slower
- No GPU required — runs on CPU

### ONNX Web demos (`onnx-web/`)
- WASM backend: any modern browser
- WebGPU backend: Chrome 113+ / Edge 113+ / Safari 17+ macOS

---

## Privacy

**All inference is 100% local.** No data is sent to any server during model inference.

- Models are downloaded once from public CDNs (Hugging Face, CDN.jsdelivr.net) over HTTPS
- After the initial download, models run fully offline (cached in browser storage)
- Your prompts, conversations, and generated text **never leave your device**
- Check browser DevTools → Network tab to verify: no requests during inference

---

## Model Caching

Models are large (hundreds of MB to several GB) and are cached by the browser after the first download so you don't re-download them on subsequent visits.

**WebLLM** stores models in **IndexedDB** (persistent, survives browser restart):
- Chrome DevTools → Application → IndexedDB → look for `webllm` or `mlc-ai` databases
- Models persist until you clear site data or browser storage
- To manually clear: DevTools → Application → Storage → Clear site data

**Transformers.js** stores models in the **Cache API** (also persistent):
- DevTools → Application → Cache Storage → look for `transformers-cache`
- Typical sizes: all-MiniLM-L6-v2 ~80MB, DistilGPT-2 ~330MB, ViT-base ~350MB

**ONNX Runtime Web** uses the same browser Cache API or IndexedDB depending on how the model is loaded.

---

## Performance Expectations

| Hardware | 1B model (WebLLM) | 7B model (WebLLM) | Transformers.js NLP |
|----------|------------------|------------------|---------------------|
| M2/M3 MacBook (Metal GPU) | 40–80 tok/s | 10–20 tok/s | 20–80ms/inference |
| Desktop NVIDIA RTX 3080+ | 50–100 tok/s | 15–30 tok/s | 10–50ms/inference |
| Desktop NVIDIA GTX 1660 | 20–40 tok/s | 5–12 tok/s | 20–80ms/inference |
| Intel integrated graphics | 5–15 tok/s | 1–4 tok/s | 50–200ms/inference |
| Mobile (flagship, 2023+) | 3–8 tok/s (if WebGPU) | Not recommended | 100–500ms/inference |
| CPU-only (WASM) | ~1–3 tok/s | Very slow | 50–500ms/inference |

---

## Running Locally

No build step needed — all demos use CDN imports and work from any static server.

```bash
# From the repo root
python3 -m http.server 8080

# Or use Node.js
npx serve .

# Or use any static file server
# Then open: http://localhost:8080/demos/webllm/
```

> **Why not `file://`?** Some browsers block `SharedArrayBuffer` and WASM threads on `file://` URLs due to security policies. A local HTTP server avoids this. WebGPU also requires a secure context (HTTPS or localhost).

---

## Troubleshooting WebGPU

**"WebGPU not available" warning appears:**

1. Verify you're using Chrome 113+ or Edge 113+
2. Try enabling at `chrome://flags/#enable-unsafe-webgpu`
3. Update your GPU drivers
4. Check if hardware acceleration is enabled: Chrome → Settings → System → "Use hardware acceleration when available"
5. Some corporate/managed Chrome installs disable WebGPU via policy — use personal browser

**Model download is stuck at 0%:**

- Check your internet connection
- Try disabling browser extensions (ad blockers can sometimes interfere with large fetches)
- Check DevTools → Network to see if requests to `huggingface.co` are blocked

**"Out of memory" error:**

- Close other tabs and applications
- Try a smaller model (Qwen2.5-0.5B, TinyLlama, or DistilGPT-2)
- Restart the browser to clear GPU memory

**Generation is extremely slow:**

- WebGPU may not be active — check the status bar shows "WebGPU" not "WASM"
- For ONNX/Transformers.js demos, slow is expected on CPU — switch to WebLLM for GPU speed

**"SharedArrayBuffer is not defined":**

- Serve from localhost (not `file://`)
- Ensure the server sends `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers if using your own server

---

## Adding New Demos

1. Create a new folder under `demos/` (e.g., `demos/whisper/`)
2. Link `../../assets/css/styles.css` — all shared styles are there
3. Use the same navigation pattern (copy the `<nav>` block from any existing demo)
4. Keep all JS inline in `<script type="module">` — no build step, no bundler
5. Use CDN imports for libraries:
   - WebLLM: `import * as webllm from "https://esm.run/@mlc-ai/web-llm"`
   - Transformers.js: `import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js'`
   - ONNX Runtime Web: `<script src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.0/dist/ort.min.js">`
6. Add a card for your demo to the relevant hub page (`transformers-js/index.html`, `onnx-web/index.html`)
7. Follow the sidebar/main layout pattern: `.demo-layout` > `.demo-sidebar` + `.demo-main`

---

## Technology Stack

| Library | Version | CDN |
|---------|---------|-----|
| `@mlc-ai/web-llm` | latest | `https://esm.run/@mlc-ai/web-llm` |
| `@xenova/transformers` | 2.17.2 | `https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/` |
| `onnxruntime-web` | 1.20.0 | `https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.0/` |

---

## License

All demo pages are part of the `ai-capabilities` project. See root `LICENSE` file.
Model weights are subject to their respective licenses on Hugging Face (Llama 3 Community License, MIT, Apache 2.0, etc.).
