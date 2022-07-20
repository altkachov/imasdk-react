/* global google */
export function initialize({videoElement, adContainer}) {
    console.log("initializing IMA");
    const adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement);
    const adsLoader = new google.ima.AdsLoader(adDisplayContainer);

    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = 'https://inv-nets.admixer.net/dsp.aspx?rct=3&zone=cab8eab3-6cb9-4bd0-868e-97f66da84fcd&zoneInt=103892&sect=47364&site=41401&rnd=[CACHEBUSTING]';

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    adsRequest.linearAdSlotWidth = videoElement.clientWidth;
    adsRequest.linearAdSlotHeight = videoElement.clientHeight;
    adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
    adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;

    // Pass the request to the adsLoader to request ads
    adsLoader.requestAds(adsRequest);

    return {adDisplayContainer: adDisplayContainer, adsLoader: adsLoader}
}
