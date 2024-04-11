import { Track, RoomEvent } from 'livekit-client';
import * as React from 'react';
import { MediaDeviceMenu } from './MediaDeviceMenu';
import { DisconnectButton } from '../components/controls/DisconnectButton';
import { RecordButton } from '../components/controls/RecordButton';
import { TrackToggle } from '../components/controls/TrackToggle';
import {
  ChatIcon,
  GearIcon,
  LeaveIcon,
  // RecordCircleIcon,
  // RecordCircleDisabledIcon,
} from '../assets/icons';
import { ChatToggle } from '../components/controls/ChatToggle';
import { useLocalParticipantPermissions, usePersistentUserChoices } from '../hooks';
import { useMediaQuery } from '../hooks/internal';
import { useMaybeLayoutContext } from '../context';
import { supportsScreenSharing } from '@livekit/components-core';
import { mergeProps } from '../utils';
import { StartMediaButton } from '../components/controls/StartMediaButton';
import { SettingsMenuToggle } from '../components/controls/SettingsMenuToggle';
import { useRoomContext } from '../context';
import { BrandLogo } from '../components/brand/BrandLogo';

/** @public */
export type ControlBarControls = {
  microphone?: boolean;
  camera?: boolean;
  chat?: boolean;
  screenShare?: boolean;
  leave?: boolean;
  settings?: boolean;
  record?: boolean;
};

/** @public */
export interface ControlBarProps extends React.HTMLAttributes<HTMLDivElement> {
  variation?: 'minimal' | 'verbose' | 'textOnly';
  controls?: ControlBarControls;
  /**
   * If `true`, the user's device choices will be persisted.
   * This will enables the user to have the same device choices when they rejoin the room.
   * @defaultValue true
   * @alpha
   */
  saveUserChoices?: boolean;
}

/**
 * The `ControlBar` prefab gives the user the basic user interface to control their
 * media devices (camera, microphone and screen share), open the `Chat` and leave the room.
 *
 * @remarks
 * This component is build with other LiveKit components like `TrackToggle`,
 * `DeviceSelectorButton`, `DisconnectButton` and `StartAudio`.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <ControlBar />
 * </LiveKitRoom>
 * ```
 * @public
 */
export function ControlBar({
  variation,
  controls,
  saveUserChoices = true,
  ...props
}: ControlBarProps) {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const layoutContext = useMaybeLayoutContext();
  React.useEffect(() => {
    if (layoutContext?.widget.state?.showChat !== undefined) {
      setIsChatOpen(layoutContext?.widget.state?.showChat);
    }
  }, [layoutContext?.widget.state?.showChat]);
  const isTooLittleSpace = useMediaQuery(`(max-width: ${isChatOpen ? 1000 : 890}px)`);

  const defaultVariation = isTooLittleSpace ? 'minimal' : 'verbose';
  variation ??= defaultVariation;

  const visibleControls = { leave: true, ...controls };

  const room = useRoomContext();
  const metadata = JSON.parse(room.metadata || '{}');

  const localPermissions = useLocalParticipantPermissions();

  if (!localPermissions) {
    visibleControls.camera = false;
    visibleControls.chat = false;
    visibleControls.microphone = false;
    visibleControls.screenShare = false;
    visibleControls.record = true;
  } else {
    visibleControls.camera ??= localPermissions.canPublish;
    visibleControls.microphone ??= localPermissions.canPublish;
    visibleControls.screenShare ??= localPermissions.canPublish;
    visibleControls.chat ??= localPermissions.canPublishData && controls?.chat;
    visibleControls.record = true;
  }

  const showIcon = React.useMemo(
    () => variation === 'minimal' || variation === 'verbose',
    [variation],
  );
  const showText = React.useMemo(
    () => variation === 'textOnly' || variation === 'verbose',
    [variation],
  );

  const browserSupportsScreenSharing = supportsScreenSharing();

  const [isScreenShareEnabled, setIsScreenShareEnabled] = React.useState(false);

  const onScreenShareChange = React.useCallback(
    (enabled: boolean) => {
      setIsScreenShareEnabled(enabled);
    },
    [setIsScreenShareEnabled],
  );

  const htmlProps = mergeProps({ className: 'lk-control-bar' }, props);

  const {
    saveAudioInputEnabled,
    saveVideoInputEnabled,
    saveAudioInputDeviceId,
    saveVideoInputDeviceId,
  } = usePersistentUserChoices({ preventSave: !saveUserChoices });

  const microphoneOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveAudioInputEnabled(enabled) : null,
    [saveAudioInputEnabled],
  );

  const cameraOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveVideoInputEnabled(enabled) : null,
    [saveVideoInputEnabled],
  );

  const [isRecording, setRecording] = React.useState(metadata?.isRecordCompositeEgress);
  React.useEffect(() => {
    setRecord(metadata?.isRecordCompositeEgress);
  }, [metadata?.isRecordCompositeEgress]);
  room.on(RoomEvent.RoomMetadataChanged, () => {
    const metadata = JSON.parse(room.metadata || '{}');
    if (
      (metadata.isRecordCompositeEgress === null ||
        typeof metadata.isRecordCompositeEgress === 'string') &&
      metadata.isRecordCompositeEgress !== isRecording
    ) {
      setRecording(metadata.isRecordCompositeEgress);
    }
  });
  const [record, setRecord] = React.useState(isRecording);
  React.useEffect(() => {
    setRecord(isRecording);
  }, [isRecording]);

  return (
    <div {...htmlProps}>
      <BrandLogo></BrandLogo>
      {visibleControls.microphone && (
        <div className="lk-button-group">
          <TrackToggle
            source={Track.Source.Microphone}
            showIcon={showIcon}
            onChange={microphoneOnChange}
          >
            {showText && 'Микрофон'}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              kind="audioinput"
              onActiveDeviceChange={(_kind, deviceId) => saveAudioInputDeviceId(deviceId ?? '')}
            />
          </div>
        </div>
      )}
      {visibleControls.camera && (
        <div className="lk-button-group">
          <TrackToggle source={Track.Source.Camera} showIcon={showIcon} onChange={cameraOnChange}>
            {showText && 'Камера'}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              kind="videoinput"
              onActiveDeviceChange={(_kind, deviceId) => saveVideoInputDeviceId(deviceId ?? '')}
            />
          </div>
        </div>
      )}
      {visibleControls.screenShare && browserSupportsScreenSharing && (
        <TrackToggle
          className="lk-hidden-mobile"
          source={Track.Source.ScreenShare}
          captureOptions={{ audio: true, selfBrowserSurface: 'include' }}
          showIcon={showIcon}
          onChange={onScreenShareChange}
        >
          {showText &&
            (isScreenShareEnabled ? 'Завершить демонстрацию экрана' : 'Демонстарция экрана')}
        </TrackToggle>
      )}
      {visibleControls.record && (
        <RecordButton>
          {/*? <RecordCircleIcon fill={'red'} /> : <RecordCircleDisabledIcon />*/}
          {showIcon && record}
          {showText && 'Запись'}
        </RecordButton>
      )}
      {visibleControls.chat && (
        <ChatToggle>
          {showIcon && <ChatIcon />}
          {showText && 'Чат'}
        </ChatToggle>
      )}
      {visibleControls.settings && (
        <SettingsMenuToggle>
          {showIcon && <GearIcon />}
          {showText && 'Настройки'}
        </SettingsMenuToggle>
      )}
      {visibleControls.leave && (
        <DisconnectButton>
          {showIcon && <LeaveIcon />}
          {showText && 'Выход'}
        </DisconnectButton>
      )}
      <StartMediaButton />
    </div>
  );
}
