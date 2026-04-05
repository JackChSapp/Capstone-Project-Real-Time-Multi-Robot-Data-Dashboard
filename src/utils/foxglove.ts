export function formatFloat(value: number | null, digits = 3) {
  return value == null ? "--" : value.toFixed(digits);
}

export function formatClockStamp(sec: number, nanosec: number) {
  return `${sec}.${nanosec.toString().padStart(9, "0")}`;
}

export function bytesToDataUrl(bytes: Uint8Array, mimeType: string) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return `data:${mimeType};base64,${btoa(binary)}`;
}

export function inferCompressedImageMimeType(format?: string) {
  const normalized = format?.toLowerCase() ?? "";

  if (normalized.includes("png")) {
    return "image/png";
  }

  return "image/jpeg";
}
