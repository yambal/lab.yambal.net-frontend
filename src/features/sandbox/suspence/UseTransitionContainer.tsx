import React, {
  useState,
  useTransition,
  Suspense
} from "react";
import { Container } from '../../../components/bootstrap/' 
import { fetchProfileData } from "./fakeApi";

function getNextId(id) {
  return id === 3 ? 0 : id + 1;
}

const initialResource = fetchProfileData(0);

export const UseTransitionContainer = () => {
  const [resource, setResource] = useState(
    initialResource
  );
  const [
    isPending,
    startTransition,
  ] = useTransition({
    timeoutMs: 3000
  });
  return (
    <Container>
      <div>pending : {isPending ? 'yes' : 'no'}</div>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(
              resource.userId
            );
            setResource(
              fetchProfileData(nextUserId)
            );
          });
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
