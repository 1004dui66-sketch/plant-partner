'use client';



import Link from 'next/link';

import { AppShell } from '@/components/layout/AppShell';

import { GlassPanel } from '@/components/ui/GlassPanel';

import { MaterialIcon } from '@/components/ui/MaterialIcon';

import { LogoutButton } from '@/components/settings/LogoutButton';

import { ProfileEditForm } from '@/components/settings/ProfileEditForm';



const settingsItems = [

  {

    icon: 'auto_awesome',

    title: 'AI 분석 설정',

    description: '진단 민감도 및 데이터 공유 구성',

    href: '#',

  },

  {

    icon: 'language',

    title: '언어 및 지역',

    description: '한국어 (대한민국)',

    href: '#',

  },

  {

    icon: 'help',

    title: '고객 센터',

    description: '자주 묻는 질문, 문의하기 및 약관',

    href: '#',

  },

] as const;



type SettingsViewProps = {

  email: string;

  displayName: string;

  bio: string;

  careAlertsEnabled: boolean;

  plantCount: number;

};



export const SettingsView = ({

  email,

  displayName,

  bio,

  careAlertsEnabled,

  plantCount,

}: SettingsViewProps) => (

  <AppShell sideNavActive="/settings">

    <main className="pt-24 md:pt-16 px-gutter md:px-margin-desktop max-w-container-max mx-auto pb-24 md:pb-12">

      <div className="mb-stack-lg">

        <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-primary tracking-tight">

          설정

        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">

          프로필, 환경 설정 및 AI 설정을 관리하여 나만의 플랜트 버디를

          만드세요.

        </p>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-stack-lg">

        <GlassPanel className="md:col-span-12 lg:col-span-4 rounded-xl p-8 flex flex-col items-center text-center relative overflow-hidden">

          <ProfileEditForm

            email={email}

            displayName={displayName}

            bio={bio}

            careAlertsEnabled={careAlertsEnabled}

            plantCount={plantCount}

          />

        </GlassPanel>



        <div className="md:col-span-12 lg:col-span-8 flex flex-col gap-4">

          {settingsItems.map((item) => (

            <GlassPanel

              key={item.title}

              className="rounded-xl p-2 transition-all hover:shadow-[0_15px_40px_rgba(0,53,39,0.08)]"

            >

              <Link

                href={item.href}

                className="flex items-center justify-between p-4 md:p-6 rounded-lg hover:bg-surface/50 transition-colors group"

              >

                <SettingRow

                  icon={item.icon}

                  title={item.title}

                  description={item.description}

                />

                <MaterialIcon

                  name="chevron_right"

                  className="text-outline group-hover:text-primary transition-colors"

                />

              </Link>

            </GlassPanel>

          ))}



          <div className="mt-4 pt-4 border-t border-outline-variant/30">

            <LogoutButton />

          </div>

        </div>

      </div>

    </main>

  </AppShell>

);



const SettingRow = ({

  icon,

  title,

  description,

}: {

  icon: string;

  title: string;

  description: string;

}) => (

  <div className="flex items-center gap-4">

    <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">

      <MaterialIcon name={icon} />

    </div>

    <div>

      <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">

        {title}

      </h3>

      <p className="font-body-md text-body-md text-on-surface-variant text-sm hidden md:block">

        {description}

      </p>

    </div>

  </div>

);

