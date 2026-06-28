import NavLinks from "./navbar/NavLinks";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import ROUTES from "@/constants/route";
const LeftSidebar = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 left-0 flex h-screen flex-col justify-between gap-6 overflow-y-auto border-r p-6 pt-32 max-sm:hidden lg:w-66.5 dark:shadow-none">
      <div className="flex flex-1 flex-col gap-2">
        <NavLinks />
      </div>
      <div className="flex flex-col gap-3">
        <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none" asChild>
          <Link href={ROUTES.SIGN_IN}>
            <Image src="/icons/account.svg" alt="Account" width={20} height={20} className="invert-colors lg:hidden" />
            <span className="primary-text-gradient max-lg:hidden">Log In</span>
          </Link>
        </Button>

        <Button
          className="small-medium light-border-2 btn-tertiary text-dark-400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
          asChild
        >
          <Link href={ROUTES.SIGN_UP}>
            <Image src="/icons/sign-up.svg" alt="Account" width={20} height={20} className="invert-colors lg:hidden" />
            <span className="max-lg:hidden">Sign Up</span>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default LeftSidebar;
