/**
 * Storybook calls `os.networkInterfaces()` to print LAN URLs; in some environments
 * (Cursor sandbox, VPN, hardened macOS) that syscall throws and the dev server exits.
 * Preload wraps it so Storybook can still start; `--host localhost` remains the primary fix.
 */
const os = require("node:os");
const orig = os.networkInterfaces.bind(os);
os.networkInterfaces = function networkInterfacesPatched() {
  try {
    return orig();
  } catch {
    return {
      lo0: [{ address: "127.0.0.1", family: "IPv4", internal: true, netmask: "255.0.0.0", mac: "00:00:00:00:00:00" }],
    };
  }
};
