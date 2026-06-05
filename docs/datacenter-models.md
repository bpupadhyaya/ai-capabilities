# Datacenter & Cluster AI Models — Infrastructure Reference

> Complete infrastructure reference for deploying large-scale open source AI models in server and cluster environments.

---

## Table of Contents

1. [Overview](#overview)
2. [Full Models Table](#full-models-table)
3. [GPU Requirement Matrix](#gpu-requirement-matrix)
4. [MoE Models Deep Dive](#moe-models-deep-dive)
5. [Cloud Provider Quick Reference](#cloud-provider-quick-reference)
6. [Serving Frameworks](#serving-frameworks)

---

## Overview

Datacenter-class AI deployment becomes necessary when:

- **Model size exceeds single-GPU VRAM**: Models over ~80 GB Q4 require multi-GPU or high-RAM CPU servers.
- **Production throughput requirements**: Serving hundreds or thousands of concurrent users demands PagedAttention, continuous batching, and tensor parallelism.
- **Fine-tuning at scale**: Full fine-tuning of 70B+ models requires 16–32× A100s with DeepSpeed ZeRO.
- **Long context at scale**: 128K+ context windows with large KV caches require significant VRAM.
- **Research reproducibility**: Running unquantized FP16/BF16 checkpoints for exact reproducibility.
- **MoE models**: Mixture-of-Experts models like DeepSeek V3 (671B total) must have all expert weights in memory even though only a fraction are active per token.

### When to Use Cloud vs On-Premise

| Factor | Cloud (AWS/Azure/GCP) | On-Premise Servers | Colocation |
|---|---|---|---|
| **Upfront cost** | $0 | $100K–$2M+ | $50K–$500K |
| **Per-hour cost** | $3–$30/hr per A100 | $0 (after amortization) | $2–$5/hr (power/cooling) |
| **Scaling** | Instant | Slow (hardware lead times) | Medium |
| **Privacy** | Provider has access | Full control | Full control |
| **Network latency** | 1–10 ms API | < 1 ms local | 1–5 ms |
| **Maintenance** | None | Full burden | Partial |
| **Break-even** | Never for intermittent use | 6–18 months for heavy use | 12–24 months |

---

## Full Models Table

Comprehensive reference for all major open source models requiring datacenter infrastructure.

| Model | Org | Params | Active (MoE) | Architecture | Context | GPU Config (recommended) | FP16 Storage | Q4 Storage | License | Key Benchmark |
|---|---|---|---|---|---|---|---|---|---|---|
| **Llama 3.1 70B** | Meta AI | 70B | — | Dense transformer | 128K | 2× A100 80GB (or 1× H100 80GB) | 140 GB | 43 GB | Llama 3.1 Community | MMLU 83.6% |
| **Llama 3.1 405B** | Meta AI | 405B | — | Dense transformer | 128K | 8× A100 80GB | 810 GB | 243 GB | Llama 3.1 Community | MMLU 88.6% |
| **Llama 3.3 70B** | Meta AI | 70B | — | Dense transformer | 128K | 2× A100 80GB | 140 GB | 43 GB | Llama 3.3 Community | Better than 3.1 70B |
| **Mixtral 8×7B** | Mistral AI | 46.7B total | 12.9B | MoE | 32K | 2× A100 80GB (all experts must be loaded) | 93 GB | 26 GB | Apache 2.0 | MMLU 70.6% |
| **Mixtral 8×22B** | Mistral AI | 141B total | 39.1B | MoE | 64K | 4× A100 80GB | 282 GB | 80 GB | Apache 2.0 | MMLU 77.8% |
| **Qwen2.5 72B** | Alibaba DAMO | 72B | — | Dense transformer | 128K | 2× A100 80GB | 144 GB | 43 GB | Qwen License | MMLU 86.1% |
| **Qwen2.5 72B Instruct** | Alibaba DAMO | 72B | — | Dense transformer | 128K | 2× A100 80GB | 144 GB | 43 GB | Qwen License | Strong reasoning |
| **Qwen2.5-Coder 32B** | Alibaba DAMO | 32B | — | Dense transformer | 128K | 1× A100 80GB | 64 GB | 19 GB | Qwen License | HumanEval 92.7% |
| **DeepSeek V3** | DeepSeek | 671B total | 37B | MoE (Multi-head Latent Attention) | 128K | 8× H100 80GB (min); 16× H100 for comfortable | 1,342 GB | 400 GB | MIT | MMLU 88.5%, SWE-Bench 42% |
| **DeepSeek R1** | DeepSeek | 671B total | 37B | MoE | 128K | 8× H100 80GB (min) | 1,342 GB | 400 GB | MIT | AIME 79.8%, best open reasoning |
| **DeepSeek R1 Distill 70B** | DeepSeek | 70B | — | Dense (distilled from R1) | 64K | 2× A100 80GB | 140 GB | 43 GB | MIT | Strong reasoning at 70B |
| **Yi 34B** | 01.AI | 34B | — | Dense transformer | 200K | 1× A100 80GB (tight) | 68 GB | 20 GB | Yi License | Long context capability |
| **Yi 1.5 34B** | 01.AI | 34B | — | Dense transformer | 4K | 1× A100 80GB (tight) | 68 GB | 20 GB | Apache 2.0 | Strong overall |
| **Falcon 40B** | TII | 40B | — | Dense transformer (multi-query attention) | 2K | 1× A100 80GB | 80 GB | 24 GB | Apache 2.0 | Early strong open model (2023) |
| **Falcon 180B** | TII | 180B | — | Dense transformer | 2K | 4× A100 80GB | 360 GB | 108 GB | Falcon License | Largest Falcon |
| **Command R+ 104B** | Cohere | 104B | — | Dense transformer | 128K | 2× A100 80GB + offload | 208 GB | 62 GB | CC-BY-NC-4.0 | RAG, grounded gen, 10 languages |
| **BLOOM 176B** | BigScience | 176B | — | Dense transformer (ALiBi) | 2K | 8× A100 40GB | 352 GB | — | RAIL-M | 46 languages; first truly multilingual open LLM |
| **GPT-NeoX 20B** | EleutherAI | 20B | — | Dense transformer (Rotary PE) | 2K | 1× A100 40GB | 40 GB | 12 GB | Apache 2.0 | Fully open; research |
| **Pythia 12B** | EleutherAI | 12B | — | Dense transformer | 2K | 1× A100 40GB | 24 GB | 7 GB | Apache 2.0 | Training dynamics research |
| **Grok-1** | xAI | 314B total | 86B | MoE | 8K | 8× A100 80GB | 628 GB | 158 GB | Apache 2.0 | Only OSS from xAI |
| **DBRX** | Databricks | 132B total | 36B | MoE | 32K | 4× A100 80GB | 264 GB | 72 GB | DBRX Open License | High-quality MoE |
| **Aya Expanse 32B** | Cohere | 32B | — | Dense transformer | 128K | 1× A100 80GB | 64 GB | 19 GB | CC-BY-NC-4.0 | 23 languages |
| **Aya Expanse 8B** | Cohere | 8B | — | Dense transformer | 128K | 1× A100 40GB | 16 GB | 4.9 GB | CC-BY-NC-4.0 | 23 languages, smaller |
| **Nemotron-4 340B** | NVIDIA | 340B | — | Dense transformer | 4K | 8× A100 80GB | 680 GB | 196 GB | NVIDIA Open Model | RLHF synthetic data generation |
| **Mistral Large 2 123B** | Mistral AI | 123B | — | Dense transformer | 128K | 4× A100 80GB (or 2× H100) | 246 GB | 74 GB | Mistral Research License | Best open Mistral; non-commercial |
| **InternLM 2.5 20B** | Shanghai AI Lab | 20B | — | Dense transformer | 1M | 1× A100 80GB (with GQA) | 40 GB | 12 GB | InternLM License | 1M context, tool use |
| **Qwen2.5 Coder 72B** | Alibaba DAMO | 72B | — | Dense transformer | 128K | 2× A100 80GB | 144 GB | 43 GB | Qwen License | HumanEval 86.6% at 72B |
| **Codestral Mamba 7B** | Mistral AI | 7B | — | Mamba (SSM) | ∞ (recurrent) | 1× A100 40GB | 14 GB | 4.1 GB | Apache 2.0 | Infinite context via SSM; code |

---

## GPU Requirement Matrix

Practical GPU configurations for each model. "Comfortable" means model fits with room for KV cache and batch sizes > 1.

| Model | Minimum Config (inference) | Comfortable Config | Production Config | Notes |
|---|---|---|---|---|
| Llama 3.1 70B (Q4) | 1× RTX 6000 Ada (48 GB) | 2× A100 40GB | 2× A100 80GB | ~43 GB Q4 |
| Llama 3.1 70B (FP16) | 2× A100 80GB | 4× A100 80GB | 4× H100 80GB | 140 GB FP16 |
| Llama 3.1 405B (Q4) | 4× A100 80GB + CPU offload | 8× A100 80GB | 8× H100 80GB | 243 GB Q4 |
| Mixtral 8×7B (Q4) | 2× RTX 3090 24GB | 2× A100 40GB | 2× A100 80GB | All experts must be in VRAM |
| Mixtral 8×22B (Q4) | 4× A100 40GB | 4× A100 80GB | 4× H100 80GB | 80 GB Q4 |
| Qwen2.5 72B (Q4) | 1× H100 80GB | 2× A100 80GB | 2× H100 80GB | 43 GB Q4; H100 has room for long KV cache |
| DeepSeek V3 (Q4) | 8× A100 80GB | 8× H100 80GB | 16× H100 80GB | 400 GB Q4; MoE needs all experts in memory |
| DeepSeek R1 (Q4) | 8× A100 80GB | 8× H100 80GB | 16× H100 80GB | Same as V3 |
| Command R+ 104B (Q4) | 2× A100 80GB (+ CPU offload) | 4× A100 40GB | 4× A100 80GB | 62 GB Q4 |
| BLOOM 176B (Q4) | 4× A100 40GB | 4× A100 80GB | 8× A100 80GB | Note: no Q4 GGUF officially; use 8-bit |
| Falcon 180B (Q4) | 4× A100 40GB | 4× A100 80GB | 8× A100 80GB | 108 GB Q4 |
| GPT-NeoX 20B (FP16) | 1× A100 40GB | 1× A100 80GB | 2× A100 40GB | 40 GB FP16 |
| Grok-1 (Q4) | 4× A100 80GB | 8× A100 80GB | 8× H100 80GB | 158 GB Q4; all 16 experts needed |
| DBRX (Q4) | 4× A100 40GB | 4× A100 80GB | 4× H100 80GB | 72 GB Q4 |
| Nemotron-4 340B (Q4) | 8× A100 40GB | 8× A100 80GB | 8× H100 80GB | 196 GB Q4 |
| Mistral Large 2 123B (Q4) | 2× A100 80GB | 4× A100 40GB | 4× A100 80GB | 74 GB Q4 |
| Yi 34B (FP16) | 1× A100 80GB | 2× A100 40GB | 2× A100 80GB | 68 GB FP16 |

### CPU Offloading

When VRAM is insufficient, frameworks like llama.cpp can offload layers to CPU RAM. Rule of thumb:

- 1 GPU layer ≈ `total_layers / model_size_in_vram_gb` computation shifted to GPU
- Each GPU layer offloaded reduces VRAM need but slows inference (PCIe bandwidth is 64 GB/s vs GPU HBM 2–3 TB/s)
- Offloading 50% of layers to CPU typically reduces throughput by 70–80%

---

## MoE Models Deep Dive

Mixture-of-Experts (MoE) architecture allows models to have far more total parameters than are active on any single forward pass. This enables parameter efficiency — the model has high capacity (many experts encode different knowledge) but each inference step only activates a small fraction.

### How MoE Works

```
Input token → Router (small FFN)
                 ↓
         Selects top-K experts
                 ↓
    Expert 1 | Expert 2 | ... | Expert N
         ↓           ↓
    Weighted sum of top-K expert outputs
                 ↓
              Output
```

**Key properties**:
- All expert weights must be in memory (VRAM/RAM) — the router selects which ones to compute, but can't know which until runtime
- Attention layers are shared (not sparse) — only the FFN layers are MoE
- Training is more complex (load balancing loss to prevent expert collapse)
- Inference compute per token ≈ active_params, not total_params — great efficiency

### MoE Model Comparison

| Model | Total Params | Active Params | Total Experts | Top-K per Token | Efficiency Ratio | Layers | Notes |
|---|---|---|---|---|---|---|---|
| **Mixtral 8×7B** | 46.7B | 12.9B | 8 (per layer) | 2 | 3.6× | 32 | First major open MoE; 2 of 8 experts active |
| **Mixtral 8×22B** | 141B | 39.1B | 8 (per layer) | 2 | 3.6× | 56 | Scaled-up Mixtral |
| **DeepSeek MoE** | 16B | 2.7B | 64 (per layer) | 6 | 5.9× | 28 | Fine-grained MoE; many small experts |
| **DeepSeek V2** | 236B | 21B | 160 per layer | 6 | 11.2× | 60 | Multi-head Latent Attention (MLA) |
| **DeepSeek V3** | 671B | 37B | 256 per layer | 8 | 18.1× | 61 | MLA + auxiliary-loss-free load balancing |
| **DeepSeek R1** | 671B | 37B | 256 per layer | 8 | 18.1× | 61 | Same arch as V3; trained for reasoning |
| **Grok-1** | 314B | 86B | ~16 per layer | 2 | 3.6× | ~64 | Architecture not fully disclosed |
| **DBRX** | 132B | 36B | 16 per layer | 4 | 3.7× | 40 | GLU-based expert FFN |
| **OLMoE 1B** | 6.9B | 1.3B | 64 per layer | 8 | 5.3× | 16 | Small MoE; ~1B active, research-friendly |
| **Qwen 1.5 MoE** | 14.3B | 2.7B | 60 per layer | 4 | 5.3× | 24 | Qwen MoE variant; efficient at small scale |

### MoE vs Dense Comparison

For a fixed compute budget (active parameters):

| Metric | Dense 7B | MoE 46.7B (12.9B active) |
|---|---|---|
| FLOPs per token | ~14 TFLOPs | ~26 TFLOPs (slightly more due to router) |
| Total VRAM needed | 14 GB FP16 | 93 GB FP16 |
| Quality (MMLU) | ~64% | ~71% |
| Training cost | Lower | Higher (routing instability) |
| Serving cost (compute) | Lower | ~Same (for active params) |
| Serving cost (memory) | Lower | **Much higher** |

**Takeaway**: MoE models give better quality per FLOPs but require far more memory bandwidth and capacity for inference. They make sense when you have abundant memory but limited compute budget.

### DeepSeek V3/R1 Architecture Innovations

**Multi-head Latent Attention (MLA)**:
- Compresses Key-Value cache using low-rank projection
- Reduces KV cache size by ~90% vs standard Multi-Head Attention (MHA)
- Makes 128K context tractable for the 671B model

**Auxiliary-loss-free Load Balancing** (V3 innovation):
- Previous MoE models used auxiliary losses to balance expert utilization
- DeepSeek V3 uses a dynamic bias term per expert without auxiliary loss
- Results in more stable training and better expert specialization

**FP8 Mixed Precision Training**:
- First major model to train in FP8 throughout
- Reduces training compute by ~2× vs BF16
- Required custom FP8 kernels for activation functions and gradient accumulation

---

## Cloud Provider Quick Reference

Self-hosting at datacenter scale is expensive. Cloud providers offer on-demand access to large-model inference.

| Provider | Service | Open Source Models Available | Pricing Model | Unique Advantage | Docs URL |
|---|---|---|---|---|---|
| **AWS Bedrock** | Managed inference API | Llama 2/3, Mistral, Command R/R+, Cohere, Amazon Nova | Per-token + per-request | VPC private endpoints; IAM integration; Guardrails for content filtering | https://aws.amazon.com/bedrock |
| **Azure AI Foundry** | Managed inference + fine-tuning | Llama 2/3, Mistral, Phi-3/4, WizardLM-2, Command R+ | Per-token; reserved throughput | Azure compliance portfolio; Active Directory auth; GitHub Copilot integration | https://ai.azure.com |
| **Google Vertex AI** | Managed inference + fine-tuning | Gemma 2/3, Llama 2/3, Mistral | Per-character | Google Cloud integration; TPU fine-tuning; lowest Gemma latency | https://cloud.google.com/vertex-ai |
| **Together AI** | Fast inference API | 100+ open source models (Llama, Mistral, Qwen, DeepSeek, etc.) | Per-token (competitive) | Largest OSS model catalog; cheap; fast | https://api.together.xyz |
| **Fireworks AI** | Fast inference API | Llama, Mistral, Mixtral, Qwen, DeepSeek, code models | Per-token | FireAttention (2-3× faster than vLLM); compound AI systems | https://fireworks.ai |
| **Replicate** | Any model, any scale | Any HuggingFace model (run via Cog) | Per-second GPU time | Run any model without setup; cold start in 30–60s | https://replicate.com |
| **Modal** | Serverless GPU | Any (deploy your own container) | Per-second GPU time | Best developer experience for custom models; instant scale | https://modal.com |
| **RunPod** | GPU rental (cloud/self-managed) | Any (you install) | Per-hour | Cheapest H100/A100 rates; template marketplace; persistent storage | https://runpod.io |
| **Lambda Labs** | GPU cloud + hardware | Any (you install) | Per-hour (50–80% cheaper than AWS) | Very competitive GPU pricing; also sells hardware | https://lambdalabs.com |
| **CoreWeave** | Enterprise GPU cloud | Any (you install) | Per-hour | NVLink clusters; lowest latency inference; IB networking | https://coreweave.com |
| **Vast.ai** | GPU marketplace (peer) | Any | Auction + spot pricing | Cheapest possible; bid on unused GPUs from individuals | https://vast.ai |
| **DeepInfra** | Inference API | Llama, Mistral, Mixtral, Qwen, Whisper | Per-token | Very cheap; good latency; 100+ models | https://deepinfra.com |
| **Groq** | LPU inference (proprietary chip) | Llama 3/3.1, Mistral, Mixtral, Gemma | Per-token | Fastest tokens/sec in the industry (LPU vs GPU); 500–800 t/s | https://groq.com |
| **Cerebras** | Wafer-scale inference | Llama 3, Llama 3.1 | Per-token | Extreme throughput (2,000+ t/s on Llama); wafer-scale chips | https://cerebras.ai |
| **Octoai** | Inference API | Llama, Mistral, Code Llama | Per-token | Fine-tuned model deployment; image models | https://octoai.cloud |
| **Anyscale** | Ray-based inference | Llama, Mistral | Per-token | Production Ray cluster management; easy fine-tuning | https://anyscale.com |

### Cost Comparison (approx. July 2025)

| Provider | Llama 3.1 70B (per 1M input tokens) | Llama 3.1 8B | Notes |
|---|---|---|---|
| Together AI | $0.88 | $0.18 | Competitive |
| Fireworks AI | $0.90 | $0.20 | Fast inference |
| DeepInfra | $0.59 | $0.09 | Cheapest major provider |
| AWS Bedrock | $2.65 | $0.22 | Premium for AWS integration |
| Azure AI | $2.80 | $0.25 | Premium for Azure integration |
| Groq | $0.59 | $0.05 | Extremely fast; LPU-based |
| Replicate | ~$1.50 | ~$0.40 | Per-second billing varies |

---

## Serving Frameworks

Production inference requires more than just loading a model. Key capabilities needed at scale:

- **Continuous batching**: Queue requests and batch them dynamically; don't wait for fixed batch sizes
- **PagedAttention**: KV cache memory management that avoids fragmentation (vLLM innovation)
- **Tensor parallelism**: Split single model across multiple GPUs (required for 70B+ on limited VRAM)
- **Pipeline parallelism**: Split model layers across GPUs (alternative to tensor parallelism)
- **Quantization**: Reduce memory and increase throughput
- **Flash Attention**: Fused attention computation that avoids materializing the full attention matrix

| Framework | Developer | GPU Support | Max Throughput | Multi-GPU | Quantization | Batch Strategy | API | License | Notes |
|---|---|---|---|---|---|---|---|---|---|
| **vLLM** | vLLM Team (UC Berkeley) | CUDA, ROCm, TPU, Neuron, XPU | Very High | Tensor + Pipeline parallel | AWQ, GPTQ, FP8, INT8, INT4 | Continuous batching + PagedAttention | OpenAI-compatible REST | Apache 2.0 | **Industry standard** for production OSS serving. PagedAttention eliminates KV cache fragmentation. 24× throughput vs naive serving. |
| **TGI (Text Generation Inference)** | HuggingFace | CUDA, ROCm, Gaudi, Inferentia | High | Tensor parallel (NCCL) | AWQ, GPTQ, FP8, EETQ, bitsandbytes | Continuous batching | REST + gRPC | Apache 2.0 | HuggingFace-native; Flash Attention 2 built-in; easy model serving from HF Hub. |
| **TensorRT-LLM** | NVIDIA | CUDA only | **Highest** | Tensor + Pipeline + Sequence parallel | INT4 (AWQ/GPTQ), INT8, FP8, FP16 | In-flight batching (continuous) | Library only (integrate with Triton) | Apache 2.0 | Requires compiling model to TRT engine per GPU/precision; highest throughput on NVIDIA. 2–3× faster than vLLM. |
| **DeepSpeed Inference** | Microsoft | CUDA, ROCm | High | Tensor parallel (ZeRO-Inference) | INT8 (SmoothQuant), FP16 | Static batching | Library | Apache 2.0 | ZeRO-Inference allows huge models on limited GPU via CPU/NVMe offload. Not optimized for throughput; better for researchers. |
| **Triton Inference Server** | NVIDIA | CUDA, ROCm, CPU | High | Via TensorRT-LLM backend | Via backend | Model ensemble + batching | gRPC + REST | BSD 3-Clause | Model serving framework; use with TensorRT-LLM backend for LLMs. Handles model lifecycle management. |
| **LightLLM** | ModelBest | CUDA | High | Tensor parallel | INT8, INT4 | TokenAttention (similar to PagedAttention) | REST | Apache 2.0 | Alternative to vLLM; TokenAttention memory management; good Triton kernel coverage |
| **SGLang** | LMSYS + Stanford | CUDA | Very High | Tensor parallel | AWQ, FP8 | RadixAttention (KV cache reuse) | REST (OpenAI-compat) | Apache 2.0 | RadixAttention reuses KV cache across requests sharing prefixes; excellent for RAG + constrained decoding |
| **llama.cpp server** | Georgi Gerganov | CUDA, Metal, Vulkan, OpenCL | Medium | Limited (CPU+GPU split) | Full GGUF range | Continuous batching (llama-server) | REST (OpenAI-compat) | MIT | Good for medium traffic; maximum hardware support; works on consumer hardware |
| **Ollama** | Ollama Inc. | CUDA, Metal, ROCm | Medium | Not supported | GGUF range | Basic | REST (OpenAI-compat) | MIT | Easy setup; not designed for high-throughput production |
| **OpenLLM** | BentoML | CUDA, Metal | Medium | Via vLLM backend | Via backend | Via vLLM | REST (OpenAI-compat) | Apache 2.0 | BentoML integration; good for BentoCloud deployment |

### Framework Selection by Scale

| Scale | Daily Requests | Recommended Framework | Why |
|---|---|---|---|
| Development / testing | < 100 | Ollama or llama-server | Simple, fast setup |
| Small production | 100–10,000 | vLLM or TGI | Continuous batching, good throughput |
| Medium production | 10K–1M | vLLM (multi-instance) | PagedAttention, horizontal scaling |
| Large production (NVIDIA) | > 1M | TensorRT-LLM + Triton | Maximum throughput per GPU dollar |
| Research / fine-tuning | Any | HuggingFace Transformers | Flexibility, not throughput |
| MoE models | Any | vLLM or SGLang | Expert-parallel support |
| Long-context RAG | Any | SGLang | RadixAttention reuses prefix KV cache |

### Performance Benchmark Summary (relative, single A100 80GB, Llama 3.1 70B Q8)

| Framework | Throughput (tokens/s) | Latency (TTFT ms) | Notes |
|---|---|---|---|
| TensorRT-LLM | 100% (baseline) | 50–100 ms | Requires compile step |
| vLLM | 65–75% | 100–200 ms | PagedAttention; easier setup |
| TGI | 55–65% | 100–200 ms | Flash Attention 2 |
| SGLang | 70–80% | 80–150 ms | RadixAttention helps repeated prefixes |
| LightLLM | 60–70% | 100–200 ms | TokenAttention |
| llama-server | 30–40% | 200–500 ms | CPU+GPU hybrid; simpler deployment |

> Numbers are approximate and vary by batch size, sequence length, and hardware. Always benchmark for your specific workload.

### Multi-GPU Configuration Examples

#### 2-GPU Tensor Parallel (vLLM)

```bash
# Llama 3.1 70B on 2× A100 80GB
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-3.1-70B-Instruct \
  --tensor-parallel-size 2 \
  --max-model-len 32768 \
  --dtype bfloat16 \
  --port 8000
```

#### 8-GPU Pipeline Parallel (TensorRT-LLM)

```bash
# Build engine for 8 GPUs
trtllm-build \
  --checkpoint_dir ./llama405b_checkpoint \
  --output_dir ./llama405b_engine \
  --tp_size 4 \
  --pp_size 2 \
  --max_batch_size 32 \
  --max_input_len 4096 \
  --max_output_len 2048 \
  --use_fused_mlp

# Serve with Triton
python3 scripts/launch_triton_server.py \
  --world_size 8 \
  --model_repo ./triton_model_repo
```

#### DeepSeek V3 Multi-GPU (SGLang, minimum config)

```bash
# 8× H100 80GB minimum for DeepSeek V3 Q4
python -m sglang.launch_server \
  --model deepseek-ai/DeepSeek-V3 \
  --tp 8 \
  --trust-remote-code \
  --host 0.0.0.0 \
  --port 30000 \
  --enable-mixed-chunk \
  --quantization fp8
```
