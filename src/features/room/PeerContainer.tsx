import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useMount } from 'react-use';
import Peer, { MeshRoom } from 'skyway-js';

type RoomData = {
  dataType: 'ping' | 'res_ping'
  to: string | 'all'
  name: string
}

const peer = new Peer({key: 'd7be2df2-a221-4b31-8777-4911bece8381', debug: 0});
let room: MeshRoom = null;
peer.on('error', console.error);

let __roomMember = {}

const ROOM_ID='1st'

export const PeerContainer = () => {
  const [roomMember, setRoomNumber] = useState({})

  const joinSkyway = () => {
    room = peer.joinRoom(ROOM_ID, {
      mode: 'mesh'
    });

    room.once('open', () => {
      console.log(`--- opened ---`)
      console.log(room)

      const data:RoomData = {
        dataType: "ping",
        to: 'all',
        name: ''
      }
      console.log(`send: ${JSON.stringify(data)}`)
      room.send(data)
    });

    room.on('data', ({ src, data }) => {
      const from: string = src
      const recieveData: RoomData = data
      console.log(`data: ${JSON.stringify(recieveData)} from ${from}`)
      switch(`${recieveData.dataType}-${recieveData.to}`){
        case 'ping-all':
          const data:RoomData = {
            dataType: 'res_ping',
            to: from,
            name: ''
          }
          console.log(`send: ${JSON.stringify(data)}`)
          room.send(data)
          break
        case `res_ping-${peer.id}`:
          console.log(`res ping ${JSON.stringify(recieveData)} from ${from}`)
          const member = {}
          member[from] = {
            name: recieveData.name
          }
          __roomMember = Object.assign({}, __roomMember, member)
          setRoomNumber(__roomMember)
          break
      }
    })

    room.on('peerJoin', peerId => {
      console.log(`--- ${peerId} joined ---`);
    });
    room.on('stream', stream => {
      console.log(`--- ${stream.peerId} stream ---`);
    });
    room.on('peerLeave', peerId => {
      console.log(`--- ${peerId} leaved ---`);
    });
    
    room.once('close', () => {
      console.log('--- leaved ---');
    });
  }

  useMount(() => {
    
    joinSkyway()
  })

  console.log(roomMember)

  return (
    <div>
      <div>{peer && peer.id}</div>
      <div>{JSON.stringify(roomMember)}</div>
    </div>
  );
}
