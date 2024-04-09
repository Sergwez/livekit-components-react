import * as React from 'react';
import { useRecordButton } from '../../hooks';

/** @public */

export interface RecordButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  startRecord?: boolean;
}

/**
 * The `DisconnectButton` is a basic html button with the added ability to disconnect from a LiveKit room.
 * Normally this is the big red button that allows end users to leave the video or audio call.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <DisconnectButton>Leave room</DisconnectButton>
 * </LiveKitRoom>
 * ```
 * @public
 */

export function RecordButton(props: RecordButtonProps) {
  const { buttonProps } = useRecordButton(props);
  return <button {...buttonProps}>{props.children}</button>;
}
