# Repository source import

Source: https://github.com/bellmarques0-crypto/Cidade-Operacional
Revision: 5b6e6da80f7aba633b01f7e45ad697a891e20012

Imported the actual application source, not the GitHub repository interface. Original React modules and SVG-rendered city remain interactive. Five original repository PNGs are preserved as CDN asset pointers in src/assets/imported-city; the original application does not reference these images at runtime.

## Verification
- Desktop 1280×1800 and phone 390×844: building dock selection, metrics panel, floor plan, workstation detail, cancel and return navigation passed.
- Both layouts: workstation operator change saved and read back after reload; road creation saved and retained after reload; building creation saved and retained after reload.
- Both layouts: roads, plazas and furniture menus opened and dismissed with Escape; layers panel opened and closed; inspector and Save remained accessible.
- Preview runtime errors: none in the saved-edit checks. Routing test passed. Latest automatic build succeeded.
- Source app was rendered locally from downloaded repository source. Its phone floor plan left early workstation columns outside the scrollable viewport; imported phone layout repairs that clipping and fits the city to the available width.
- Window does not scroll in city mode; wheel screenshots recorded the same full-screen city. Floor plan has its own scroll area.

## Limits
Original browser-local saving is retained; there is no account login or shared Cloud storage. No video or canvas static fallback was introduced. Original ticker motion is retained, with reduced-motion support added. Exhaustive drag/resize, every architecture option, deletion variants, and all source phone controls were not individually verified.

Browser evidence: /tmp/browser/cidade/*-city.png, *-city-wheel.png, *-workstation.png, *-editor.png, *-saved-workstation.png, *-menu.png, *-layers.png, *-road-inspector.png, *-building-form.png. Structured preview observations are in navigation.json and saved-edits.json.