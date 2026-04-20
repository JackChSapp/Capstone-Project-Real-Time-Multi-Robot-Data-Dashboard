FROM python:3.13-slim

# Bring in the uv binary from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

# Install dependencies (cached unless pyproject.toml or uv.lock change)
COPY pyproject.toml uv.lock README.md ./
RUN uv sync --frozen --no-dev

# Copy source
COPY src/ ./src/

ENV PYTHONPATH=/app/src

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "mcap_recorder.main:app", "--host", "0.0.0.0", "--port", "8000"]
