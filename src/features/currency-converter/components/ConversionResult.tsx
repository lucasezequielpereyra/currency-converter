export const ConversionResult = () => {
  return (
    <section
      className="flex flex-col md:flex-row md:items-start md:justify-between w-full gap-6 md:gap-4"
      aria-label="Conversion results"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2 w-full md:w-1/2">
        <p className="font-bold text-2xl md:text-3xl text-black" role="status">
          1.00 U$ Dollar = 0.858885 Euro
        </p>
        <p className="text-sm md:text-base text-text">1 EUR = 1.164300 USD</p>
      </div>
      <aside className="w-full md:w-1/2 flex flex-col gap-4">
        <div className="bg-light-violet rounded-lg p-4" role="note">
          <p className="text-sm text-black font-semibold leading-6 md:leading-10">
            We use the mid-market rate for our Converter. This is for informational purposes only.
            You won't receive this rate when sending money.
          </p>
        </div>
        <p className='text-xs md:text-right font-bold text-text'>
          <span className="underline">US Dollar</span> to <span className="underline">Euro</span> conversion -- Last updated <time dateTime="2025-08-08T02:18:00Z">Aug 8, 2025, 2:18 AM UTC</time>
        </p>
      </aside>
    </section>
  )
}
