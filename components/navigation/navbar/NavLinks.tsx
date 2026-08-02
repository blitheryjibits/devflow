"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants/index";
import { cn } from "@/lib/utils";

const NavLinks = ({
	isMobileNav = false,
	userId,
}: {
	isMobileNav?: boolean;
	userId?: string;
}) => {
	const pathName = usePathname();

	return (
		<>
			{sidebarLinks.map((item) => {
				const isActive =
					(pathName.includes(item.route) && item.route.length > 1) ||
					pathName === item.route;
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
							isActive
								? "primary-gradient text-light-900 rounded-lg"
								: "text-dark300_light900",
							"flex items-center justify-start gap-4 bg-transparent p-3",
						)}
					>
						<Image
							src={item.imgURL}
							width={20}
							height={20}
							alt={item.label}
							className={cn({ "invert-colors": !isActive })}
						/>
						<p
							className={cn(
								isActive ? "base-bold" : "base-medium",
								!isMobileNav && "max-lg:hidden",
							)}
						>
							{item.label}
						</p>
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
