import React from 'react'

export const AdditionalContent = () => {
  const data = getData();
  return <p>{data}</p>;
};

let loadedData: string | null = null;

const loadData = (ms: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        resolve("Hello")
      },
      ms
    )
  })
}

const getData = () => {
  if (loadedData) {
    // 取得済みなので返す
    return loadedData;
  } else {
    throw loadData(2000).then(data => {
      loadedData = data;
    });
  }
}