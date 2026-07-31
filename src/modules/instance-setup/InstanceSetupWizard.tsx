"use client";

import { cn } from "@utils/helpers";
import { CheckCircle2, Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { ApiError, SetupRequest } from "@/interfaces/Instance";
import { submitSetup } from "@/utils/unauthenticatedApi";
import { NetBirdLogo } from "@components/NetBirdLogo";
import Button from "@components/Button";
import { Label } from "@components/Label";
import { Input } from "@components/Input";
import HelpText from "@components/HelpText";
import { GradientFadedBackground } from "@components/ui/GradientFadedBackground";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLocale } from "@/contexts/LocaleProvider";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  general?: string;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/i;

export default function InstanceSetupWizard() {
  const { t } = useLocale();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t("setup.error.emailRequired");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t("setup.error.emailInvalid");
    }

    if (!formData.password) {
      newErrors.password = t("setup.error.passwordRequired");
    } else if (formData.password.length < 8) {
      newErrors.password = t("setup.error.passwordLength");
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("setup.error.confirmRequired");
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = t("setup.error.passwordMismatch");
    }

    if (!formData.name.trim()) {
      newErrors.name = t("setup.error.nameRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const request: SetupRequest = {
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
      };

      await submitSetup(request);
      setIsSuccess(true);
    } catch (err) {
      const error = err as ApiError;
      let message = t("setup.error.generic");

      switch (error.code) {
        case 400:
          message = t("setup.error.invalid");
          break;
        case 412:
          message = t("setup.error.alreadyComplete");
          setTimeout(() => (window.location.href = "/"), 2000);
          break;
        case 422:
          message = t("setup.error.validation");
          break;
        case 500:
          message = t("setup.error.generic");
          break;
        default:
          message = t("setup.error.generic");
      }

      setErrors({ general: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isSuccess) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Full page reload to get fresh instance status from API
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess]);

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  // Surface a mismatch as soon as the operator types in the confirm field,
  // not just on submit (mirrors the invite-redeem flow).
  const passwordsMatch = formData.password === formData.confirmPassword;
  const confirmPasswordError =
    errors.confirmPassword ??
    (formData.confirmPassword && !passwordsMatch
      ? t("setup.error.passwordMismatch")
      : undefined);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 pb-16 pt-16 text-slate-950 dark:bg-nb-gray-950 dark:text-white">
        <div className="fixed right-5 top-5 z-20">
          <LanguageSwitcher />
        </div>
        <div className={"flex items-center justify-center"}>
          <NetBirdLogo size={"large"} mobile={false} />
        </div>
        <Card className={"max-w-[360px] mt-8 mx-auto"}>
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-4 mx-auto">
            <CheckCircle2 className="text-green-500" size={22} />
          </div>
          <h1 className={"relative z-10 text-center text-xl"}>
            {t("setup.success")}
          </h1>
          <div
            className={
              "relative z-10 mt-2 block text-center text-sm font-light text-slate-600 dark:text-nb-gray-300"
            }
          >
            {t("setup.redirecting", { seconds: countdown })}
          </div>
          <div className={"flex items-center justify-center mt-4"}>
            <Button
              type="button"
              onClick={() => (window.location.href = "/")}
              variant={"primary"}
              className={"mx-auto w-full"}
            >
              {t("setup.goLogin")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-5 pb-16 pt-16 text-slate-950 dark:bg-nb-gray-950 dark:text-white">
      <div className="fixed right-5 top-5 z-20">
        <LanguageSwitcher />
      </div>
      <div className={"flex items-center justify-center"}>
        <NetBirdLogo size={"large"} mobile={false} />
      </div>
      <Card className={"max-w-[420px] mt-8 mx-auto"}>
        <h1 className={"relative z-10 text-center text-xl"}>
          {t("setup.welcome")}
        </h1>
        <div
          className={
            "relative z-10 mt-2 block text-center text-sm font-light text-slate-600 dark:text-nb-gray-300"
          }
        >
          {t("setup.description")}
        </div>

        <form
          onSubmit={handleSubmit}
          className={"flex flex-col gap-5 mt-7 z-10 relative"}
        >
          {errors.general && <ErrorMessage error={errors.general} />}
          <div>
            <Label htmlFor={"name"}>{t("setup.name")}</Label>
            <Input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange("name")}
              placeholder={t("setup.namePlaceholder")}
              disabled={isSubmitting}
              autoFocus
              error={errors.name}
            />
          </div>

          <div>
            <Label htmlFor={"email"}>{t("setup.email")}</Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              placeholder="admin@example.com"
              disabled={isSubmitting}
              error={errors.email}
            />
          </div>

          <div>
            <Label htmlFor={"password"}>{t("setup.password")}</Label>
            <Input
              type={"password"}
              id="password"
              value={formData.password}
              onChange={handleInputChange("password")}
              placeholder={t("setup.passwordPlaceholder")}
              disabled={isSubmitting}
              error={errors.password}
              showPasswordToggle={true}
            />
            <HelpText className={"mt-2"}>{t("setup.passwordHelp")}</HelpText>
          </div>

          <div>
            <Label htmlFor={"confirmPassword"}>
              {t("setup.confirmPassword")}
            </Label>
            <Input
              type={"password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              placeholder={t("setup.confirmPasswordPlaceholder")}
              disabled={isSubmitting}
              error={confirmPasswordError}
              showPasswordToggle={true}
            />
          </div>

          <Button
            type={"submit"}
            disabled={isSubmitting}
            variant={"primary"}
            className={"w-full"}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                {t("setup.creating")}
              </>
            ) : (
              t("setup.create")
            )}
          </Button>
        </form>
      </Card>

      <div className={"flex items-center justify-center mt-6"}>
        <span
          className={"text-sm text-nb-gray-400 font-light pb-10 text-center"}
        >
          {t("setup.oneTime")}
        </span>
      </div>
    </div>
  );
}

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "px-6 sm:px-10 py-8 pt-6",
        "relative rounded-xl border border-slate-200 bg-white shadow-sm dark:border-nb-gray-910 dark:bg-nb-gray-940",
        className,
      )}
    >
      <GradientFadedBackground />
      {children}
    </div>
  );
};

const ErrorMessage = ({ error }: { error?: string }) => {
  return (
    <div className="text-red-400 bg-red-800/20 border border-red-800/50 rounded-lg px-4 py-3 whitespace-break-spaces my-3 text-sm">
      {error}
    </div>
  );
};
