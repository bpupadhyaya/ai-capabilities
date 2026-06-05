# Proprietary AI Models — Complete Reference

> Reference for AGI developers evaluating closed/proprietary models for hybrid architectures, benchmarking, and capability comparison.

---

## Table of Contents

1. [Introduction](#introduction)
2. [On-Device Proprietary Models](#on-device-proprietary-models)
3. [Cloud API Models](#cloud-api-models)
4. [API Quick Start Examples](#api-quick-start-examples)
5. [Cost Estimation Guide](#cost-estimation-guide)
6. [Privacy Considerations](#privacy-considerations)

---

## Introduction

Proprietary AI models offer different trade-offs compared to open source alternatives. The decision is rarely binary — most production AGI systems use proprietary APIs for capability headroom and open source for privacy-sensitive or high-volume tasks.

### Trade-off Summary

| Dimension | Proprietary Cloud | Proprietary On-Device | Open Source |
|---|---|---|---|
| **Raw Capability** | Highest (GPT-4o, Claude, Gemini) | Moderate (device-constrained) | Competitive up to ~70B |
| **Privacy** | Low (data leaves device) | High (stays on device) | High (stays on device) |
| **Cost at Scale** | High (per-token) | Zero marginal | Zero marginal |
| **Latency** | Network-dependent | Very low | Low (local) |
| **Offline Operation** | No | Yes | Yes |
| **Customization** | None / limited system prompts | None | Full (fine-tuning, LoRA) |
| **Reproducibility** | Low (model versions change silently) | Moderate | High (pin weights) |
| **Vendor Lock-in** | High | Medium | None |
| **Setup Effort** | Minimal (API key) | Moderate | Moderate–High |
| **Context Windows** | Up to 2M tokens | 4K–128K typical | Up to 1M (GLM-4, InternLM) |

### When to Choose Proprietary Cloud

- Maximum capability needed for low-volume high-stakes tasks (legal analysis, complex coding, frontier reasoning)
- Rapid prototyping where setup time matters
- Multimodal tasks requiring video understanding (Gemini 1.5 Pro)
- Tasks requiring real-time web search integration (Grok, Perplexity Sonar)
- When VRAM/RAM constraints make open source impractical

### When to Avoid Proprietary Cloud

- Health, financial, or legally sensitive user data
- High-frequency inference (cost blows up quickly)
- Offline / air-gapped requirements
- AGI systems requiring consistent model behavior over time
- EU GDPR strict compliance without data processing agreements

---

## On-Device Proprietary Models

These are vendor-controlled models that run locally on devices but are **not open source** — weights are not publicly available, cannot be fine-tuned, and are managed by the vendor's OS/app ecosystem.

| Model | Vendor | Device | Params (approx) | Modalities | Offline | Privacy | Access Method | Notes |
|---|---|---|---|---|---|---|---|---|
| Gemini Nano 1 | Google DeepMind | Pixel 8 Pro | ~1.8B | Text | Yes | On-device | Android AICore API | First on-device Gemini; requires Android 14 + AICore system app |
| Gemini Nano 2 | Google DeepMind | Pixel 9 series | ~3.25B | Text + Vision | Yes | On-device | Android AICore API | Multimodal, improved reasoning vs Nano 1 |
| Gemini Nano (Galaxy) | Google / Samsung | Galaxy S25 series | ~3.25B | Text + Vision | Partial | On-device + cloud | Samsung AI features | Custom integration with One UI |
| Apple Intelligence | Apple | iPhone 15 Pro / 15 Pro Max, iPhone 16+, iPad M1+, Mac M1+ | ~3B | Text + Vision | Partial | On-device + Private Cloud Compute | iOS/macOS system APIs | Hybrid: simple tasks fully local, complex tasks route to PCC (verifiable privacy). Not accessible to third-party developers via public API. |
| Apple Foundation Models | Apple | All Apple Intelligence devices | ~3B | Text | Partial | On-device + PCC | Swift Foundation Models API (iOS 26+) | Apple's on-device model is now partially accessible to third-party apps via the Foundation Models framework introduced at WWDC 2025 |
| Samsung Gauss Mobile | Samsung Research | Galaxy S24+ and S25 series | Unknown (~2–4B) | Text + Vision (partial) | Partial | On-device + Samsung cloud | Samsung AI features | Powers Circle to Search context, Note Assist, etc. Not developer-accessible as standalone API. |
| Qualcomm AI Hub Models | Qualcomm | Snapdragon 8 Gen 3 / Gen 4 devices | Various (1B–7B) | Text, Vision | Yes | On-device | Qualcomm AI Hub SDK | Pre-optimized model variants; supports Llama, Mistral, etc. on-device via QNN |
| MediaTek APU Models | MediaTek | Dimensity 9300 / 9400 | ~3B | Text | Yes | On-device | MediaTek NeuroPilot SDK | Vendor-optimized inference; weights from partners |

### Notes on On-Device Proprietary Models

**Apple Private Cloud Compute (PCC)**: Apple's hybrid approach routes larger inference requests to Apple-operated servers using custom Apple Silicon. The design allows independent verification that Apple cannot see request contents — a novel privacy architecture. Source code for PCC is published for security researchers. However, the model weights and exact architecture remain proprietary.

**Android AICore**: Google's system-level AI runtime on Android. Gemini Nano runs within AICore and is accessible to apps via the `com.google.android.apps.aicore` system service. The model is downloaded OTA and managed by Google Play.

**Samsung Gauss**: Samsung's proprietary family (Gauss Language, Gauss Code, Gauss Image) is the foundation for Samsung AI features. The mobile variant is embedded in Samsung system apps. As of 2025, no public developer API for Gauss Mobile itself — Samsung directs developers to use Google Gemini APIs or on-device Gemini Nano.

---

## Cloud API Models

Full reference for production-grade cloud AI APIs. Prices current as of mid-2025 (always verify at provider pricing pages — these change frequently).

| Model | Vendor | Context | Input $/1M tokens | Output $/1M tokens | Modalities | SOTA Benchmark | Notable Feature | API Endpoint |
|---|---|---|---|---|---|---|---|---|
| **GPT-4o** | OpenAI | 128K | $2.50 | $10.00 | Text + Vision + Audio | MMLU ~88% | Best all-round; native audio I/O | `gpt-4o` |
| **GPT-4o mini** | OpenAI | 128K | $0.15 | $0.60 | Text + Vision | — | Best cost/quality ratio at small scale | `gpt-4o-mini` |
| **o1** | OpenAI | 128K | $15.00 | $60.00 | Text + Vision | AIME 83.3% | Extended thinking, internal chain-of-thought | `o1` |
| **o1-mini** | OpenAI | 128K | $3.00 | $12.00 | Text | — | Cheaper reasoning model | `o1-mini` |
| **o3** | OpenAI | 200K | $10.00 | $40.00 | Text + Vision | ARC-AGI 88% | Best reasoning; high effort mode | `o3` |
| **o4-mini** | OpenAI | 200K | $1.10 | $4.40 | Text + Vision | — | Efficient reasoning, vision-capable | `o4-mini` |
| **Claude 3.5 Sonnet** | Anthropic | 200K | $3.00 | $15.00 | Text + Vision | SWE-Bench 49% | Best coding; strong tool use | `claude-3-5-sonnet-20241022` |
| **Claude 3.5 Haiku** | Anthropic | 200K | $0.80 | $4.00 | Text + Vision | — | Fast + affordable, vision capable | `claude-3-5-haiku-20241022` |
| **Claude 3 Opus** | Anthropic | 200K | $15.00 | $75.00 | Text + Vision | — | Deep analysis, complex reasoning | `claude-3-opus-20240229` |
| **Claude Sonnet 4** | Anthropic | 200K | $3.00 | $15.00 | Text + Vision | — | 2025 flagship mid-tier; improved reasoning | `claude-sonnet-4-5` |
| **Claude Opus 4** | Anthropic | 200K | $15.00 | $75.00 | Text + Vision | — | 2025 frontier; best Anthropic model | `claude-opus-4-5` |
| **Gemini 1.5 Pro** | Google DeepMind | 2,000K | $1.25 | $5.00 | Text + Vision + Audio + Video | — | 2M context window; video understanding | `gemini-1.5-pro` |
| **Gemini 1.5 Flash** | Google DeepMind | 1,000K | $0.075 | $0.30 | Text + Vision + Audio | — | Fast 1M context, very cheap | `gemini-1.5-flash` |
| **Gemini 2.0 Flash** | Google DeepMind | 1,000K | $0.10 | $0.40 | Text + Vision + Audio | — | Native audio output; realtime streaming | `gemini-2.0-flash` |
| **Gemini 2.5 Pro** | Google DeepMind | 1,000K | $1.25 | $2.50 | Text + Vision + Audio + Video | — | Thinking mode; extended reasoning | `gemini-2.5-pro` |
| **Gemini 2.5 Flash** | Google DeepMind | 1,000K | $0.15 | $0.60 | Text + Vision + Audio | — | Fast thinking model | `gemini-2.5-flash` |
| **Grok 2** | xAI | 128K | $2.00 | $10.00 | Text + Vision | — | Real-time X/Twitter data access | `grok-2` |
| **Grok 3** | xAI | 131K | $3.00 | $15.00 | Text + Vision | — | Think mode; stronger reasoning | `grok-3` |
| **Grok 3 Mini** | xAI | 131K | $0.30 | $0.50 | Text | — | Affordable xAI option | `grok-3-mini` |
| **Mistral Large** | Mistral AI | 128K | $2.00 | $6.00 | Text | — | Best European frontier model | `mistral-large-latest` |
| **Mistral Medium** | Mistral AI | 32K | $0.40 | $2.00 | Text | — | Balanced mid-tier | `mistral-medium-latest` |
| **Mistral Small** | Mistral AI | 32K | $0.10 | $0.30 | Text | — | Affordable, fast | `mistral-small-latest` |
| **Codestral** | Mistral AI | 32K | $0.20 | $0.60 | Text (code) | HumanEval 81.1% | Best API-accessible code model from Mistral | `codestral-latest` |
| **Command R+** | Cohere | 128K | $2.50 | $10.00 | Text | — | RAG-optimized, grounded generation | `command-r-plus` |
| **Command R** | Cohere | 128K | $0.15 | $0.60 | Text | — | Fast RAG model | `command-r` |
| **Amazon Nova Pro** | AWS | 300K | $0.80 | $3.20 | Text + Vision + Video | — | AWS-native, Bedrock integration | `amazon.nova-pro-v1:0` |
| **Amazon Nova Lite** | AWS | 300K | $0.06 | $0.24 | Text + Vision + Video | — | Cheap multimodal | `amazon.nova-lite-v1:0` |
| **Amazon Nova Micro** | AWS | 128K | $0.035 | $0.14 | Text | — | Cheapest option | `amazon.nova-micro-v1:0` |
| **Jamba 1.5 Large** | AI21 Labs | 256K | $2.00 | $8.00 | Text | — | SSM-Transformer hybrid (Mamba core) | `jamba-1.5-large` |
| **Jamba 1.5 Mini** | AI21 Labs | 256K | $0.20 | $0.40 | Text | — | Small SSM-Transformer hybrid | `jamba-1.5-mini` |
| **Sonar Pro** | Perplexity AI | 200K | $3.00 | $15.00 | Text | — | Real-time web search built-in | `sonar-pro` |
| **Sonar** | Perplexity AI | 128K | $1.00 | $1.00 | Text | — | Search-augmented, affordable | `sonar` |
| **WizardLM-2 8x22B** | Microsoft/WizardLM | 64K | $0.50 | $0.50 | Text | — | Open-weights model on Azure | via Azure AI Foundry |

### API Endpoints Reference

| Provider | Base URL | Auth Header | OpenAI Compatible |
|---|---|---|---|
| OpenAI | `https://api.openai.com/v1` | `Authorization: Bearer $OPENAI_API_KEY` | Native |
| Anthropic | `https://api.anthropic.com/v1` | `x-api-key: $ANTHROPIC_API_KEY` | Partial (messages endpoint) |
| Google Gemini | `https://generativelanguage.googleapis.com/v1beta` | `?key=$GOOGLE_API_KEY` | No (own format) |
| Google Vertex AI | `https://{region}-aiplatform.googleapis.com` | OAuth2 / Service Account | Partial |
| Mistral AI | `https://api.mistral.ai/v1` | `Authorization: Bearer $MISTRAL_API_KEY` | Yes |
| Cohere | `https://api.cohere.com/v2` | `Authorization: Bearer $COHERE_API_KEY` | Partial |
| xAI (Grok) | `https://api.x.ai/v1` | `Authorization: Bearer $XAI_API_KEY` | Yes |
| AWS Bedrock | `https://bedrock-runtime.{region}.amazonaws.com` | AWS SigV4 | Partial |
| AI21 Labs | `https://api.ai21.com/studio/v1` | `Authorization: Bearer $AI21_API_KEY` | No |
| Perplexity | `https://api.perplexity.ai` | `Authorization: Bearer $PERPLEXITY_API_KEY` | Yes |

---

## API Quick Start Examples

### OpenAI (GPT-4o)

```python
from openai import OpenAI

client = OpenAI(api_key="sk-...")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful AI assistant."},
        {"role": "user", "content": "Explain the difference between MoE and dense transformer architectures."}
    ],
    max_tokens=1024,
    temperature=0.7
)

print(response.choices[0].message.content)
print(f"Tokens used — Input: {response.usage.prompt_tokens}, Output: {response.usage.completion_tokens}")
```

### Anthropic (Claude)

```python
import anthropic

client = anthropic.Anthropic(api_key="sk-ant-...")

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system="You are a helpful AI assistant.",
    messages=[
        {"role": "user", "content": "What are the main challenges in building AGI?"}
    ]
)

print(message.content[0].text)
print(f"Tokens — Input: {message.usage.input_tokens}, Output: {message.usage.output_tokens}")
```

### Google Gemini

```python
import google.generativeai as genai

genai.configure(api_key="AIza...")

model = genai.GenerativeModel("gemini-2.5-pro")

response = model.generate_content(
    "What hardware is needed to run a 70B parameter model locally?",
    generation_config=genai.types.GenerationConfig(
        max_output_tokens=1024,
        temperature=0.7,
    )
)

print(response.text)
print(f"Tokens — Input: {response.usage_metadata.prompt_token_count}, Output: {response.usage_metadata.candidates_token_count}")
```

### Mistral AI

```python
from mistralai import Mistral

client = Mistral(api_key="...")

response = client.chat.complete(
    model="mistral-large-latest",
    messages=[
        {"role": "user", "content": "Compare vLLM and TGI for production serving."}
    ]
)

print(response.choices[0].message.content)
```

### Cohere (RAG-optimized)

```python
import cohere

co = cohere.ClientV2(api_key="...")

response = co.chat(
    model="command-r-plus",
    messages=[{"role": "user", "content": "What is retrieval augmented generation?"}],
    documents=[
        {"data": {"text": "RAG combines retrieval systems with generation models..."}},
    ]
)

print(response.message.content[0].text)
```

### xAI (Grok) — OpenAI-compatible

```python
from openai import OpenAI

client = OpenAI(
    api_key="xai-...",
    base_url="https://api.x.ai/v1"
)

response = client.chat.completions.create(
    model="grok-3",
    messages=[{"role": "user", "content": "What happened in AI today?"}]
)

print(response.choices[0].message.content)
```

### AWS Bedrock (Amazon Nova)

```python
import boto3
import json

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")

body = json.dumps({
    "messages": [{"role": "user", "content": [{"text": "Explain transformer attention."}]}],
    "inferenceConfig": {"maxTokens": 512, "temperature": 0.7}
})

response = bedrock.invoke_model(
    modelId="amazon.nova-pro-v1:0",
    body=body,
    contentType="application/json",
    accept="application/json"
)

result = json.loads(response["body"].read())
print(result["output"]["message"]["content"][0]["text"])
```

### Perplexity Sonar (with web search)

```python
from openai import OpenAI  # Perplexity uses OpenAI-compatible API

client = OpenAI(
    api_key="pplx-...",
    base_url="https://api.perplexity.ai"
)

response = client.chat.completions.create(
    model="sonar-pro",
    messages=[
        {"role": "system", "content": "Be precise and cite sources."},
        {"role": "user", "content": "What are the latest open source AI model releases this week?"}
    ]
)

print(response.choices[0].message.content)
# Sonar Pro includes citations in the response
```

### Unified Multi-Provider via LiteLLM

```python
import litellm

# LiteLLM provides a unified interface across all providers
# pip install litellm

# Switch providers by changing model string — same code
responses = {}

providers = {
    "openai": "gpt-4o",
    "anthropic": "claude-sonnet-4-5",
    "gemini": "gemini/gemini-2.5-pro",
    "ollama": "ollama/llama3.1:8b",  # local model
}

for name, model in providers.items():
    resp = litellm.completion(
        model=model,
        messages=[{"role": "user", "content": "What is 2+2? Answer in one word."}],
        max_tokens=10
    )
    responses[name] = resp.choices[0].message.content

print(responses)
```

---

## Cost Estimation Guide

### Basic Formula

```
Monthly cost = (daily_input_tokens × input_price / 1_000_000 +
                daily_output_tokens × output_price / 1_000_000) × 30
```

### Typical Token Counts

| Task Type | Input Tokens | Output Tokens | Notes |
|---|---|---|---|
| Simple Q&A | 50–200 | 100–500 | Short system prompt + brief answer |
| Code generation | 200–1,000 | 500–2,000 | Spec + generated function |
| Document summarization | 2,000–20,000 | 200–1,000 | Doc in context, short summary out |
| RAG query | 500–3,000 | 200–800 | Query + retrieved chunks + answer |
| Long document analysis | 10K–100K | 500–5,000 | Full doc in context |
| Multi-turn conversation | 500–5,000 cumulative | 100–500 per turn | Context grows each turn |
| Agentic loop (10 steps) | 5,000–50,000 total | 2,000–10,000 total | Each step re-sends history |

### Cost Examples at Scale (monthly)

| Use Case | Daily Calls | Model | Est. Monthly Cost |
|---|---|---|---|
| 1,000 user chatbot queries/day | 1,000 | GPT-4o mini | ~$3–15 |
| 1,000 user chatbot queries/day | 1,000 | GPT-4o | ~$80–300 |
| Code review pipeline (100 PRs/day) | 100 | Claude 3.5 Sonnet | ~$50–200 |
| Document summarization (10K docs/day) | 10,000 | Gemini 1.5 Flash | ~$10–50 |
| RAG system (500 queries/day) | 500 | Command R | ~$5–20 |
| Agentic loop (1000 runs/day, 10 steps) | 10,000 effective | GPT-4o | ~$1,500–6,000 |

### Cost Optimization Strategies

1. **Tiered routing**: Use cheap models (GPT-4o mini, Haiku) for simple tasks; reserve expensive models for complex ones.
2. **Caching**: Implement semantic caching for repeated or similar queries. Tools: GPTCache, Redis.
3. **Prompt compression**: Use LLMLingua or similar tools to compress long prompts by 2–4× before sending.
4. **Batch API**: OpenAI, Anthropic, and Google offer ~50% discount for non-real-time batch processing.
5. **Context management**: Truncate or summarize conversation history. Don't re-send the full history every turn.
6. **Output length control**: Set `max_tokens` conservatively and instruct models to be concise.
7. **Open source for high-volume**: At >100K queries/day, running a 7B–13B open source model on a $2/hr GPU instance is usually cheaper than any cloud API.

---

## Privacy Considerations

### Data Retention Policies (as of mid-2025)

| Provider | Default Retention | Zero Data Retention Option | Enterprise Tier |
|---|---|---|---|
| OpenAI | 30 days (API) | Yes (ZDR add-on, Enterprise) | ChatGPT Enterprise |
| Anthropic | 30 days | Yes (Enterprise agreement) | Claude for Enterprise |
| Google (Gemini API) | Up to 60 days | Yes (Vertex AI enterprise) | Google Cloud |
| Mistral AI | Configurable | Yes | La Plateforme Enterprise |
| Cohere | 30 days | Yes (Enterprise) | Cohere Platform |
| xAI | Per ToS | Unknown | None announced |
| AWS Bedrock | Not stored by default | N/A (stored in your AWS account) | Native VPC isolation |
| Azure OpenAI | Not stored by default | N/A | Azure compliance tiers |

### Privacy Architecture Patterns for AGI Systems

**Pattern 1: Tiered Privacy Routing**
```
User query → Privacy classifier
  ├── PII detected → Route to local/open source model
  └── No PII → Route to cloud API for best quality
```

**Pattern 2: Hybrid On-Device + Cloud**
```
Simple tasks (intent detection, short QA) → On-device model (Apple Intelligence / Gemini Nano)
Complex tasks (reasoning, generation) → Private Cloud Compute (Apple PCC) or enterprise tier cloud
```

**Pattern 3: Air-Gapped Deployment**
```
All inference → Self-hosted open source model (Llama, Qwen, Mistral)
No network calls → Audit log all prompts/responses locally
```

### Data Residency Options

| Provider | US Only | EU Region | Other Regions | Notes |
|---|---|---|---|---|
| OpenAI | Default | No (as of 2025) | No | Enterprise can negotiate DPAs |
| Anthropic | Default | No | No | SOC 2 Type II certified |
| Google Gemini | US default | Yes (Vertex AI EU) | Yes (multi-region) | GDPR-compliant via DPA |
| AWS Bedrock | Per-region | eu-west-1, eu-central-1 | Global | Native AWS region isolation |
| Azure OpenAI | US default | Yes (multiple EU regions) | Yes | Full Microsoft compliance portfolio |
| Mistral AI | EU (France) | Yes (default) | No | GDPR native, EU company |

### Regulatory Considerations

- **EU AI Act (2024–2026 rollout)**: High-risk AI systems (hiring, credit, healthcare) face strict requirements. On-device models are generally lower risk profile.
- **GDPR/CCPA**: Any personal data in prompts must be handled under data processing agreements. Cloud APIs require DPAs with providers.
- **HIPAA**: AWS Bedrock and Azure OpenAI offer BAAs. Most other providers do not. Open source on-premises is safest for healthcare.
- **SOC 2**: OpenAI, Anthropic, Google, Cohere all have SOC 2 Type II. Required for most enterprise procurement.
