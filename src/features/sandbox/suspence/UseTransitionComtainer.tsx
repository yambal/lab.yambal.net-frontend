import React, { Suspense } from 'react'
import {AdditionalContent} from '../suspence/AdditionalContent'
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

export const UseTransitionComtainer = () => {
  const [showChild, setShowChild] = React.useState(false);
  const [isPending, startTransition] = React.useTransition(SUSPENSE_CONFIG);

  return (
    <>
      <h1>02 Example of useTransition</h1>
      <Suspense fallback={<p>loading...</p>}>
        {showChild ? (
          <AdditionalContent />
        ) : (
          <button
            onClick={() => {
              // setShowChildをstartTransitionで囲んだ
              startTransition(() => {
                setShowChild(true);
              });
            }}
          >
            追加コンテンツを表示
          </button>
        )}
      </Suspense>
    </>
  );
};