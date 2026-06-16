"use client";
import React from "react";
import { sidebarLinks } from "@/constants/index";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";

const NavLinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {
  const pathName = usePathname();
  const userId = 1;

  return (
    <>
      {sidebarLinks.map((item) => {
        const isActive = (pathName.includes(item.route) && item.route.length > 1) || pathName === item.route;
        if (item.route === "/profile") {
          if (userId) item.route = `${item.route}/${userId}`;
          else {
            return null;
          }
        }

        const linkComponent = (
          <Link
            href={item.route}
            key={item.label}
            className={cn(
              isActive ? "primary-gradient text-light-900 rounded-lg" : "text-dark300_light900",
              "flex items-center justify-start gap-4 bg-transparent p-4"
            )}
          >
            <Image
              src={item.imgURL}
              width={20}
              height={20}
              alt={item.label}
              className={cn({ "invert-colors": !isActive })}
            />
            <p className={cn(isActive ? "base-bold" : "base-medium", !isMobileNav && "max-lg:hidden")}>{item.label}</p>
          </Link>
        );
        return isMobileNav ? (
          <SheetClose asChild key={item.route}>
            {linkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={item.route}>{linkComponent}</React.Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;
