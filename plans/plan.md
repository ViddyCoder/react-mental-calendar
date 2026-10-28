# Doomsday Date Calculator — App Plan

## Goal

Build a small, browser-based React app that teaches mental weekday calculation with the Doomsday algorithm. A user enters a Gregorian year, month, and day; the app validates the date and presents an explanation in ordered cards, first finding the year's Doomsday with the Odd+11 method, then finding the requested date's weekday from a nearby monthly Doomsday.

## User experience

1. Show three clearly labeled inputs: **Year**, **Month**, and **Day**, plus a **Calculate** button.
2. On submission, validate that all fields are present and that the date exists, including leap-year rules. Show a clear inline error for invalid input.
3. For a valid date, show a sequence of cards:
   - **Find the century anchor** — identify the Gregorian century and its anchor weekday.
   - **Apply Odd+11** — show each operation on the year's last two digits.
   - **Find the year's Doomsday** — combine the Odd+11 result with the century anchor modulo seven.
   - **Choose the month's Doomsday** — select the date's monthly anchor, accounting for leap years.
   - **Count to the requested date** — show the signed number of days from the monthly anchor and reduce it modulo seven.
   - **Result** — display the final weekday and the entered date prominently.
4. Keep the entered date visible with the result. Recalculate when the user submits a new date.

## Calculation details

### Weekday representation

Use one consistent internal mapping for modulo-seven arithmetic, for example Sunday = 0 through Saturday = 6. Convert to readable weekday names at the presentation boundary. Normalize negative remainders into the range 0–6.

### Century anchor

Use the Gregorian century-anchor cycle, which repeats every 400 years:

| Century index modulo 4 | Anchor weekday |
| --- | --- |
| 0 | Tuesday |
| 1 | Sunday |
| 2 | Friday |
| 3 | Wednesday |

For example, the 2000s use Tuesday and the 1900s use Wednesday. The supported input range should be documented and chosen to avoid ambiguous year-entry conventions; a practical initial range is 1600–9999.

### Odd+11: year Doomsday

Let `y` be the final two digits of the year. Show each intermediate value in its own step within the Odd+11 card:

1. If `y` is odd, add 11; otherwise leave it unchanged.
2. Halve the result.
3. If the result is odd, add 11; otherwise leave it unchanged.
4. Apply mod 7 to the result.
5. Subtract the result from 7. This is the offset from the century anchor.
5. Add the offset to the century anchor's weekday index to get that year's Doomsday.

The explanation should display the actual values and explicitly say when a conditional operation is skipped. Keep the year Doomsday separate from the final date weekday so users can follow the two stages.

### Monthly Doomsday anchors

Use a hardcoded, named table of month anchors, where each entry is the calendar day that always falls on that year's Doomsday:

| Month | Common year | Leap year |
| --- | ---: | ---: |
| January | 3 | 4 |
| February | 28 | 29 |
| March | 14 | 14 |
| April | 4 | 4 |
| May | 9 | 9 |
| June | 6 | 6 |
| July | 11 | 11 |
| August | 8 | 8 |
| September | 5 | 5 |
| October | 10 | 10 |
| November | 7 | 7 |
| December | 12 | 12 |

For the entered month, show the selected anchor date and whether the year is a leap year.

### Requested date weekday

Compute `delta = entered day - monthly anchor day`. Add `delta` to the year's Doomsday weekday index modulo seven. In the card, show whether this means counting forward or backward, the number of days, and the resulting weekday. A zero delta means the entered date is itself a Doomsday.

## Validation and edge cases

- Require integer year, month, and day values; reject incomplete or out-of-range values before calculating.
- Validate the actual calendar date, including month lengths and Gregorian leap years (divisible by 4, except centuries unless divisible by 400).
- Handle Odd+11's conditional steps and negative date offsets explicitly.
- Do not silently substitute a date or weekday when input is invalid; keep errors visible and do not show stale results as if they match the invalid input.
- State the supported year range in the form and its validation message.

## Suggested React structure

- `DateInputForm`: controlled year/month/day inputs, submit handling, and validation feedback.
- `calculateDoomsday`: pure calculation function returning typed intermediate values for the explanation cards as well as the final weekday.
- `weekday` / date constants: weekday names, century-anchor cycle, and monthly Doomsday table.
- `CalculationSteps`: renders the ordered explanation cards from the calculation result.
- `App`: owns form and result state and lays out the page.

Keep calculation logic independent of React so it can be tested directly. Avoid duplicating calculations in presentation components; cards should render the intermediate values returned by the pure function.

## Visual and accessibility direction

- Use a simple responsive layout with a centered input panel and a readable vertical sequence of result cards.
- Give each input a persistent label, use appropriate numeric input constraints, and associate validation text with the relevant form.
- Preserve logical heading order and ensure the result and errors are understandable to assistive technology.
- Make the step sequence readable on narrow screens and do not rely on color alone to distinguish states.

## Testing plan

- Unit-test Odd+11 intermediate steps and year Doomsdays, including even/odd suffixes and century boundaries.
- Unit-test leap-year handling and all monthly anchors.
- Unit-test date validation, signed offsets, modulo behavior, and final weekdays.
- Include known-date checks, such as 2000-01-01 (Saturday), 2024-02-29 (Thursday), and 2026-10-27 (Tuesday).
- Test the form's invalid-date feedback and verify a valid submission renders each explanation step and the final weekday.

## Implementation sequence

1. Confirm or scaffold the React project and establish its existing conventions.
2. Implement and test the pure Gregorian date and Doomsday calculations.
3. Build the controlled form and validation behavior.
4. Render the intermediate results as step-by-step cards and add responsive styling.
5. Run the focused tests and the project's existing build or type-check.
