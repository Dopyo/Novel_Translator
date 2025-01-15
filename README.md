# Novel Translator

Personal Project to make it easier to compare machine translation quality when translating novels. The goal is to visually assess improvements in translation quality as different enhancements are applied. Do not serve over the internet if you expect someone else to use your credits for other purposes.

## Demo

<a href="https://www.youtube.com/watch?v=IRmymS2kFzM" target="_blank">
  <img src="https://img.youtube.com/vi/IRmymS2kFzM/0.jpg" alt="Watch the demo" />
</a>

## Requirements

.env file (placed in backend folder)

```
VITE_MODEL_1_NAME=gpt-4o (model name)
VITE_MODEL_1_ENDPOINT=https://api.openai.com/v1 (do not include /chat/completions)
VITE_MODEL_1_API_KEY=your-key

VITE_MODEL_2_NAME=Qwen/Qwen2.5-72B-Instruct
VITE_MODEL_2_ENDPOINT=https://api.deepinfra.com/v1/openai
VITE_MODEL_2_API_KEY=your-key

(you can add more by incrementing VITE_MODEL_3...)
```

Run these commands to start the app

```
cd ./frontend
npm run build
cd ../backend
python -m venv venv
On macOS/Linux: source venv/bin/activate
On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run
```

The page will be served on http://127.0.0.1:5000/

## Todo

1. port 5000 is currently hardcoded in app.jsx (needs to be changed)
2. view token count and api cost
3. menu to configure api settings for each model (max token count, logprobs, etc.)
4. the entire code is in app.jsx (needs to be changed)
5. prepare jsonl file for evaluation with openai's Evaluation Platform

## Long term goal

1. RAG for more consistent named entity
2. Fine tunning
