import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  // Branch policy: per-branch tuning
  branch: (branch) => {
    if (branch.isDefault) {
      // Default branch: no overrides, uses project defaults
      return {};
    }
    if (!branch.exists) {
      // New non-default branches: auto-expire
      return { ttl: "7d" };
    }
    // Existing branch: no changes
    return {};
  },
});
