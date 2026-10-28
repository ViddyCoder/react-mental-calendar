# Daymark

Daymark is a small React app that demonstrates the Doomsday method for finding
the weekday of a Gregorian date. Enter a date to see its century anchor, year
calculation, monthly anchor, and final weekday.

The calculator supports years **1600–9999**. It validates Gregorian month
lengths and leap years before showing a result. The year calculation uses the
Odd+11 method: adjust odd suffix values, halve, adjust odd results again, then
convert the modulo-seven remainder to a century-anchor offset with `7 - r`.
The app shows each intermediate value, including when an adjustment is
skipped.

## Development

```sh
npm install
npm run dev
```

Run `npm run build` to type-check and create the production build, or
`npm run lint` to lint the source.
