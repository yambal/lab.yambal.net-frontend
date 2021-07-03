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
      /**
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      source.connect(ctx.destination);
       */
    })
  })

  return (
    <Fragment />
  )
}