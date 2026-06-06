import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { AddToCollectionForm } from '@/components/scan/AddToCollectionForm';
import { BotanicalMarker } from '@/components/plants/BotanicalMarker';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { getScanAnalysis } from '@/lib/actions/plants';
import { formatConfidence, parseCareSummary } from '@/lib/analysis';
import { resolveImageUrl } from '@/lib/storage/resolve-image-url';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const RESULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA4F9L8dbzvce3RuNkttHgqYjEv1X9DHA9b3ERG-xbXlEr80G4WLujbgL1mQtE9dfVoBwpV7Y73PaQoD44nE9uj8oLPQbjcmYVdP-SLJgA56AlMvuP2WphkEY9LalVj80BMs7xAiyIN23xxjHe1g1ob2gDaZ2TEiinrb-PN1wrwKbq1zp4yX09B-DqCgS1iak88FKllq5PhAwgfB_FUNDnRWdFYOhHldA6fcEDtgR2nRVswPXAV899od-RUpE-abA86WFeQvlz9duu1';

const DEFAULT_TOXICITY =
  '반려동물이나 어린이가 잎을 먹지 않도록 주의가 필요합니다.';

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function ScanResultPage({ searchParams }: PageProps) {
  const { id } = await searchParams;

  if (!id) {
    redirect('/scan');
  }

  const analysis = await getScanAnalysis(id);
  const supabase = await createSupabaseServerClient();
  const imageUrl = await resolveImageUrl(supabase, analysis.image_url);
  const careSummary = parseCareSummary(analysis.care_summary);
  const confidenceLabel = formatConfidence(analysis.confidence);
  const symbolismText =
    analysis.symbolism ??
    '긴 수명과 건강, 그리고 관계의 결속을 상징합니다.';

  return (
    <AppShell sideNavMainActive="/scan" className="pt-20 pb-24 md:pb-0">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter h-16 bg-surface/70 backdrop-blur-xl border-b border-white/30 shadow-sm shadow-primary/5 md:hidden">
        <Link
          href="/scan"
          aria-label="뒤로"
          className="text-primary hover:bg-primary-container/20 transition-colors rounded-full p-2"
        >
          <MaterialIcon name="arrow_back" filled />
        </Link>
        <div className="font-headline-md text-headline-md text-primary flex-1 text-center">
          인식 결과
        </div>
        <Image
          alt="프로필"
          src={RESULT_AVATAR}
          width={40}
          height={40}
          className="rounded-full object-cover border border-white/40 shadow-sm"
        />
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg min-h-screen flex flex-col xl:flex-row gap-stack-lg">
        <section className="w-full xl:w-5/12 relative rounded-xl overflow-hidden shadow-2xl h-[50vh] xl:h-[80vh] flex-shrink-0 group">
          <RemoteImage
            alt="스캔된 식물"
            src={imageUrl}
            fill
            priority
            className="rounded-xl transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none rounded-xl" />
          <BotanicalMarker className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" />
          <div className="absolute top-4 left-4 z-20 glass-panel px-4 py-2 rounded-full flex items-center space-x-2">
            <MaterialIcon name="verified" filled className="text-primary text-sm" />
            <span className="font-label-md text-label-md text-primary">
              {confidenceLabel}
            </span>
          </div>
        </section>

        <section className="w-full xl:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-stack-md content-start">
          <div className="col-span-1 md:col-span-2 glass-panel p-8 rounded-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none" />
            <span className="inline-block px-3 py-1 rounded-full bg-secondary-fixed-dim/30 text-on-secondary-fixed-variant font-label-md text-xs uppercase tracking-wider mb-2">
              인식된 식물
            </span>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-1">
              {analysis.plant_name}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant italic mb-4">
              {symbolismText}
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {analysis.diagnosis}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start">
              <AddToCollectionForm analysisId={analysis.id} />
              <button
                type="button"
                className="glass-panel text-primary hover:bg-white/50 font-label-md text-label-md px-6 py-4 rounded-full transition-all active:scale-95 flex items-center justify-center space-x-2 shrink-0"
              >
                <MaterialIcon name="share" />
                <span>결과 공유</span>
              </button>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 glass-panel p-6 rounded-xl">
            <h3 className="font-headline-md text-primary mb-6 flex items-center text-2xl">
              <MaterialIcon name="auto_awesome" className="mr-2 text-base" />
              관리 요약
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {careSummary.map((item) => (
                <div
                  key={item.title}
                  className="bg-surface-container-low/50 p-4 rounded-lg border border-white/50 flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed mb-3 shadow-sm">
                    <MaterialIcon name={item.icon} filled />
                  </div>
                  <h4 className="font-label-md text-label-md text-primary mb-1">
                    {item.title}
                  </h4>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-1 glass-panel p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-fixed/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            <h3 className="font-label-md text-label-md text-primary mb-3 flex items-center uppercase tracking-wider text-xs">
              <MaterialIcon name="auto_awesome" className="mr-2 text-base" />
              꽃말과 상징
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {symbolismText}
            </p>
          </div>

          <div className="col-span-1 glass-panel p-6 rounded-xl bg-error-container/20 border-error/10">
            <h3 className="font-label-md text-label-md text-error mb-3 flex items-center uppercase tracking-wider text-xs">
              <MaterialIcon name="warning" filled className="mr-2 text-base" />
              독성 주의
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {analysis.recommendation.includes('독') ||
              analysis.recommendation.includes(' toxic')
                ? analysis.recommendation
                : DEFAULT_TOXICITY}
            </p>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
