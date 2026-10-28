import { useState, type FormEvent } from 'react'
import {
  calculateDoomsday,
  daysInMonth,
  MAX_YEAR,
  MIN_YEAR,
  MONTHS,
  WEEKDAYS,
  type DoomsdayCalculation,
} from './doomsday'
import './App.css'

function weekday(index: number): string {
  return WEEKDAYS[index]!
}

function App() {
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [result, setResult] = useState<DoomsdayCalculation | null>(null)
  const [error, setError] = useState('')

  const updateInput = (
    setter: (value: string) => void,
    value: string,
  ) => {
    setter(value)
    setResult(null)
    setError('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)

    if (!year || !month || !day) {
      setError('Enter a year, month, and day to continue.')
      return
    }

    const parsedYear = Number(year)
    const parsedMonth = Number(month)
    const parsedDay = Number(day)

    if (![parsedYear, parsedMonth, parsedDay].every(Number.isInteger)) {
      setError('Year, month, and day must be whole numbers.')
      return
    }
    if (parsedYear < MIN_YEAR || parsedYear > MAX_YEAR) {
      setError(`Enter a year from ${MIN_YEAR} to ${MAX_YEAR}.`)
      return
    }
    if (parsedMonth < 1 || parsedMonth > 12) {
      setError('Choose a month from January to December.')
      return
    }
    if (parsedDay < 1 || parsedDay > daysInMonth(parsedYear, parsedMonth)) {
      setError('That day does not exist in the selected month.')
      return
    }

    setResult(calculateDoomsday(parsedYear, parsedMonth, parsedDay))
    setError('')
  }

  const inputDate =
    result && `${MONTHS[result.month - 1]} ${result.day}, ${result.year}`

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="#" aria-label="DoomsDay home">
          <span className="brand-mark" aria-hidden="true">d.</span>
          <span>dayreckon</span>
        </a>
        <span className="header-note">A little mental magic</span>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow"><span className="sparkle" aria-hidden="true">✳</span> THE DOOMSDAY METHOD</p>
        <h1 id="page-title">What day was it?</h1>
        <p className="intro-copy">
          Find the weekday for any date, and learn the mental math
          behind it.
        </p>
      </section>

      <section className="calculator-panel" aria-label="Date calculator">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-heading">
            <div>
              <h2>Pick a date</h2>
              <p>Works for Gregorian dates from {MIN_YEAR} to {MAX_YEAR}.</p>
            </div>
            <span className="calendar-icon" aria-hidden="true">▦</span>
          </div>

          <div className="date-fields">
            <div className="field year-field">
              <label htmlFor="year">Year</label>
              <input
                id="year"
                name="year"
                type="number"
                inputMode="numeric"
                min={MIN_YEAR}
                max={MAX_YEAR}
                step="1"
                placeholder="2026"
                value={year}
                onChange={(event) => updateInput(setYear, event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'form-error' : undefined}
              />
            </div>
            <div className="field month-field">
              <label htmlFor="month">Month</label>
              <select
                id="month"
                name="month"
                value={month}
                onChange={(event) => updateInput(setMonth, event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'form-error' : undefined}
              >
                <option value="" disabled>Select month</option>
                {MONTHS.map((name, index) => (
                  <option value={index + 1} key={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="field day-field">
              <label htmlFor="day">Day</label>
              <input
                id="day"
                name="day"
                type="number"
                inputMode="numeric"
                min="1"
                max="31"
                step="1"
                placeholder="27"
                value={day}
                onChange={(event) => updateInput(setDay, event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'form-error' : undefined}
              />
            </div>
          </div>

          {error && <p className="form-error" id="form-error" role="alert">{error}</p>}

          <button className="calculate-button" type="submit">
            Calculate weekday <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>

      {result ? (
        <section className="results" aria-labelledby="steps-heading" aria-live="polite">
          <div className="results-heading">
            <div>
              <p className="eyebrow">YOUR DATE, DECODED</p>
              <h2 id="steps-heading">The steps</h2>
            </div>
            <span className="date-pill">{inputDate}</span>
          </div>

          <ol className="step-list">
            <li className="step-card">
              <span className="step-number">01</span>
              <div className="step-content">
                <h3>Find the century anchor</h3>
                <p>
                  {result.century}–{result.century + 99} uses{' '}
                  <strong>{weekday(result.centuryAnchorIndex)}</strong> as its
                  anchor day.
                </p>
              </div>
              <span className="step-value">{weekday(result.centuryAnchorIndex)}</span>
            </li>

            <li className="step-card">
              <span className="step-number">02</span>
              <div className="step-content">
                <h3>Apply Odd+11</h3>
                <p>
                  Work through the last two digits of the year,
                  <strong> {result.yearSuffix}</strong>:
                </p>
                <ol className="odd11-steps">
                  <li>
                    {result.firstOddAdjustmentApplied
                      ? `${result.yearSuffix} is odd: add 11 → ${result.afterFirstOddAdjustment}.`
                      : `${result.yearSuffix} is even: skip adding 11 → ${result.afterFirstOddAdjustment}.`}
                  </li>
                  <li>
                    Halve: {result.afterFirstOddAdjustment} ÷ 2 = {result.firstHalf}.
                  </li>
                  <li>
                    {result.secondOddAdjustmentApplied
                      ? `${result.firstHalf} is odd: add 11 → ${result.afterSecondOddAdjustment}.`
                      : `${result.firstHalf} is even: skip adding 11 → ${result.afterSecondOddAdjustment}.`}
                  </li>
                  <li>
                    Modulo 7: {result.afterSecondOddAdjustment} mod 7 = {result.odd11Remainder}.
                  </li>
                  <li>
                    Subtract from 7: 7 − {result.odd11Remainder} = {result.yearOffset}.
                  </li>
                </ol>
              </div>
              <span className="step-value">offset {result.yearOffset}</span>
            </li>

            <li className="step-card">
              <span className="step-number">03</span>
              <div className="step-content">
                <h3>Find the year’s Doomsday</h3>
                <p>
                  Add the Odd+11 offset to the century anchor and wrap around
                  the week.
                </p>
                <div className="math-line">
                  <span>{weekday(result.centuryAnchorIndex)}</span>
                  <span>+ {result.yearOffset}</span>
                  <span>= {weekday(result.doomsdayIndex)}</span>
                </div>
              </div>
              <span className="step-value">{weekday(result.doomsdayIndex)}</span>
            </li>

            <li className="step-card">
              <span className="step-number">04</span>
              <div className="step-content">
                <h3>Choose the month’s Doomsday</h3>
                <p>
                  {result.leapYear ? 'Leap year' : 'Common year'}: in{' '}
                  {MONTHS[result.month - 1]}, the {result.monthlyAnchor}
                  {ordinalSuffix(result.monthlyAnchor)} is a{' '}
                  {weekday(result.doomsdayIndex)}.
                </p>
              </div>
              <span className="step-value">
                {MONTHS[result.month - 1]} {result.monthlyAnchor}
              </span>
            </li>

            <li className="step-card">
              <span className="step-number">05</span>
              <div className="step-content">
                <h3>Count to your date</h3>
                {result.delta === 0 ? (
                  <p>Your date lands right on the month’s Doomsday.</p>
                ) : (
                  <p>
                    Count {Math.abs(result.delta)} day{Math.abs(result.delta) === 1 ? '' : 's'}{' '}
                    {result.delta > 0 ? 'forward' : 'backward'} from the monthly
                    anchor.
                  </p>
                )}
              </div>
              <span className="step-value">
                {result.delta > 0 ? '+' : ''}{result.delta} days
              </span>
            </li>
          </ol>

          <section className="answer-card" aria-label="Calculated weekday">
            <div className="answer-icon" aria-hidden="true">✳</div>
            <div>
              <p className="answer-label">SO THE WEEKDAY WAS</p>
              <p className="answer-date">{inputDate}</p>
            </div>
            <p className="answer-day">{weekday(result.dateWeekdayIndex)}</p>
          </section>
        </section>
      ) : (
        <aside className="hint-card">
          <span className="hint-icon" aria-hidden="true">✳</span>
          <p><strong>A fun fact</strong><br />Doomsday is a weekday that several memorable dates share every year.</p>
        </aside>
      )}

      <footer className="site-footer">
        <span>Made for the analog mind.</span>
        <span>Gregorian calendar · {MIN_YEAR}–{MAX_YEAR}</span>
      </footer>
    </main>
  )
}

function ordinalSuffix(day: number): string {
  if (day % 100 >= 11 && day % 100 <= 13) return 'th'
  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

export default App
