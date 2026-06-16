import { auth, signOut } from "@/auth";
import ROUTES from "@/constants/route";

const Home = async () => {
  const session = await auth();
  console.log(session);
  return (
    <>
      <h1>Welcome to the root home page</h1>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
        className="px-10 pt-25"
      ></form>
    </>
  );
};

export default Home;
