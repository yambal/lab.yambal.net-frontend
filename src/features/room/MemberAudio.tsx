import React, { useEffect, useRef } from 'react';
import { useMount } from 'react-use';
import { useRecoilValue } from 'recoil';
import { distanceFamilyById, exMeshodsState } from './peerAtom';


type MemberAudioProps = {
  peerId: string
}

export const MemberAudio = ({
  peerId
}:MemberAudioProps) => {
  const audioRef = useRef<HTMLAudioElement>()
  const exMethods = useRecoilValue(exMeshodsState)
  const distance = useRecoilValue(distanceFamilyById(peerId))

  useMount(() => {
    audioRef.current.srcObject = exMethods.getStream(peerId)
    audioRef.current.play()
  })

  useEffect(() => {
    switch(distance){
      case 'immediately':
        audioRef.current.volume = 1
        break;
      case 'standingTalk':
        audioRef.current.volume = 0.9
        break;
      case 'symposium':
        audioRef.current.volume = 0.8
        break;
      case 'festa':
        audioRef.current.volume = 0.4
        break; 
      case 'neighborhood':
        audioRef.current.volume = 0.1
        break;
      case 'out':
        audioRef.current.volume = 0.02
        break;
    }
  },[distance])

  return (
    <>
    <audio id={peerId} ref={audioRef} controls={false}/>
    </>
  )
}