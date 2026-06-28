import Link from "next/link";
import ROUTES from "@/constants/route";
import Image from "next/image";
import TagCard from "../cards/TagCard";

const RightSidebar = () => {
  const hotQs = [
    { _id: "1", title: "How to create a custom hook in React?" },
    { _id: "2", title: "How to use React Context?" },
  ];

  const popTags = [
    { _id: "1", name: "react", questions: 100 },
    { _id: "2", name: "javascript", questions: 500 },
    { _id: "3", name: "typescript", questions: 700 },
    { _id: "4", name: "postgresql", questions: 300 },
    { _id: "5", name: "mongodb", questions: 1000 },
    { _id: "6", name: "react-query", questions: 1000 },
  ];

  return (
    <section className="custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 right-0 flex h-screen w-87.5 flex-col gap-6 overflow-y-auto border-l p-6 pt-36 max-lg:hidden dark:shadow-none">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <div className="mt-7 flex w-full flex-col gap-7">
          {hotQs.map(({ _id, title }) => (
            <Link
              key={_id}
              href={ROUTES.PROFILE(_id)}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{`${title}`}</p>
              <Image src="/icons/chevron-right.svg" alt="chevron" width={20} height={20} className="invert-colors" />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popTags.map(({ _id, name, questions }) => (
            <TagCard key={_id} _id={_id} name={name} questions={questions} showCount compact />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
