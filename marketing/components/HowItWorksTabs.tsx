import { useState } from 'react';
import Image from 'next/image';

interface Tab {
  id: string;
  title: string;
  icon: string;
  content: {
    description: string;
    image: string;
    cta?: {
      text: string;
      href: string;
    };
  };
}

const tabs: Tab[] = [
  {
    id: 'connect',
    title: 'Connect',
    icon: '/icons/connect.svg',
    content: {
      description: 'AI engages your website visitors in real-time through natural conversations, understanding their needs and qualifying them as leads.',
      image: '/images/connect-tab.svg',
      cta: {
        text: 'Learn about AI engagement',
        href: '/features/ai-engagement'
      }
    }
  },
  {
    id: 'assess',
    title: 'Assess',
    icon: '/icons/assess.svg',
    content: {
      description: 'Our AI analyzes conversations to identify qualified leads and routes them to the right team members based on your criteria.',
      image: '/images/assess-tab.svg',
      cta: {
        text: 'See how we qualify leads',
        href: '/features/lead-qualification'
      }
    }
  },
  {
    id: 'act',
    title: 'Act',
    icon: '/icons/act.svg',
    content: {
      description: 'Convert more leads by automatically scheduling meetings, demos, or follow-ups based on prospect interest and readiness.',
      image: '/images/act-tab.svg',
      cta: {
        text: 'Explore conversion features',
        href: '/features/conversion'
      }
    }
  }
];

const HowItWorksTabs = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="flex flex-col gap-10 md:gap-12 text-center text-balance justify-center items-center">
      <div className="relative w-screen">
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-w1 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-w1 to-transparent z-10"></div>
        
        <div className="overflow-x-auto w-full no-scrollbar relative">
          <div role="tablist" aria-orientation="horizontal" className="relative inline-block px-4 md:px-0" tabIndex={0}>
            <div className="flex flex-row gap-4 w-fit rounded-full bg-p1/10 border-[1px] border-p1/20 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-content`}
                  data-state={activeTab === tab.id ? 'active' : 'inactive'}
                  id={`${tab.id}-tab`}
                  className={`flex flex-row gap-2 items-center justify-center px-4 py-2 rounded-full transition-colors relative z-10 ${
                    activeTab === tab.id ? 'text-w1' : 'text-p1'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className={`transition-colors [&_path]:stroke-${activeTab === tab.id ? 'w1' : 'p1'}`}>
                    <Image src={tab.icon} alt="" width={16} height={16} />
                  </div>
                  <span className="transition-colors">{tab.title}</span>
                </button>
              ))}
              <div
                className="absolute top-1 left-1 bg-p1 rounded-full transition-all duration-300 ease-in-out"
                style={{
                  height: 'calc(100% - 8px)',
                  left: '8px',
                  width: '66px',
                  transform: `translateX(${tabs.findIndex(t => t.id === activeTab) * 100}%)`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-0 items-center relative">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            data-state={activeTab === tab.id ? 'active' : 'inactive'}
            role="tabpanel"
            aria-labelledby={`${tab.id}-tab`}
            id={`${tab.id}-content`}
            tabIndex={0}
            className={`
              data-[state=active]:flex flex-col gap-8 items-center
              data-[state=inactive]:hidden
              data-[state=active]:animate-in
              data-[state=inactive]:animate-out
              relative md:mx-0 section-x
              ${activeTab === tab.id ? '' : 'hidden'}
            `}
          >
            <p className="body text-w4 !text-balance">{tab.content.description}</p>
            
            <div className="w-full border-bg1/20 border p-2 relative max-h-[584px] xl:min-h-[584px] grid content-center">
              <div className="size-0.5 absolute z-10 bg-bg1 top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="size-0.5 absolute z-10 bg-bg1 bottom-0 left-0 -translate-x-1/2 translate-y-1/2"></div>
              <div className="size-0.5 absolute z-10 bg-bg1 top-0 right-0 translate-x-1/2 -translate-y-1/2"></div>
              <div className="size-0.5 absolute z-10 bg-bg1 bottom-0 right-0 translate-x-1/2 translate-y-1/2"></div>
              
              <Image
                src={tab.content.image}
                alt={tab.title}
                width={1200}
                height={800}
                className="w-auto m-auto"
              />
            </div>

            {tab.content.cta && (
              <a
                href={tab.content.cta.href}
                className="inline-flex items-center text-p1 hover:text-p2 transition-colors"
              >
                {tab.content.cta.text}
                <Image
                  src="/icons/arrow-right.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="ml-2"
                />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorksTabs; 