# AGI Developer Parameters Reference — Complete Field Guide

> The definitive reference for AI engineers building toward Artificial General Intelligence systems. Every parameter, benchmark, and hardware specification that matters — with AGI-specific context.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Model Capability Parameters](#model-capability-parameters)
3. [Hardware Parameters](#hardware-parameters)
4. [Quantization Reference](#quantization-reference)
5. [Benchmark Guide](#benchmark-guide)
6. [AGI Capability Checklist](#agi-capability-checklist)
7. [Memory and Storage Formulas](#memory-and-storage-formulas)
8. [Speed Estimation by Hardware](#speed-estimation-by-hardware)

---

## Introduction

Building toward AGI requires understanding two levels of parameters simultaneously:

1. **Model parameters**: The learned weights that encode knowledge and reasoning patterns; architectural choices that determine capability ceiling; training decisions that shape behavior.

2. **Deployment parameters**: The hardware constraints, quantization trade-offs, and inference settings that determine whether a model's capabilities can be accessed in your target environment.

Most engineering failure in on-device AGI development comes from optimizing one level while ignoring the other — either running a model that's too capable to fit in memory, or fitting a model that can't perform the required task.

### The AGI Parameter Hierarchy

```
Task Requirements
    ↓
Benchmark thresholds (MMLU, HumanEval, ARC-AGI, etc.)
    ↓
Minimum model capability (params, context, modalities)
    ↓
Quantization selection (Q4 vs Q8 vs FP16)
    ↓
Hardware fit (VRAM / RAM / storage)
    ↓
Runtime selection (vLLM / llama.cpp / MLX / etc.)
    ↓
Inference parameters (temperature, top_p, context length)
```

Work top-down when designing a system. Work bottom-up when debugging performance.

---

## Model Capability Parameters

The architectural and training parameters that determine what a model can do.

| Parameter | What It Means | AGI Relevance | Key Threshold | How to Find It |
|---|---|---|---|---|
| **Total Parameters (B)** | Total learned weights across all layers. Proxy for raw capacity and knowledge storage. | More params = more world knowledge, better reasoning, fewer hallucinations. Sub-7B models struggle with reliable tool use. | 7B+ for reliable instruction following; 70B+ for frontier open capabilities | Model card, config.json: `num_parameters` |
| **Active Parameters (MoE)** | For Mixture-of-Experts: params actually computed per token. Determines inference cost. | MoE efficiency enables large total capacity with small compute cost. DeepSeek V3 has 671B total but ~37B active per token — compute cost of a 37B model. | Higher active ratio = better quality per compute unit | Model card: `num_experts_per_tok` × `expert_params` |
| **Context Window (tokens)** | Maximum sequence length: input + output tokens combined. | Critical for long reasoning chains, multi-document analysis, agentic memory. Human experts need to consider long documents — AGI must too. | 32K minimum for practical use; 128K+ for serious AGI tasks; 1M+ for "infinite context" illusion | config.json: `max_position_embeddings` |
| **Vocabulary Size** | Number of unique tokens the model can represent. | Larger vocabulary = better tokenization efficiency for code, math, multilingual content. | 32K (GPT-2) → 128K (Llama 3) trend; 128K+ for multilingual | config.json: `vocab_size` |
| **Hidden Dimension (d_model)** | Width of internal representations. | Wider = richer representations per layer but more memory per activation. Key for model quality. | Typically 2048–8192 for 7B models; scales with model size | config.json: `hidden_size` |
| **Number of Layers** | Depth of the transformer stack. | More layers = more sequential processing and abstraction. Critical for reasoning depth. | 32 layers (7B) → 80 layers (70B) → 126 layers (405B) | config.json: `num_hidden_layers` |
| **Attention Heads (MHA)** | Multi-head attention parallelism. Each head learns different attention patterns. | More heads = finer-grained attention but more KV cache memory. | 32 heads (7B) → 64 heads (70B) typical | config.json: `num_attention_heads` |
| **KV Heads (GQA)** | Grouped Query Attention: fewer KV heads than Q heads reduces KV cache. | Directly reduces inference memory. GQA with 8 KV heads vs 32 Q heads = 4× KV cache reduction. | Standard for modern models (Llama 3, Mistral, Qwen2.5 all use GQA) | config.json: `num_key_value_heads` |
| **MLA (Multi-head Latent Attention)** | DeepSeek's KV cache compression via low-rank projection. | ~90% KV cache reduction vs MHA. Enables 128K context on very large models. | Only in DeepSeek V2/V3/R1 as of 2025 | config.json: `q_lora_rank`, `kv_lora_rank` |
| **FFN / Intermediate Size** | Width of feed-forward network (4× hidden_size typically). | FFN stores "factual knowledge"; bigger = more capacity. In MoE, this is the expert size × num_experts. | Usually `hidden_size × 4`; MoE: many smaller experts | config.json: `intermediate_size` |
| **Modalities** | Input/output types: text, image, audio, video. | AGI requires all modalities. Current best: GPT-4o (text+vision+audio), Gemini 2.5 Pro (text+vision+audio+video). Open source is catching up. | For AGI: all modalities required. For most tasks: text + vision sufficient | Model card: "modalities" or architecture description |
| **Architecture Family** | Transformer vs Mamba (SSM) vs Hybrid. | Standard transformer: O(n²) attention but universal capability. Mamba: O(n) but weaker in-context learning. Hybrid: promising. | Transformer remains dominant for 2025; Mamba gaining in long-context niche | config.json: `model_type` |
| **Attention Pattern** | Local vs global attention; sliding window vs full attention. | Full attention sees everything; sliding window limits to nearby tokens (cheaper). Gemma 2 alternates local/global. | Full global attention required for cross-document reasoning | config.json: `sliding_window`, `attention_layers` |
| **Positional Encoding** | How positions are encoded: RoPE, ALiBi, NoPE, learned absolute. | RoPE with dynamic NTK scaling enables context extension beyond training length. Critical for long-context AGI. | RoPE (standard); ALiBi (length extrapolation); YaRN (GLM-4 1M ctx) | config.json: `rope_theta`, `position_embedding_type` |
| **Tied Embeddings** | Whether input and output embedding matrices share weights. | Reduces parameter count without much quality loss. Standard in smaller models. | Common in <3B models | config.json: `tie_word_embeddings` |
| **Training Data Size (tokens)** | How many tokens the model was trained on. | More training data = more world knowledge. Modern frontier models: 15T–30T tokens. | ≥ 1T tokens needed; 10T+ for competitive quality | Paper or model card |
| **Training Compute (FLOPs)** | Total floating-point operations during training. | Chinchilla scaling laws predict optimal params/tokens ratio. Indicator of training thoroughness. | Chinchilla-optimal: ~20 tokens/param | Paper or model card |
| **System Prompt / Chat Template** | The template format for instruction-following models (e.g., `[INST]...[/INST]`). | Critically affects instruction-following quality. Wrong template = garbage output. | Match exactly — `tokenizer_config.json`: `chat_template` | `tokenizer_config.json` |

---

## Hardware Parameters

The physical constraints that determine which models you can run and how fast.

| Parameter | Unit | What It Determines | How to Measure | Rule of Thumb | Key Bottleneck? |
|---|---|---|---|---|---|
| **System RAM** | GB | Maximum model size for CPU inference or Apple Silicon unified memory | `htop`, Task Manager, `free -h` (Linux) | Model Q4 size + 2 GB overhead + KV cache | Primary constraint for CPU/Apple Silicon |
| **GPU VRAM** | GB | Maximum model size for GPU inference | `nvidia-smi`, `rocm-smi`, Activity Monitor (Mac) | FP16: params × 2 GB; Q4: params × 0.55 GB | Primary constraint for NVIDIA/AMD GPU |
| **Memory Bandwidth** | GB/s | **Primary bottleneck for LLM inference throughput** | `nvidia-smi dmon`, bandwidth test | Higher BW = more tokens/sec. Scales linearly. | **Yes — the dominant bottleneck** |
| **Compute (TFLOPS)** | Tera FLOPs/sec | Token generation speed (secondary to bandwidth for inference) | `nvidia-smi --query-gpu=tflops` | Only matters when batch size > 1 | Secondary for inference |
| **Storage Type / Speed** | GB/s | Model load time; matters for cold start | `fio`, `diskmark`, `blackmagic disk speed test` | NVMe SSD: 5–7 GB/s; SATA SSD: 0.5 GB/s; HDD: 0.1 GB/s | Model load time only |
| **Storage Capacity** | GB | How many models you can keep loaded | `df -h`, Finder/Explorer | Keep 2–3× working set; streaming from disk is too slow | Model storage |
| **CPU Cores / Threads** | Count | CPU inference parallelism; tokenization speed | `nproc`, Task Manager | LLM inference scales weakly beyond 4–8 cores; prefer GPU | For CPU-only inference |
| **CPU Architecture** | ISA | AVX2/AVX-512/NEON/SVE support for SIMD inference | `lscpu` (Linux), `sysctl` (Mac) | AVX-512 = 2× faster CPU inference vs AVX2; Apple NEON excellent | CPU inference speed |
| **NPU / ANE TOPS** | Tera-Ops/sec | On-device AI accelerator performance; key for mobile | Apple: `xcrun xctrace`, Qualcomm: QNN Profiler | Apple ANE: 35–38 TOPS (A17 Pro/A18); Snapdragon: 45–75 TOPS (AI-TOPS) | Mobile inference speed |
| **NVLink Bandwidth** | GB/s | Multi-GPU communication speed (NVIDIA) | `nvidia-smi nvlink --status` | NVLink 4 (H100): 900 GB/s bidirectional vs PCIe 5.0: 128 GB/s | Multi-GPU scaling |
| **PCIe Bandwidth** | GB/s | CPU-GPU data transfer; bottleneck for CPU offloading | `gpuz`, `lspci -vvv | grep -A5 LnkSta` | PCIe 4.0 x16: 32 GB/s; PCIe 5.0 x16: 64 GB/s | CPU offload performance |
| **Thermal Design Power (TDP)** | Watts | Sustained performance (thermal throttling) | `nvidia-smi --query-gpu=power.draw`, `powermetrics` (Mac) | Running near TDP = risk of throttling; affects sustained t/s | Sustained load performance |
| **Unified Memory** | GB | Apple Silicon only: CPU + GPU share same pool | Activity Monitor → GPU History | The killer feature: M4 Max at 128 GB = 70B Q8 on a laptop | Apple Silicon's advantage |
| **Flash Storage Access** (Apple Silicon) | GB/s | Apple uses storage as extension of unified memory for large models | `sudo powermetrics --samplers disk` | Can run models larger than RAM using ANE + flash offload | Apple-specific large model capability |

### Memory Bandwidth by Hardware Class

| Hardware | Memory BW | Impact on 7B Q4 Speed |
|---|---|---|
| DDR4-3200 (desktop CPU) | 50 GB/s | ~5–8 t/s |
| DDR5-6400 (high-end desktop CPU) | 102 GB/s | ~12–18 t/s |
| M1 (8-core GPU) | 68 GB/s | ~25–30 t/s |
| M4 Pro | 273 GB/s | ~90–110 t/s |
| M4 Max | 546 GB/s | ~120–140 t/s |
| RTX 4090 | 1,008 GB/s | ~110–130 t/s |
| A100 80GB | 2,000 GB/s | ~160–180 t/s |
| H100 SXM | 3,350 GB/s | ~250–300 t/s |
| H200 | 4,800 GB/s | ~350–420 t/s |

---

## Quantization Reference

Comprehensive guide to every quantization format used in production AI inference.

| Format | Bits per Weight | Size Factor vs FP16 | Quality Degradation | Speed vs FP16 | Mobile Support | CUDA Support | Metal Support | When to Use |
|---|---|---|---|---|---|---|---|---|
| **FP32** | 32 | 2.0× larger | None (training) | 0.5× | No | Yes | Yes | Training only; too large/slow for inference |
| **TF32** | 19 effective | Same storage as FP32 | Minimal | 1× | No | A100+ | No | NVIDIA TensorFloat training; not for inference |
| **BF16** | 16 (8 exp, 7 mantissa) | 1.0× | Minimal | 1× | Partial (Apple ANE) | A100+ native | Yes (Apple) | Training + inference baseline; better range than FP16 |
| **FP16** | 16 (5 exp, 10 mantissa) | 1.0× | Minimal | 1× | Yes (GPU) | Yes | Yes | Standard GPU inference; risk of overflow for large models |
| **FP8 E4M3** | 8 (4 exp, 3 mantissa) | 0.5× | Very small | 2× | No | H100/H200 | No | H100/H200 training + inference; NVIDIA hardware native |
| **FP8 E5M2** | 8 (5 exp, 2 mantissa) | 0.5× | Small | 2× | No | H100/H200 | No | Better range than E4M3; used in backward pass |
| **INT8 / Q8_0** | 8 | 0.5× | Very small (< 0.5% MMLU drop) | 1.5–2× | Yes | Yes (CUTLASS) | Yes | Near-lossless; good when RAM allows; SmoothQuant for server |
| **Q8_0 (GGUF)** | 8 | 0.5× | Near-zero | 1.5× | Yes | Yes | Yes | Recommended when you have RAM and want quality |
| **Q6_K (GGUF)** | 6 | 0.375× | Very small | 1.8× | Yes | Yes | Yes | Excellent balance; often preferred over Q5 |
| **Q5_K_M (GGUF)** | ~5.5 (mixed k-quant) | 0.31× | Small | 2× | Yes | Yes | Yes | Good quality/size; step down from Q6 |
| **Q5_K_S (GGUF)** | ~5 (smaller variant) | 0.29× | Slightly more than Q5_K_M | 2× | Yes | Yes | Yes | Smaller Q5 variant |
| **Q4_K_M (GGUF)** | ~4.5 (mixed k-quant) | 0.26× | Moderate (1–2% MMLU drop) | 2.5× | Yes | Yes | Yes | **Recommended default** for most deployments |
| **Q4_K_S (GGUF)** | ~4 (smaller k-quant) | 0.23× | Moderate+ | 2.5× | Yes | Yes | Yes | Smaller Q4 variant; slightly lower quality |
| **Q4_0 (GGUF)** | 4 | 0.25× | Similar to Q4_K_M (older format) | 2.5× | Yes | Yes | Yes | Legacy; Q4_K_M preferred for new deployments |
| **IQ4_XS (GGUF)** | ~4 (imatrix-calibrated) | 0.22× | Better than Q4_K_M | 2.5× | Yes | Yes | Yes | Best 4-bit quality; requires importance matrix |
| **IQ3_XXS (GGUF)** | ~3 (imatrix) | 0.17× | Significant | 3× | Yes | Yes | Yes | Aggressive compression with imatrix calibration |
| **Q3_K_M (GGUF)** | ~3.5 (k-quant) | 0.19× | Significant (3–5% MMLU drop) | 3× | Yes | Yes | Yes | Minimum viable quality; use when RAM very constrained |
| **Q3_K_S (GGUF)** | ~3 (smaller) | 0.18× | More than Q3_K_M | 3× | Yes | Yes | Yes | Smaller Q3 variant |
| **Q2_K (GGUF)** | ~2.5 (k-quant) | 0.14× | High (5–10% MMLU drop) | 4× | Yes | Yes | Yes | Extreme compression; noticeable quality loss for all tasks |
| **GPTQ INT4** | 4 | 0.25× | Moderate (similar to Q4) | 3× (GPU) | No | CUDA only | No | GPU-only; calibrated on sample data; older server standard |
| **AWQ INT4** | 4 | 0.25× | Less than GPTQ (activation-aware) | 3× (GPU) | No | CUDA only | No | Better than GPTQ; activation magnitudes protect key weights |
| **EXL2 (variable)** | 2–8 per layer | Variable | Tunable per quality target | 3–4× | No | CUDA only | No | Best NVIDIA quality/speed; ExLlamaV2 only |
| **EETQ INT8** | 8 | 0.5× | Very small | 2× | No | CUDA only | No | TGI-specific; fast INT8 without calibration |
| **bitsandbytes 4-bit (NF4)** | 4 | 0.25× | Moderate | 2× | No | CUDA | No | HuggingFace QLoRA training; NormalFloat quantization |
| **MLC INT4** | 4 | 0.25× | Similar to Q4_K_M | 3× (GPU) | Yes | Yes | Yes (via Vulkan) | MLC LLM mobile deployment; TVM-compiled |
| **INT4 (CoreML palettized)** | 4 | 0.25× | Moderate | 3× (ANE) | iOS/macOS only | No | ANE | Apple on-device deployment via Core ML |

### Quality Degradation by Task Type

Different tasks are more sensitive to quantization:

| Task | Most Sensitive Quantization | Minimum Recommended |
|---|---|---|
| Mathematical reasoning | High sensitivity | Q5_K_M or better |
| Code generation | High sensitivity | Q5_K_M or better |
| Factual QA (MMLU) | Medium sensitivity | Q4_K_M |
| Creative writing | Low sensitivity | Q3_K_M viable |
| Summarization | Low sensitivity | Q4_0 or Q3_K_M |
| Translation | Medium sensitivity | Q4_K_M |
| Tool use / function calling | Very high sensitivity | Q5_K_M or Q8 |
| Long-context reasoning | High sensitivity (KV cache quality) | Q4_K_M minimum |

---

## Benchmark Guide

Every standardized evaluation used to compare AI models, with AGI-specific interpretation.

| Benchmark | Full Name | What It Tests | Score Range | Human Baseline | Top OSS Score (2025) | AGI Threshold | Notes |
|---|---|---|---|---|---|---|---|
| **MMLU** | Massive Multitask Language Understanding | 57 academic subjects: STEM, humanities, social sciences, law, medicine, history | 0–100% | ~89% (human expert avg) | Qwen2.5 72B: 86.1%, Llama 3.1 405B: 88.6% | ≥89% (human expert parity) | Gold standard for general knowledge. 14,000 multiple-choice questions. Random baseline: 25%. |
| **MMLU-Pro** | MMLU Professional | Harder version of MMLU: 10 choices, more complex reasoning required | 0–100% | ~86% | ~60–70% (open models) | ≥80% | Harder than MMLU; better discriminates strong models. 10-option questions. |
| **ARC-Challenge** | AI Reasoning Challenge | Grade-school science questions requiring reasoning beyond memorization | 0–100% | ~70–80% | ~90%+ for 70B models | ≥92% | 1,172 hard science questions. Easy baseline: 33%. Part of Open LLM Leaderboard. |
| **HellaSwag** | — | Commonsense natural language inference; sentence completion | 0–100% | ~95% | ~95%+ (near saturation for large models) | ≥97% | Nearly solved by 70B models. Still useful for small model discrimination. |
| **HumanEval** | — | Python code generation: 164 problems, pass@1 | 0–100% | ~88% (human programmer) | Qwen2.5-Coder 32B: 92.7% | ≥90% | Industry standard code benchmark. `pass@1` = single sample correctness. |
| **HumanEval+** | Extended HumanEval | HumanEval with stronger test cases | 0–100% | ~88% | ~85–90% (best code models) | ≥90% | Catches more edge case failures than original HumanEval. |
| **MBPP** | Mostly Basic Python Programming | 374 Python problems from crowdsourced simple tasks | 0–100% | ~90% | ~85%+ (strong models) | ≥90% | Complements HumanEval; simpler problems |
| **GSM8K** | Grade School Math 8K | 8,500 elementary math word problems | 0–100% | ~100% (simple for adults) | ~95%+ (frontier models) | ≥99% | Solved by frontier models; use MATH for harder evaluation |
| **MATH** | Hendrycks MATH | Competition-level mathematics (AMC, AIME, Olympiad) | 0–100% | ~40% (human non-expert) / ~90% (expert) | DeepSeek R1: ~90%+ | ≥90% (expert human) | Genuinely hard; separates reasoning models from knowledge-retrieval models |
| **AIME** | American Invitational Mathematics Examination | High school math olympiad problems | 0–30 problems | ~30% (top students) | DeepSeek R1: ~79.8% (AIME 2024) | ≥90% (AIME 2024) | Best reasoning benchmark; highly discriminative |
| **MT-Bench** | Multi-Turn Benchmark | 80 multi-turn conversations in 8 categories; judged by GPT-4 | 1–10 | GPT-4 ~9.0, Human ~9.0 | ~8.5–9.0 (frontier open models) | ≥9.0 | Instruction-following quality in dialogue. Judge bias toward verbosity. |
| **LMSYS Arena / Chatbot Arena** | — | Human preference voting; head-to-head model comparisons | ELO 800–1400+ | — | llama 3.3 70B ELO ~1250 | — | Gold standard for real-world preference; slow to accrue enough votes for new models |
| **TruthfulQA** | — | Truthfulness on 817 adversarial trick questions (designed to exploit human misconceptions) | 0–100% | ~94% (truthful) | ~70–80% (open models) | ≥94% | Tests hallucination resistance. Models tend to learn human misconceptions. |
| **BigBench Hard** | Beyond the Imitation Game Benchmark (Hard subset) | 23 challenging tasks across diverse reasoning types | 0–100% per task | — | ~80%+ (frontier models) | ≥85% avg | Subset of BIG-bench tasks that remain hard for frontier models |
| **ARC-AGI** | Abstraction and Reasoning Corpus for AGI | Novel visual reasoning tasks that require generalizing from few examples | 0–100% | ~98% | o3 (high): ~88% (with compute), best open: ~25–40% | ≥95% | **The closest to an AGI benchmark**. Requires genuine abstraction, not memorization. Huge compute-accuracy tradeoff. |
| **SWE-Bench Verified** | Software Engineering Benchmark | Real GitHub issues from popular repositories; model must fix code | 0–100% | ~100% (human engineer with context) | Claude 3.5 Sonnet: 49% (cloud) | ≥70% | Best real-world coding benchmark. Harder than HumanEval; requires understanding codebase context. |
| **GPQA** | Graduate-Level Google-Proof Q&A | Expert-level PhD questions in biology, chemistry, physics | 0–100% | ~65% (PhD experts in field) | ~50–60% (frontier open models) | ≥75% | Extremely hard; designed to be impossible to Google. True understanding required. |
| **IFEval** | Instruction Following Evaluation | 500 verifiable instruction-following tasks (format, length, content) | 0–100% | — | ~85–90% (frontier models) | ≥95% | Tests strict instruction adherence. Critical for agentic/tool use scenarios. |
| **BFCL (Berkeley Function Calling)** | Berkeley Function Calling Leaderboard | Tool use / function calling accuracy | 0–100% | — | ~85–90% (frontier models) | ≥95% | Critical for AGI systems. Measures JSON schema compliance and parameter extraction. |
| **AlpacaEval 2.0** | — | Win rate vs GPT-4 Turbo on 805 instructions | Win rate 0–100% | GPT-4 Turbo = baseline | ~60–75% (frontier open vs GPT-4T) | >75% vs GPT-4 Turbo | Instruction-following quality; length-controlled variant reduces verbosity bias. |
| **RULER** | Retrieval and Understanding for Long-context Eval | Long context understanding: retrieval, QA, summarization at 4K–128K+ | 0–100% | — | ~80–90% at 32K for strong models | ≥90% at 128K | Critical for AGI long-context memory. Most models degrade sharply beyond 32K "effective" context. |
| **FRAMES** | Factuality, Retrieval, And Multi-hop Evaluation of Summarization | Long-context factuality over multiple documents | 0–100% | — | ~60–70% (frontier) | ≥85% | Tests multi-document reasoning and factual synthesis |
| **LiveCodeBench** | — | Continuously updated coding problems from LeetCode, AtCoder, CodeForces | 0–100% | — | ~40–60% (frontier models) | ≥75% | Anti-contamination benchmark; problems post-date training cutoffs |
| **MultiIF** | Multi-turn Instruction Following | Instruction following over multi-turn conversations | 0–100% | — | ~75–85% | ≥95% | Harder version of IFEval; tracks instruction accumulation across turns |

### Benchmark Contamination Warning

Models trained on internet data may have seen benchmark questions during training, inflating scores. More reliable benchmarks:

- **Anti-contamination**: LiveCodeBench, ARC-AGI (novel tasks), Chatbot Arena (human votes on new convos)
- **Potentially contaminated**: MMLU, HumanEval, GSM8K (widely reproduced online)
- **Mitigation**: Use multiple benchmarks; look for consistency across contaminated and non-contaminated ones

---

## AGI Capability Checklist

What a system would need to achieve on each dimension to be considered capable of general intelligence tasks across all domains.

### Current Best (2025) vs AGI Threshold

| Capability | Best Open Source | Best Proprietary | AGI Threshold | Gap |
|---|---|---|---|---|
| **General knowledge (MMLU)** | 88.6% (Llama 405B) | ~90%+ (GPT-4o) | ≥89% human expert | Near-closed for large models |
| **Mathematical reasoning (MATH)** | ~90% (R1 distills) | ~95% (o3) | ≥90% | Near-closed for reasoning models |
| **Code generation (HumanEval)** | 92.7% (Qwen2.5-Coder 32B) | ~95% | ≥90% | Reached by best code models |
| **Novel abstract reasoning (ARC-AGI)** | ~40% (frontier open) | 88% (o3, max compute) | ≥98% human | **Large gap remains** |
| **Real software engineering (SWE-Bench)** | ~20–25% (open models) | 49% (Claude 3.5 Sonnet) | ≥90% | **Large gap remains** |
| **Long-context faithfulness (RULER 128K)** | ~60–70% (strong models) | ~80% (Gemini 2.5) | ≥95% | Significant gap |
| **Instruction following (IFEval)** | ~85% | ~92% | ≥99% | Gap remains |
| **Tool use accuracy (BFCL)** | ~80–85% | ~90% | ≥99% | Gap remains |
| **Multimodal understanding** | Limited (Llama 11B vision) | Strong (GPT-4o, Gemini) | All modalities seamlessly | Significant gap in open models |
| **Multi-step planning** | Poor (no standardized benchmark) | Moderate | Robust | Not well measured |
| **Self-correction / metacognition** | Poor | Moderate | Reliable self-assessment | Not well measured |
| **Continual learning** | No (static weights) | No | Needed for true AGI | Fundamental limitation |

### The On-Device AGI Capability Gap

For on-device AGI specifically, the additional challenge:

| Constraint | Today's Best On-Device | Required for AGI | Gap |
|---|---|---|---|
| Model size (consumer device) | ~4B params | ~70B+ params equivalent | 20× |
| Memory | 4–8 GB (mobile) | 64 GB+ | 8–16× |
| Speed | 30–50 t/s (mobile) | 100+ t/s | 2–3× |
| Context | 4K–32K (practical mobile) | 1M+ | 32–250× |
| Modalities | Text primary | All modalities | Vision improving; audio/video missing |
| Tool use reliability | Poor at <4B | 95%+ accuracy needed | Large gap |

---

## Memory and Storage Formulas

Essential calculations for planning model deployments.

### Core Formulas

```
# VRAM / RAM for inference (GPU/unified memory)
FP32_VRAM_GB  = parameters_billions × 4
FP16_VRAM_GB  = parameters_billions × 2
BF16_VRAM_GB  = parameters_billions × 2
INT8_VRAM_GB  = parameters_billions × 1
Q4_VRAM_GB    = parameters_billions × 0.55   # approximate for k-quant
Q4_0_VRAM_GB  = parameters_billions × 0.50   # theoretical minimum

# Storage (file size on disk)
FP16_storage_GB  = parameters_billions × 2.0
Q8_storage_GB    = parameters_billions × 1.1
Q5_K_M_storage_GB = parameters_billions × 0.65
Q4_K_M_storage_GB = parameters_billions × 0.55
Q3_K_M_storage_GB = parameters_billions × 0.40
Q2_K_storage_GB  = parameters_billions × 0.28

# KV Cache (per token, approximate)
# For standard MHA:
KV_cache_GB = (2 × num_layers × num_kv_heads × head_dim × sequence_length × bytes_per_element) / 1e9

# Example: Llama 3.1 8B at 8K context (FP16):
# 2 × 32 × 8 × 128 × 8192 × 2 bytes = 1.07 GB

# For GQA models (most modern models), KV cache is smaller:
# Llama 3.2 3B (GQA, 8 KV heads): 
# 2 × 28 × 8 × 128 × 8192 × 2 bytes = 0.94 GB at 8K

# Rule: KV cache at 2K context ≈ small; at 128K context = multiply by 64

# Total RAM Required
total_ram_GB = model_vram_GB + kv_cache_GB + framework_overhead_GB + os_GB

# Framework overhead:
# llama.cpp: ~0.3–0.5 GB
# PyTorch/Transformers: ~1.5–3 GB
# Ollama: ~0.5 GB

# OS overhead:
# Minimal Linux: 0.5–1 GB
# Ubuntu Desktop: 2–3 GB
# macOS: 3–4 GB
# Windows: 4–6 GB
```

### MoE Memory Formula

```
# MoE models: ALL experts must be in memory (router can pick any)
MoE_VRAM_GB = total_params_billions × bits_per_weight_bytes

# DeepSeek V3 at Q4:
# 671B × 0.55 = 369 GB (approx; actual slightly higher due to attention weights)
# Need at least 4× H100 80GB (320 GB) with offloading, 8× H100 comfortably

# Active compute cost:
# DeepSeek V3: 37B active params per token ≈ cost of running a 37B dense model
```

### Context Length Scaling

KV cache grows linearly with context. This is why long-context inference is expensive:

| Context Length | KV Cache (Llama 3.1 8B, FP16) | KV Cache (Llama 3.1 70B, FP16) |
|---|---|---|
| 2K | 0.27 GB | 2.10 GB |
| 8K | 1.07 GB | 8.39 GB |
| 32K | 4.30 GB | 33.6 GB |
| 128K | 17.2 GB | 134 GB |

> This is why 70B models at 128K context need ~134 GB just for the KV cache — on top of 140 GB for weights = 274 GB total. Multi-GPU becomes essential.

### Quick Reference: GB per Billion Parameters

| Precision / Format | GB per 1B params | Example: 7B | Example: 70B |
|---|---|---|---|
| FP32 | 4.0 | 28 GB | 280 GB |
| FP16 / BF16 | 2.0 | 14 GB | 140 GB |
| Q8_0 | 1.0 | 7 GB | 70 GB |
| Q6_K | 0.73 | 5.1 GB | 51 GB |
| Q5_K_M | 0.65 | 4.5 GB | 45 GB |
| Q4_K_M | 0.55 | 3.8 GB | 38 GB |
| Q4_0 | 0.50 | 3.5 GB | 35 GB |
| Q3_K_M | 0.40 | 2.8 GB | 28 GB |
| Q2_K | 0.28 | 1.9 GB | 19 GB |

---

## Speed Estimation by Hardware

Approximate token generation speed for common hardware and model sizes. **Generation speed** (decode phase, single batch, 1 request). Prefill (prompt processing) is typically 5–20× faster per token.

| Hardware | 7B Q4 | 13B Q4 | 32B Q4 | 70B Q4 | Notes |
|---|---|---|---|---|---|
| **Intel Core i9-13900K (DDR5)** | 8–12 t/s | 4–6 t/s | N/A | N/A | CPU-only; AVX-512; ~100 GB/s BW |
| **Apple M1 MacBook (8 GB)** | 20–25 t/s | ~10 t/s | N/A | N/A | 8-core GPU, 68 GB/s, model barely fits |
| **Apple M1 MacBook (16 GB)** | 28–35 t/s | 14–18 t/s | N/A | N/A | Comfortable for 7B; 13B Q4 fits |
| **Apple M2 MacBook (24 GB)** | 38–46 t/s | 20–26 t/s | 9–12 t/s | N/A | 24 GB: 32B Q4 just fits |
| **Apple M3 Pro (36 GB)** | 55–65 t/s | 28–35 t/s | 13–17 t/s | 5–6 t/s (tight) | 150 GB/s BW |
| **Apple M3 Max (64 GB)** | 80–95 t/s | 45–55 t/s | 20–26 t/s | 10–13 t/s | 300 GB/s BW; 70B Q4 fits |
| **Apple M3 Max (128 GB)** | 85–100 t/s | 50–60 t/s | 22–28 t/s | 14–18 t/s | 70B Q8 fits |
| **Apple M4 Pro (48 GB)** | 90–110 t/s | 50–60 t/s | 22–28 t/s | N/A | 273 GB/s BW |
| **Apple M4 Max (128 GB)** | 120–140 t/s | 65–80 t/s | 30–38 t/s | 18–22 t/s | 546 GB/s BW; best consumer |
| **Apple M4 Ultra (192 GB)** | 160–200 t/s | 90–110 t/s | 45–55 t/s | 28–35 t/s | 1,092 GB/s BW |
| **RTX 3060 (12 GB CUDA)** | 45–55 t/s | 22–28 t/s | N/A | N/A | 360 GB/s; 13B Q4 fits |
| **RTX 3090 (24 GB CUDA)** | 80–95 t/s | 40–50 t/s | N/A | N/A | 936 GB/s; 32B Q4 fits |
| **RTX 4080 (16 GB CUDA)** | 90–110 t/s | 45–55 t/s | N/A | N/A | 736 GB/s; 13B Q8 |
| **RTX 4090 (24 GB CUDA)** | 110–130 t/s | 55–65 t/s | N/A | N/A | 1,008 GB/s; 32B Q4 fits |
| **RTX 5090 (32 GB CUDA)** | 140–165 t/s | 75–90 t/s | 35–45 t/s | N/A | 1,792 GB/s |
| **A100 40 GB** | 130–150 t/s | 70–85 t/s | N/A | N/A | 1,555 GB/s; 32B Q4 fits |
| **A100 80 GB** | 160–180 t/s | 90–110 t/s | 40–50 t/s | 22–28 t/s | 2,000 GB/s; 70B fits |
| **2× A100 80 GB** | 165–185 t/s | 95–115 t/s | 45–55 t/s | 40–50 t/s | Tensor parallel; scales nearly linear |
| **H100 SXM 80 GB** | 250–300 t/s | 140–170 t/s | 70–85 t/s | 35–45 t/s | 3,350 GB/s HBM3 |
| **H200 141 GB** | 350–420 t/s | 190–240 t/s | 100–125 t/s | 55–70 t/s | 4,800 GB/s HBM3e |
| **Snapdragon 8 Gen 3 (mobile)** | 30–50 t/s | N/A | N/A | N/A | GPU via Vulkan/OpenCL |
| **Apple A17 Pro (mobile)** | 30–45 t/s | N/A | N/A | N/A | ANE + GPU; 4B Q4 practical limit |

> All numbers are approximate, single-request generation speed using popular frameworks (MLX for Apple, ExLlamaV2/vLLM for NVIDIA, llama.cpp for general). Throughput (multiple concurrent requests) can be higher with batching. Prefill speed (processing long prompts) is 5–20× faster per token than generation.

### Speed Improvement Strategies

| Strategy | Speedup | Trade-off | When to Use |
|---|---|---|---|
| Lower quantization (Q8 → Q4) | 1.5–2× generation | Quality degradation | RAM-constrained |
| Speculative decoding | 2–3× | Needs small draft model | Long outputs, low latency |
| Flash Attention | 1.5–2× prefill | None (pure optimization) | Always enable if supported |
| KV cache sharing (SGLang RadixAttention) | 2–5× throughput | None | Repeated prefixes (RAG, system prompts) |
| Continuous batching | 10–50× throughput (not per-request) | Slightly higher per-request latency | Production serving |
| Tensor parallelism | Near-linear scaling | Requires NVLink for best results | Multi-GPU serving |
| Smaller model (7B vs 13B) | 2× | Quality reduction | Latency-critical applications |
| Longer context → larger KV cache → slower | Inverse | None (fundamental) | Minimize context when speed critical |
