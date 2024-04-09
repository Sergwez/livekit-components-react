import type { CaptureOptionsBySource, ToggleSource } from '@livekit/components-core';
import * as React from 'react';
import { getSourceIcon } from '../../assets/icons/util';
import { useTrackToggle } from '../../hooks';
import { useEffect } from 'react';

/** @public */
export interface TrackToggleProps<T extends ToggleSource>
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  source: T;
  showIcon?: boolean;
  initialState?: boolean;
  /**
   * Function that is called when the enabled state of the toggle changes.
   * The second function argument `isUserInitiated` is `true` if the change was initiated by a user interaction, such as a click.
   */
  onChange?: (enabled: boolean, isUserInitiated: boolean) => void;
  captureOptions?: CaptureOptionsBySource<T>;
}

/**
 * With the `TrackToggle` component it is possible to mute and unmute your camera and microphone.
 * The component uses an html button element under the hood so you can treat it like a button.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <TrackToggle source={Track.Source.Microphone} />
 *   <TrackToggle source={Track.Source.Camera} />
 * </LiveKitRoom>
 * ```
 * @public
 */

export function TrackToggle<T extends ToggleSource>({ showIcon, ...props }: TrackToggleProps<T>) {
  // const [primaryColor, setPrimaryColor] = useState('');
  // const [textPrimaryColor, setTextPrimaryColor] = useState('');
  // const [borderRadius, setBorderRadius] = useState('');
  // useEffect(() => {
  //   const endpoint = 'https://api.dev.proofix.ru/api/branding_meets';
  //   fetch(endpoint)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setPrimaryColor(data.data.list[1].primary_color);
  //       setTextPrimaryColor(data.data.list[1].text_primary_color);
  //       setBorderRadius(data.data.list[1].border_radius);
  //     })
  //     .catch((error) => console.error('Error:', error));
  // }, []);
  useEffect(() => {
    const lkButton = document.querySelectorAll('.lk-button');
    const lkParticipantName = document.querySelectorAll('.lk-participant-name');
    const lkConnectionQuality = document.querySelectorAll('.lk-connection-quality');
    const lkParticipantTile = document.querySelectorAll('.lk-participant-tile');
    const lkGridLayout = document.querySelectorAll('.lk-grid-layout');
    const lkChat = document.querySelector('.lk-chat');
    const selectedItems = document.querySelectorAll('.lk-media-device-select li[aria-selected]');
    const inputElement: any = document.querySelector('.lk-chat-form-input');

    const parsBrandingData: any = localStorage.getItem('brandingData');
    const pars = JSON.parse(parsBrandingData);
    const primaryColor = pars.primary_color;
    const textPrimaryColor = pars.text_primary_color;
    const borderRadius = pars.border_radius;

    selectedItems.forEach((item) => {
      const ariaSelected: any = item.getAttribute('aria-selected');
      const dataLkActive: any = item.getAttribute('data-lk-active');
      if (ariaSelected && dataLkActive) {
        console.log(ariaSelected);
        // @ts-ignore
        item.style.background = textPrimaryColor;
      }
    });

    inputElement.addEventListener('focus', function (e: any) {
      e.target.style.outline = `2px solid ${textPrimaryColor}`;
    });

    // @ts-ignore
    lkChat.style.color = textPrimaryColor;
    lkButton.forEach((key) => {
      // @ts-ignore
      key.style.color = textPrimaryColor;
      // @ts-ignore
      key.style.borderRadius = `${borderRadius}px`;
      // key.addEventListener('mouseover', function () {
      //   // @ts-ignore
      //   key.style.background = primaryColor;
      // });
      //
      // key.addEventListener('mouseout', function () {
      //   // @ts-ignore
      //   key.style.background = '#1e1e1e';
      // });
    });
    lkParticipantTile.forEach((key) => {
      // @ts-ignore
      key.style.color = primaryColor;
    });
    lkGridLayout.forEach((key) => {
      // @ts-ignore
      key.style.color = primaryColor;
    });

    lkParticipantName.forEach((key) => {
      // @ts-ignore
      key.style.color = textPrimaryColor;
    });

    lkConnectionQuality.forEach((key) => {
      // @ts-ignore
      key.style.color = textPrimaryColor;
    });
  });
  const { buttonProps, enabled } = useTrackToggle(props);
  return (
    <button {...buttonProps}>
      {(showIcon ?? true) && getSourceIcon(props.source, enabled)}
      {props.children}
    </button>
  );
}
