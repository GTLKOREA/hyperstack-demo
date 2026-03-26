"use client";

import type { CategoryMode, CommunicationChannel, CommunicationQueueItem } from "@/lib/jos-types";

type CommunicationHubProps = {
  channels: CommunicationChannel[];
  queue: CommunicationQueueItem[];
  mode: CategoryMode;
};

export function CommunicationHub({ channels, queue, mode }: CommunicationHubProps) {
  const businessQueue = queue.filter((item) => item.category === "business").slice(0, 4);
  const privateQueue = queue.filter((item) => item.category === "private").slice(0, 4);

  return (
    <section className="jos-glass p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Omnichannel Communication</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">Live communication hub</h3>
        </div>
        <span className="rounded-full bg-[var(--panel-strong)] px-3 py-1 text-xs font-medium capitalize text-[var(--muted)]">{mode} attention lane</span>
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        {channels.map((channel: CommunicationChannel) => (
          <div key={channel.name} className="rounded-[22px] border border-[var(--line)] bg-white/75 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-[var(--ink-strong)]">{channel.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{channel.capability}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                channel.status === "live" ? "bg-[#ecfdf5] text-[#15803d]" : "bg-[#f8fafc] text-[#475569]"
              }`}>
                {channel.status}
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">{channel.messageCount}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">messages in queue</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-[var(--ink-strong)]">Business communication</p>
          <div className="mt-3 space-y-3">
            {businessQueue.map((item) => (
              <QueueCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--ink-strong)]">Private communication</p>
          <div className="mt-3 space-y-3">
            {privateQueue.map((item) => (
              <QueueCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function QueueCard({ item }: { item: CommunicationQueueItem }) {
  return (
    <div className="rounded-[22px] border border-[var(--line)] bg-white/75 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-[var(--ink-strong)]">{item.personName}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{item.requiredAction}</p>
        </div>
        <span className="rounded-full bg-[var(--panel-strong)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          {item.region}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-[var(--muted)]">
        <span>{item.channel}</span>
        <span className="capitalize">{item.category}</span>
      </div>
    </div>
  );
}

