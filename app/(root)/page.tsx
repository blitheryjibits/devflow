import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "@/constants/route";

const Home = async () => {
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button asChild className="primary-gradient text-light-900! min-h-11.5 rounded-sm px-4 py-3">
          <Link href={ROUTES.ASK_QUESTION}>ask a question</Link>
        </Button>
      </section>
      <section className="mt-11">local search</section>
      HomeFilter
      <div className="mt-10 flex w-full flex-col gap-6">
        <p>Question card 1</p>
        <p>Question card 2</p>
        <p>Question card 3</p>
        <p>Question card 4</p>
      </div>
    </>
  );
};

export default Home;
