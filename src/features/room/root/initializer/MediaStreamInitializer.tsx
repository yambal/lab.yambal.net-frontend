import React, { Fragment, useEffect } from 'react';
import { useMount } from 'react-use';

type MediaStreamInitializerProps = {
  onMediaStream: (stream: MediaStream) => void
}

export const MediaStreamInitializer = ({
  onMediaStream
}:MediaStreamInitializerProps) => {

  //useMount(() => {
  useEffect(() => {
    var constraints = { audio: true, video: false };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      onMediaStream(stream)
    })
  },[])

  return (
    <Fragment />
  )
}