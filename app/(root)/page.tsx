import { auth, signOut } from "@/auth";
import ROUTES from "@/constants/route";

const Home = async () => {
  const session = await auth();
  console.log(session);
  return <>Home Sweet Home</>;
};

export default Home;
