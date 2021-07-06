import React, { useRef } from 'react';
import { useMount } from 'react-use';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import { exMeshodsState } from './peerAtom';


type MemberAudioProps = {
  peerId: string
}

export const MemberAudio = ({
  peerId
}:MemberAudioProps) => {
  const audioRef = useRef<HTMLAudioElement>()
  const exMethods = useRecoilValue(exMeshodsState)

  useMount(() => {
    audioRef.current.srcObject = exMethods.getStream(peerId)
    audioRef.current.play()
  })

  return (
    <audio id={peerId} ref={audioRef} controls={true}/>
  )
}