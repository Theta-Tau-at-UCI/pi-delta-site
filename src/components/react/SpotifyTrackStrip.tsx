// SpotifyTrackStrip, the floating "Favorite track" strip pinned to the top
// of the brother detail modal. Uses the Spotify Embed Iframe API
// (https://developer.spotify.com/documentation/embeds/iframe-api) rather
// than a raw <iframe>, so we can call play() in the controller callback and
// have the track auto-start using the brother card's click as the user
// gesture. Browser autoplay policies require a gesture within ~5s; the
// click that opened the modal counts as long as we attach the controller
// in the same task.
import { useEffect, useRef } from 'react';

interface Props {
  name: string;
  trackId: string;
}

// Minimal subset of Spotify's IFrame API surface we use here.
interface EmbedController {
  loadUri(uri: string): void;
  play(): void;
  destroy(): void;
}

interface IFrameAPI {
  createController(
    element: HTMLElement,
    options: { uri: string; width?: string; height?: string },
    callback: (ctrl: EmbedController) => void,
  ): void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
    __spotifyIframeApi?: IFrameAPI;
    __spotifyIframeApiQueue?: Array<(api: IFrameAPI) => void>;
  }
}

// One-time bootstrap: load the iframe API script and route IFrameAPI to a
// queue so multiple components can wait for it. The first caller installs
// onSpotifyIframeApiReady; later callers just wait for `__spotifyIframeApi`.
function loadSpotifyApi(): Promise<IFrameAPI> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.__spotifyIframeApi) return Promise.resolve(window.__spotifyIframeApi);

  return new Promise((resolve) => {
    window.__spotifyIframeApiQueue = window.__spotifyIframeApiQueue || [];
    window.__spotifyIframeApiQueue.push(resolve);

    if (!window.onSpotifyIframeApiReady) {
      window.onSpotifyIframeApiReady = (api) => {
        window.__spotifyIframeApi = api;
        (window.__spotifyIframeApiQueue || []).forEach((cb) => cb(api));
        window.__spotifyIframeApiQueue = [];
      };
    }

    if (!document.querySelector('script[data-spotify-iframe-api]')) {
      const s = document.createElement('script');
      s.src = 'https://open.spotify.com/embed/iframe-api/v1';
      s.async = true;
      s.setAttribute('data-spotify-iframe-api', '');
      document.head.appendChild(s);
    }
  });
}

export default function SpotifyTrackStrip({ name, trackId }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<EmbedController | null>(null);
  const figureRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  // Latest name, read by the embed effect without making it a dependency
  // (re-running that effect restarts playback).
  const nameRef = useRef(name);

  // The API replaces our host <div> with an <iframe> of its own that carries
  // no title attribute, so a title on the host is inert. Name the real
  // iframe instead. Runs on every name change so the title follows the
  // brother when the modal navigates.
  useEffect(() => {
    nameRef.current = name;
    const apply = () =>
      wrapRef.current
        ?.querySelector('iframe')
        ?.setAttribute('title', `${name}'s favorite song on Spotify`);
    apply();
    // On first mount the iframe doesn't exist yet; the embed effect below
    // names it again once the controller has swapped it in.
    const id = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(id);
  }, [name]);

  useEffect(() => {
    let cancelled = false;
    const nameIframe = () => {
      const apply = () =>
        wrapRef.current
          ?.querySelector('iframe')
          ?.setAttribute('title', `${nameRef.current}'s favorite song on Spotify`);
      apply();
      requestAnimationFrame(apply);
    };
    loadSpotifyApi().then((api) => {
      if (cancelled || !hostRef.current) return;
      // If a controller already exists from a previous brother, swap track
      // and play instead of recreating it (avoids tearing down the iframe).
      if (controllerRef.current) {
        controllerRef.current.loadUri(`spotify:track:${trackId}`);
        controllerRef.current.play();
        nameIframe();
        return;
      }
      api.createController(
        hostRef.current,
        { uri: `spotify:track:${trackId}`, width: '100%', height: '80' },
        (ctrl) => {
          if (cancelled) {
            ctrl.destroy();
            return;
          }
          controllerRef.current = ctrl;
          ctrl.play();
          nameIframe();
        },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [trackId]);

  // Tear down the controller only when the strip itself unmounts (modal
  // closes), not on every track change.
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.destroy();
        controllerRef.current = null;
      }
    };
  }, []);

  // Publish the strip's real rendered height to the modal as --now-playing-h,
  // so the card is shifted down by exactly the strip's height and can never be
  // covered by it, even when the Spotify embed renders taller than the
  // requested 80px (its height varies across mobile browsers).
  useEffect(() => {
    const fig = figureRef.current;
    if (!fig) return;
    const modal = fig.closest('.brother-detail') as HTMLElement | null;
    if (!modal) return;
    const apply = () => modal.style.setProperty('--now-playing-h', `${fig.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(fig);
    return () => {
      ro.disconnect();
      modal.style.removeProperty('--now-playing-h');
    };
  }, []);

  return (
    <figure ref={figureRef} className="brother-detail__now-playing">
      <figcaption className="brother-detail__now-playing-caption">
        <span className="brother-detail__now-playing-eyebrow">Favorite track</span>
        <span className="font-display brother-detail__now-playing-who">
          for {name.split(' ')[0]}
        </span>
      </figcaption>
      <div ref={wrapRef} className="brother-detail__now-playing-embed-wrap">
        <div ref={hostRef} className="brother-detail__now-playing-embed" />
      </div>
    </figure>
  );
}
