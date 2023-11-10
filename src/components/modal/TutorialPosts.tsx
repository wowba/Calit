import React from "react";

interface Props {
  posts: any;
}

export default function TutorialPost({ posts }: Props) {
  return (
    <div>
      <ul>
        {posts.map((post: any) => (
          <div key={post.key}>
            <p>{post.key}</p>
            <p>{post.content}</p>
          </div>
        ))}
      </ul>
    </div>
  );
}
