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

## AI Models
- **Init**: Gemini 3 Pro
- **Parse**: GLM 4.7
- **Design**: Kimi K2.5
- **Implement**: Smart Routing
- **Verify**: Minimax M2.1
- **Secure**: Gemini 3 Pro / Kimi K2.5

## Configuration
Global config is stored at `~/.specflow/config.json`.
