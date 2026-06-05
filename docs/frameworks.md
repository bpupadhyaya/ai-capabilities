# AI Inference Frameworks & Tools — Complete Reference

> Comprehensive guide to every tool in the open source AI stack: inference runtimes, model hubs, fine-tuning, evaluation, vector databases, and embedding models.

---

## Table of Contents

1. [Inference Runtimes](#inference-runtimes)
2. [Model Hubs & Download Sources](#model-hubs--download-sources)
3. [Fine-tuning Frameworks](#fine-tuning-frameworks)
4. [Evaluation Frameworks](#evaluation-frameworks)
5. [Vector Databases](#vector-databases)
6. [Embedding Models](#embedding-models)
7. [AGI Stack Recommendations](#agi-stack-recommendations)

---

## Inference Runtimes

Every production-relevant framework for running LLMs locally or on servers.

| Framework | Developer | Platform | Model Formats | GPU Backends | API Server | Chat UI | License | GitHub Stars (approx) | Best For |
|---|---|---|---|---|---|---|---|---|---|
| **llama.cpp** | Georgi Gerganov | Linux, macOS, Windows, Android, iOS | GGUF | CUDA, Metal, Vulkan, OpenCL, SYCL, Kompute, BLAS | Yes (llama-server, OpenAI-compat REST) | Basic web UI (llama-server) | MIT | ~75K | Maximum portability; lowest level control; embedded systems; edge deployment |
| **Ollama** | Ollama Inc. | Linux, macOS, Windows | GGUF (auto-download) | CUDA, Metal, ROCm | Yes (OpenAI-compat REST on :11434) | No (CLI); use Open WebUI | MIT | ~110K | Easiest local setup; one-command model management; development API server |
| **LM Studio** | LM Studio | macOS, Windows, Linux | GGUF | CUDA, Metal | Yes (OpenAI-compat) | Yes (polished desktop app) | Proprietary (free) | N/A (app) | Non-technical users; GUI model browsing; Windows/Mac desktop |
| **GPT4All** | Nomic AI | Linux, macOS, Windows | GGUF | CUDA, Metal | Yes (OpenAI-compat) | Yes (Qt app) | MIT | ~72K | Privacy-first; zero telemetry; local document indexing built-in |
| **Jan** | Jan.ai | Linux, macOS, Windows | GGUF | CUDA, Metal | Yes (OpenAI-compat) | Yes (Electron app) | AGPL-3.0 | ~26K | Clean Electron-based desktop app; extensions ecosystem |
| **KoboldCpp** | LostRuins | Linux, macOS, Windows | GGUF | CUDA, Metal, Vulkan, OpenCL | Yes (Kobold API + OpenAI-compat) | Yes (web UI) | AGPL-3.0 | ~7K | Creative writing; roleplay; advanced sampling (mirostat, typical_p, TFS); horde API |
| **text-generation-webui (oobabooga)** | oobabooga | Linux, macOS, Windows | GGUF, GPTQ, AWQ, EXL2, FP16, bitsandbytes | CUDA (primary), Metal (partial), ROCm | Yes (OpenAI-compat) | Yes (feature-rich web UI) | AGPL-3.0 | ~44K | Power users; multi-backend; many extensions; GPTQ/AWQ/EXL2 on GPU |
| **mlx-lm** | Apple | macOS only | MLX format (convert from HF/GGUF) | Metal (Apple Silicon only) | No native (use llm CLI or FastAPI wrap) | No | MIT | ~12K | **Best Apple Silicon inference performance**; native MLX framework |
| **vLLM** | vLLM Team (UC Berkeley) | Linux (primary), macOS partial | HuggingFace SafeTensors, AWQ, GPTQ, FP8, GGUF (via convert) | CUDA, ROCm, TPU (JAX), AWS Neuron, Intel Gaudi | Yes (OpenAI-compat, production-grade) | No | Apache 2.0 | ~50K | Production high-throughput server; PagedAttention; best OSS serving framework |
| **TGI (Text Generation Inference)** | HuggingFace | Linux, Docker | HuggingFace, GGUF, AWQ, GPTQ, FP8, EETQ | CUDA, ROCm, Gaudi, Inferentia | Yes (REST + gRPC) | No | Apache 2.0 | ~10K | HuggingFace ecosystem; Flash Attention 2; easy HF Hub model serving |
| **TensorRT-LLM** | NVIDIA | Linux | HuggingFace (compile to TRT) | CUDA only (H100/A100 primary) | Library (integrate with Triton) | No | Apache 2.0 | ~9K | Maximum NVIDIA GPU throughput; 2–3× faster than vLLM; production NVIDIA clusters |
| **DeepSpeed Inference** | Microsoft | Linux | HuggingFace | CUDA, ROCm | Library only | No | Apache 2.0 | ~36K | Multi-GPU ZeRO-Inference; large models with CPU/NVMe offload |
| **ExLlamaV2** | turboderp | Linux, Windows | EXL2, GPTQ | CUDA only | Yes (REST via tabbyAPI) | No | MIT | ~4K | **Fastest CUDA inference per GPU**; best quality/speed on NVIDIA; EXL2 format |
| **llama-server** | llama.cpp project | All (same as llama.cpp) | GGUF | All llama.cpp backends | Yes (OpenAI-compat REST + web UI) | Yes (built-in basic chat) | MIT | (part of llama.cpp repo) | Headless API server from llama.cpp; lightweight; works on all hardware |
| **llamafile** | Mozilla Ocho / justine tunney | All (single executable) | GGUF (embedded) | CUDA, Metal, AVX2 | Yes (same as llama-server) | Yes (browser-based) | Apache 2.0 | ~20K | Zero-install distribution; single .exe contains model + server; great for sharing |
| **llama-swap** | Community | Linux, macOS | GGUF (via llama.cpp) | All llama.cpp backends | Yes (OpenAI-compat proxy) | No | MIT | ~1K | Automatically hot-swaps models based on request routing; manages multiple GGUF models |
| **MLC LLM** | MLC.ai / CMU / OctoAI | Android, iOS, macOS, Linux, Windows, Web | MLC format (TVM-compiled) | Vulkan, Metal, CUDA, WebGPU, OpenCL | Yes (REST + iOS/Android lib) | Yes (WebLLM for browser) | Apache 2.0 | ~20K | Mobile deployment (Android + iOS); WebLLM browser inference; broadest device support |
| **GGML** | Georgi Gerganov | All | GGML (deprecated) | CPU primarily | No | No | MIT | ~12K (archived) | **Deprecated predecessor to GGUF**. Shown for historical context. Use llama.cpp/GGUF instead. |
| **AutoGPTQ** | PanQiWei + community | Linux, Windows | GPTQ | CUDA | No (library) | No | MIT | ~5K | GPTQ quantization + inference library; provides `AutoModelForCausalLM` wrapper |
| **AutoAWQ** | MIT HAN Lab | Linux, Windows | AWQ | CUDA | No (library) | No | MIT | ~3K | AWQ quantization + inference; better quality than GPTQ |
| **ONNX Runtime (ORT)** | Microsoft | All (Windows, Linux, macOS, Android, iOS) | ONNX | CUDA, DirectML (Windows), CoreML (iOS/Mac), NNAPI (Android), QNN (Qualcomm), OpenVINO | No (library) | No | MIT | ~17K | Cross-platform; Phi-3/4 Mini Microsoft official deployments; Windows DirectML |
| **OpenLLM** | BentoML | Linux, macOS | HuggingFace, GGUF, GPTQ, AWQ | CUDA, Metal | Yes (OpenAI-compat) | No | Apache 2.0 | ~10K | BentoML cloud deployment integration; easy model serving |
| **LiteLLM** | BerriAI | All | Proxy (any provider/backend) | Depends on backend | Yes (unified OpenAI-compat proxy) | No | MIT | ~20K | Unified API gateway across 100+ providers + local models; cost tracking; fallbacks |
| **Triton Inference Server** | NVIDIA | Linux (Docker) | Multiple (TensorRT, ONNX, PyTorch, TF) | CUDA (NVIDIA) | Yes (gRPC + REST) | No | BSD 3-Clause | ~9K | Enterprise NVIDIA serving platform; model ensemble; A/B testing; dynamic batching |
| **SGLang** | LMSYS + Stanford | Linux | HuggingFace, AWQ, FP8 | CUDA, ROCm | Yes (OpenAI-compat) | No | Apache 2.0 | ~12K | RadixAttention (KV cache reuse); constrained decoding (grammar, JSON); structured output |
| **LightLLM** | ModelBest | Linux | HuggingFace, INT8 | CUDA | Yes (REST) | No | Apache 2.0 | ~3K | TokenAttention (alternative to PagedAttention); MiniCPM deployment |
| **ktransformers** | Kuaishou | Linux, Windows | HuggingFace | CUDA + CPU hybrid | Yes (REST) | No | Apache 2.0 | ~8K | CPU+GPU hybrid inference for large MoE models; runs DeepSeek V3/R1 on consumer hardware |
| **Open WebUI** | Open WebUI | All (Docker) | Via Ollama or OpenAI-compat backends | Via backend | Consumes APIs | Yes (full-featured web app) | MIT | ~55K | Best web frontend for Ollama; RAG, tools, image gen, voice; replaces ChatGPT UI locally |
| **tabbyAPI** | Therianwolf | Linux, Windows | EXL2, GPTQ | CUDA | Yes (OpenAI-compat) | No | Apache 2.0 | ~2K | REST API wrapper for ExLlamaV2; best API server for NVIDIA deployments |

---

## Model Hubs & Download Sources

Where to find model weights.

| Hub | URL | Focus | Access Model | Quantized GGUF | Notable Features |
|---|---|---|---|---|---|
| **HuggingFace Hub** | https://huggingface.co | All model types; the primary hub | Free (gated models require approval) | Yes (community-provided) | Largest collection; model cards; Spaces demos; datasets; git-LFS storage; safetensors format |
| **Ollama Library** | https://ollama.com/library | GGUF models for Ollama | Free; auto-download via `ollama pull` | Yes (auto-selected by Ollama) | One-command download + run; curated list; Modelfile system for customization |
| **LM Studio Hub** | Built into LM Studio app | GGUF models | Free (built into app) | Yes | Integrated search + download within LM Studio; no separate URL needed |
| **GGUF models (TheBloke)** | https://huggingface.co/TheBloke | GGUF quantized models | Free | Yes (all quantization levels) | Large archive; many legacy models; superseded by newer quantizers |
| **GGUF models (bartowski)** | https://huggingface.co/bartowski | GGUF quantized models (newer) | Free | Yes (imatrix + k-quants) | IQ-quants (imatrix calibration); current frontier models; excellent quality |
| **GGUF models (unsloth)** | https://huggingface.co/unsloth | GGUF + fine-tuned models | Free | Yes | Dynamic quants; LoRA adapters; training + inference combined |
| **MLX Community** | https://huggingface.co/mlx-community | MLX-format models for Apple Silicon | Free | Yes (INT4, BF16) | MLX-converted models; organized by model family |
| **ModelScope** | https://modelscope.cn | Chinese + international models | Free (account required) | Partial | Strong for Qwen, Tongyi, Chinese models; Alibaba ecosystem |
| **Civitai** | https://civitai.com | Stable Diffusion, Flux, image models | Free + paid | N/A (image models) | Community LoRAs, checkpoints, embeddings for image generation |
| **NVIDIA NGC** | https://catalog.ngc.nvidia.com | NVIDIA-optimized models | Free (NGC account) | ONNX, TRT formats | TensorRT-LLM optimized; NVIDIA official |
| **AWS Bedrock Model Gallery** | https://aws.amazon.com/bedrock | Managed models (cloud) | Pay-per-token | No (managed) | Llama, Mistral, Command R+, Nova; no download, API access only |
| **Together AI Models** | https://api.together.xyz/models | Open models (API) | API key | No (API access) | 100+ open models; fastest OSS API |
| **Replicate Model Explorer** | https://replicate.com/explore | Any model (run on cloud) | API key | No (cloud run) | Community-deployed models; CivitAI image models |
| **Groq Models** | https://console.groq.com | LPU-accelerated inference | API key | No (cloud API) | Fastest inference speed; Llama, Mistral, Gemma |

### Recommended Download Workflow

```bash
# 1. Find model on HuggingFace
# Search at https://huggingface.co/models?sort=trending&pipeline_tag=text-generation

# 2. Download specific GGUF quant
# Option A: huggingface-cli (recommended)
pip install huggingface-hub
huggingface-cli download bartowski/Llama-3.3-70B-Instruct-GGUF \
  --include "Llama-3.3-70B-Instruct-Q4_K_M.gguf" \
  --local-dir ./models

# Option B: wget direct (for single file)
wget "https://huggingface.co/bartowski/Llama-3.3-70B-Instruct-GGUF/resolve/main/Llama-3.3-70B-Instruct-Q4_K_M.gguf"

# Option C: Ollama (easiest)
ollama pull llama3.3:70b

# Option D: Python
from huggingface_hub import hf_hub_download
hf_hub_download(repo_id="bartowski/Llama-3.3-70B-Instruct-GGUF", 
                filename="Llama-3.3-70B-Instruct-Q4_K_M.gguf",
                local_dir="./models")
```

---

## Fine-tuning Frameworks

Tools for adapting pre-trained models to specific domains or tasks.

### Fine-tuning Method Overview

| Method | Full Name | Description | GPU VRAM Required | Quality | Use Case |
|---|---|---|---|---|---|
| **Full Fine-tuning** | — | Update all model weights | 2–4× model FP16 size | Best | Large dataset, significant domain shift |
| **LoRA** | Low-Rank Adaptation | Add small trainable matrices alongside frozen weights | ~1.5× model FP16 | Very good | Most tasks; adaptable, removable |
| **QLoRA** | Quantized LoRA | LoRA on 4-bit quantized base model | ~0.5–0.8× model FP16 | Good | Consumer GPU fine-tuning |
| **DoRA** | Weight-Decomposed LoRA | Separates magnitude and direction updates | Similar to LoRA | Better than LoRA | Better than vanilla LoRA at same rank |
| **RLHF** | Reinforcement Learning from Human Feedback | PPO to optimize human preference reward model | Large (needs reward model too) | Best alignment | ChatGPT-style alignment |
| **DPO** | Direct Preference Optimization | Alignment without explicit reward model | Similar to LoRA | Good alignment | Easier than RLHF; common for open models |
| **ORPO** | Odds Ratio Preference Optimization | SFT + preference optimization in one step | Similar to LoRA | Good alignment | Simpler than DPO |
| **GaLore** | Gradient Low-Rank Projection | Full fine-tuning with memory-efficient gradient projection | ~2× model FP16 | Near-full | Full fine-tuning on limited hardware |

### Framework Comparison

| Framework | Methods | GPU Req (min) | Speed vs HF | Multi-GPU | FSDP/DeepSpeed | Notes | URL |
|---|---|---|---|---|---|---|---|
| **Unsloth** | LoRA, QLoRA, Full (new) | 4–6 GB (QLoRA 7B) | 2–5× faster, 70% less VRAM | Limited (experimental) | No (single GPU focus) | **Best consumer GPU fine-tuner**. Custom Triton kernels for 2–5× speedup. Supports Llama, Mistral, Qwen, Phi, Gemma. | https://github.com/unslothai/unsloth |
| **Axolotl** | LoRA, QLoRA, Full, RLHF, DPO, ORPO | 8 GB (QLoRA) | Similar to HF | Yes (FSDP, DeepSpeed) | Yes | Flexible YAML config; largest framework support; good for experiments | https://github.com/axolotl-ai-cloud/axolotl |
| **LLaMA-Factory** | LoRA, QLoRA, Full, RLHF, DPO, PPO, KTO | 8 GB (QLoRA) | Similar to HF | Yes | Yes | Web UI (LlamaBoard); easy dataset management; Chinese community | https://github.com/hiyouga/LLaMA-Factory |
| **TRL (HuggingFace)** | SFT, RLHF, PPO, DPO, ORPO, KTO, RewardTrainer | 16 GB (SFT 7B) | 1× (baseline) | Yes (FSDP, DeepSpeed) | Yes | Official HuggingFace RL library; most complete RLHF support | https://github.com/huggingface/trl |
| **torchtune** | LoRA, QLoRA, Full | 8 GB (LoRA) | Similar to HF | Yes (FSDP) | FSDP only | Meta's PyTorch-native fine-tuning; excellent for Llama models | https://github.com/pytorch/torchtune |
| **mlx-lm** | LoRA, QLoRA | 16 GB unified memory | 1–2× on Apple Si | No | No | Apple Silicon only; fine-tune on MacBook; surprisingly capable | https://github.com/ml-explore/mlx-examples |
| **SWIFT** | LoRA, QLoRA, Full, DPO | 8 GB | Similar | Yes | Yes | Alibaba's framework; best for Qwen fine-tuning; VLM support | https://github.com/modelscope/swift |
| **FastChat** | Full, LoRA | 16 GB | Similar | Yes (FSDP) | Yes | Vicuna/LLaVA team; more research-focused | https://github.com/lm-sys/FastChat |

### VRAM Requirements for Common Fine-tuning Tasks

| Task | Model | Method | Min VRAM | Recommended VRAM |
|---|---|---|---|---|
| Instruction tuning | Llama 3.2 3B | QLoRA | 4 GB | 8 GB |
| Instruction tuning | Mistral 7B | QLoRA | 6 GB | 12 GB |
| Instruction tuning | Llama 3.1 8B | QLoRA | 8 GB | 16 GB |
| Instruction tuning | Llama 3.1 8B | LoRA (BF16) | 16 GB | 24 GB |
| Instruction tuning | Qwen2.5 14B | QLoRA | 12 GB | 24 GB |
| Instruction tuning | Llama 3.3 70B | QLoRA | 40 GB | 80 GB |
| DPO alignment | Mistral 7B | QLoRA | 8 GB | 16 GB |
| RLHF (PPO) | Llama 3.1 8B | LoRA | 40 GB | 80 GB (needs separate reward model) |
| Full fine-tuning | Llama 3.2 3B | Full BF16 | 24 GB | 40 GB |
| Full fine-tuning | Llama 3.1 8B | Full BF16 + FSDP | 2× A100 80GB | 4× A100 80GB |

---

## Evaluation Frameworks

Tools for systematically measuring model capabilities.

| Framework | Developer | URL | What It Tests | Models Supported | Notes |
|---|---|---|---|---|---|
| **lm-evaluation-harness** | EleutherAI | https://github.com/EleutherAI/lm-evaluation-harness | 200+ tasks: MMLU, ARC, HellaSwag, TruthfulQA, GSM8K, MATH, HumanEval, and more | All HuggingFace models, GGUF (via llama.cpp backend), API | **The standard**. Powers HuggingFace Open LLM Leaderboard. Run: `lm_eval --model hf --model_args pretrained=meta-llama/Llama-3.3-70B-Instruct --tasks mmlu --num_fewshot 5` |
| **HELM (Holistic Evaluation)** | Stanford CRFM | https://crfm.stanford.edu/helm | 60+ scenarios with accuracy, calibration, fairness, efficiency metrics | API models + open models | Most comprehensive; measures beyond accuracy; toxicity, bias, calibration |
| **OpenLLM Leaderboard (v2)** | HuggingFace | https://huggingface.co/spaces/open-llm-leaderboard/open-llm-leaderboard | MMLU-Pro, GPQA, MuSR, MATH, IFEval, BBH | All public HF models (submit to evaluate) | Live community benchmark; v2 (2024) uses harder benchmarks than v1 |
| **AlpacaEval 2.0** | Tatsu Lab | https://tatsu-lab.github.io/alpaca_eval | Instruction following; win rate vs GPT-4 Turbo | HuggingFace + API | Length-controlled version (LC) reduces verbosity bias |
| **LMSYS Chatbot Arena** | LMSYS | https://chat.lmsys.org (arena mode) | Human preference; head-to-head ELO rankings | All (submit model for evaluation) | Gold standard for real-world preference; slow to accrue votes; but most reliable |
| **BigCode Evaluation Harness** | BigCode | https://github.com/bigcode-project/bigcode-evaluation-harness | Code: HumanEval, MBPP, MultiPL-E, DS-1000, SWE-Bench | Code models | Official BigCode eval; multi-language programming |
| **MT-Bench** | LMSYS | https://github.com/lm-sys/FastChat/tree/main/fastchat/llm_judge | Multi-turn conversation quality (80 questions, 8 categories) | Any with OpenAI-compat API | GPT-4 as judge; scores 1–10; good for chat models |
| **PromptBench** | Microsoft | https://github.com/microsoft/promptbench | Robustness to adversarial prompts; prompt sensitivity | HuggingFace + API | Tests how much model performance degrades under prompt perturbations |
| **RAGAS** | Exploding Gradients | https://github.com/explodinggradients/ragas | RAG pipeline quality: faithfulness, relevancy, context recall | LLM-judge based (uses your LLM) | Specifically for RAG evaluation; answer relevance, context precision |
| **AgentBench** | Tsinghua | https://github.com/THUDM/AgentBench | Agentic task performance across 8 environments | API models | Tasks: OS, DB, KG, web, card games, lateral thinking |
| **LiveCodeBench** | Various | https://livecodebench.github.io | Code problems post-training-cutoff (anti-contamination) | API + HuggingFace | Problems from LeetCode/AtCoder/CodeForces after model training date |
| **SimpleQA** | OpenAI | https://github.com/openai/simple-evals | Short-answer factual questions; hallucination rate | API + HuggingFace | Clean setup; measures factual accuracy and "I don't know" calibration |
| **MixEval** | MixEval Team | https://mixeval.github.io | Web queries sampled from real user distribution | API + HuggingFace | Ground-truth based; less judge bias than MT-Bench |
| **RULER** | NVIDIA | https://github.com/hsiehjackson/RULER | Long context retrieval+reasoning at 4K to 1M tokens | API + HuggingFace | Reveals "effective context length" vs advertised context length |

---

## Vector Databases

For RAG (Retrieval Augmented Generation), long-term memory, and semantic search in AGI systems.

| Database | Language | Cloud Managed | Self-Hosted | Embedding Support | Max Scale | License | Notes |
|---|---|---|---|---|---|---|---|
| **Chroma** | Python (primary), JS | No | Yes (in-process + server) | Any (pass your own vectors) | Millions of docs (single node) | Apache 2.0 | **Easiest local setup**. In-process mode: `chroma.PersistentClient(path="./db")`. No server needed. Perfect for prototyping. |
| **FAISS** | C++ / Python | No | Yes (library) | Any | Billions (with GPU index) | MIT | Meta's high-performance similarity search. Not a full DB — library only. Fastest for pure ANN search. No persistence built-in. |
| **Qdrant** | Rust / Python / Go / JS | Yes (Qdrant Cloud) | Yes (Docker/binary) | Built-in (via FastEmbed) or custom | Billions (distributed) | Apache 2.0 | **Best production self-hosted vector DB**. Payload filtering + HNSW index. gRPC + REST. Sparse+dense hybrid search. |
| **Weaviate** | Go / Python / JS | Yes (WCS cloud) | Yes (Docker) | Built-in (OpenAI/Cohere/etc) or custom | Hundreds of millions | BSD 3-Clause | GraphQL + REST API. Multi-tenancy. Built-in BM25 hybrid search. Modules for auto-vectorization. |
| **Pinecone** | Python / JS | Yes only (managed) | No | Built-in or custom | Billions | Proprietary (free tier) | Serverless tier: generous free tier. No self-hosting. Best managed option for quick start. Pod-based for production. |
| **Milvus** | Go / Python / C++ | Yes (Zilliz Cloud) | Yes (Docker + k8s) | Any | Billions (distributed) | Apache 2.0 | Most scalable open source vector DB. Operator for k8s. GPU-accelerated indexing. Complex but powerful. |
| **LanceDB** | Python / JS | No | Yes (embedded) | Any | Billions (columnar storage) | Apache 2.0 | Built on Lance columnar format. Tight pandas/polars/DuckDB integration. Great for data lake RAG. Zero-copy reads. |
| **pgvector** | SQL (PostgreSQL extension) | Yes (via Supabase, etc.) | Yes (PostgreSQL) | Any | ~100M (single node) | PostgreSQL License | If you're already on PostgreSQL — just add extension. SQL interface. Lower performance than dedicated vector DBs. |
| **Redis (Vector Search)** | Any (Redis client) | Yes (Redis Cloud) | Yes (Redis Stack) | Any | Millions | Redis license (proprietary for enterprise) | In-memory; ultra-fast for smaller datasets. Redis Stack includes vector search module. |
| **OpenSearch (k-NN)** | Any | Yes (AWS) | Yes (Docker) | Any | Hundreds of millions | Apache 2.0 | Elasticsearch/OpenSearch k-NN plugin. Good if already using OpenSearch for full-text. |

### Quick Selection Guide

| Use Case | Recommended DB | Why |
|---|---|---|
| Local prototype / single machine | Chroma (in-process) | Zero setup, Python-native |
| Production single-server | Qdrant | Best OSS self-hosted; Rust performance |
| Massive scale (billions) | Milvus or Qdrant distributed | Horizontal scaling |
| Cloud, no DevOps | Pinecone | Fully managed, serverless tier |
| Data warehouse / analytics | LanceDB | Columnar format, pandas-native |
| Already on PostgreSQL | pgvector | Add extension, no new infrastructure |
| Pure speed (library) | FAISS | Fastest raw ANN; no DB features |

### RAG Architecture Pattern

```python
# Minimal RAG with Chroma + Ollama (fully local, offline)

import chromadb
from chromadb.utils import embedding_functions
import requests, json

# Initialize local vector store
chroma_client = chromadb.PersistentClient(path="./rag_db")

# Use a local embedding model (via Ollama)
class OllamaEmbedder:
    def __call__(self, texts):
        results = []
        for text in texts:
            resp = requests.post(
                "http://localhost:11434/api/embeddings",
                json={"model": "nomic-embed-text", "prompt": text}
            )
            results.append(resp.json()["embedding"])
        return results

collection = chroma_client.get_or_create_collection(
    name="knowledge_base",
    embedding_function=OllamaEmbedder()
)

# Index documents
def index_document(doc_id: str, text: str, metadata: dict = {}):
    collection.add(documents=[text], ids=[doc_id], metadatas=[metadata])

# Retrieve and generate
def rag_query(query: str, n_results: int = 5) -> str:
    # Retrieve relevant chunks
    results = collection.query(query_texts=[query], n_results=n_results)
    context = "\n\n".join(results["documents"][0])
    
    # Generate with local LLM
    prompt = f"""Use the following context to answer the question:

Context:
{context}

Question: {query}

Answer:"""
    
    resp = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "llama3.1:8b", "prompt": prompt, "stream": False}
    )
    return resp.json()["response"]
```

---

## Embedding Models

Models that convert text (or other content) into dense vector representations for semantic search, RAG, and classification.

| Model | Developer | Params | Dimensions | Max Input (tokens) | Multilingual | License | Speed | MTEB Score | Notes |
|---|---|---|---|---|---|---|---|---|---|
| **all-MiniLM-L6-v2** | sentence-transformers | 22M | 384 | 256 | No (EN) | Apache 2.0 | Very fast | 56.3 | **Best small embedding**; 5× smaller than base models; great for prototyping |
| **all-MiniLM-L12-v2** | sentence-transformers | 33M | 384 | 256 | No (EN) | Apache 2.0 | Fast | 59.8 | Slightly better than L6 at modest size increase |
| **all-mpnet-base-v2** | sentence-transformers | 109M | 768 | 384 | No (EN) | Apache 2.0 | Fast | 63.3 | Better quality than MiniLM; was long-term recommended default |
| **paraphrase-multilingual-MiniLM-L12-v2** | sentence-transformers | 117M | 384 | 512 | Yes (50+ languages) | Apache 2.0 | Fast | 58.5 | Good multilingual at small size |
| **nomic-embed-text-v1.5** | Nomic AI | 137M | 768 (variable via Matryoshka) | 8,192 | Partial | Apache 2.0 | Fast | 62.3 | **Long context** (8K); Matryoshka dimensions (768/512/256/128/64); runs in Ollama |
| **mxbai-embed-large-v1** | mixedbread.ai | 335M | 1,024 | 512 | No (EN) | Apache 2.0 | Medium | 64.7 | High quality large embedding; SOTA for Apache models |
| **gte-large** | Alibaba DAMO | 335M | 1,024 | 512 | No (EN) | MIT | Medium | 63.1 | Strong general embedding |
| **gte-Qwen2-7B-instruct** | Alibaba DAMO | 7B | 3,584 | 32,768 | Yes | Apache 2.0 | Slow | 72.1 | SOTA on MTEB; long context; multilingual; expensive to run |
| **e5-mistral-7b-instruct** | Microsoft | 7B | 4,096 | 32,768 | Partial | MIT | Slow | 66.6 | Instruction-following embedding; SOTA for 7B class |
| **e5-large-v2** | Microsoft | 335M | 1,024 | 512 | No (EN) | MIT | Medium | 62.9 | Strong E5 series; good production choice |
| **multilingual-e5-large-instruct** | Microsoft | 560M | 1,024 | 512 | Yes (93 languages) | MIT | Medium | 64.4 | Best multilingual at medium size |
| **bge-large-en-v1.5** | BAAI | 335M | 1,024 | 512 | No (EN) | MIT | Medium | 64.2 | BGE series; strong EN performance |
| **bge-m3** | BAAI | 570M | 1,024 | 8,192 | Yes (100 languages) | MIT | Medium | 68.0 | **Best multilingual OSS embedding**; dense + sparse + multi-vector; ColBERT support |
| **sfr-embedding-mistral** | Salesforce | 7B | 4,096 | 32K | Partial | CC-BY-NC-4.0 | Slow | 67.6 | SOTA at release; instruction-tuned Mistral base |
| **stella_en_400M_v5** | infgrad | 400M | 1,024–8,192 (Matryoshka) | 512 | No (EN) | MIT | Medium | 66.3 | High MTEB at 400M; Matryoshka dimensions |
| **text-embedding-3-small** | OpenAI | Unknown | 1,536 | 8,191 | Yes | Proprietary (API) | API | 62.3 | Best price/quality API embedding; $0.02/1M tokens |
| **text-embedding-3-large** | OpenAI | Unknown | 3,072 | 8,191 | Yes | Proprietary (API) | API | 64.6 | Best API embedding quality; Matryoshka dimensions; $0.13/1M tokens |
| **embed-english-v3.0** | Cohere | Unknown | 1,024 | 512 | No (EN) | Proprietary (API) | API | 64.5 | Strong API embedding; compression-friendly |
| **embed-multilingual-v3.0** | Cohere | Unknown | 1,024 | 512 | Yes (100+ languages) | Proprietary (API) | API | 64.0 | Best multilingual API embedding |

### MTEB (Massive Text Embedding Benchmark) Context

MTEB scores are averages across 56 tasks including retrieval, reranking, STS, classification, clustering. Higher = better. SOTA (2025): ~72–75 for best 7B models.

### Embedding Model Selection Guide

| Use Case | Recommended | Why |
|---|---|---|
| Quick prototype, English | all-MiniLM-L6-v2 | Tiny, fast, good enough |
| Production, English, cost-conscious | nomic-embed-text-v1.5 | Long context, runs via Ollama, Apache 2.0 |
| Production, English, max quality OSS | mxbai-embed-large-v1 | Highest quality Apache 2.0 single-lang |
| Production multilingual OSS | bge-m3 | Dense+sparse, 100 languages, long context |
| Best quality, budget for API | text-embedding-3-large | OpenAI, easy, Matryoshka |
| Long documents (8K+ tokens) | nomic-embed-text-v1.5 or bge-m3 | 8K context window |
| State-of-the-art quality | gte-Qwen2-7B-instruct | Highest MTEB, requires 7B inference |
| Offline, mobile | all-MiniLM-L6-v2 or MobileBERT | Smallest footprint |

### Running Embeddings Locally

```python
# Option 1: sentence-transformers (easiest Python setup)
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("nomic-ai/nomic-embed-text-v1.5", trust_remote_code=True)
embeddings = model.encode(["Hello world", "Goodbye moon"], 
                          prompt_name="search_document")  # use "search_query" for queries
print(embeddings.shape)  # (2, 768)

# Option 2: Ollama (easiest no-code setup)
# Pull: ollama pull nomic-embed-text
import requests

def embed_ollama(text: str, model: str = "nomic-embed-text") -> list[float]:
    resp = requests.post("http://localhost:11434/api/embeddings",
                        json={"model": model, "prompt": text})
    return resp.json()["embedding"]

# Option 3: FastEmbed (Qdrant's library — fast, no PyTorch)
from fastembed import TextEmbedding

embedding_model = TextEmbedding("nomic-ai/nomic-embed-text-v1.5-Q")
embeddings = list(embedding_model.embed(["Hello world", "Goodbye moon"]))
```

---

## AGI Stack Recommendations

Opinionated guide to assembling a complete on-device AGI stack at each hardware tier. "AGI stack" means: a local AI system capable of reasoning, memory, tool use, and multi-modal perception, running fully offline.

### Tier 1: Mobile AGI (Smartphone / Tablet)

**Target hardware**: iPhone 16 Pro / Samsung Galaxy S25 Ultra / iPad Pro M4
**RAM budget**: 4–8 GB for AI

| Component | Recommendation | Alternative | Notes |
|---|---|---|---|
| **LLM** | Llama 3.2 3B Q4_K_M | Phi-4 Mini 3.8B Q4 | 3B = best quality/RAM tradeoff on mobile |
| **Vision** | Gemma 3 4B (multimodal) or Llama 3.2 11B (iPad) | LLaVA 1.6 7B (iPad) | 4B vision model fits on flagship phone |
| **Embedding** | nomic-embed-text-v1.5 Q (FastEmbed) | all-MiniLM-L6-v2 | For local RAG/memory |
| **Vector Store** | Chroma (in-process, SQLite-backed) | LanceDB | No server needed; embedded |
| **Runtime** | llama.cpp (via JNI on Android, C++ on iOS) | MLC LLM | llama.cpp: broader quant support; MLC: faster GPU |
| **Orchestration** | Custom Swift/Kotlin + LangChain-lite | LlamaIndex (Python via Pythonista/server) | No Python on device; custom or Wasm |
| **Memory** | Chroma + SQLite for structured memory | JSON files (simpler) | Semantic + episodic memory |
| **Tools** | Device APIs: camera, calendar, maps, files | — | Use device sensors as tool inputs |

**Stack sketch**:
```
User input (text/voice/camera)
    → Intent classifier (SmolLM2 360M, ~100ms)
    → If vision: Gemma 3 4B vision encoder
    → Context retrieval from Chroma (semantic memory)
    → Llama 3.2 3B Q4 generates response + tool calls
    → Tool execution (calendar/search/device APIs)
    → Response to user
```

### Tier 2: Desktop AGI (Consumer Laptop/Desktop)

**Target hardware**: MacBook Pro M3 Pro 36GB / Windows PC with RTX 4090 / Linux with 32GB RAM
**Memory budget**: 16–36 GB

| Component | Recommendation (Apple) | Recommendation (NVIDIA) | Notes |
|---|---|---|---|
| **LLM** | Qwen2.5 32B Q4_K_M (MLX) | Qwen2.5 32B Q4_K_M (ExLlamaV2) | Best quality that fits in 24–36 GB |
| **Code model** | Qwen2.5-Coder 14B (MLX) | Qwen2.5-Coder 14B (ExLlamaV2) | Specialized for code tasks |
| **Reasoning** | DeepSeek-R1-Distill-Qwen 14B | DeepSeek-R1-Distill-Qwen 14B | Chain-of-thought reasoning |
| **Vision** | Gemma 3 12B vision (Ollama) | Llama 3.2 11B Vision (Ollama) | Document and image understanding |
| **Embedding** | nomic-embed-text-v1.5 (Ollama) | bge-large-en-v1.5 (sentence-transformers) | Semantic search |
| **Vector Store** | Qdrant (Docker) | Qdrant (Docker) | Production-grade; low RAM overhead |
| **Runtime** | Ollama + mlx-lm | Ollama + ExLlamaV2 | Two runtimes: Ollama for API; mlx-lm for max speed |
| **Orchestration** | LangGraph | LangGraph | Best for complex agentic loops |
| **API Gateway** | LiteLLM (proxy) | LiteLLM (proxy) | Unify local + cloud API access |
| **UI** | Open WebUI | Open WebUI | ChatGPT-quality local UI |

**Stack sketch**:
```
Open WebUI / custom app
    → LiteLLM proxy (routes to local or cloud based on task)
        ├── Simple chat → Llama 3.1 8B (Ollama, fast)
        ├── Complex reasoning → DeepSeek-R1-Distill 14B (Ollama)
        ├── Code → Qwen2.5-Coder 14B (Ollama)
        └── Vision → Llama 3.2 11B Vision (Ollama)
    → LangGraph agent loop
        ├── Tool: Qdrant RAG retrieval (nomic embeddings)
        ├── Tool: Code interpreter (subprocess)
        ├── Tool: Web search (optional: Brave API)
        └── Tool: File read/write
    → Structured output → response to user
```

### Tier 3: Workstation AGI (High-RAM Mac or Server)

**Target hardware**: Mac Studio M4 Ultra (192GB) / Server with 4× A100 80GB / Lambda A6000 workstation
**Memory budget**: 80–192 GB

| Component | Recommendation | Notes |
|---|---|---|
| **Primary LLM** | Llama 3.1 405B Q4 (via vLLM or SGLang, multi-GPU) | Frontier-class; 243 GB Q4 needs 4+ GPUs or M4 Ultra |
| **Fast LLM** | Llama 3.3 70B Q4 (MLX on M4 Ultra, or vLLM) | For high-throughput inference |
| **Reasoning** | DeepSeek R1 70B distill or DeepSeek V3 (partial quant) | Full DeepSeek V3 needs 8+ H100 |
| **Code** | Qwen2.5-Coder 32B | HumanEval 92.7%; fits in 24 GB |
| **Vision** | Gemma 3 27B vision | 128K ctx + multimodal; 20 GB Q4 |
| **Embedding** | bge-m3 (multilingual) | Dense+sparse; 100 languages |
| **Vector Store** | Qdrant (distributed) or Milvus | Scale for large knowledge bases |
| **Runtime** | vLLM (multi-GPU) + MLX (Apple Silicon) | vLLM: continuous batching + PagedAttention |
| **Serving** | vLLM + OpenAI-compat API | Expose as API for client apps |
| **Orchestration** | LangGraph + CrewAI | Multi-agent coordination |
| **Memory** | Qdrant (episodic) + SQLite (structured) + knowledge graph | Three-tier memory architecture |

**Production Multi-Agent Architecture**:
```
Client applications (web, mobile, CLI)
    → API Gateway (LiteLLM proxy)
        → Routing: task → model assignment
    → Agent Orchestrator (LangGraph)
        ├── Planning agent (Llama 405B → breaks task into steps)
        ├── Research agent (70B → RAG queries, web search)
        ├── Code agent (Qwen2.5-Coder 32B → writes/tests code)
        ├── Reasoning agent (DeepSeek R1 distill → logical inference)
        └── Critic agent (70B → validates outputs, detects errors)
    → Memory Layer
        ├── Semantic memory: Qdrant (bge-m3 embeddings)
        ├── Episodic memory: SQLite (structured conversation history)
        └── Procedural memory: Vector store (tool use patterns)
    → Tool Layer
        ├── Code interpreter
        ├── File system access
        ├── Web browser (Playwright)
        ├── Shell execution
        └── API integrations
    → Output validation → Human-in-the-loop (when confidence low)
```
