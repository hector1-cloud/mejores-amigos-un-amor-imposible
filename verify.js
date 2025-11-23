// Lógica: descarga, cálculo de SHA-256 y comparación
(async () => {
  const btn = document.getElementById("download-btn");
  const statusEl = document.getElementById("status");

  // Carga metadatos
  const meta = await fetch("metadata.json").then(r => r.json());
  const releaseUrl = meta.release_file;
  const checksumUrl = meta.checksum_file;

  // Obtiene checksum esperado (solo el hash)
  async function fetchExpectedHash() {
    const text = await fetch(checksumUrl).then(r => r.text());
    // Línea: "<hash>  mejores-amigos_v1.1.0.zip"
    return text.trim().split(/\s+/)[0];
  }

  // Calcula SHA-256 de un ArrayBuffer
  async function sha256(buffer) {
    const hash = await crypto.subtle.digest("SHA-256", buffer);
    const hex = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
    return hex;
  }

  btn.addEventListener("click", async () => {
    statusEl.textContent = "Verificando…";
    btn.disabled = true;

    try {
      // 1) Descarga binaria
      const resp = await fetch(releaseUrl);
      const data = await resp.arrayBuffer();

      // 2) Cálculo local de hash
      const localHash = await sha256(data);
      // 3) Hash esperado
      const expectedHash = await fetchExpectedHash();

      if (localHash === expectedHash) {
        statusEl.textContent = "✔ Integridad comprobada";
        // Genera descarga
        const blob = new Blob([data], { type: "application/zip" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = releaseUrl.split("/").pop();
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(a.href);
        a.remove();
      } else {
        statusEl.textContent = "✗ Integridad rota";
        console.error("Hashes difieren:", { localHash, expectedHash });
      }
    } catch (e) {
      statusEl.textContent = "Error";
      console.error(e);
    } finally {
      btn.disabled = false;
    }
  });
})();