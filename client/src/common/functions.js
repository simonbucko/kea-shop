export const createMessageObject = (text, sender) => {
  const unixEpochTime = Math.round(new Date().getTime() / 1000).toString();
  return {
    timestamp: unixEpochTime,
    text,
    sender,
  };
};

export const hashValue = async (value, maxLength = 20) => {
  const msgUint8 = new TextEncoder().encode(value);

  const hashBuffer = await window.crypto.subtle.digest("SHA-512", msgUint8);

  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array

  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string

  return hashHex.slice(0, maxLength);
};
