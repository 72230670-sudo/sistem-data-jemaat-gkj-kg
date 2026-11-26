import StatistikJemaat from './StatistikJemaat.jsx'

export default function DashboardView({ data }) {
  return (
    <div className="sa-dashboard-page">
      <StatistikJemaat members={data.members} families={data.families} />
    </div>
  )
}