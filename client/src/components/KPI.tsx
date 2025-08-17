type Props = { label: string; value: string | number; note?: string }

export default function KPI({ label, value, note }: Props) {
  return (
    <div className="kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {note && <small className="muted">{note}</small>}
    </div>
  )
}


