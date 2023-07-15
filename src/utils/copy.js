async function copy(address) {
  try {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(address);
    } else {
      document.execCommand('copy', true, address);
    }
  } catch (error) {}
}

export default copy;
