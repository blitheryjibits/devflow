import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "@/constants/route";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const questions = [
  {
    _id: 1,
    title: "how to build in react",
    tags: [{ _id: 1, name: "React" }],
  },
  {
    _id: 2,
    title: "how to build in javascript",
    tags: [{ _id: 1, name: "Javascript" }],
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
          <h1 key={question._id}>{question.title}</h1>
        ))}
      </div>
    </>
  );
};

export default Home;
