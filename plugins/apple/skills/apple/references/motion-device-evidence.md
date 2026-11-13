# Native visual, animation and thermal evidence

Record logical viewport points, native screenshot pixels, scale, safe areas, orientation and font scaling separately. A stretched 360-point screenshot is not a newly rendered 1080-pixel interface. Inspect actual native captures, keyboard-open forms, long names, error/loading/empty/populated states, accessibility reading order and Reduce Motion. RTL layout must preserve appropriate number and currency ordering. Do not crop essential actions merely to promise no scrolling.

Use subtle finite entrance motion and interruptible transitions. Pause offscreen work. Measure input-to-visible response and full frame costs, not only GPU submit time. Report device, build, refresh rate, sample duration and percentile frame timing; do not claim 60 fps from a single frame. Profile release-equivalent code separately from development overlays.

Temperature: record charging state, battery sensor provenance, workload, ambient conditions where known, and a bounded cooldown sample. Battery temperature is not SoC or case temperature. Monitoring itself can create CPU load; compare after stopping WDA/streaming. Do not infer stock apps cause heat from storage usage, or delete user data as an optimisation. Stop only owned test processes. If the device displays a temperature warning, stop the workload and allow it to cool.
