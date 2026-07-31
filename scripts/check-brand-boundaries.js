const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const checks = [
  {
    file: "src/auth/OIDCError.tsx",
    forbidden: [
      ["raw OIDC errors as a heading", /<h1[^>]*>\s*\{errorDescription\}/],
    ],
  },
  {
    file: "src/app/error/page.tsx",
    forbidden: [["raw backend response label", /response_message\s*:/]],
  },
  {
    file: "src/app/invite/page.tsx",
    forbidden: [["raw invite API error", /setError\(\s*err\.message/]],
  },
  {
    file: "src/modules/integrations/idp-sync/azure-ad/AzureADSetup.tsx",
    forbidden: [
      [
        "upstream silent-auth callback",
        /https:\/\/app\.netbird\.io\/silent-auth/,
      ],
    ],
  },
  {
    file: "src/modules/integrations/idp-sync/entra-scim/EntraSCIMSetup.tsx",
    forbidden: [
      ["upstream SCIM endpoint", /https:\/\/api\.netbird\.io\/api\/scim\/v2/],
    ],
  },
  {
    file: "src/modules/integrations/idp-sync/generic-scim/GenericSCIMSetup.tsx",
    forbidden: [
      ["upstream SCIM endpoint", /https:\/\/api\.netbird\.io\/api\/scim\/v2/],
    ],
  },
  {
    file: "src/modules/integrations/idp-sync/jumpcloud/JumpcloudSetup.tsx",
    forbidden: [
      ["upstream SCIM endpoint", /https:\/\/api\.netbird\.io\/api\/scim\/v2/],
    ],
  },
];

const failures = [];

for (const check of checks) {
  const source = fs.readFileSync(path.join(root, check.file), "utf8");
  for (const [description, pattern] of check.forbidden) {
    if (pattern.test(source)) {
      failures.push(`${check.file}: ${description}`);
    }
  }
}

if (failures.length > 0) {
  console.error("CyberNet brand boundary check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("CyberNet brand boundary check passed.");
