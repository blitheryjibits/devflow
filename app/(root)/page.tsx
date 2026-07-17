import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "@/constants/route";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/cards/QuestionCard";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const questions = [
  {
    _id: "1",
    title: "how to build in react",
    tags: [{ _id: "1", name: "React" }],
    author: { _id: "1", name: "John Doe", image: "/icons/avatar.svg" },
    createdAt: new Date("2023-06-01T10:00:00Z"),
    upvotes: 10,
    answers: 5,
    views: 100,
  },
  {
    _id: "2",
    title: "how to build in javascript",
    tags: [{ _id: "2", name: "Javascript" }],
    author: { _id: "2", name: "John Doe", image: "/icons/avatar.svg" },
    createdAt: new Date("2025-04-01T10:00:00Z"),
    upvotes: 15,
    answers: 8,
    views: 200,
  },
  {
    _id: "3",
    title: "MongoDB vs MySQL: Which One Should You Choose?",
    tags: [
      { _id: "1", name: "MongoDB" },
      { _id: "2", name: "MySQL" },
    ],
    author: { _id: "1", name: "Jane Doe", image: "/icons/avatar.svg" },
    createdAt: new Date(),
    upvotes: 15,
    answers: 8,
    views: 200,
  },
];

const Home = async ({ searchParams }: SearchParams) => {
  const { query = "", filter = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title.toLowerCase().includes(query?.toLowerCase());
    const matchesFilter = filter ? question.tags.some((tag) => tag.name.toLowerCase() === filter.toLowerCase()) : true;
    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button asChild className="primary-gradient text-light-900! min-h-11.5 rounded-sm px-4 py-3">
          <Link href={ROUTES.ASK_QUESTION}>ask a question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch imgSrc="/icons/search.svg" placeholder="Search Questions" otherClasses="flex-1" route="/" />
      </section>

      <HomeFilter />

      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
};

export default Home;
