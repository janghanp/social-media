import React from "react";

const Feed = () => {
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Shoes!</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
      </div>
        <img
          src="https://api.lorem.space/image/shoes?w=400&h=225"
          alt="Shoes"
        />
    </div>
  );
};

export default Feed;
