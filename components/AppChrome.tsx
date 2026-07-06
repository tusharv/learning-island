"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { ActivityIconName } from "@/types/learning";
import { BRAND_ASSETS, BRAND_NAME } from "@/lib/branding";
import type { AppChromeBack, BreadcrumbSegment } from "@/lib/breadcrumbs";
import { ActivityIcon } from "./ActivityIcon";
import { SoundToggle } from "./SoundToggle";

export type AppChromeHeading = {
  icon?: ActivityIconName;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  titleId?: string;
};

type AppChromeProps = {
  crumbs: BreadcrumbSegment[];
  back?: AppChromeBack | null;
  onBack?: () => void;
  heading?: AppChromeHeading;
  status?: ReactNode;
};

function HomeIcon({ className = "" }: { className?: string }) {
  return (
    <span className={["breadcrumb-home-icon", className].filter(Boolean).join(" ")} aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        <path
          className="breadcrumb-home-shape"
          d="M4 14 16 4l12 10v12a2 2 0 0 1-2 2h-7v-8H13v8H6a2 2 0 0 1-2-2Z"
        />
        <path className="breadcrumb-home-wave" d="M8 26c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      </svg>
    </span>
  );
}

function SegmentIcon({
  icon,
}: {
  icon: ActivityIconName | "home" | undefined;
}) {
  if (!icon) {
    return null;
  }

  if (icon === "home") {
    return <HomeIcon className="breadcrumb-segment-icon" />;
  }

  return <ActivityIcon icon={icon} className="breadcrumb-segment-icon" />;
}

export function AppChrome({ crumbs, back, onBack, heading, status }: AppChromeProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (back?.href) {
      router.push(back.href);
    }
  };

  const handleBrandClick = () => {
    router.push("/");
  };

  const handleCrumbClick = (href: string) => {
    router.push(href);
  };

  const pageTitle = heading?.title ?? heading?.subtitle;
  const pageTitleId = heading?.titleId;

  return (
    <header className="app-chrome">
      <div className="app-chrome__row">
        <div className="app-chrome__brand-panel">
          <button
            type="button"
            className="app-brand"
            onClick={handleBrandClick}
            aria-label={`${BRAND_NAME} home`}
          >
            <Image
              src={BRAND_ASSETS.markPath}
              alt={`${BRAND_NAME} mark`}
              width={48}
              height={48}
              priority
              className="app-brand__logo"
            />
          </button>

          {back ? (
            <button type="button" className="app-chrome-back" onClick={handleBack}>
              ← {back.label}
            </button>
          ) : null}
        </div>

        <div className="app-chrome__center">
          <nav className="app-chrome__crumbs" aria-label="Where you are">
            <ol className="breadcrumb-trail">
              {crumbs.map((segment, index) => {
                const key = `${segment.label}-${index}`;
                const isCurrent = segment.current === true;

                if (isCurrent || !segment.href) {
                  return (
                    <li key={key} className="breadcrumb-item">
                      <span
                        className="breadcrumb-segment"
                        data-current={isCurrent ? "true" : undefined}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        <SegmentIcon icon={segment.icon} />
                        <span className="breadcrumb-segment-label">{segment.label}</span>
                      </span>
                      {index < crumbs.length - 1 ? (
                        <span className="breadcrumb-separator" aria-hidden="true">
                          ›
                        </span>
                      ) : null}
                    </li>
                  );
                }

                return (
                  <li key={key} className="breadcrumb-item">
                    <button
                      type="button"
                      className="breadcrumb-segment"
                      onClick={() => handleCrumbClick(segment.href!)}
                    >
                      <SegmentIcon icon={segment.icon} />
                      <span className="breadcrumb-segment-label">{segment.label}</span>
                    </button>
                    <span className="breadcrumb-separator" aria-hidden="true">
                      ›
                    </span>
                  </li>
                );
              })}
            </ol>
          </nav>

          {heading && pageTitle ? (
            <div className="app-chrome__inline-title">
              {heading.icon ? (
                <ActivityIcon icon={heading.icon} className="app-chrome__title-icon" />
              ) : null}
              <div className="app-chrome__title-copy">
                {heading.eyebrow ? (
                  <span className="app-chrome__eyebrow">{heading.eyebrow}</span>
                ) : null}
                <h1 id={pageTitleId} className="app-chrome__page-title">
                  {pageTitle}
                </h1>
                {heading.title && heading.subtitle ? (
                  <p className="app-chrome__page-subtitle">{heading.subtitle}</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="app-chrome__actions">
          {status}
          <SoundToggle />
        </div>
      </div>
    </header>
  );
}
