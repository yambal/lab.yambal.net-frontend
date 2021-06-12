import React, { Suspense } from 'react'
import { Container } from '../../../components/bootstrap';
import { AdditionalContent } from './AdditionalContent'

/**
 * https://qiita.com/uhyo/items/6be96c278c71b0ddb39b
 * @returns 
 */

export const SuspenseComtainer = () => {
  const [showChild, setShowChild] = React.useState(false);

  return (
    <Container>
      <h1>01 Example of Suspense</h1>
      {showChild ? (
        <>
        <Suspense fallback={<p>loading...</p>}>
          <AdditionalContent />
        </Suspense>
        </>
      ) : (
        <button onClick={() => setShowChild(true)}>追加コンテンツを表示</button>
      )}
    </Container>
  );
};