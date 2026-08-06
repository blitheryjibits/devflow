import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { techMap } from "@/constants/techMap";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const techDescriptionMap: { [key: string]: string } = {
	javascript:
		"JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
	typescript:
		"TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",
	react:
		"React is a popular library for building fast and modular user interfaces.",
	nextjs:
		"Next.js is a React framework for server-side rendering and building optimized web applications.",
	nodejs:
		"Node.js enables server-side JavaScript, allowing you to create fast, scalable network applications.",
	python:
		"Python is a versatile language known for readability and a vast ecosystem, often used for data science and automation.",
	java: "Java is an object-oriented language commonly used for enterprise applications and Android development.",
	cplusplus:
		"C++ is a high-performance language suitable for system software, game engines, and complex applications.",
	git: "Git is a version control system that tracks changes in source code during software development.",
	docker:
		"Docker is a container platform that simplifies application deployment and environment management.",
	mongodb:
		"MongoDB is a NoSQL database for handling large volumes of flexible, document-based data.",
	mysql:
		"MySQL is a popular relational database, known for reliability and ease of use.",
	postgresql:
		"PostgreSQL is a robust open-source relational database with advanced features and strong SQL compliance.",
	aws: "AWS is a comprehensive cloud platform offering a wide range of services for deployment, storage, and more.",
};

export const getTechDescription = (techName: string) => {
	const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();
	return techDescriptionMap[normalizedTechName]
		? techDescriptionMap[normalizedTechName]
		: `${techName} is a technology or tool widely used in web development, providing valuable features and capabilities.`;
};

export const getDeviconsClassName = (techName: string) => {
	const normalizedTechName = techName.replace(/[ .]/g, "").toLocaleLowerCase();

	return techMap[normalizedTechName]
		? `${techMap[normalizedTechName]} colored`
		: "devicon-devicon-plain";
};

export const getTimeStamp = (createdAt: Date): string => {
	const date = new Date(createdAt);
	const now = new Date();
	const diff = (now.getTime() - date.getTime()) / 1000; // seconds

	if (diff < 5) return "just now";
	if (diff < 60) return `${Math.floor(diff)} seconds ago`;

	const minutes = diff / 60;
	if (minutes < 60) return `${Math.floor(minutes)} minutes ago`;

	const hours = minutes / 60;
	if (hours < 24) return `${Math.floor(hours)} hours ago`;

	const days = hours / 24;
	if (days < 7) return `${Math.floor(days)} days ago`;

	const weeks = days / 7;
	if (weeks < 4) return `${Math.floor(weeks)} weeks ago`;

	const months = days / 30; // approx
	if (months < 12) return `${Math.floor(months)} months ago`;

	const years = days / 365; // approx
	return `${Math.floor(years)} years ago`;
};
