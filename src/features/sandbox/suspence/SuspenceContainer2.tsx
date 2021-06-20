import React, { useState, Suspense } from "react";
import { fetchProfileData } from "./fakeApi";
import { Container } from '../../../components/bootstrap/' 
function getNextId(id) {
  return id === 3 ? 0 : id + 1;
}

const initialResource = fetchProfileData(0);

export const SuspenceContainer2 = () => {
  const [resource, setResource] = useState(
    initialResource
  );
  return (
    <Container>
      <button
        onClick={() => {
          const nextUserId = getNextId(
            resource.userId
          );
          setResource(
            fetchProfileData(nextUserId)
          );
        }}
      >
        Next
      </button>
      <ProfilePage resource={resource} />
    </Container>
  );
}

function ProfilePage({ resource }) {
  return (
    <Suspense
      fallback={<h1>Loading profile...</h1>}
    >
      <ProfileDetails resource={resource} />
      <Suspense
        fallback={<h1>Loading posts...</h1>}
      >
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}

