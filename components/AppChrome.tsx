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
              width={96}
              height={96}
              priority
              className="app-brand__logo"
            />
          </button>

          <div className="app-chrome__back">
            {back ? (
              <button type="button" className="app-chrome-back" onClick={handleBack}>
                ← {back.label}
              </button>
            ) : (
              <span className="app-chrome-back-placeholder" aria-hidden="true" />
            )}
          </div>
        </div>

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

        <div className="app-chrome__actions">
          <SoundToggle />
        </div>
      </div>

      {heading || status ? (
        <div className="app-chrome__page-head">
          {heading ? (
            <div className="page-title-lockup">
              {heading.icon ? (
                <ActivityIcon icon={heading.icon} className="subject-heading-icon" />
              ) : null}
              <div>
                {heading.eyebrow ? <p className="eyebrow">{heading.eyebrow}</p> : null}
                {heading.title ? (
                  <>
                    <h1 id={heading.titleId}>{heading.title}</h1>
                    {heading.subtitle ? (
                      <p className="map-subtitle">{heading.subtitle}</p>
                    ) : null}
                  </>
                ) : heading.subtitle ? (
                  <h1 id={heading.titleId} className="page-heading">
                    {heading.subtitle}
                  </h1>
                ) : null}
              </div>
            </div>
          ) : null}
          {status}
        </div>
      ) : null}
    </header>
  );
}
