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
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const lkButton: NodeListOf<HTMLElement> = document.querySelectorAll('.lk-button');
      const lkParticipantName: NodeListOf<HTMLElement> =
        document.querySelectorAll('.lk-participant-name');
      const lkConnectionQuality: NodeListOf<HTMLElement> =
        document.querySelectorAll('.lk-connection-quality');
      const lkParticipantTile: NodeListOf<HTMLElement> =
        document.querySelectorAll('.lk-participant-tile');
      const lkGridLayout: NodeListOf<HTMLElement> = document.querySelectorAll('.lk-grid-layout');
      const lkChat: HTMLElement | null = document.querySelector('.lk-chat');
      const selectedItems: NodeListOf<HTMLElement> = document.querySelectorAll(
        '.lk-media-device-select li[aria-selected]',
      );
      const inputElement: HTMLElement | null = document.querySelector('.lk-chat-form-input');
      const parsBrandingData: string | null = localStorage.getItem('brandingData');
      let pars: {
        primary_color: string | null;
        text_primary_color: string | null;
        border_radius: string | null;
      } = {
        primary_color: null,
        text_primary_color: null,
        border_radius: null,
      };
      let primaryColor: string | null;
      let textPrimaryColor: string | null = null;
      let borderRadius: string | null;
      if (parsBrandingData) {
        pars = JSON.parse(parsBrandingData);
        primaryColor = pars.primary_color;
        textPrimaryColor = pars.text_primary_color;
        borderRadius = pars.border_radius;
      }

      selectedItems.forEach((item: any) => {
        const ariaSelected: string | null = item.getAttribute('aria-selected');
        const dataLkActive: string | null = item.getAttribute('data-lk-active');
        if (ariaSelected && dataLkActive) {
          item.style.background = textPrimaryColor;
        }
      });

      if (inputElement) {
        inputElement.addEventListener('focus', function (e: FocusEvent) {
          console.log(typeof e);
          (e.target as HTMLElement).style.outline = `2px solid ${textPrimaryColor ?? ''}`;
        });
      }
      if (lkChat) {
        lkChat.style.color = textPrimaryColor ?? '';
      }

      lkButton.forEach((key) => {
        key.style.color = textPrimaryColor ?? '';
        key.style.borderRadius = `${borderRadius}px`;
      });
      lkParticipantTile.forEach((key) => {
        key.style.color = primaryColor ?? '';
      });
      lkGridLayout.forEach((key) => {
        key.style.color = primaryColor ?? '';
      });
      lkParticipantName.forEach((key) => {
        key.style.color = textPrimaryColor ?? '';
      });
      lkConnectionQuality.forEach((key) => {
        key.style.color = textPrimaryColor ?? '';
      });
    });

    observer.observe(document, { attributes: true, childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  const { buttonProps, enabled } = useTrackToggle(props);
  return (
    <button {...buttonProps}>
      {(showIcon ?? true) && getSourceIcon(props.source, enabled)}
      {props.children}
    </button>
  );
}
