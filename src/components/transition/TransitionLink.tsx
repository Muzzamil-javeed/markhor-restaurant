"use client";

import Link from "next/link";
import {
  useCallback,
  type ComponentProps,
  type MouseEvent,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { labelForHref, shouldInterceptNavigation } from "@/lib/motion";
import { useOptionalTransitionNav } from "@/components/transition/TransitionProvider";

type TransitionLinkProps = ComponentProps<typeof Link> & {
  transitionLabel?: string;
};

export function TransitionLink({
  href,
  onClick,
  transitionLabel,
  replace,
  ...rest
}: TransitionLinkProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nav = useOptionalTransitionNav();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;

      const hrefStr =
        typeof href === "string" ? href : href.pathname || "/";

      const reason = shouldInterceptNavigation({
        href: hrefStr,
        currentPath: pathname,
        currentSearch: searchParams?.toString()
          ? `?${searchParams.toString()}`
          : "",
        target: rest.target,
        download: Boolean(rest.download),
        button: event.button,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
      });

      if (reason) {
        if (reason === "hash" && hrefStr.includes("#")) {
          const id = hrefStr.split("#")[1];
          if (id) {
            event.preventDefault();
            document
              .getElementById(id)
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
        return;
      }

      if (!nav) return;

      event.preventDefault();
      const label = transitionLabel ?? labelForHref(hrefStr);
      nav.navigate(hrefStr, label);
    },
    [href, nav, onClick, pathname, rest.download, rest.target, searchParams, transitionLabel],
  );

  return (
    <Link href={href} replace={replace} onClick={handleClick} {...rest} />
  );
}
