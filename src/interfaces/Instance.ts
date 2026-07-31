export interface InstanceStatus {
  setup_required: boolean;
  client_update?: ClientUpdateConfig;
}

export interface ClientUpdateConfig {
  brand: {
    product_name: string;
    logo_url: string;
  };
  localization: {
    default_locale: "zh-CN" | "en";
    supported_locales: string[];
  };
  update: {
    channel: string;
    latest_version: string;
    version_check_url: string;
    release_notes_url: string;
    download_url: string;
    platform_download_urls: {
      darwin: string;
      windows: string;
      linux: string;
      ios: string;
      android: string;
    };
    automatic_updates_enabled: boolean;
  };
}

export interface SetupRequest {
  email: string;
  password: string;
  name: string;
}

export interface SetupResponse {
  user_id: string;
  email: string;
}

export interface ApiError {
  code: number;
  message: string;
}

export interface VersionInfo {
  management_current_version: string;
  management_available_version: string;
  dashboard_available_version: string;
}
