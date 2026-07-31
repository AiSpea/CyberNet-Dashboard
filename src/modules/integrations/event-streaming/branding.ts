import loadConfig from "@utils/config";

export const eventStreamingConfig = loadConfig();

const resourceNamePrefix = eventStreamingConfig.productName
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 47)
  .replace(/-+$/g, "");

export const defaultEventStreamResourceName = resourceNamePrefix
  ? `${resourceNamePrefix}-activity-events`
  : "activity-events";
