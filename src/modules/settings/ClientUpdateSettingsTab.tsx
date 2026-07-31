"use client";

import Breadcrumbs from "@components/Breadcrumbs";
import Button from "@components/Button";
import { Callout } from "@components/Callout";
import { Input } from "@components/Input";
import { Label } from "@components/Label";
import { notify } from "@components/Notification";
import Paragraph from "@components/Paragraph";
import { SelectDropdown } from "@components/select/SelectDropdown";
import * as Tabs from "@radix-ui/react-tabs";
import { useApiCall } from "@utils/api";
import useFetchApi from "@utils/api";
import { Globe2, RefreshCw, Save, ShieldCheck } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import { useLocale } from "@/contexts/LocaleProvider";
import type { ClientUpdateConfig, InstanceStatus } from "@/interfaces/Instance";

const emptyConfig: ClientUpdateConfig = {
  brand: {
    product_name: "CyberNet",
    logo_url: "https://cybernet.aisp24.com/cybernet-app-icon.png",
  },
  localization: {
    default_locale: "zh-CN",
    supported_locales: ["zh-CN", "en"],
  },
  update: {
    channel: "stable",
    latest_version: "",
    version_check_url:
      "https://cybernet.aisp24.com/api/instance/client-update/version",
    release_notes_url: "https://cybernet.aisp24.com/downloads",
    download_url: "https://cybernet.aisp24.com/downloads",
    platform_download_urls: {
      darwin: "",
      windows: "",
      linux: "",
      ios: "",
      android: "",
    },
    automatic_updates_enabled: false,
  },
};

export default function ClientUpdateSettingsTab() {
  const { t } = useLocale();
  const { data, isLoading, mutate } = useFetchApi<InstanceStatus>(
    "/instance",
    true,
    false,
  );
  const saveRequest = useApiCall<ClientUpdateConfig>(
    "/instance/client-update",
    true,
  );
  const [form, setForm] = useState<ClientUpdateConfig>(emptyConfig);
  const [saved, setSaved] = useState<ClientUpdateConfig>(emptyConfig);

  useEffect(() => {
    if (!data?.client_update) return;
    setForm(data.client_update);
    setSaved(data.client_update);
  }, [data]);

  const hasChanges = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(saved),
    [form, saved],
  );

  const updateBrand = (
    key: keyof ClientUpdateConfig["brand"],
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      brand: { ...current.brand, [key]: value },
    }));
  };

  const updateRelease = (
    key: keyof Omit<
      ClientUpdateConfig["update"],
      "platform_download_urls" | "automatic_updates_enabled"
    >,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      update: { ...current.update, [key]: value },
    }));
  };

  const updatePlatform = (
    key: keyof ClientUpdateConfig["update"]["platform_download_urls"],
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      update: {
        ...current.update,
        platform_download_urls: {
          ...current.update.platform_download_urls,
          [key]: value,
        },
      },
    }));
  };

  const save = () => {
    const request = saveRequest.put({
      ...form,
      update: {
        ...form.update,
        automatic_updates_enabled: false,
      },
    });
    notify({
      title: t("updates.saved"),
      description: t("updates.savedDescription"),
      loadingMessage: t("updates.saving"),
      promise: request.then((updated) => {
        setForm(updated);
        setSaved(updated);
        void mutate();
        return updated;
      }),
    });
  };

  return (
    <Tabs.Content value="client-updates" className="w-full">
      <div className="p-default py-6 max-w-3xl">
        <Breadcrumbs>
          <Breadcrumbs.Item
            href="/settings"
            label={t("nav.settings")}
            icon={<SettingsIcon size={13} />}
          />
          <Breadcrumbs.Item
            href="/settings?tab=client-updates"
            label={t("updates.tab")}
            icon={<RefreshCw size={14} />}
            active
          />
        </Breadcrumbs>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1>{t("updates.title")}</h1>
            <Paragraph className="mt-2">{t("updates.description")}</Paragraph>
          </div>
          <Button
            variant="primary"
            onClick={save}
            disabled={isLoading || !hasChanges}
            data-testid="save-client-update-settings"
          >
            <Save size={15} />
            {t("updates.save")}
          </Button>
        </div>

        <Callout variant="info" className="mt-6">
          {t("updates.manualOnly")}
        </Callout>

        <section className="mt-8">
          <div className="flex items-center gap-3 mb-5">
            <Image
              src="/cybernet-app-icon.png"
              alt="CyberNet"
              width={38}
              height={38}
              className="rounded-[28%]"
            />
            <div>
              <h2 className="text-base">{t("updates.productName")}</h2>
              <p className="text-xs text-nb-gray-400">
                CyberNet Dashboard / OAuth
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label={t("updates.productName")}>
              <Input
                value={form.brand.product_name}
                onChange={(event) =>
                  updateBrand("product_name", event.target.value)
                }
                disabled={isLoading}
              />
            </Field>
            <Field label={t("updates.defaultLanguage")}>
              <SelectDropdown
                value={form.localization.default_locale}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    localization: {
                      ...current.localization,
                      default_locale: value as "zh-CN" | "en",
                    },
                  }))
                }
                options={[
                  { value: "zh-CN", label: "简体中文" },
                  { value: "en", label: "English" },
                ]}
                disabled={isLoading}
                className="w-full"
              />
            </Field>
            <Field label={t("updates.logoUrl")} className="md:col-span-2">
              <Input
                type="url"
                value={form.brand.logo_url}
                onChange={(event) =>
                  updateBrand("logo_url", event.target.value)
                }
                disabled={isLoading}
              />
            </Field>
          </div>
        </section>

        <section className="mt-10 border-t border-nb-gray-900 pt-8">
          <div className="flex items-center gap-2 mb-5">
            <Globe2 size={17} />
            <h2 className="text-base">{t("updates.title")}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label={t("updates.channel")}>
              <SelectDropdown
                value={form.update.channel}
                onChange={(value) => updateRelease("channel", value)}
                options={[
                  { value: "stable", label: t("updates.channel.stable") },
                  { value: "beta", label: t("updates.channel.beta") },
                  { value: "rc", label: t("updates.channel.rc") },
                ]}
                disabled={isLoading}
                className="w-full"
              />
            </Field>
            <Field
              label={t("updates.latestVersion")}
              hint={t("updates.emptyVersion")}
            >
              <Input
                placeholder="0.1.1"
                value={form.update.latest_version}
                onChange={(event) =>
                  updateRelease("latest_version", event.target.value)
                }
                disabled={isLoading}
              />
            </Field>
            <Field
              label={t("updates.versionCheckUrl")}
              className="md:col-span-2"
            >
              <Input
                type="url"
                value={form.update.version_check_url}
                onChange={(event) =>
                  updateRelease("version_check_url", event.target.value)
                }
                disabled={isLoading}
              />
            </Field>
            <Field label={t("updates.releaseNotesUrl")}>
              <Input
                type="url"
                value={form.update.release_notes_url}
                onChange={(event) =>
                  updateRelease("release_notes_url", event.target.value)
                }
                disabled={isLoading}
              />
            </Field>
            <Field label={t("updates.downloadUrl")}>
              <Input
                type="url"
                value={form.update.download_url}
                onChange={(event) =>
                  updateRelease("download_url", event.target.value)
                }
                disabled={isLoading}
              />
            </Field>
          </div>
        </section>

        <section className="mt-10 border-t border-nb-gray-900 pt-8">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck size={17} />
            <h2 className="text-base">{t("updates.platformUrls")}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {(
              [
                ["darwin", t("updates.macosUrl")],
                ["windows", t("updates.windowsUrl")],
                ["linux", t("updates.linuxUrl")],
                ["ios", t("updates.iosUrl")],
                ["android", t("updates.androidUrl")],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label}>
                <Input
                  type="url"
                  placeholder={form.update.download_url}
                  value={form.update.platform_download_urls[key]}
                  onChange={(event) => updatePlatform(key, event.target.value)}
                  disabled={isLoading}
                />
              </Field>
            ))}
          </div>
        </section>
      </div>
    </Tabs.Content>
  );
}

function Field({
  label,
  hint,
  className,
  children,
}: Readonly<{
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}>) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-nb-gray-400">{hint}</p>}
    </div>
  );
}
