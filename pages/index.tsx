import type { NextPage } from "next";

import Feed from "../components/Feed";
import Widget from "../components/Widget";

const Home: NextPage = () => {
  return (
    <div className="container mx-auto max-w-4xl flex flex-row border min-h-screen px-5 lg:px-0">
      <section className="w-4/5">
        {/* <Feed /> */}
      </section>
      <section className="w-2/5">
        {/* <Widget /> */}
      </section>
    </div>
  );
};

export default Home;
