import React, { useState, useCallback, Fragment } from 'react';
import { useMount } from 'react-use';

type MediaStreamInitializerProps = {
  onMediaStream: (stream: MediaStream) => void
}

export const MediaStreamInitializer = ({
  onMediaStream
}:MediaStreamInitializerProps) => {

  useMount(() => {
    var constraints = { audio: true, video: false };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      onMediaStream(stream)
    })
  })

  return (
    <Fragment />
  )
}