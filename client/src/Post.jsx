import React from "react";

const Post = () => {
  return (
    <div className="post">
      <div className="image">
        <img
          src="https://techcrunch.com/wp-content/uploads/2023/06/Screenshot-2023-06-20-at-13.28.51-e1687264290854.png?w=1390&crop=1"
          alt=""
        />
      </div>
      <div className="texts">
        <h2>
          Sequoia debuts Atlas, an interactive guide to the European tech talent
          landscape
        </h2>
        <p className="info">
          <a href="" className="author">
            Vinayaka Iyer
          </a>
          <time>2023-01-06 16:45</time>
        </p>
        <p className="summary">
          There is an estimated 3 million software engineers in Europe,
          depending on what report you want to believe, but finding the rights
          engineers for the job in hand isn’t all that straight forward.
        </p>
      </div>
    </div>
  );
};

export default Post;
