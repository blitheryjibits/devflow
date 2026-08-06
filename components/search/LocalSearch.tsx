"use client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";

interface Props {
	route: string;
	imgSrc: string;
	placeholder: string;
	iconPosition?: "left" | "right";
	otherClasses?: string;
}

const LocalSearch = ({
	route,
	imgSrc,
	placeholder,
	iconPosition = "left",
	otherClasses,
}: Props) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const query = searchParams.get("query") || "";
	const [searchQuery, setSearchQuery] = useState(query);
	const router = useRouter();
	const previousSearchRef = useRef(searchQuery);

	useEffect(() => {
		if (previousSearchRef.current === searchQuery) return;

		previousSearchRef.current = searchQuery;

		const delayDebounceFn = setTimeout(() => {
			if (searchQuery) {
				const newUrl = formUrlQuery({
					params: searchParams.toString(),
					key: "query",
					value: searchQuery,
				});

				router.push(newUrl, { scroll: false });
			} else {
				if (pathname === route) {
					const newUrl = removeKeysFromUrlQuery({
						params: searchParams.toString(),
						keysToRemove: ["query"],
					});

					router.push(newUrl, { scroll: false });
				}
			}
		}, 800);

		return () => clearTimeout(delayDebounceFn);
	}, [searchQuery, router, route, searchParams, pathname]);

	return (
		<div
			className={`background-light800_dark100 flex min-h-14 grow items-center gap-4 rounded-sm px-4 ${otherClasses}`}
		>
			{iconPosition === "left" && (
				<Image
					src={imgSrc}
					height={24}
					width={24}
					alt="Search"
					className="cursor-pointer"
				/>
			)}
			<Input
				type="text"
				placeholder={placeholder}
				value={searchQuery}
				onChange={(e) => {
					setSearchQuery(e.target.value);
				}}
				className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
			/>
			{iconPosition === "right" && (
				<Image
					src={imgSrc}
					height={15}
					width={15}
					alt="Search"
					className="cursor-pointer"
				/>
			)}
		</div>
	);
};

export default LocalSearch;
