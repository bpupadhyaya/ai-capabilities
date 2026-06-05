# Open Source AI Models — Complete Reference

> Exhaustive reference for AGI developers building on-device, offline, and self-hosted AI systems.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Mobile / Edge Models](#mobileEdge-models)
3. [Desktop / Laptop Models](#desktop--laptop-models)
4. [Datacenter Models](#datacenter-models)
5. [License Comparison](#license-comparison)
6. [Inference Frameworks](#inference-frameworks)

---

## Introduction

Open source AI models are the foundation of trustworthy AGI development. The key advantages over proprietary cloud APIs are:

- **Privacy**: Data never leaves your hardware. No telemetry, no training on your prompts, HIPAA/GDPR/EU AI Act compliance is achievable.
- **Customization**: Fine-tune on domain-specific data, adjust system prompts without restrictions, modify architectures.
- **No Vendor Lock-in**: Switch providers, models, and quantizations without API key dependencies or pricing changes.
- **Reproducibility**: Pin exact model versions (commits, quantizations, checkpoints). Results are deterministic and auditable.
- **Cost**: After hardware acquisition, inference is free at any scale. No per-token billing.
- **Offline Operation**: Works in air-gapped environments, remote locations, and on-device deployments.
- **Research Transparency**: Access to weights, training details, and architecture papers.

For AGI development specifically, open source models allow you to build agentic loops, long-running reasoning pipelines, and persistent memory systems without worrying about API rate limits, costs that scale with usage, or model behavior changes in future API versions.

---

## Mobile / Edge Models

Models suitable for smartphones, tablets, single-board computers, and edge devices. Generally under 4B parameters. RAM figures are for inference with a short context window; longer contexts require more RAM for the KV cache.

> **Key**: HF = HuggingFace available | OL = Ollama tag exists | WL = WebLLM supported

| Model | Organization | Params | Context | RAM Min | Storage (Q4) | Modalities | License | HF | Ollama | WebLLM |
|---|---|---|---|---|---|---|---|---|---|---|
| SmolLM2 135M | HuggingFace | 0.135B | 2K | 0.2 GB | 0.1 GB | Text | Apache 2.0 | ✓ | ✗ | ✓ |
| SmolLM2 360M | HuggingFace | 0.36B | 8K | 0.4 GB | 0.2 GB | Text | Apache 2.0 | ✓ | ✗ | ✓ |
| SmolLM2 1.7B | HuggingFace | 1.7B | 8K | 1.5 GB | 1.0 GB | Text | Apache 2.0 | ✓ | ✓ | ✓ |
| TinyLlama 1.1B | TinyLlama Project | 1.1B | 2K | 1.0 GB | 0.6 GB | Text | Apache 2.0 | ✓ | ✓ | ✓ |
| Qwen2.5 0.5B | Alibaba DAMO | 0.5B | 32K | 0.5 GB | 0.4 GB | Text | Qwen License | ✓ | ✓ | ✓ |
| Qwen2.5 1.5B | Alibaba DAMO | 1.5B | 32K | 1.5 GB | 1.0 GB | Text | Qwen License | ✓ | ✓ | ✓ |
| Qwen2.5 3B | Alibaba DAMO | 3B | 32K | 2.5 GB | 1.9 GB | Text | Qwen License | ✓ | ✓ | ✓ |
| DeepSeek-R1-Distill-Qwen 1.5B | DeepSeek | 1.5B | 64K | 2.0 GB | 1.0 GB | Text | MIT | ✓ | ✓ | ✗ |
| OLMo 1B | Allen Institute for AI | 1B | 2K | 1.0 GB | 0.6 GB | Text | Apache 2.0 | ✓ | ✓ | ✗ |
| Falcon 1B | Technology Innovation Institute | 1B | 2K | 1.0 GB | 0.7 GB | Text | Apache 2.0 | ✓ | ✗ | ✗ |
| OpenELM 1.1B | Apple | 1.1B | 2K | 1.5 GB | 0.7 GB | Text | Apple Sample Code License | ✓ | ✗ | ✗ |
| OpenELM 3B | Apple | 3B | 2K | 3.0 GB | 1.7 GB | Text | Apple Sample Code License | ✓ | ✗ | ✗ |
| MiniCPM 2B | ModelBest / Tsinghua | 2B | 4K | 2.0 GB | 1.2 GB | Text | Apache 2.0 | ✓ | ✓ | ✗ |
| MiniCPM 3B | ModelBest / Tsinghua | 3B | 32K | 3.0 GB | 1.9 GB | Text | MiniCPM License | ✓ | ✓ | ✗ |
| Gemma 3 1B | Google DeepMind | 1B | 32K | 1.0 GB | 0.7 GB | Text | Gemma ToS | ✓ | ✓ | ✓ |
| Gemma 3 4B | Google DeepMind | 4B | 128K | 3.0 GB | 2.5 GB | Text + Vision | Gemma ToS | ✓ | ✓ | ✓ |
| Gemma 3n E2B | Google DeepMind | ~2B eff. | 32K | 2.0 GB | 1.0 GB | Text | Gemma ToS | ✓ | ✓ | ✗ |
| Gemma 3n E4B | Google DeepMind | ~4B eff. | 128K | 3.0 GB | 2.0 GB | Text + Vision + Audio | Gemma ToS | ✓ | ✓ | ✗ |
| Gemma 2 2B | Google DeepMind | 2B | 8K | 2.0 GB | 1.3 GB | Text | Gemma ToS | ✓ | ✓ | ✓ |
| Phi-3 Mini 3.8B | Microsoft Research | 3.8B | 128K | 3.0 GB | 2.2 GB | Text | MIT | ✓ | ✓ | ✓ |
| Phi-3.5 Mini 3.8B | Microsoft Research | 3.8B | 128K | 3.0 GB | 2.2 GB | Text | MIT | ✓ | ✓ | ✓ |
| Phi-4 Mini 3.8B | Microsoft Research | 3.8B | 128K | 3.0 GB | 2.2 GB | Text | MIT | ✓ | ✓ | ✗ |
| Llama 3.2 1B | Meta AI | 1B | 128K | 1.0 GB | 0.7 GB | Text | Llama 3.2 Community | ✓ | ✓ | ✓ |
| Llama 3.2 3B | Meta AI | 3B | 128K | 3.0 GB | 1.9 GB | Text | Llama 3.2 Community | ✓ | ✓ | ✓ |

### Notes on Mobile Models

- **Gemma 3n E2B/E4B**: Use a novel **MatFormer** (nested architecture) design that allows the model to adaptively use fewer parameters for simpler tasks. E2B and E4B denote effective parameter counts, not full parameter counts. Audio modality is experimental.
- **OpenELM**: Apple's on-device model uses layer-wise parameter allocation and is optimized for Core ML / ANE deployment. The "Apple Sample Code License" restricts redistribution and commercial use.
- **DeepSeek-R1-Distill-Qwen 1.5B**: Despite small size, inherits chain-of-thought reasoning behavior from R1's distillation process. Strong at math and logical reasoning relative to its parameter count.
- **MiniCPM 3B**: 32K context on a 3B model is notable. Uses sliding window attention. Good general-purpose edge model from Tsinghua.
- **Phi series (Microsoft)**: "Textbook quality" training data approach. Phi-4 Mini achieves near-7B quality in a 3.8B footprint.

---

## Desktop / Laptop Models

Models suitable for consumer laptops (8–64 GB RAM) and workstations (64 GB+). Organized by parameter count. RAM figures are for Q4_K_M quantization unless noted.

| Model | Org | Params | Context | RAM (Q4) | VRAM | Storage Q4 | Quantizations | Best Use | HF | Ollama |
|---|---|---|---|---|---|---|---|---|---|---|
| Mistral 7B v0.3 | Mistral AI | 7B | 32K | 6 GB | 6 GB | 4.1 GB | Q2–Q8, FP16 | General, chat, instruction | ✓ | ✓ |
| Falcon 7B | TII | 7B | 2K | 6 GB | 6 GB | 4.1 GB | Q2–Q8 | Research, text gen | ✓ | ✓ |
| WizardLM-2 7B | Microsoft/Wizard | 7B | 32K | 6 GB | 6 GB | 4.1 GB | Q4–Q8 | Instruction following | ✓ | ✓ |
| Zephyr 7B Beta | HuggingFace H4 | 7B | 32K | 6 GB | 6 GB | 4.1 GB | Q4–Q8 | Chat, DPO-tuned | ✓ | ✓ |
| CodeLlama 7B | Meta AI | 7B | 16K | 6 GB | 6 GB | 3.8 GB | Q4–Q8 | Code (HumanEval 33.5%) | ✓ | ✓ |
| Qwen2.5 7B | Alibaba DAMO | 7B | 128K | 6 GB | 6 GB | 4.7 GB | Q4–Q8 | General, multilingual | ✓ | ✓ |
| Qwen2.5-Coder 7B | Alibaba DAMO | 7B | 128K | 6 GB | 6 GB | 4.7 GB | Q4–Q8 | Code (HumanEval 88.4%) | ✓ | ✓ |
| DeepSeek-R1-Distill-Llama 8B | DeepSeek | 8B | 64K | 6 GB | 6 GB | 4.9 GB | Q4–Q8 | Reasoning, math | ✓ | ✓ |
| Llama 3.1 8B | Meta AI | 8B | 128K | 6 GB | 6 GB | 4.7 GB | Q4–Q8 | General purpose flagship | ✓ | ✓ |
| StarCoder2 7B | BigCode / HF | 7B | 16K | 6 GB | 6 GB | 4.0 GB | Q4–Q8 | Code generation | ✓ | ✓ |
| Marco-o1 7B | AIDC-AI | 7B | 8K | 6 GB | 6 GB | 4.1 GB | Q4–Q8 | Reasoning/chain-of-thought | ✓ | ✓ |
| EXAONE 3.5 7.8B | LG AI Research | 7.8B | 32K | 7 GB | 7 GB | 4.6 GB | Q4–Q8 | Bilingual (EN/KO) | ✓ | ✓ |
| LLaVA 1.6 7B | LLaVA Team / MS | 7B | 32K | 8 GB | 8 GB | 4.8 GB | Q4–Q8 | Vision + text | ✓ | ✓ |
| GLM-4 9B | Zhipu AI | 9B | 1M | 8 GB | 8 GB | 5.4 GB | Q4–Q8 | Long-context, Chinese+EN | ✓ | ✓ |
| Yi 1.5 9B | 01.AI | 9B | 4K | 8 GB | 8 GB | 5.4 GB | Q4–Q8 | General, Chinese+EN | ✓ | ✓ |
| Gemma 2 9B | Google DeepMind | 9B | 8K | 8 GB | 8 GB | 5.4 GB | Q4–Q8 | General, strong for size | ✓ | ✓ |
| InternLM 2.5 7B | Shanghai AI Lab | 7B | 1M | 6 GB | 6 GB | 4.1 GB | Q4–Q8 | Long-context, tool use | ✓ | ✓ |
| Phi-3 Medium 14B | Microsoft Research | 14B | 128K | 12 GB | 12 GB | 8.2 GB | Q4–Q8 | Instruction following | ✓ | ✓ |
| Phi-4 14B | Microsoft Research | 14B | 16K | 12 GB | 12 GB | 8.2 GB | Q4–Q8 | General (MMLU 84.8%) | ✓ | ✓ |
| Phi-4 Reasoning 14B | Microsoft Research | 14B | 32K | 12 GB | 12 GB | 8.2 GB | Q4–Q8 | Reasoning + math | ✓ | ✓ |
| Mistral Nemo 12B | Mistral AI / NVIDIA | 12B | 128K | 10 GB | 10 GB | 7.0 GB | Q4–Q8 | General, multilingual | ✓ | ✓ |
| CodeLlama 13B | Meta AI | 13B | 16K | 10 GB | 10 GB | 7.4 GB | Q4–Q8 | Code generation | ✓ | ✓ |
| LLaVA 1.6 13B | LLaVA Team | 13B | 4K | 12 GB | 12 GB | 8.0 GB | Q4–Q8 | Vision + text | ✓ | ✓ |
| Orca 2 13B | Microsoft Research | 13B | 4K | 10 GB | 10 GB | 7.6 GB | Q4–Q8 | Reasoning (step-by-step) | ✓ | ✓ |
| Qwen2.5 14B | Alibaba DAMO | 14B | 128K | 12 GB | 12 GB | 9.0 GB | Q4–Q8 | General, multilingual | ✓ | ✓ |
| Qwen2.5-Coder 14B | Alibaba DAMO | 14B | 128K | 12 GB | 12 GB | 9.0 GB | Q4–Q8 | Code (top OSS coder) | ✓ | ✓ |
| DeepSeek-R1-Distill-Qwen 14B | DeepSeek | 14B | 64K | 12 GB | 12 GB | 9.0 GB | Q4–Q8 | Reasoning, chain-of-thought | ✓ | ✓ |
| SOLAR 10.7B | Upstage AI | 10.7B | 4K | 8 GB | 8 GB | 6.3 GB | Q4–Q8 | General, depth upscaling | ✓ | ✓ |
| Vicuna 13B | LMSYS / UC Berkeley | 13B | 4K | 10 GB | 10 GB | 7.3 GB | Q4–Q8 | Chat, legacy | ✓ | ✓ |
| StarCoder2 15B | BigCode / HF | 15B | 16K | 12 GB | 12 GB | 9.0 GB | Q4–Q8 | Code generation | ✓ | ✓ |
| DeepSeek-Coder-V2-Lite 16B | DeepSeek | 16B total (2.4B active MoE) | 128K | 14 GB | 14 GB | 9.7 GB | Q4–Q8 | Code (MoE efficiency) | ✓ | ✓ |
| Llama 3.2 11B Vision | Meta AI | 11B | 128K | 10 GB | 10 GB | 6.5 GB | Q4–Q8 | Vision + text | ✓ | ✓ |
| Gemma 3 12B | Google DeepMind | 12B | 128K | 10 GB | 10 GB | 7.0 GB | Q4–Q8 | General, vision | ✓ | ✓ |
| Gemma 2 27B | Google DeepMind | 27B | 8K | 20 GB | 20 GB | 16 GB | Q4–Q8 | General, top 27B | ✓ | ✓ |
| InternLM 2.5 20B | Shanghai AI Lab | 20B | 1M | 16 GB | 16 GB | 12 GB | Q4–Q8 | Long-context, tool use | ✓ | ✓ |
| Mistral Small 22B | Mistral AI | 22B | 32K | 16 GB | 16 GB | 13 GB | Q4–Q8 | Efficient large model | ✓ | ✓ |
| Codestral 22B | Mistral AI | 22B | 32K | 16 GB | 16 GB | 13 GB | Q4–Q8 | Code (HumanEval 81.1%) | ✓ | ✓ |
| Yi 1.5 34B | 01.AI | 34B | 4K | 24 GB | 24 GB | 20 GB | Q4–Q8 | General, large capacity | ✓ | ✓ |
| Qwen2.5 32B | Alibaba DAMO | 32B | 128K | 24 GB | 24 GB | 19 GB | Q4–Q8 | General, multilingual | ✓ | ✓ |
| DeepSeek-R1-Distill-Qwen 32B | DeepSeek | 32B | 64K | 24 GB | 24 GB | 19 GB | Q4–Q8 | Reasoning, near R1 full | ✓ | ✓ |
| Command R 35B | Cohere | 35B | 128K | 28 GB | 28 GB | 21 GB | Q4–Q8 | RAG, tool use | ✓ | ✓ |
| Gemma 3 27B | Google DeepMind | 27B | 128K | 20 GB | 20 GB | 16 GB | Q4–Q8 | General, vision | ✓ | ✓ |
| Llama 3.3 70B | Meta AI | 70B | 128K | 43 GB | 48 GB | 43 GB | Q4–Q8 | Frontier-class open | ✓ | ✓ |

### Notes on Desktop Models

- **GLM-4 9B**: Achieves 1M token context through YaRN rotary position interpolation. Strong Chinese-English bilingual model.
- **InternLM 2.5 7B/20B**: 1M context via dynamic NTK scaling. Natively supports function calling and tool use.
- **DeepSeek-Coder-V2-Lite**: A 16B parameter MoE model where only 2.4B parameters are active per token — very efficient for code tasks.
- **SOLAR 10.7B**: Uses Depth Up-Scaling (DUS) to merge two 7B models into a 10.7B model without additional training. Strong general benchmark performance.
- **Qwen2.5-Coder 7B**: State-of-the-art code model at 7B parameters with 88.4% HumanEval. Competitive with much larger models.
- **Codestral 22B**: Mistral's dedicated code model. 81.1% HumanEval, 80+ programming languages, fill-in-the-middle support.

---

## Datacenter Models

Models requiring multi-GPU or high-RAM server infrastructure. Suitable for self-hosted production APIs, large-scale research, and fine-tuning.

| Model | Org | Params | Active (MoE) | Context | RAM Full | VRAM Config | Storage Q4 | License | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Llama 3.1 70B | Meta AI | 70B | — | 128K | 140 GB | 2× A100 80GB | 43 GB | Llama 3.1 Community | MMLU 83.6% |
| Llama 3.1 405B | Meta AI | 405B | — | 128K | 810 GB | 8× A100 80GB | 243 GB | Llama 3.1 Community | MMLU 88.6%, frontier open model |
| Mixtral 8×7B | Mistral AI | 46.7B | 12.9B | 32K | 93 GB | 2× A100 80GB | 26 GB | Apache 2.0 | MoE, 8 experts top-2 |
| Mixtral 8×22B | Mistral AI | 141B | 39.1B | 64K | 282 GB | 4× A100 80GB | 80 GB | Apache 2.0 | MoE, 8 experts top-2 |
| Qwen2.5 72B | Alibaba DAMO | 72B | — | 128K | 144 GB | 2× A100 80GB | 43 GB | Qwen License | Strong multilingual |
| Qwen2.5-Coder 32B | Alibaba DAMO | 32B | — | 128K | 64 GB | 1× A100 80GB | 19 GB | Qwen License | HumanEval 92.7% |
| DeepSeek V3 | DeepSeek | 671B | 37B | 128K | 1,340 GB | 8× H100 min | 400 GB | MIT | 256 experts, top-8 MoE; MMLU 88.5% |
| DeepSeek R1 | DeepSeek | 671B | 37B | 128K | 1,340 GB | 8× H100 min | 400 GB | MIT | 256 experts, top-8 MoE; thinking model |
| Yi 34B | 01.AI | 34B | — | 200K | 68 GB | 1× A100 80GB | 20 GB | Yi License | 200K context via rope scaling |
| Falcon 40B | TII | 40B | — | 2K | 80 GB | 1× A100 80GB | 24 GB | Apache 2.0 | Early strong open model |
| Falcon 180B | TII | 180B | — | 2K | 360 GB | 8× A100 80GB | 108 GB | Falcon License | Largest Falcon |
| Command R+ 104B | Cohere | 104B | — | 128K | 208 GB | 4× A100 80GB | 62 GB | CC-BY-NC-4.0 | RAG + grounded generation |
| BLOOM 176B | BigScience | 176B | — | 2K | 352 GB | 8× A100 80GB | — | RAIL-M | 46 languages, fully open |
| GPT-NeoX 20B | EleutherAI | 20B | — | 2K | 40 GB | 1× A100 40GB | 12 GB | Apache 2.0 | Research, fully open |
| Grok-1 | xAI | 314B | 86B | 8K | 628 GB | 8× A100 80GB | 158 GB | Apache 2.0 | 16 experts, top-2 MoE |
| DBRX | Databricks | 132B | 36B | 32K | 264 GB | 4× A100 80GB | 72 GB | DBRX License | 16 experts, top-4 MoE |
| Aya Expanse 32B | Cohere | 32B | — | 128K | 64 GB | 1× A100 80GB | 19 GB | CC-BY-NC-4.0 | 23 languages |
| Nemotron-4 340B | NVIDIA | 340B | — | 4K | 680 GB | 8× A100 80GB | 196 GB | NVIDIA Open Model License | Strong RLHF |
| Mistral Large 2 123B | Mistral AI | 123B | — | 128K | 246 GB | 4× A100 80GB | 74 GB | Mistral Research License | Best open Mistral model |

---

## License Comparison

Understanding open source AI licenses is critical for commercial deployment and redistribution decisions.

| License | Commercial Use | Modify | Distribute | User Limit | Attribution | Notes |
|---|---|---|---|---|---|---|
| **Apache 2.0** | Yes | Yes | Yes | None | Required | Standard permissive; patent grant included. Most permissive. |
| **MIT** | Yes | Yes | Yes | None | Required | Minimal, maximally permissive. No patent grant. |
| **Llama 2 Community** | Yes (<700M MAU) | Yes | Yes | 700M MAU cap | Meta attribution | Free for commercial use below 700M monthly active users. Must follow acceptable use policy. |
| **Llama 3 / 3.1 / 3.2 Community** | Yes (<700M MAU) | Yes | Yes | 700M MAU cap | Meta attribution | Updated terms; broadly permissive. Derivatives must include "Built with Llama" |
| **Qwen License** | Yes (check per version) | Yes | Yes | None | Attribution | Qwen 2.0+ is broadly permissive. Earlier versions had restrictions. Check model card. |
| **Gemma Terms of Service** | Yes | Yes | Yes | None | Attribution | Must not use to improve other LLMs outside Google ecosystem. No competing model training. |
| **DBRX License** | No (requires agreement) | Restricted | Restricted | Agreement-based | Databricks | Not truly open; requires signing license agreement. Research use permitted. |
| **Falcon License** (180B) | Yes (>1M users needs agreement) | Yes | Yes | Conditional | TII attribution | Falcon 40B and below: Apache 2.0. 180B has additional terms. |
| **BigCode OpenRAIL-M** | Yes | Yes | Yes | None | Attribution | Behavioral use restrictions (cannot use for harm). StarCoder models. |
| **CC-BY-4.0** | Yes | Yes | Yes | None | Required | Creative Commons permissive. Less common for model weights. |
| **CC-BY-NC-4.0** | **No** | Yes | Yes (non-commercial) | None | Required | Non-commercial only. Cohere Aya, Command R+ use this. |
| **BLOOM RAIL-M** | Yes | Yes | Yes | None | Attribution | Responsible AI License with use restrictions. 46 language model. |
| **Mistral Research License** | **No (research only)** | Restricted | Restricted | Research use | Mistral attribution | Mistral Large 2 is research/non-commercial. |
| **NVIDIA Open Model License** | Restricted | Restricted | Restricted | Agreement-based | NVIDIA attribution | Nemotron models. Permits limited commercial use per agreement. |
| **Apple Sample Code License** | **No** | Restricted | Restricted | None (no redistribution) | Apple attribution | OpenELM — cannot redistribute model weights in products. |
| **Yi License** | Yes (<100M params free, larger needs agreement) | Yes | Yes (with conditions) | Conditional | 01.AI attribution | Yi-34B+ may require commercial agreement. |

### License Decision Matrix for AGI Developers

| Use Case | Recommended Licenses | Avoid |
|---|---|---|
| Commercial product, any scale | Apache 2.0, MIT, Llama 3 Community | CC-BY-NC, DBRX, Mistral Research |
| Open source research | Any | None |
| Internal enterprise tool | Apache 2.0, MIT, Llama 3, Qwen | CC-BY-NC if intent is commercial |
| Mobile app deployment | Apache 2.0, MIT, Gemma ToS, Phi MIT | Apple Sample Code License (no redistribution) |
| Fine-tuning for commercial release | Apache 2.0, MIT, Llama 3 | Gemma ToS (cannot train competing models) |

---

## Inference Frameworks

Tools for running open source models locally or on servers.

| Framework | Developer | Platform | Model Formats | GPU Backends | API Server | Chat UI | License | Best For |
|---|---|---|---|---|---|---|---|---|
| **llama.cpp** | Georgi Gerganov | Linux, macOS, Windows, Android | GGUF | CUDA, Metal, OpenCL, Vulkan, SYCL | Yes (REST) | No (CLI only) | MIT | Low-level control, embedded, maximum portability |
| **Ollama** | Ollama | Linux, macOS, Windows | GGUF (auto-pull) | CUDA, Metal, ROCm | Yes (REST + OpenAI-compat) | No (CLI) | MIT | Easiest local setup, one-command model management |
| **LM Studio** | LM Studio | macOS, Windows, Linux | GGUF | CUDA, Metal | Yes (OpenAI-compat) | Yes | Proprietary (free) | Non-technical users, easy GUI |
| **GPT4All** | Nomic AI | Linux, macOS, Windows | GGUF | CUDA, Metal | Yes | Yes | MIT | Privacy-focused, no telemetry |
| **Jan** | Jan.ai | Linux, macOS, Windows | GGUF | CUDA, Metal | Yes (OpenAI-compat) | Yes | AGPL-3.0 | Electron app, clean UI |
| **KoboldCpp** | LostRuins | Linux, macOS, Windows | GGUF | CUDA, Metal, Vulkan | Yes | Yes | AGPL-3.0 | Creative writing, roleplay, extended sampling |
| **text-generation-webui** | oobabooga | Linux, macOS, Windows | GGUF, GPTQ, AWQ, EXL2 | CUDA, Metal, ROCm | Yes | Yes | AGPL-3.0 | Power users, many backends/extensions |
| **MLX** | Apple | macOS only | MLX (convert from GGUF/HF) | Metal (Apple Silicon only) | No | No | MIT | Best Apple Silicon performance (llm framework: mlx-lm) |
| **vLLM** | UC Berkeley / vLLM Team | Linux (primary), macOS | HuggingFace, GGUF (limited), AWQ, GPTQ, FP8 | CUDA, ROCm, TPU, Neuron | Yes (OpenAI-compat) | No | Apache 2.0 | Production server, highest throughput |
| **TGI (Text Generation Inference)** | HuggingFace | Linux | HuggingFace, GGUF, AWQ, GPTQ | CUDA, ROCm, Inferentia | Yes (REST) | No | Apache 2.0 | HuggingFace ecosystem, production |
| **ExLlamaV2** | turboderp | Linux, Windows | EXL2, GPTQ | CUDA only | Yes | No | MIT | Fastest CUDA inference, best quality/speed on NVIDIA |
| **MLC LLM** | MLC.ai / CMU | Android, iOS, macOS, Linux | MLC (compile-time) | CUDA, Metal, Vulkan, OpenCL | Yes | Yes (web) | Apache 2.0 | Mobile deployment, WebLLM browser inference |
| **DeepSpeed Inference** | Microsoft | Linux | HuggingFace | CUDA | No (library) | No | Apache 2.0 | Multi-GPU serving, ZeRO optimization |
| **TensorRT-LLM** | NVIDIA | Linux | HuggingFace (compile to TRT) | CUDA only | No (library) | No | Apache 2.0 | Maximum NVIDIA throughput, H100/A100 |
| **llama-server** | llama.cpp team | All | GGUF | All llama.cpp backends | Yes (OpenAI-compat) | Yes (basic web) | MIT | Headless server from llama.cpp |
| **OpenLLM** | BentoML | Linux, macOS | HuggingFace, GGUF, GPTQ | CUDA, Metal | Yes (OpenAI-compat) | No | Apache 2.0 | BentoML ecosystem integration |
| **LiteLLM** | BerriAI | All | Proxy for all providers | Depends on backend | Yes (unified OpenAI proxy) | No | MIT | Unified API gateway, provider abstraction |

### Quick Selection Guide

| Scenario | Recommended Tool |
|---|---|
| First time, just want to chat | Ollama + Open WebUI |
| macOS Apple Silicon best performance | mlx-lm (via Ollama MLX or native) |
| Windows/Linux consumer GPU | Ollama or LM Studio |
| Production API server (NVIDIA) | vLLM |
| Mobile app (Android/iOS) | MLC LLM or llama.cpp Android |
| Fine-grained CUDA inference | ExLlamaV2 |
| Creative writing / roleplay | KoboldCpp |
| Multiple providers via one API | LiteLLM |
| Jupyter notebook exploration | HuggingFace Transformers |
