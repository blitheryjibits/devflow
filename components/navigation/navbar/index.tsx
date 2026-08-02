import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import Theme from "@/components/navigation/navbar/Theme";
import UserAvatar from "@/components/UserAvatar";
import MobileNavigation from "./MobileNavigation";

const NavBar = async () => {
	const session = await auth();

	return (
		<nav className="flex-between background-light900_dark200 fixed z-20 w-full p-6 sm:px-12 dark:shadow-none">
			<Link href="/" className="flex items-center gap-1">
				<Image
					src="/images/site-logo.svg"
					width={23}
					height={23}
					alt="Devflow Logo"
				/>
				<p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
					Dev<span className="text-primary-500">flow</span>
				</p>
			</Link>
			<p>Global Search</p>
			<div className="flex-between gap-5">
				<Theme />

				{session?.user?.id && (
					<UserAvatar
						id={session.user.id}
						name={session.user.name || "User"}
						imageUrl={session.user?.image}
					/>
				)}

				<MobileNavigation />
			</div>
		</nav>
	);
};

export default NavBar;
