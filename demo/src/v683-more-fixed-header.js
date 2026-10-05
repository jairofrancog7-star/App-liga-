/* Header visibility is now owned by LJR_CHROME and the measured scroll surface. */
(()=>{for(const event of ['hashchange','pageshow','resize'])addEventListener(event,()=>window.LJR_SCROLL_CHROME?.refresh?.())})();
