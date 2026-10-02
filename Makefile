CC       = gcc
CXX      = g++
CXXFLAGS = -std=c++17 -O2 -Wall -Wextra -Ithird_party -Inative/c
# Windows (MinGW / w64devkit) requires Winsock; harmless on Linux if libs are absent.
LDFLAGS  = -pthread -lws2_32 -lmswsock

.PHONY: all check-tools wasm server client test run dev-server clean

all: check-tools test wasm server client

check-tools:
	@command -v gcc  >/dev/null 2>&1 || (echo "ERROR: gcc is required. Install w64devkit or MSYS2 MinGW-w64."; exit 1)
	@command -v g++  >/dev/null 2>&1 || (echo "ERROR: g++ is required. Install w64devkit or MSYS2 MinGW-w64."; exit 1)
	@command -v emcc >/dev/null 2>&1 || (echo "ERROR: Emscripten (emcc) is required for the WASM validator."; echo "       See: https://emscripten.org/docs/getting_started/"; exit 1)
	@command -v node >/dev/null 2>&1 || (echo "ERROR: Node.js (LTS 20+) is required."; exit 1)
	@echo "All tools OK."

# ── C validator object (shared between the server and the test binary) ──────
build/validator.o: native/c/validator.c native/c/validator.h
	mkdir -p build
	$(CC) -std=c99 -O2 -Wall -c native/c/validator.c -o build/validator.o

# ── Unit tests for the C validator ───────────────────────────────────────────
test: build/validator.o
	$(CC) -std=c99 -Wall native/c/test_validator.c native/c/validator.c -o build/test_validator
	./build/test_validator

# ── WebAssembly build (Emscripten) ───────────────────────────────────────────
wasm:
	mkdir -p client/public/wasm
	emcc native/c/validator.c -O2 \
	  -o client/public/wasm/validator.js \
	  -s MODULARIZE=1 \
	  -s EXPORT_NAME=createValidator \
	  -s ENVIRONMENT=web \
	  -s EXPORTED_FUNCTIONS='["_bb_validate_name","_bb_validate_email","_bb_validate_phone","_bb_guests_from_bucket"]' \
	  -s EXPORTED_RUNTIME_METHODS='["cwrap"]'

# ── C++ HTTP server ───────────────────────────────────────────────────────────
server: build/validator.o
	$(CXX) $(CXXFLAGS) native/cpp/main.cpp native/cpp/slots.cpp build/validator.o \
	  -o build/server $(LDFLAGS)

# ── React + Vite production build ────────────────────────────────────────────
client:
	cd client && npm install && npm run build

# ── Run the server (production — serves client/dist) ─────────────────────────
run: server
	./build/server

# ── Dev mode: server only (Vite dev server handles the frontend on :5173) ────
dev-server: server
	./build/server

# ── Clean build artefacts ─────────────────────────────────────────────────────
clean:
	rm -rf build client/dist client/public/wasm
