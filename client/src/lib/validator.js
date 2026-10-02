let wasmModule = null;
let initPromise = null;
let wrappers = {};

export async function initValidator() {
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    // If the script is already there and loaded
    if (window.createValidator) {
      window.createValidator().then(m => {
        wasmModule = m;
        setupWrappers();
        resolve(true);
      }).catch(reject);
      return;
    }

    const script = document.createElement('script');
    script.src = '/wasm/validator.js';
    script.onload = () => {
      if (window.createValidator) {
        window.createValidator().then(m => {
          wasmModule = m;
          setupWrappers();
          resolve(true);
        }).catch(reject);
      } else {
        reject(new Error("createValidator not found in window."));
      }
    };
    script.onerror = () => reject(new Error("Failed to load /wasm/validator.js"));
    document.body.appendChild(script);
  });

  return initPromise;
}

function setupWrappers() {
  wrappers.validateName = wasmModule.cwrap('bb_validate_name', 'number', ['string']);
  wrappers.validateEmail = wasmModule.cwrap('bb_validate_email', 'number', ['string']);
  wrappers.validatePhone = wasmModule.cwrap('bb_validate_phone', 'number', ['string']);
  wrappers.guestsFromBucket = wasmModule.cwrap('bb_guests_from_bucket', 'number', ['number']);
}

export function validateName(s) {
  if (!wasmModule) throw new Error("WASM not initialized");
  return wrappers.validateName(s) === 1;
}

export function validateEmail(s) {
  if (!wasmModule) throw new Error("WASM not initialized");
  return wrappers.validateEmail(s) === 1;
}

export function validatePhone(s) {
  if (!wasmModule) throw new Error("WASM not initialized");
  // Allow empty to pass C validation if empty is allowed by JS logic?
  // Wait, C might fail empty. Let's rely entirely on C.
  return wrappers.validatePhone(s) === 1;
}

export function guestsFromBucket(b) {
  if (!wasmModule) throw new Error("WASM not initialized");
  return wrappers.guestsFromBucket(b);
}
