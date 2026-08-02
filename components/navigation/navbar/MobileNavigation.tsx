import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import NavLinks from "@/components/navigation/navbar/NavLinks";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import ROUTES from "@/constants/route";

const MobileNavigation = async () => {
	const session = await auth();
	const userId = session?.user?.id;
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Image
					src="icons/hamburger.svg"
					width={36}
					height={36}
					alt="menu"
					className="invert-colors sm:hidden"
				/>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="background-light900_dark200 border-none"
			>
				<SheetHeader>
					<SheetTitle className="hidden">Navigation</SheetTitle>
					<Link href={ROUTES.HOME} className="flex items-center gap-1">
						<Image
							src="/images/site-logo.svg"
							width={23}
							height={23}
							alt="logo"
						/>
						<p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900">
							Dev<span className="text-primary-500">flow</span>
						</p>
					</Link>
					<div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
						<SheetClose asChild className="flex h-full flex-col gap-6 pt-16">
							<NavLinks isMobileNav />
						</SheetClose>
						<div className="flex flex-col gap-3">
							{userId ? (
								<SheetClose asChild>
									<form
										action={async () => {
											"use server";
											await signOut();
										}}
									>
										<Button
											type="submit"
											className="base-medium w-fit !bg-transparent px-4 py-3"
										>
											<LogOut className="size-5 text-black dark:text-white" />
											<span className=" text-dark300_light900">Logout</span>
										</Button>
									</form>
								</SheetClose>
							) : (
								<>
									<SheetClose asChild className="flex h-full flex-col">
										<Link href={ROUTES.SIGN_IN}>
											<Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
												<span className="primary-text-gradient">Log In</span>
											</Button>
										</Link>
									</SheetClose>
									<SheetClose asChild className="flex h-full flex-col">
										<Link href={ROUTES.SIGN_UP}>
											<Button className="small-medium light-border-2 btn-tertiary text-dark-400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
												<span className="primary-text-gradient">Sign Up</span>
											</Button>
										</Link>
									</SheetClose>
								</>
							)}
						</div>
					</div>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
};

export default MobileNavigation;
