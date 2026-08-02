import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ROUTES from "@/constants/route";

interface Props {
	id: string;
	name?: string;
	imageUrl?: string | null;
	className?: string;
}

const UserAvatar = ({ id, name, imageUrl, className }: Props) => {
	const initials = name
		?.split(" ")
		.map((n: string) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<Link href={ROUTES.PROFILE(id)}>
			<Avatar className={className}>
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={name || "User Avatar"}
						width={36}
						height={36}
						className="object-cover rounded-full"
						quality={100}
					/>
				) : (
					<AvatarFallback className="text-sm font-medium text-white">
						{initials}
					</AvatarFallback>
				)}
			</Avatar>
		</Link>
	);
};

export default UserAvatar;
