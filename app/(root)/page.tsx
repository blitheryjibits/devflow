import Hello from "../../components/Hello";
const Home = () => {
  return (
    <main>
      <div>
        <Hello />
        <h1>Welcome to the Home Page</h1>
        <p>This is the main landing page of the application.</p>
      </div>
      <Hello />
    </main>
  );
};

export default Home;
