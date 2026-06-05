# Mobile & On-Device AI Models — Developer Reference

> Complete guide for AGI developers deploying large language models on smartphones, tablets, and edge hardware.

---

## Table of Contents

1. [Why On-Device AI Matters](#why-on-device-ai-matters)
2. [Hardware Requirements by Platform](#hardware-requirements-by-platform)
3. [Model Comparison Table](#model-comparison-table)
4. [Runtime Comparison](#runtime-comparison)
5. [Quantization Guide](#quantization-guide)
6. [Integration Examples](#integration-examples)

---

## Why On-Device AI Matters

On-device AI has moved from novelty to necessity for serious AGI applications. The key drivers:

### Privacy
User data never leaves the device. No network request = no data breach surface. Critical for:
- Personal health and wellness apps
- Private journaling and notes
- Financial data analysis
- Child-safe applications
- Enterprise applications handling sensitive IP

### Latency
Cloud API round-trip: 200–2,000 ms depending on model and region. On-device: 20–200 ms for first token on modern mobile hardware. For interactive AI — real-time voice, live translation, continuous sensing — on-device is the only viable architecture.

### Offline Operation
No network dependency means the app works on:
- Airplanes, subways, rural areas
- Countries with unstable connectivity
- Enterprise air-gapped environments
- Disaster response scenarios

### Cost at Scale
At 100,000 daily active users with 10 AI queries per user per day = 1M API calls/day. At GPT-4o mini pricing ($0.15/1M input + $0.60/1M output), that's ~$225–750/day = $82K–274K/year. On-device: $0 marginal cost after device acquisition.

### EU AI Act and GDPR Compliance
On-device AI processes personal data locally, which simplifies GDPR compliance significantly. No data leaves the device, no data processor relationship is established, no DPA required with a cloud provider.

### Personalization Without Privacy Loss
On-device models can be fine-tuned or adapted using federated learning techniques on user's own data. The model improves without centralizing personal data.

---

## Hardware Requirements by Platform

The primary constraint on mobile AI is **RAM** — both the model weights and the KV cache must fit in memory simultaneously.

| Platform | RAM Available for AI | Recommended Model Size | Max Context | Notes |
|---|---|---|---|---|
| **Android 2022 mid-range** (SD 7 Gen 1, 4–6 GB RAM) | ~1.5 GB | 1B Q4 | 2K | Very tight; only TinyLlama-class models |
| **Android 2023 mid-range** (SD 7s Gen 2, 6–8 GB RAM) | ~2.5 GB | 1.5–2B Q4 | 4K | SmolLM2 1.7B, Gemma 2 2B at Q4 |
| **Android 2024 flagship** (SD 8 Gen 3, 12 GB RAM) | ~5–6 GB | 3–4B Q4 | 8K–32K | Gemma 3 4B, Qwen2.5 3B comfortable |
| **Android 2025 flagship** (SD 8 Elite, 12–16 GB RAM) | ~6–8 GB | 4–7B Q4 | 32K | Approaching desktop-class inference |
| **iPhone 14 Pro** (A16, 6 GB RAM) | ~2.5 GB | 2B Q4 | 4K | Core ML required for ANE acceleration |
| **iPhone 15 Pro / Pro Max** (A17 Pro, 8 GB RAM) | ~3.5 GB | 3B Q4 | 8K | ANE 35 TOPS; solid on-device tier |
| **iPhone 16** (A18, 8 GB RAM) | ~4 GB | 3–4B Q4 | 16K | Required for Apple Intelligence |
| **iPhone 16 Pro** (A18 Pro, 8 GB RAM) | ~4.5 GB | 4B Q4 | 32K | Faster ANE than iPhone 16; Apple Intelligence tier |
| **iPad Pro 11-inch M4** (16 GB RAM) | ~8 GB | 7–8B Q4 | 32K | Tablet-class; strong NPU |
| **iPad Pro 13-inch M4** (16–32 GB RAM) | ~10–20 GB | 8–13B Q4 | 128K | Workstation-class on-device inference |
| **Raspberry Pi 5** (8 GB RAM) | ~6 GB | 3B Q4 | 4K | CPU-only; ~2–5 t/s; slow but viable |
| **NVIDIA Jetson Orin NX 16GB** | 16 GB unified | 7B Q4 | 32K | 100 TOPS AI; ~25–40 t/s on 7B |
| **NVIDIA Jetson AGX Orin 64GB** | 64 GB unified | 30B Q4 | 128K | 275 TOPS; best edge inference hardware |
| **Google Coral Edge TPU** | Host RAM | 1–2B (compiled) | 2K | Requires TFLite compile; specialized |
| **Apple M1 (MacBook/Mac mini)** | 8–16 GB | 7B Q4 (16 GB) | 32K | MLX preferred; ~30–40 t/s on 7B |

### Memory Overhead Calculation

```
Total RAM needed = model_q4_size_GB + kv_cache_GB + framework_overhead_GB

kv_cache (GB) ≈ (2 × layers × kv_heads × head_dim × seq_len × 2 bytes) / 1e9
For Llama 3.2 3B at 4K context: ~0.3 GB
For Llama 3.2 3B at 32K context: ~2.4 GB  ← this is why long context hurts mobile

framework_overhead = ~0.5 GB (llama.cpp) to ~1.5 GB (PyTorch)
```

---

## Model Comparison Table

All models with confirmed or practical mobile deployment capability. Speed estimates are on Snapdragon 8 Gen 3 (mobile flagship 2024) using llama.cpp with GPU backend (Adreno 750 via OpenCL/Vulkan).

| Model | Params | Q4 Size | RAM Min | Context | Est. Speed* (t/s) | Modality | Best Framework | Primary Use Case |
|---|---|---|---|---|---|---|---|---|
| SmolLM2 135M | 135M | 0.1 GB | 0.2 GB | 2K | 250+ | Text | llama.cpp, MLC | Ultra-fast intent detection |
| SmolLM2 360M | 360M | 0.2 GB | 0.4 GB | 8K | 180 | Text | llama.cpp, MLC | Device-side NLU |
| SmolLM2 1.7B | 1.7B | 1.0 GB | 1.5 GB | 8K | 80 | Text | llama.cpp, MLC | General small tasks |
| TinyLlama 1.1B | 1.1B | 0.6 GB | 1.0 GB | 2K | 100 | Text | llama.cpp, MLC | Embedded, IoT |
| Qwen2.5 0.5B | 0.5B | 0.4 GB | 0.5 GB | 32K | 220 | Text | llama.cpp | Long-context edge |
| Qwen2.5 1.5B | 1.5B | 1.0 GB | 1.5 GB | 32K | 100 | Text | llama.cpp, MLC | Mid-range Android |
| Qwen2.5 3B | 3B | 1.9 GB | 2.5 GB | 32K | 55 | Text | llama.cpp | Flagship Android |
| Llama 3.2 1B | 1B | 0.7 GB | 1.0 GB | 128K | 110 | Text | llama.cpp, ExecuTorch | General, long context |
| Llama 3.2 3B | 3B | 1.9 GB | 3.0 GB | 128K | 45 | Text | llama.cpp, ExecuTorch | Best Llama for mobile |
| Llama 3.2 11B Vision | 11B | 6.5 GB | 10.0 GB | 128K | 8–12 | Text + Vision | llama.cpp (with clip) | Tablet/iPad multimodal |
| OLMo 1B | 1B | 0.6 GB | 1.0 GB | 2K | 110 | Text | llama.cpp | Research, open weights |
| Falcon 1B | 1B | 0.7 GB | 1.0 GB | 2K | 105 | Text | llama.cpp | Research |
| OpenELM 1.1B | 1.1B | 0.7 GB | 1.5 GB | 2K | 90 | Text | Core ML (Apple only) | Apple ecosystem only |
| OpenELM 3B | 3B | 1.7 GB | 3.0 GB | 2K | 35 | Text | Core ML (Apple only) | Apple ecosystem only |
| MiniCPM 2B | 2B | 1.2 GB | 2.0 GB | 4K | 75 | Text | llama.cpp | Compact general model |
| MiniCPM 3B | 3B | 1.9 GB | 3.0 GB | 32K | 48 | Text | llama.cpp | Mid-range, long context |
| DeepSeek-R1-Distill-Qwen 1.5B | 1.5B | 1.0 GB | 2.0 GB | 64K | 90 | Text | llama.cpp | Reasoning on mobile |
| Gemma 3 1B | 1B | 0.7 GB | 1.0 GB | 32K | 115 | Text | llama.cpp, MLC, TFLite | Wide deployment |
| Gemma 3 4B | 4B | 2.5 GB | 3.0 GB | 128K | 32 | Text + Vision | llama.cpp | Vision on flagship |
| Gemma 3n E2B | ~2B eff. | 1.0 GB | 2.0 GB | 32K | 70 | Text | llama.cpp, MLC | Adaptive compute |
| Gemma 3n E4B | ~4B eff. | 2.0 GB | 3.0 GB | 128K | 35 | Text + Vision + Audio | llama.cpp | Multimodal edge |
| Gemma 2 2B | 2B | 1.3 GB | 2.0 GB | 8K | 65 | Text | llama.cpp, MLC, TFLite | Strong 2B model |
| Phi-3 Mini 3.8B | 3.8B | 2.2 GB | 3.0 GB | 128K | 38 | Text | llama.cpp, ONNX | Strong quality at size |
| Phi-3.5 Mini 3.8B | 3.8B | 2.2 GB | 3.0 GB | 128K | 38 | Text | llama.cpp, ONNX | Updated Phi-3 |
| Phi-4 Mini 3.8B | 3.8B | 2.2 GB | 3.0 GB | 128K | 36 | Text | llama.cpp | Best 4B-class reasoning |

> *Speed estimates: tokens/second on Snapdragon 8 Gen 3 with Adreno 750 GPU acceleration via OpenCL/Vulkan through llama.cpp. Actual performance varies by batch size, quantization, and context length. CPU-only speeds are typically 3–8× slower. Apple A17 Pro with Core ML ANE can achieve 2–3× these speeds for optimized models.

---

## Runtime Comparison

| Runtime | Platform | Model Format | GPU/NPU Acceleration | Quantization Support | Android | iOS | License | Notes |
|---|---|---|---|---|---|---|---|---|
| **llama.cpp** | All (incl. Android, iOS, Linux, macOS, Windows) | GGUF | CUDA, Metal, Vulkan, OpenCL (Adreno/Mali) | Q2 through FP16 (k-quants) | Yes (JNI/Android NDK) | Yes (Swift/C++ bridging) | MIT | Most portable; primary choice for mobile. Uses OpenCL for Adreno GPU, Vulkan for Mali |
| **MLC LLM** | Android, iOS, macOS, Linux, Web | MLC (pre-compiled per model) | Vulkan (Android), Metal (iOS), CUDA | 4-bit quantization (TVM-based) | Yes (AAR library) | Yes (Swift package) | Apache 2.0 | Best for web (WebLLM); requires model compilation step. Fastest GPU on mobile |
| **ExecuTorch (Meta)** | iOS, Android, macOS | .pte (ExecuTorch) | Apple ANE (XNNPACK/CoreML), Qualcomm HTP, GPU | INT8, INT4 | Yes | Yes | BSD 3-Clause | Meta's production mobile inference. Used for Llama on-device. ANE support for Apple |
| **Core ML (Apple)** | iOS, iPadOS, macOS, visionOS, tvOS only | .mlpackage / .mlmodelc | ANE (Neural Engine) + GPU + CPU | FP16, INT8, INT4 (palettized) | No | Only Apple platforms | Apple (free with Xcode) | Maximum Apple Silicon performance. Requires converting models via coremltools |
| **TensorFlow Lite** | Android, iOS, embedded | .tflite | Android NNAPI, CoreML (iOS), GPU | INT8, INT4, FP16 dynamic range | Yes | Yes | Apache 2.0 | Mature, wide ecosystem; primarily for smaller models (<3B) and classification tasks |
| **ONNX Runtime Mobile** | Android, iOS, embedded, Windows ARM | .onnx | NNAPI (Android), CoreML (iOS), DirectML (Windows), QNN (Qualcomm) | INT8, FP16 | Yes | Yes | MIT | Cross-platform standard; good for Phi-3 Mini (Microsoft ships ONNX variants) |
| **Ollama** | macOS, Linux, Windows | GGUF (auto-pull) | Metal (macOS), CUDA, ROCm | Full llama.cpp range | No | No (macOS only) | MIT | Best for local desktop; not for mobile deployment |
| **Qualcomm QNN SDK** | Android (Snapdragon only) | QNN binary (.bin) | Qualcomm HTP (Hexagon NPU) | INT8, INT4, FP16 | Yes | No | Qualcomm proprietary | Maximum performance on Snapdragon devices. Requires Qualcomm toolchain. |
| **MediaTek NeuroPilot** | Android (Dimensity only) | NeuroPilot format | APU (MediaTek AI Processing Unit) | INT8, INT4 | Yes (Dimensity only) | No | MediaTek proprietary | For Dimensity-based phones (many mid-range Android) |
| **llama.cpp (iOS framework)** | iOS / macOS | GGUF | Metal | Full GGUF range | No | Yes | MIT | llama.cpp compiled as iOS framework via Swift Package Manager. Excellent Metal performance |

### Runtime Selection Guide for Mobile

| Scenario | Recommended Runtime | Reason |
|---|---|---|
| Android flagship (Snapdragon 8 Gen 3+) | MLC LLM or llama.cpp + Vulkan | Best GPU utilization on Adreno |
| Android mid-range (Snapdragon 7 Gen) | llama.cpp + OpenCL | Broad compatibility |
| Android Dimensity flagship | llama.cpp + Vulkan or NeuroPilot | Vulkan portable; NeuroPilot for max perf |
| iOS (iPhone 15 Pro+) | ExecuTorch + CoreML or llama.cpp + Metal | ANE gives 2–3× speedup on supported models |
| iOS (older, A14+) | llama.cpp + Metal | Good Metal support across A14 and newer |
| Cross-platform app | llama.cpp (shared C++ core) | Single codebase, JNI on Android, C++ bridge on iOS |
| Browser / Progressive Web App | MLC LLM (WebLLM) | WebGPU-based, no native code needed |
| Raspberry Pi / ARM Linux | llama.cpp CPU | No GPU; relies on NEON SIMD |
| Jetson / embedded NVIDIA | llama.cpp + CUDA or vLLM | Full CUDA support |

---

## Quantization Guide

Quantization reduces model size and speeds up inference at the cost of some quality. Understanding the trade-offs is essential for mobile deployment where every MB matters.

### Quantization Format Reference

| Format | Bits per Weight | Size Factor vs FP16 | Quality vs FP16 | Speed vs FP16 | Mobile Support | Notes |
|---|---|---|---|---|---|---|
| **FP32** | 32 | 2× larger | Lossless (training) | 0.5× | No (too slow/large) | Training only |
| **BF16** | 16 | 1× | ~Lossless | 1× | Partial (Apple ANE) | Training + inference baseline |
| **FP16** | 16 | 1× | ~Lossless | 1× | Yes (GPU) | Standard GPU inference |
| **Q8_0** | 8 | 0.5× | Negligible loss | 1.5× | Yes | Near-lossless; safe for all models |
| **Q6_K** | 6 | 0.375× | Very small loss | 1.8× | Yes | Excellent balance |
| **Q5_K_M** | 5 | 0.31× | Small loss | 2× | Yes | Good quality, good speed |
| **Q5_K_S** | 5 | 0.29× | Slightly more than Q5_K_M | 2× | Yes | Smaller variant of Q5 |
| **Q4_K_M** | 4 | 0.25× | Moderate loss | 2.5× | Yes | **Recommended default for mobile** |
| **Q4_K_S** | 4 | 0.23× | Slightly worse than Q4_K_M | 2.5× | Yes | Smaller Q4 variant |
| **Q4_0** | 4 | 0.25× | Similar to Q4_K_M (older format) | 2.5× | Yes | Legacy format; Q4_K_M preferred |
| **IQ4_XS** | 4 | 0.22× | Better than Q4_K_M (imatrix) | 2.5× | Yes | Best 4-bit quality via importance matrix |
| **IQ3_XXS** | 3 | 0.17× | Significant loss | 3× | Yes | Aggressive compression |
| **Q3_K_M** | 3 | 0.19× | Significant loss | 3× | Yes | Minimum viable for most tasks |
| **Q2_K** | 2 | 0.13× | High loss | 4× | Yes | Extreme compression; noticeable degradation |
| **INT4 (MLC)** | 4 | 0.25× | Similar to Q4_K_M | 3× (GPU) | Yes (MLC LLM) | MLC LLM's 4-bit format, TVM-compiled |
| **INT8 (ONNX/TFLite)** | 8 | 0.5× | Very small loss | 2× | Yes | Good for TFLite/ONNX mobile deployment |

### The K-Quant System (llama.cpp)

"K-quants" use different bit widths for different layers (more bits for attention layers which are more sensitive). `_M` = medium variant (good balance), `_S` = small variant (more compressed), `_L` = large variant (higher quality).

- **Q4_K_M** is the recommended default for most use cases on mobile.
- **Q5_K_M** if you have the RAM budget and want noticeably better quality (especially for coding/math).
- **Q3_K_M** as an absolute minimum when RAM is critically constrained.

### Mobile RAM Budget Decision Matrix

| Available RAM for Model | Recommended Quantization | Max Model Size |
|---|---|---|
| 0.5 GB | Q4_K_M | 0.5B params (SmolLM2 360M) |
| 1.0 GB | Q4_K_M | 1.5B params (TinyLlama, SmolLM2 1.7B) |
| 2.0 GB | Q4_K_M | 3B params (Llama 3.2 3B, Qwen2.5 3B) |
| 3.0 GB | Q4_K_M or Q5_K_M | 3–4B params (Gemma 3 4B, Phi-4 Mini) |
| 4.0 GB | Q5_K_M | 4–5B params |
| 6.0 GB | Q4_K_M | 7B params (Mistral 7B) |
| 8.0 GB | Q5_K_M | 7B params or Q4 of 13B |

---

## Integration Examples

### Android — Kotlin with llama.cpp (JNI)

```kotlin
// build.gradle.kts
dependencies {
    implementation("com.github.Mugen87:llama.android:latest") // or use llama.cpp Android bindings
}

// LlamaInference.kt
class LlamaInference(private val modelPath: String) {
    
    private external fun initModel(modelPath: String, nCtx: Int, nThreads: Int): Long
    private external fun generate(handle: Long, prompt: String, maxTokens: Int): String
    private external fun freeModel(handle: Long)
    
    companion object {
        init {
            System.loadLibrary("llama")
        }
    }
    
    private var modelHandle: Long = 0
    
    fun load() {
        modelHandle = initModel(modelPath, contextSize = 2048, nThreads = 4)
    }
    
    // Streaming generation via callback
    fun generateStreaming(
        prompt: String,
        onToken: (String) -> Unit,
        onComplete: () -> Unit
    ) {
        // Run on background thread — never block UI
        CoroutineScope(Dispatchers.IO).launch {
            val result = generate(modelHandle, prompt, maxTokens = 512)
            result.split(" ").forEach { token ->
                withContext(Dispatchers.Main) { onToken(token) }
            }
            withContext(Dispatchers.Main) { onComplete() }
        }
    }
    
    fun unload() {
        if (modelHandle != 0L) {
            freeModel(modelHandle)
            modelHandle = 0L
        }
    }
}

// Usage in Activity/Fragment
class ChatActivity : AppCompatActivity() {
    
    private val llama = LlamaInference("/sdcard/models/llama3.2-3b-q4.gguf")
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Load model in background
        lifecycleScope.launch(Dispatchers.IO) {
            llama.load()
        }
    }
    
    fun onSendMessage(userMessage: String) {
        val prompt = "<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n${userMessage}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n"
        
        val responseBuilder = StringBuilder()
        
        llama.generateStreaming(
            prompt = prompt,
            onToken = { token ->
                responseBuilder.append(token)
                updateUI(responseBuilder.toString())
            },
            onComplete = {
                saveToHistory(userMessage, responseBuilder.toString())
            }
        )
    }
}
```

### Android — Kotlin with MLC LLM

```kotlin
// build.gradle.kts
dependencies {
    implementation("ai.mlc:mlc-llm-android:0.1.0")
}

// MLCInference.kt
import ai.mlc.mlcllm.MLCEngine

class MLCInference(context: Context) {
    
    private val engine = MLCEngine()
    
    fun loadModel(modelPath: String) {
        engine.reload(modelPath, modelLib = "llama", overrideConfig = "")
    }
    
    // Streaming with Kotlin coroutines + Flow
    fun chat(userMessage: String): Flow<String> = flow {
        val messages = listOf(
            mapOf("role" to "user", "content" to userMessage)
        )
        
        engine.chat.completions.create(
            messages = messages,
            model = "Llama-3.2-3B-Instruct-q4f16_1-MLC",
            stream = true
        ).collect { chunk ->
            val delta = chunk.choices.firstOrNull()?.delta?.content ?: ""
            if (delta.isNotEmpty()) emit(delta)
        }
    }
}
```

### iOS — Swift with llama.cpp

```swift
import Foundation

// Package.swift — add llama.cpp as Swift package
// https://github.com/ggerganov/llama.cpp (has Swift package support)

class LlamaManager: ObservableObject {
    
    private var context: OpaquePointer?
    private var model: OpaquePointer?
    
    @Published var isLoaded = false
    @Published var output = ""
    
    func loadModel(path: String) async throws {
        let modelParams = llama_model_default_params()
        model = llama_load_model_from_file(path, modelParams)
        guard model != nil else { throw LlamaError.modelLoadFailed }
        
        var ctxParams = llama_context_default_params()
        ctxParams.n_ctx = 4096
        ctxParams.n_threads = Int32(ProcessInfo.processInfo.processorCount)
        
        context = llama_new_context_with_model(model, ctxParams)
        guard context != nil else { throw LlamaError.contextCreationFailed }
        
        await MainActor.run { isLoaded = true }
    }
    
    func generate(prompt: String, maxTokens: Int = 512) async {
        guard let context = context, let model = model else { return }
        
        // Tokenize prompt
        var tokens = [llama_token](repeating: 0, count: prompt.count + 64)
        let nTokens = llama_tokenize(model, prompt, Int32(prompt.utf8.count), &tokens, Int32(tokens.count), true, false)
        tokens = Array(tokens.prefix(Int(nTokens)))
        
        // Decode in background, publish tokens to main thread
        await withCheckedContinuation { continuation in
            Task.detached(priority: .userInitiated) {
                // inference loop — simplified
                for _ in 0..<maxTokens {
                    // llama_decode, llama_sampler_sample, append to output...
                    // actual implementation requires llama_batch, sampler chain
                }
                continuation.resume()
            }
        }
    }
    
    func unload() {
        if let ctx = context { llama_free(ctx) }
        if let mdl = model { llama_free_model(mdl) }
        context = nil
        model = nil
        isLoaded = false
    }
}

// SwiftUI View
struct ChatView: View {
    @StateObject var llama = LlamaManager()
    @State var userInput = ""
    @State var conversation = ""
    
    var body: some View {
        VStack {
            ScrollView {
                Text(conversation).padding()
            }
            
            HStack {
                TextField("Message", text: $userInput)
                    .textFieldStyle(.roundedBorder)
                
                Button("Send") {
                    let prompt = userInput
                    userInput = ""
                    Task {
                        await llama.generate(prompt: prompt)
                    }
                }
                .disabled(!llama.isLoaded)
            }
            .padding()
        }
        .onAppear {
            Task {
                let modelURL = Bundle.main.url(forResource: "llama3.2-3b-q4_k_m", withExtension: "gguf")!
                try? await llama.loadModel(path: modelURL.path)
            }
        }
    }
}
```

### iOS — Swift with ExecuTorch (Meta)

```swift
// Add ExecuTorch Swift Package from https://github.com/pytorch/executorch
import ExecuTorch

class ExecuTorchInference {
    
    private var module: Module?
    
    func loadModel(path: String) throws {
        module = try Module(path: path)
    }
    
    func generate(prompt: String) throws -> String {
        guard let module = module else { throw InferenceError.notLoaded }
        
        // ExecuTorch uses ET format (.pte files)
        // Input preparation is model-specific
        let inputs = [EValue(stringScalar: prompt)]
        let outputs = try module.forward(inputs)
        
        return outputs.first?.stringValue ?? ""
    }
}
```

### React Native — Cross-Platform with llama.rn

```typescript
// npm install llama.rn
import { LlamaContext, initLlama } from 'llama.rn';

// LlamaService.ts
class LlamaService {
  private context: LlamaContext | null = null;

  async loadModel(modelPath: string): Promise<void> {
    this.context = await initLlama({
      model: modelPath,          // Path to .gguf file in app documents
      use_mlock: true,
      n_ctx: 2048,
      n_threads: 4,
      n_gpu_layers: 99,          // Use GPU (Metal on iOS, Vulkan on Android)
    });
  }

  async *generateStream(prompt: string): AsyncGenerator<string> {
    if (!this.context) throw new Error('Model not loaded');

    const stopTokens = ['</s>', '<|end|>', '<|eot_id|>'];

    const result = await this.context.completion(
      {
        prompt,
        n_predict: 512,
        stop: stopTokens,
        temperature: 0.7,
        top_p: 0.9,
      },
      (data: { token: string }) => {
        // This callback fires for each token
        return data.token;
      }
    );

    yield result.text;
  }

  async unload(): Promise<void> {
    await this.context?.release();
    this.context = null;
  }
}

// React Native Component
const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const llamaService = useRef(new LlamaService()).current;

  useEffect(() => {
    // Load model from app documents directory
    const modelPath = `${RNFS.DocumentDirectoryPath}/llama3.2-3b-q4_k_m.gguf`;
    llamaService.loadModel(modelPath);
    
    return () => { llamaService.unload(); };
  }, []);

  const sendMessage = async () => {
    const userMsg = input;
    setInput('');
    
    const prompt = buildPrompt(messages, userMsg); // format for model's template
    let response = '';
    
    setMessages(prev => [...prev, 
      { role: 'user', content: userMsg },
      { role: 'assistant', content: '' }
    ]);

    for await (const token of llamaService.generateStream(prompt)) {
      response += token;
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = response;
        return updated;
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList data={messages} renderItem={renderMessage} />
      <TextInput value={input} onChangeText={setInput} />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};
```
