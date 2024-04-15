import type { Room } from 'livekit-client';
import * as React from 'react';
import type { RecordButtonProps } from '../components';
import { useRoomContext } from '../context';
import { mergeProps } from '../mergeProps';

interface EEgress {
  roomName: string;
  status: string | number;
}

function setupRecordButton() {
  const toggleRecord = async (room: Room) => {
    // const apiEndpoint = sessionStorage.getItem('apiEndpoint');
    const apiEndpoint = `${window.origin}/api/`
    // const apiEndpoint = 'http://localhost:3000/api/';
    const metaData = JSON.parse(room.metadata || '{}');
    let isRecord = null;

    const listEndpoint = `${apiEndpoint}record_list`;
    const res = await fetch(`${listEndpoint}`);
    const { response } = await res.json();

    const currentActiveEgress = response.filter((elem: EEgress) => {
      return (
        elem.roomName === room.name &&
        (elem.status === 'EGRESS_STARTING' || elem.status === 'EGRESS_ACTIVE' || elem.status === 0 || elem.status === 1  )
      );
    });

    if (currentActiveEgress[0]?.egressId) {
      const params = new URLSearchParams({ egressId: metaData.isRecordCompositeEgress });
      const stopEndpoint = `${apiEndpoint}stop_record`;
      const res = await fetch(`${stopEndpoint}?${params.toString()}`);
      const { response } = await res.json();
      if (response) {
        isRecord = null;
      }
    }

    if (!currentActiveEgress[0]?.egressId) {
      const [companyСode, meetСode] = room.name.split('-')
      const params = new URLSearchParams({ roomName: room.name, meetСode, companyСode });
      const startEndpoint = `${apiEndpoint}start_record`;
      const res = await fetch(`${startEndpoint}?${params.toString()}`);
      const { response } = await res.json();
      if (response?.egressId) {
        isRecord = response.egressId;
      }
    }

    const newMetaData = {
      ...metaData,
      isRecordCompositeEgress: isRecord,
    };
    room.localParticipant.setMetadata(JSON.stringify(newMetaData));
    const bodyReq = {
      roomName: room.name,
      metadata: newMetaData,
    };
    fetch(`${apiEndpoint}update_metadata`, {
      method: 'POST',
      body: JSON.stringify(bodyReq),
    }).then(async (res) => {
      console.log(await res.json());
    });
  };
  const className: string = 'lk-button';
  return { className, toggleRecord };
}

/**
 * The `useDisconnectButton` hook is used to implement the `DisconnectButton` or your
 * custom implementation of it. It adds onClick handler to the button to disconnect
 * from the room.
 *
 * @example
 * ```tsx
 * const { buttonProps } = useDisconnectButton();
 * return <button {...buttonProps}>Disconnect</button>;
 * ```
 * @public
 */
export function useRecordButton(props: RecordButtonProps) {
  // console.log(true);
  const room = useRoomContext();
  // const connectionState = useConnectionState(room);

  const buttonProps = React.useMemo(() => {
    const { className, toggleRecord } = setupRecordButton();
    const mergedProps = mergeProps(props, {
      className,
      onClick: () => toggleRecord(room),
      disabled: false,
    });
    return mergedProps;
  }, [props]);

  return { buttonProps };
}
