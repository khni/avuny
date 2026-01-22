"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@workspace/ui/components/breadcrumb";
import { ReactNode, ComponentType } from "react";

type BreadCrumbItem = {
  href: string;
  name: string;
};

type CustomBreadCrumbProps = {
  /** Current page name */
  pageName: string;
  /** List of breadcrumb items */
  items: BreadCrumbItem[];
  /** Optional link wrapper (e.g. Next.js Link or custom routing component) */
  LinkWrapper?: ComponentType<{ href: string; children: ReactNode }>;
};

/**
 * Custom breadcrumb component with optional Link wrapper.
 * If `LinkWrapper` is provided, it wraps breadcrumb links using that component (e.g., Next.js Link).
 * Otherwise, it falls back to a native <a> tag.
 */
export function CustomBreadCrumb({
  pageName,
  items,
  LinkWrapper,
}: CustomBreadCrumbProps) {
  return (
    <Breadcrumb className="mb-3">
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={item.href} className="flex items-center">
            <BreadcrumbItem>
              {LinkWrapper ? (
                <LinkWrapper href={item.href}>
                  <BreadcrumbLink asChild>
                    <span className="text-base cursor-pointer">
                      {item.name}
                    </span>
                  </BreadcrumbLink>
                </LinkWrapper>
              ) : (
                <BreadcrumbLink
                  href={item.href}
                  className="text-base cursor-pointer"
                >
                  {item.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {index < items.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}

        <BreadcrumbItem>
          <BreadcrumbPage>
            <p className="text-base font-semibold">{pageName}</p>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
