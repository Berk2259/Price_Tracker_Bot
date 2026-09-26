import { Fragment } from "react";
import { AdminIcon } from "@/components/admin-icons";

export type PortalRequest = {
  id: number;
  category: string;
  products: string[];
  note: string | null;
  status: string;
  date: string;
};

const labels = ["Gönderildi", "İnceleniyor", "Takibe eklendi"];

function Tracker({ status }: { status: string }) {
  if (status === "reddedildi") {
    return (
      <div className="mt-3 rounded-xl bg-red-500/15 px-3 py-2 text-[13px] font-bold text-red-400">
        Bu talep şu an için uygun bulunmadı.
      </div>
    );
  }

  const step = status === "bekliyor" ? 0 : status === "inceleniyor" ? 1 : 2;

  return (
    <>
      <div className="mt-4 flex items-start">
        {labels.map((label, i) => (
          <Fragment key={label}>
            {i > 0 && (
              <div
                className={
                  "mt-2.5 h-[3px] flex-1 " +
                  (i <= step ? "bg-emerald-500" : "bg-zinc-800")
                }
              />
            )}
            <div
              className={
                "flex w-[84px] flex-col items-center gap-1 text-center text-[11.5px] font-bold " +
                (i <= step ? "text-zinc-50" : "text-zinc-500")
              }
            >
              <span
                className={
                  "grid h-[22px] w-[22px] place-items-center rounded-full " +
                  (i <= step
                    ? "bg-emerald-500 text-[#052e2b]"
                    : "bg-zinc-800 text-transparent") +
                  (i === step && step < 2
                    ? " animate-pulse ring-4 ring-emerald-500/20"
                    : "")
                }
              >
                <AdminIcon name="check" size={12} stroke={3.4} />
              </span>
              {label}
            </div>
          </Fragment>
        ))}
      </div>
      {status === "tamamlandi" && (
        <div className="mt-3 rounded-xl bg-green-400/15 px-3 py-2 text-[13px] font-bold text-green-400">
          Ürünler takibine eklendi, artık bildirim alacaksın.
        </div>
      )}
    </>
  );
}

export function PortalRequestCard({ request }: { request: PortalRequest }) {
  return (
    <div className="rounded-[20px] border border-zinc-800 bg-zinc-900 px-[18px] py-4">
      <div className="flex items-center gap-2.5">
        <b className="text-base">{request.category}</b>
        <span className="ml-auto text-[12.5px] text-zinc-500">{request.date}</span>
      </div>

      {request.products.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {request.products.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="rounded-[9px] bg-emerald-500/15 px-2.5 py-0.5 text-[12.5px] font-bold text-emerald-300"
            >
              {name}
            </span>
          ))}
        </div>
      )}

      {request.note && (
        <p className="mt-2 text-[13px] text-zinc-500">Notun: {request.note}</p>
      )}

      <Tracker status={request.status} />
    </div>
  );
}