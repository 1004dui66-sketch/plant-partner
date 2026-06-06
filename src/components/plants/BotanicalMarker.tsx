/** Stitch kr_3/kr_4 — AI 스캔 포인트 글래스 마커 */
export const BotanicalMarker = ({
  className = 'absolute top-1/3 right-1/3',
}: {
  readonly className?: string;
}) => (
  <div
    className={`${className} flex items-center justify-center pointer-events-none`}
    aria-hidden
  >
    <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full border border-white/50 flex items-center justify-center shadow-lg relative">
      <div className="w-3 h-3 bg-primary-fixed rounded-full animate-ping absolute" />
      <div className="w-3 h-3 bg-primary-fixed rounded-full" />
    </div>
  </div>
);
