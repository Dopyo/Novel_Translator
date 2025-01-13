import os


def get_models():
    models = []
    i = 1
    while True:
        name = os.getenv(f"VITE_MODEL_{i}_NAME")
        endpoint = os.getenv(f"VITE_MODEL_{i}_ENDPOINT")
        api_key = os.getenv(f"VITE_MODEL_{i}_API_KEY")

        if not name or not endpoint or not api_key:
            break

        models.append(
            {
                "name": name,
                "endpoint": endpoint,
                "api_key": api_key,
            }
        )
        i += 1

    return models
