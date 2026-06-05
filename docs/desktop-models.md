# Desktop & Laptop AI Models — Hardware Guide

> Complete hardware and model selection guide for AGI developers running local inference on consumer and prosumer hardware.

---

## Table of Contents

1. [RAM Tier Guide](#ram-tier-guide)
2. [Apple Silicon Guide](#apple-silicon-guide)
3. [NVIDIA GPU Guide](#nvidia-gpu-guide)
4. [AMD GPU Guide](#amd-gpu-guide)
5. [Inference Tool Comparison](#inference-tool-comparison)
6. [Model Format Reference](#model-format-reference)

---

## RAM Tier Guide

The single most important factor for local LLM inference is **how much memory your hardware has**. For CPU-based inference (or unified memory like Apple Silicon), this is system RAM. For discrete GPU inference, it is VRAM.

Figures below are for Q4_K_M quantization unless specified. Add ~2–4 GB for OS + framework overhead when planning.

### 8 GB RAM

The minimum for useful local AI. Tight but workable for 7B models.

| Model | Params | Q4 Size | Fits Comfortably | Notes |
|---|---|---|---|---|
| SmolLM2 1.7B | 1.7B | 1.0 GB | Yes | Very fast, tiny |
| TinyLlama 1.1B | 1.1B | 0.6 GB | Yes | Legacy, limited quality |
| Llama 3.2 1B | 1B | 0.7 GB | Yes | Better quality, 128K ctx |
| Llama 3.2 3B | 3B | 1.9 GB | Yes | Good daily driver |
| Qwen2.5 3B | 3B | 1.9 GB | Yes | Strong at 3B |
| Phi-4 Mini 3.8B | 3.8B | 2.2 GB | Yes | Near-7B quality |
| Gemma 3 4B | 4B | 2.5 GB | Yes | Vision + long context |
| Mistral 7B v0.3 | 7B | 4.1 GB | **Tight** | ~2 GB OS headroom. Works but context limited |
| Llama 3.1 8B | 8B | 4.7 GB | **Tight** | Barely fits at Q4 with 2K context |
| Qwen2.5 7B | 7B | 4.7 GB | **Tight** | Fits at Q4 with short context |
| Gemma 2 2B (Q8) | 2B | 2.6 GB | Yes | Near-full quality at 2B |
| Phi-4 Mini (Q8) | 3.8B | 4.2 GB | Tight | High quality but tight |

**Recommendation**: Qwen2.5 3B or Phi-4 Mini 3.8B for best quality at this tier. Mistral 7B Q4_K_S works with careful context management.

### 16 GB RAM

The sweet spot for serious local AI work. Covers 13B models comfortably.

| Model | Params | Q4 Size | Q8 Size | Notes |
|---|---|---|---|---|
| Llama 3.1 8B | 8B | 4.7 GB | 8.5 GB | Full quality at Q8 |
| Mistral 7B | 7B | 4.1 GB | 7.7 GB | Fast, Q8 available |
| Qwen2.5 7B | 7B | 4.7 GB | 8.5 GB | 128K context, multilingual |
| Qwen2.5-Coder 7B | 7B | 4.7 GB | 8.5 GB | HumanEval 88.4% |
| Phi-4 14B | 14B | 8.2 GB | 15.4 GB | Q4 comfortable, Q8 tight |
| Mistral Nemo 12B | 12B | 7.0 GB | 13.2 GB | Long context, multilingual |
| Gemma 2 9B | 9B | 5.4 GB | 9.9 GB | Strong at 9B |
| Gemma 3 12B | 12B | 7.0 GB | 13.2 GB | Vision, 128K ctx |
| CodeLlama 13B | 13B | 7.4 GB | 13.9 GB | Code-specific |
| DeepSeek-R1-Distill-Llama 8B | 8B | 4.9 GB | 8.8 GB | Strong reasoning |
| Vicuna 13B | 13B | 7.3 GB | 13.7 GB | Chat-tuned, legacy |
| Yi 1.5 9B | 9B | 5.4 GB | 9.9 GB | Chinese + English |

**Recommendation**: Phi-4 14B (Q4) or Qwen2.5 7B (Q8) for general use; Qwen2.5-Coder 7B for code.

### 24 GB RAM (or 24 GB VRAM — RTX 3090/4090)

Strong tier. Handles 22B models and some 32B models at Q4.

| Model | Q4 Size | Q8 Size | Notes |
|---|---|---|---|
| Mistral Small 22B | 13 GB | 24 GB | Q8 fits exactly |
| Codestral 22B | 13 GB | 24 GB | Best code model at 22B |
| Yi 1.5 34B | 20 GB | Doesn't fit | Q4 fits, strong 34B |
| Qwen2.5 32B | 19 GB | Doesn't fit | Q4 fits, excellent model |
| DeepSeek-R1-Distill-Qwen 32B | 19 GB | Doesn't fit | Strong reasoning |
| Gemma 2 27B | 16 GB | Doesn't fit (Q8=30 GB) | Q4 comfortable |
| Gemma 3 27B | 16 GB | Doesn't fit | Vision + 128K ctx |
| Llama 3.1 8B (Q8) | — | 8.5 GB | Premium quality 8B |
| Mixtral 8×7B (Q4) | ~26 GB | Doesn't fit | Full MoE (all experts in RAM) |

**Recommendation**: Qwen2.5 32B Q4 for general; DeepSeek-R1-Distill-Qwen 32B for reasoning; Codestral 22B for code.

### 32 GB RAM

Workstation tier. Covers all practical consumer-grade models.

| Model | Q4 Size | Notes |
|---|---|---|
| Qwen2.5 32B | 19 GB | Excellent + 128K context |
| DeepSeek-R1-Distill-Qwen 32B | 19 GB | Best OSS reasoning at this size |
| Command R 35B | 21 GB | RAG-optimized |
| Yi 1.5 34B | 20 GB | Strong at 34B |
| Llama 3.3 70B (Q2_K) | ~23 GB | Low quality, not recommended |
| Gemma 2 27B (Q8) | 30 GB | Near-full quality |
| Mistral Small 22B (Q8) | 24 GB | Full quality 22B |

### 64 GB RAM (Mac Studio M2 Max / M2 Ultra / M3 Max, Server workstations)

Frontier consumer tier. 70B models run well.

| Model | Q4 Size | Q8 Size | Notes |
|---|---|---|---|
| Llama 3.3 70B | 43 GB | ~77 GB (tight) | Flagship open source |
| Llama 3.1 70B | 43 GB | ~77 GB (tight) | Slightly smaller version |
| Qwen2.5 72B | 43 GB | Doesn't fit | Multilingual 70B |
| Mixtral 8×7B (Q4) | ~26 GB | 46 GB | Full MoE fits comfortably |
| DeepSeek-R1-Distill-Qwen 32B (Q8) | — | 35 GB | Near-full quality 32B |

### 96 GB+ RAM (Mac Studio M2 Ultra / M4 Ultra, High-RAM workstations)

Near-datacenter capability on a desktop.

| Model | Q4 Size | Q8 Size | FP16 Size | Notes |
|---|---|---|---|---|
| Llama 3.3 70B | 43 GB | 77 GB | 140 GB | Q8 comfortable |
| Llama 3.1 405B (Q2) | ~110 GB | Doesn't fit | Doesn't fit | Very low quality; not recommended |
| Mixtral 8×22B (Q4) | ~80 GB | Doesn't fit | Doesn't fit | 39B active params |
| Llama 3.1 70B (FP16) | — | — | 140 GB (M2 Ultra 192GB) | Full precision at max |

### 128 GB+ RAM (Mac Studio M4 Ultra max, high-end workstations)

| Model | Q4 Size | Q8 Size | Notes |
|---|---|---|---|
| Llama 3.1 405B (Q4) | 243 GB | — | Needs 256 GB; M4 Ultra 192 GB not quite enough |
| Llama 3.3 70B (FP16) | — | 140 GB | Full precision |
| Mixtral 8×22B (Q8) | — | 155 GB | Near-full quality |

---

## Apple Silicon Guide

Apple Silicon's **unified memory architecture** is a game-changer for local AI. The same high-bandwidth memory pool is shared between CPU, GPU, and Apple Neural Engine (ANE), enabling models far larger than typical laptop VRAM while maintaining competitive inference speeds.

### Apple Silicon Chip Comparison

| Chip | Unified Memory Options | GPU Cores | ANE | Memory Bandwidth | Best Model Fit | Recommended Framework |
|---|---|---|---|---|---|---|
| **M1** | 8 GB, 16 GB | 7 or 8 | 16-core, 11 TOPS | 68 GB/s | 7B Q4 (16 GB), 3B Q4 (8 GB) | MLX or Ollama |
| **M1 Pro** | 16 GB, 32 GB | 14 or 16 | 16-core, 11 TOPS | 200 GB/s | 7B Q8 (16 GB), 13B Q8 (32 GB) | MLX |
| **M1 Max** | 32 GB, 64 GB | 24 or 32 | 16-core, 11 TOPS | 400 GB/s | 13B Q8 (32 GB), 30B Q4 (64 GB) | MLX |
| **M1 Ultra** | 64 GB, 128 GB | 48 or 64 | 32-core | 800 GB/s | 70B Q4 (128 GB) | MLX |
| **M2** | 8 GB, 16 GB, 24 GB | 8 or 10 | 16-core, 15.8 TOPS | 100 GB/s | 7B Q4 (8 GB), 13B Q4 (16 GB), 13B Q8 (24 GB) | MLX |
| **M2 Pro** | 16 GB, 32 GB | 16 or 19 | 16-core, 15.8 TOPS | 200 GB/s | 13B Q8 (16 GB), 32B Q4 (32 GB) | MLX |
| **M2 Max** | 32 GB, 64 GB, 96 GB | 30 or 38 | 16-core | 400 GB/s | 32B Q8 (64 GB), 70B Q4 (96 GB) | MLX |
| **M2 Ultra** | 64 GB, 128 GB, 192 GB | 60 or 76 | 32-core | 800 GB/s | 70B Q8 (128 GB), Mixtral 8x22B (192 GB) | MLX |
| **M3** | 8 GB, 16 GB, 24 GB | 10 | 16-core, 18 TOPS | 100 GB/s | 7B Q4 (8 GB), 13B Q8 (24 GB) | MLX |
| **M3 Pro** | 18 GB, 36 GB | 18 | 16-core, 18 TOPS | 150 GB/s | 13B Q4 (18 GB), 32B Q4 (36 GB) | MLX |
| **M3 Max** | 36 GB, 48 GB, 64 GB, 128 GB | 40 | 16-core | 300 GB/s | 32B Q8 (48 GB), 70B Q4 (64 GB), 70B Q8 (128 GB) | MLX |
| **M4** | 16 GB, 32 GB | 10 | 16-core, 38 TOPS | 120 GB/s | 7B Q8 (16 GB), 13B Q8 (32 GB) | MLX |
| **M4 Pro** | 24 GB, 48 GB, 64 GB | 20 or 30 | 16-core, 38 TOPS | 273 GB/s | 13B Q8 (24 GB), 30B Q8 (48 GB), 34B Q8 (64 GB) | MLX |
| **M4 Max** | 36 GB, 64 GB, 128 GB | 40 | 16-core, 38 TOPS | 546 GB/s | 32B Q8 (64 GB), 70B Q4 (64 GB), 70B Q8 (128 GB) | MLX |
| **M4 Ultra** | 128 GB, 192 GB | 80 | 32-core | 1,092 GB/s | Mixtral 8x22B Q8, Llama 405B Q4 (needs 256 GB+) | MLX |

### Apple Silicon Inference Speed (MLX, tokens/sec generated)

| Hardware | 7B Q4 | 13B Q4 | 32B Q4 | 70B Q4 | Notes |
|---|---|---|---|---|---|
| M1 8GB | 20–25 t/s | N/A (OOM) | N/A | N/A | RAM bottleneck |
| M1 16GB | 28–35 t/s | 14–18 t/s | N/A | N/A | |
| M2 8GB | 25–30 t/s | N/A | N/A | N/A | |
| M2 16GB | 35–42 t/s | 18–22 t/s | N/A | N/A | |
| M2 24GB | 38–45 t/s | 20–25 t/s | 9–12 t/s | N/A | |
| M3 Pro 36GB | 55–65 t/s | 28–35 t/s | 13–17 t/s | 5–6 t/s | |
| M3 Max 64GB | 80–95 t/s | 45–55 t/s | 20–26 t/s | 10–13 t/s | |
| M3 Max 128GB | 85–100 t/s | 50–60 t/s | 22–28 t/s | 13–17 t/s | |
| M4 Pro 48GB | 90–110 t/s | 50–60 t/s | 22–28 t/s | N/A (needs 64 GB) | Higher bandwidth |
| M4 Max 128GB | 120–140 t/s | 65–80 t/s | 30–38 t/s | 18–22 t/s | Best consumer perf |
| M4 Ultra 192GB | 160–200 t/s | 90–110 t/s | 45–55 t/s | 28–35 t/s | |

> MLX numbers. Ollama (via llama.cpp Metal backend) is typically 10–20% slower. Numbers are for generation; prefill (prompt processing) is faster.

### Apple Silicon Framework Recommendations

- **MLX** (`mlx-lm`): Best performance. Apple's own framework, uses Metal natively. Install: `pip install mlx-lm`. Run: `mlx_lm.generate --model mlx-community/Llama-3.3-70B-Instruct-4bit --prompt "Hello"`. Model library at `https://huggingface.co/mlx-community`.
- **Ollama**: Second-best, easiest setup. Uses llama.cpp Metal backend. Good for REST API use.
- **llama.cpp**: Full control, slightly slower than MLX. Good for custom sampling/quantization.
- **Core ML** (via `coremltools`): Mainly for deploying on iPhone/iPad. Not typically used for Mac inference.

---

## NVIDIA GPU Guide

NVIDIA GPUs provide the highest single-card inference throughput for LLMs. Key specs: VRAM size, memory bandwidth, and Tensor Core generation.

### Consumer GPUs

| GPU | VRAM | Memory BW | FP16 TFLOPS | Best Models | Recommended Tool |
|---|---|---|---|---|---|
| **RTX 3060** | 12 GB | 360 GB/s | 12.7 | 7B Q8, 13B Q4 | llama.cpp, Ollama |
| **RTX 3070** | 8 GB | 448 GB/s | 20.4 | 7B Q4 | llama.cpp, Ollama |
| **RTX 3080** | 10 GB | 760 GB/s | 29.8 | 7B Q4 (tight) | llama.cpp |
| **RTX 3090** | 24 GB | 936 GB/s | 35.6 | 13B Q8, 34B Q4 | ExLlamaV2, Ollama |
| **RTX 3090 Ti** | 24 GB | 1,008 GB/s | 40.0 | 13B Q8, 34B Q4 | ExLlamaV2 |
| **RTX 4060 Ti** | 16 GB | 288 GB/s | 22.1 | 7B Q8, 13B Q4 | llama.cpp, Ollama |
| **RTX 4070** | 12 GB | 504 GB/s | 29.1 | 7B Q8, 13B Q4 | ExLlamaV2 |
| **RTX 4070 Ti Super** | 16 GB | 672 GB/s | 44.1 | 13B Q8, 22B Q4 | ExLlamaV2 |
| **RTX 4080** | 16 GB | 736 GB/s | 48.7 | 13B Q8, 22B Q4 | ExLlamaV2, vLLM |
| **RTX 4080 Super** | 16 GB | 736 GB/s | 52.2 | 13B Q8, 22B Q4 | ExLlamaV2 |
| **RTX 4090** | 24 GB | 1,008 GB/s | 82.6 | 13B Q8+, 34B Q4 | ExLlamaV2, vLLM |
| **RTX 5080** | 16 GB | 960 GB/s | 68 | 13B Q8, 22B Q4 | vLLM, ExLlamaV2 |
| **RTX 5090** | 32 GB | 1,792 GB/s | 104 | 32B Q4, 13B FP16 | vLLM, ExLlamaV2 |

### Professional / Workstation GPUs

| GPU | VRAM | Memory BW | Best Models | Notes |
|---|---|---|---|---|
| **RTX A4000** | 16 GB | 448 GB/s | 13B Q8, 22B Q4 | ECC, workstation |
| **RTX A5000** | 24 GB | 768 GB/s | 34B Q4, 13B Q8 | ECC, workstation |
| **RTX A6000** | 48 GB | 768 GB/s | 70B Q4 | Best single-card |
| **RTX 6000 Ada** | 48 GB | 960 GB/s | 70B Q4 | Faster than A6000 |
| **H100 SXM** | 80 GB | 3,350 GB/s | 70B FP16, 120B Q4 | Datacenter; highest BW |
| **H100 PCIe** | 80 GB | 2,000 GB/s | 70B FP16, 120B Q4 | PCIe variant |
| **H200** | 141 GB | 4,800 GB/s | 70B FP32, 340B Q4 | Largest single card |
| **A100 40 GB** | 40 GB | 1,555 GB/s | 30B Q8, 70B Q4 | Legacy datacenter |
| **A100 80 GB** | 80 GB | 2,000 GB/s | 70B FP16, 120B Q4 | Standard datacenter |

### Multi-GPU Configurations (NVLink)

| Config | Total VRAM | Models | Notes |
|---|---|---|---|
| 2× RTX 4090 | 48 GB | Mixtral 8×7B Q4, 70B Q2 | Consumer NVLink not available; tensor parallel via llama.cpp |
| 2× A100 80GB | 160 GB | Llama 405B Q4 (needs 243 GB), 70B FP16 | NVLink 600 GB/s bidirectional |
| 4× A100 80GB | 320 GB | Llama 405B Q4, Mixtral 8×22B FP16 | |
| 8× A100 80GB | 640 GB | Llama 405B FP16 (810 GB, still needs offload), DeepSeek V3 Q4 | |
| 8× H100 80GB | 640 GB | Same as 8× A100 but ~3× faster | NVLink 900 GB/s per GPU |
| 8× H200 141GB | 1,128 GB | Llama 405B FP32, DeepSeek V3 FP16 | Full-precision frontier models |

### CUDA Inference Speed (tokens/sec generated, single card)

| Hardware | 7B Q4 | 13B Q4 | 70B Q4 | Notes |
|---|---|---|---|---|
| RTX 3060 12GB | 45–55 t/s | 22–28 t/s | N/A | |
| RTX 3090 24GB | 80–95 t/s | 40–50 t/s | N/A | CPU offload needed |
| RTX 4080 16GB | 90–110 t/s | 45–55 t/s | N/A | |
| RTX 4090 24GB | 110–130 t/s | 55–65 t/s | N/A | Fastest consumer |
| RTX 5090 32GB | 140–160 t/s | 75–90 t/s | N/A | |
| A100 80GB | 160–180 t/s | 90–110 t/s | 22–28 t/s | Full 70B fits |
| H100 80GB | 250–300 t/s | 140–170 t/s | 35–45 t/s | Fastest single card |

---

## AMD GPU Guide

AMD GPUs support LLM inference via ROCm (Linux, some Windows support via DirectML).

| GPU | VRAM | ROCm Support | Best Tool | Notes |
|---|---|---|---|---|
| **RX 7900 XTX** | 24 GB | Yes (ROCm 5.7+) | Ollama (ROCm), llama.cpp | Best AMD consumer card; good ROCm support |
| **RX 7900 XT** | 20 GB | Yes | Ollama, llama.cpp | 20B Q4 fits |
| **RX 7800 XT** | 16 GB | Yes (partial) | llama.cpp | 13B Q8 |
| **MI300X** | 192 GB | Yes (datacenter) | vLLM, TGI | AMD's H100 competitor; excellent for inference |
| **MI250X** | 128 GB | Yes | vLLM | Large context models |

> AMD ROCm inference is typically 15–30% slower than equivalent NVIDIA on the same framework. ROCm Linux support is better than Windows. For consumer AMD GPUs, `llama.cpp` with HIP backend or Ollama's ROCm build are the most reliable options.

---

## Inference Tool Comparison

Full comparison of all major desktop inference tools. Crucial for choosing the right stack.

| Tool | Developer | OS | GPU Backends | Quantization | Chat UI | API Server | Model Format | License | Best For |
|---|---|---|---|---|---|---|---|---|---|
| **Ollama** | Ollama Inc. | macOS, Linux, Windows | CUDA, Metal, ROCm | Q2–Q8, FP16 (GGUF) | CLI only | Yes (OpenAI-compat REST) | GGUF | MIT | Easiest setup; one-command model download + run |
| **LM Studio** | LM Studio | macOS, Windows, Linux | CUDA, Metal | Q2–FP16 (GGUF) | Yes (polished UI) | Yes (OpenAI-compat) | GGUF | Proprietary (free) | Best for non-technical users |
| **llama.cpp** | Georgi Gerganov + community | All | CUDA, Metal, Vulkan, OpenCL, SYCL, Kompute | Q2–FP16, k-quants | No (CLI) | Yes (llama-server, REST) | GGUF | MIT | Maximum portability and control |
| **GPT4All** | Nomic AI | macOS, Linux, Windows | CUDA, Metal | Q4_0, Q4_K_M | Yes | Yes | GGUF | MIT | Privacy-focused; zero telemetry; no cloud |
| **Jan** | Jan.ai | macOS, Linux, Windows | CUDA, Metal | Q4–Q8 | Yes (Electron) | Yes (OpenAI-compat) | GGUF | AGPL-3.0 | Clean desktop app; model management UI |
| **KoboldCpp** | LostRuins | Linux, macOS, Windows | CUDA, Metal, Vulkan, OpenCL | Q2–Q8 | Yes (web UI) | Yes | GGUF | AGPL-3.0 | Creative writing; roleplay; advanced sampling (mirostat, etc.) |
| **text-generation-webui (oobabooga)** | oobabooga | Linux, macOS, Windows | CUDA (primary), Metal (partial), ROCm | GGUF, GPTQ, AWQ, EXL2, FP16 | Yes (full-featured web) | Yes (OpenAI-compat) | Multiple | AGPL-3.0 | Power users; many extensions; GPTQ/AWQ/EXL2 support |
| **MLX / mlx-lm** | Apple | macOS only | Metal (Apple Silicon only) | BF16, FP16, INT4, INT8 | No (CLI/Python) | Partial (via llm framework) | MLX (convert from HF) | MIT | **Best Apple Silicon performance** |
| **ExLlamaV2** | turboderp | Linux, Windows | CUDA only | EXL2, GPTQ, INT8 | No (CLI/Python) | Yes | EXL2, GPTQ | MIT | Fastest CUDA inference; best quality/speed on NVIDIA |
| **vLLM** | vLLM Team (UC Berkeley) | Linux (primary) | CUDA, ROCm, TPU, Neuron | AWQ, GPTQ, FP8, INT8 | No | Yes (OpenAI-compat, production-grade) | HuggingFace, GGUF (limited) | Apache 2.0 | Production server deployment; PagedAttention for high throughput |
| **TGI (Text Generation Inference)** | HuggingFace | Linux, Docker | CUDA, ROCm, Gaudi, Inferentia | AWQ, GPTQ, FP8, EETQ | No | Yes (REST) | HuggingFace | Apache 2.0 | HuggingFace ecosystem; Flash Attention 2 |
| **TensorRT-LLM** | NVIDIA | Linux | CUDA only | INT4, INT8, FP8, FP16 | No | No (library only; pair with Triton) | TRT Engine (compiled) | Apache 2.0 | Maximum NVIDIA throughput; requires compile step |
| **llama-server** | llama.cpp team | All | All llama.cpp backends | GGUF full range | Yes (basic web chat) | Yes (OpenAI-compat) | GGUF | MIT | Headless llama.cpp with web UI + API |
| **Open WebUI** | Open WebUI | All (Docker) | Via Ollama backend | Via Ollama | Yes (full ChatGPT-like) | No (is the UI) | Via Ollama | MIT | Best web UI for Ollama; RAG, tools, image gen integration |
| **LiteLLM Proxy** | BerriAI | All | Depends on backend | Proxy | No | Yes (unified OpenAI proxy) | Any (proxy) | MIT | Unified API gateway across providers + local models |

### Quick Selection Guide

| Scenario | Best Tool | Runner-Up |
|---|---|---|
| First time, macOS | Ollama + Open WebUI | LM Studio |
| First time, Windows | LM Studio | Ollama |
| Apple Silicon, maximum speed | mlx-lm | Ollama |
| NVIDIA, maximum speed | ExLlamaV2 or vLLM | text-generation-webui |
| API server for development | Ollama | llama-server |
| Production API server | vLLM | TGI |
| Batch processing (high throughput) | vLLM | TGI |
| Creative writing / roleplay | KoboldCpp | text-generation-webui |
| Non-technical user | LM Studio | GPT4All |
| Privacy-first / no telemetry | GPT4All | KoboldCpp |
| Advanced quantization (GPTQ/AWQ/EXL2) | text-generation-webui | ExLlamaV2 |
| Embedded / edge Linux | llama.cpp | llamafile |

---

## Model Format Reference

Different quantization formats and model serialization formats used by different tools.

| Format | Created By | Bit Widths | Quantization Quality | GPU Support | Key Tools | Notes |
|---|---|---|---|---|---|---|
| **GGUF** | llama.cpp team (Georgi Gerganov) | Q2 through FP16; k-quant variants | Good (k-quants are state-of-the-art) | CUDA, Metal, Vulkan, OpenCL | llama.cpp, Ollama, LM Studio, GPT4All, KoboldCpp | Successor to GGML. Single-file format containing weights + tokenizer + metadata. The most portable format. Find quantized models on HuggingFace from `bartowski`, `TheBloke`, `unsloth` namespaces. |
| **GPTQ** | Tim Dettmers et al. | INT4, INT8 | Good (layer-wise, calibrated) | CUDA only | AutoGPTQ, text-generation-webui, ExLlamaV2 | GPU-only; calibrated quantization using sample data. Requires calibration dataset. Generally better than naive INT4 but worse than k-quant GGUF. |
| **AWQ (Activation-aware Weight Quantization)** | MIT HAN Lab | INT4 | Better than GPTQ (activation-aware) | CUDA | AutoAWQ, vLLM, TGI | Analyzes activation magnitudes to protect important weights. Better quality than GPTQ at same bit width. Slower to quantize but faster to run. |
| **EXL2** | turboderp | Variable (1–8 bits mixed) | Best of any format (tunable per layer) | CUDA only | ExLlamaV2 | Assigns different bit widths to different layers based on importance. Achieves best quality/size tradeoff on NVIDIA. Requires ExLlamaV2. |
| **MLX** | Apple | BF16, FP16, INT4, INT8 | Good (Apple-native) | Metal (Apple Silicon only) | mlx-lm, MLX framework | Apple's own format for Apple Silicon. Convert from HuggingFace with `mlx_lm.convert`. Fastest format on Apple Silicon. Models on HuggingFace under `mlx-community` namespace. |
| **ONNX** | Microsoft + Linux Foundation | FP32, FP16, INT8, INT4 | Depends on export quality | CUDA, DirectML, CoreML, NNAPI, QNN, CPU | ONNX Runtime, Optimum (HuggingFace) | Cross-platform standard. Phi-3 Mini and Phi-4 Mini have official Microsoft ONNX releases. Best for Windows DirectML and cross-platform deployment. |
| **SafeTensors** | HuggingFace | BF16, FP16, FP32 | Lossless | CUDA, Metal, ROCm | HuggingFace Transformers, vLLM, TGI | Standard HuggingFace format. Safer than pickle-based .bin files. FP16/BF16 only — not quantized. |
| **HuggingFace .bin (pickle)** | HuggingFace | FP32, FP16 | Lossless | CUDA, Metal | HuggingFace Transformers | Legacy format; being phased out in favor of SafeTensors. Security risk (arbitrary code execution via pickle). |
| **llamafile** | Mozilla Ocho | GGUF-based | Same as GGUF | CUDA, Metal | llamafile (self-contained executable) | Single executable that contains the model weights. No installation needed. Run with `./model.llamafile`. |
| **ExecuTorch .pte** | Meta AI | INT8, INT4 | Good | ANE (Apple), Qualcomm HTP, GPU | ExecuTorch | Meta's mobile-first format. Requires compile step from HuggingFace checkpoint. Used for on-device Llama deployment. |
| **TFLite .tflite** | Google | INT8, INT4, FP16 | Variable | NNAPI (Android), CoreML (iOS) | TensorFlow Lite | Primarily for classification/generation models under ~3B. LLMs need specialized kernels. |

### Format Selection by Use Case

| Use Case | Recommended Format | Why |
|---|---|---|
| Desktop general use (any platform) | GGUF (Q4_K_M) | Portable, great tooling, good quality |
| Apple Silicon maximum speed | MLX (INT4 or FP16) | Native Metal, best throughput |
| NVIDIA maximum quality/speed | EXL2 | Per-layer bit allocation |
| NVIDIA production server | AWQ INT4 or FP8 | vLLM-optimized, high throughput |
| Windows desktop | GGUF or ONNX | DirectML support for ONNX; llama.cpp for GGUF |
| Mobile Android/iOS | ExecuTorch or GGUF (via llama.cpp) | ExecuTorch for ANE, GGUF for portability |
| Cross-platform embedding/NPU | ONNX | Widest hardware support via ONNX Runtime |
