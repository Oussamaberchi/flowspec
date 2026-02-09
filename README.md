# SpecFlow CLI

SpecFlow is a CLI extension for OpenCode that enables Spec-Driven Development.

## Installation

### Build from Source

1. Clone the repository
   ```bash
   git clone https://github.com/Oussamaberchi/flowspec.git
   cd flowspec
   ```

### Install with LLM Assistance

For a guided installation using an LLM (like ChatGPT, Claude, or Gemini), please see [LLM_INSTALL.md](LLM_INSTALL.md).

2. Install dependencies
   ```bash
   npm install
   ```
3. Build the project
   ```bash
   npm run build
   ```
4. Link the command globally
   ```bash
   npm link
   ```

Now you can use `specflow` from anywhere.

## Usage

### Initialize a Project
```bash
specflow init my-project
cd my-project
```

### Parse Requirements
Edit `.specflow/current/01-requirements.md` with EARS format:
- `When <trigger>, the <system> shall <action>`
- `While <precondition>, the <system> shall <action>`
- `The <system> shall <action>`

Then validate:
```bash
specflow parse
```

### Generate Design
```bash
specflow design
```

### Generate Implementation
```bash
specflow implement
```

### Verify Code
```bash
specflow verify
```

### Security Scan
```bash
specflow secure
```

## OpenCode Integration

SpecFlow now ships an OpenCode plugin so it can be invoked directly from the OpenCode CLI.

### Option A: Project-Local Plugin (fastest)
1. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
2. Open this repo in OpenCode. The plugin file lives at `.opencode/plugins/specflow.ts` (and `.opencode/plugin/specflow.ts` for older builds) and will be auto-loaded.
3. In OpenCode, ask the agent to run the `specflow` tool, for example:
   ```text
   Use the specflow tool to run "init" in the current repo.
   ```

### Option B: Use as a Package Plugin
1. Build and link the package:
   ```bash
   npm install
   npm run build
   npm link
   ```
2. In your target project, add a plugin entry in your OpenCode config:
   ```json
   {
     "plugin": ["specflow/opencode"]
   }
   ```
3. Ensure the target project can resolve `specflow` (install from npm or `npm link specflow`).

## AI Models
- **Init**: Gemini 3 Pro
- **Parse**: GLM 4.7
- **Design**: Kimi K2.5
- **Implement**: Smart Routing
- **Verify**: Minimax M2.1
- **Secure**: Gemini 3 Pro / Kimi K2.5

## Configuration
Global config is stored at `~/.specflow/config.json`.
