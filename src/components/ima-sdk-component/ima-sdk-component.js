import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import './ima-sdk-component.css';
import * as ima from './ima-helper';

// TODO
// IMA overlays the video container
// https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side#triggering-click-to-pause-on-mobile-devices

// IMA SDK need to be imported
// https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side#3.-import-the-ima-sdk
const ImaSdkComponent = forwardRef(({
                                        videoElementRef,
                                        onError: onErrorCallback,
                                        onPauseRequested: onPauseRequestedCallback,
                                        onResumeRequested: onResumeRequestedCallback,
                                    }, ref) => {
    /* global google */
    console.log("RENDER IMASDK", {ref: ref, videoElementRef: videoElementRef});
    const [adsManager, setAdsManager] = useState();
    const [adDisplayContainer, setAdDisplayContainer] = useState();
    const [adsLoader, setAdsLoader] = useState();
    const [hidden, setHidden] = useState(true);
    const [repeatInitialize, setRepeatInitialize] = useState(Math.random());
    const adContainerRef = useRef();
    const onError = useCallback((err) => {
        if (onErrorCallback) onErrorCallback(err);
    }, [onErrorCallback]);
    const onPauseRequested = useCallback((err) => {
        if (onPauseRequestedCallback) onPauseRequestedCallback(err);
    }, [onPauseRequestedCallback]);
    const onResumeRequested = useCallback((err) => {
        setHidden(true);
        setRepeatInitialize(Math.random());
        if (onResumeRequestedCallback) onResumeRequestedCallback(err);
    }, [onResumeRequestedCallback]);
    // Let the AdsLoader know when the video has ended
    useEffect(() => {
        const videoElement = videoElementRef.current;
        if (!videoElement || !adsLoader) return;
        const listener = () => {
            adsLoader.contentComplete();
        };
        videoElement.addEventListener('ended', listener);
        return () => videoElement.removeEventListener('ended', listener);
    }, [videoElementRef.current]);
    // add adsManager listeners
    useEffect(() => {
        if (!adsManager) return;
        const onAdError = (err) => {
            console.log("ON_AD_ERROR", err);
            onError(err);
        };
        const onContentPauseRequested = (e) => {
            console.log("PAUSE_REQUESTED", e);
            onPauseRequested(e);
        };
        const onContentResumeRequested = (e) => {
            console.log("RESUME_REQUESTED", e);
            onResumeRequested(e);
        };
        adsManager.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            onAdError);
        adsManager.addEventListener(
            google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
            onContentPauseRequested);
        adsManager.addEventListener(
            google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
            onContentResumeRequested);
        return () => {
            adsManager.removeEventListener(
                google.ima.AdErrorEvent.Type.AD_ERROR,
                onAdError);
            adsManager.removeEventListener(
                google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
                onContentPauseRequested);
            adsManager.removeEventListener(
                google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
                onContentResumeRequested);
        };
    }, [adsManager]);
    // add adsLoader listeners
    useEffect(() => {
        const videoElement = videoElementRef.current;
        if (!adsLoader || !videoElement) return;
        const onError = (e) => {
            console.log("onError", e.getError());
            if (adsManager) {
                adsManager.destroy();
            }
        };
        const onLoaded = (e) => {
            const _adsManager = e.getAdsManager(videoElement);
            window.ADS_MANAGER = _adsManager;
            setAdsManager(_adsManager);
        };
        adsLoader.addEventListener(
            google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            onLoaded,
            false);
        adsLoader.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            onError,
            false);
        return () => {
            adsLoader.removeEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onLoaded);
            adsLoader.removeEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onError);
        };
    }, [adsLoader, videoElementRef.current]);
    // initialize IMA
    useEffect(() => {
            const videoElement = videoElementRef.current;
            const adContainer = adContainerRef.current;
            if (!adContainer || !videoElement) return;
            const {adDisplayContainer: _adDisplayContainer, adsLoader: _adsLoader} = ima.initialize({
                adContainer: adContainer,
                videoElement: videoElement
            });
            setAdDisplayContainer(_adDisplayContainer);
            setAdsLoader(_adsLoader);

            return () => {
                console.log("DESTROY IMA");
                _adDisplayContainer.destroy();
                _adsLoader.destroy();
            }
        },
        [adContainerRef.current, videoElementRef.current, repeatInitialize]);
    useEffect(() => {
        const videoElement = videoElementRef.current;
        if (!adsManager || !videoElement) return;
        const resizeObserver = new ResizeObserver(function () {
            console.log("video resized");
            var width = videoElement.clientWidth;
            var height = videoElement.clientHeight;
            adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
        });
        resizeObserver.observe(videoElement);
        return () => resizeObserver.disconnect();
    }, [adsManager, videoElementRef.current]);
    const loadAds = useCallback((event) => {
        const videoElement = videoElementRef.current;
        if (!videoElement) return;
        console.log("loading ads");
        setHidden(false);
        // Initialize the container. Must be done via a user action on mobile devices.
        videoElement.load();
        adDisplayContainer.initialize();

        var width = videoElement.clientWidth;
        var height = videoElement.clientHeight;
        try {
            adsManager.init(width, height, google.ima.ViewMode.NORMAL);
            adsManager.start();
        } catch (adError) {
            // Play the video without ads, if an error occurs
            onError(new Error("AdsManager could not be started"));
        }
    }, [videoElementRef.current, adDisplayContainer, adsManager, onError]);
    useImperativeHandle(ref, () => ({
        loadAds: loadAds,
    }), [loadAds])
    return <div hidden={hidden} className={'ad-container'} ref={adContainerRef} id="ad-container"></div>
});
export default ImaSdkComponent;
